import { randomUUID } from 'node:crypto';

function send(res, status, body) {
  res.status(status).json(body);
}

function databaseConfig() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return {
    url: SUPABASE_URL.replace(/\/+$/, ''),
    key: SUPABASE_SERVICE_ROLE_KEY,
  };
}

function supabaseHeaders(key) {
  const headers = { apikey: key };
  if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`;
  return headers;
}

function validContent(content) {
  return content && typeof content === 'object' && !Array.isArray(content)
    && ['pillars', 'principles', 'members', 'journal', 'manifesto', 'projects']
      .every((key) => Array.isArray(content[key]));
}

async function reportSupabaseError(response, operation) {
  const responseBody = await response.text();
  let details;
  try {
    details = JSON.parse(responseBody);
  } catch {
    details = responseBody;
  }

  console.error(`Supabase content ${operation} failed.`, {
    status: response.status,
    details,
  });

  const code = details?.code;
  const message = typeof details?.message === 'string' ? details.message : '';
  if (code === 'PGRST205' || code === '42P01' || /site_content.*does not exist|could not find the table/i.test(message)) {
    return 'Supabase cannot find the site_content table. Run supabase/schema.sql in the Supabase SQL Editor.';
  }
  if (response.status === 401 || response.status === 403) {
    return 'Supabase rejected the server key. Check SUPABASE_URL and set SUPABASE_SERVICE_ROLE_KEY to the project service_role key in Vercel.';
  }
  if (response.status === 404) {
    if (operation === 'photo upload') {
      return 'Supabase could not find the member-photos Storage bucket. Run supabase/schema.sql again in the Supabase SQL Editor.';
    }
    return 'Supabase returned 404. Verify SUPABASE_URL is the exact Project URL from Supabase (https://<project-ref>.supabase.co), and confirm public.site_content exists and is exposed to the Data API. After creating the table, run NOTIFY pgrst, \'reload schema\'; in the Supabase SQL Editor.';
  }
  return `Supabase content ${operation} failed (HTTP ${response.status}). Check the Vercel function logs for details.`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const config = databaseConfig();
    if (!config) return send(res, 503, { error: 'Shared content storage is not configured.' });
    try {
      const response = await fetch(
        `${config.url}/rest/v1/site_content?key=eq.main&select=content`,
        { headers: supabaseHeaders(config.key) },
      );
      if (!response.ok) {
        const error = await reportSupabaseError(response, 'read');
        return send(res, 502, { error });
      }
      const rows = await response.json();
      return send(res, 200, { content: rows[0]?.content || null });
    } catch (error) {
      console.error('Supabase content read failed.', error);
      return send(res, 502, { error: 'Could not connect to shared website storage.' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  const { ADMIN_PASSWORD } = process.env;
  if (!ADMIN_PASSWORD) return send(res, 503, { error: 'Admin access is not configured.' });
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return send(res, 400, { error: 'Request body must be valid JSON.' });
  }

  if (body?.action === 'login') {
    if (body.password !== ADMIN_PASSWORD) return send(res, 401, { error: 'Incorrect access key.' });
    return send(res, 200, { ok: true });
  }

  if (body?.action === 'upload-photo') {
    if (body.password !== ADMIN_PASSWORD) return send(res, 401, { error: 'Admin session is invalid. Log in again.' });
    const match = typeof body.image === 'string'
      ? body.image.match(/^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/)
      : null;
    if (!match) return send(res, 400, { error: 'The processed photo must be a JPEG image.' });

    const imageBytes = Buffer.from(match[1], 'base64');
    if (imageBytes.length > 2 * 1024 * 1024) {
      return send(res, 413, { error: 'The processed photo is too large. Choose a smaller image.' });
    }

    const config = databaseConfig();
    if (!config) return send(res, 503, { error: 'Shared photo storage is not configured.' });
    const objectPath = `${randomUUID()}.jpg`;
    try {
      const response = await fetch(
        `${config.url}/storage/v1/object/member-photos/${objectPath}`,
        {
          method: 'POST',
          headers: {
            ...supabaseHeaders(config.key),
            'Content-Type': 'image/jpeg',
            'x-upsert': 'false',
          },
          body: imageBytes,
        },
      );
      if (!response.ok) {
        const error = await reportSupabaseError(response, 'photo upload');
        return send(res, 502, { error });
      }
      return send(res, 200, {
        url: `${config.url}/storage/v1/object/public/member-photos/${objectPath}`,
      });
    } catch (error) {
      console.error('Supabase photo upload failed.', error);
      return send(res, 502, { error: 'Could not connect to shared photo storage.' });
    }
  }

  if (body?.action !== 'save') return send(res, 400, { error: 'Unknown content action.' });
  if (body.password !== ADMIN_PASSWORD) return send(res, 401, { error: 'Admin session is invalid. Log in again.' });
  if (!validContent(body.content)) return send(res, 400, { error: 'Website content has an invalid format.' });

  const config = databaseConfig();
  if (!config) return send(res, 503, { error: 'Shared content storage is not configured.' });
  try {
    const response = await fetch(
      `${config.url}/rest/v1/site_content?on_conflict=key`,
      {
        method: 'POST',
        headers: {
          ...supabaseHeaders(config.key),
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({ key: 'main', content: body.content, updated_at: new Date().toISOString() }),
      },
    );
    if (!response.ok) {
      const error = await reportSupabaseError(response, 'save');
      return send(res, 502, { error });
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('Supabase content save failed.', error);
    return send(res, 502, { error: 'Could not connect to shared website storage.' });
  }
}

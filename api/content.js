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

function validContent(content) {
  return content && typeof content === 'object' && !Array.isArray(content)
    && ['pillars', 'principles', 'members', 'journal', 'manifesto', 'projects']
      .every((key) => Array.isArray(content[key]));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    const config = databaseConfig();
    if (!config) return send(res, 503, { error: 'Shared content storage is not configured.' });
    try {
      const response = await fetch(
        `${config.url}/rest/v1/site_content?key=eq.main&select=content`,
        { headers: { apikey: config.key, Authorization: `Bearer ${config.key}` } },
      );
      if (!response.ok) {
        console.error('Supabase content read failed with status', response.status);
        return send(res, 502, { error: 'Could not load shared website content.' });
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
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({ key: 'main', content: body.content, updated_at: new Date().toISOString() }),
      },
    );
    if (!response.ok) {
      console.error('Supabase content save failed with status', response.status);
      return send(res, 502, { error: 'Could not publish website content.' });
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('Supabase content save failed.', error);
    return send(res, 502, { error: 'Could not connect to shared website storage.' });
  }
}

import React, { useEffect, useState } from 'react';
import { ModalProvider } from '../ModalContext.jsx';
import Modal from '../components/Modal.jsx';
import Intro from '../components/Intro.jsx';
import Header from '../components/Header.jsx';
import SectionProgress from '../components/SectionProgress.jsx';
import Hero from '../components/Hero.jsx';
import VisualBreak from '../components/VisualBreak.jsx';
import Pillars from '../components/Pillars.jsx';
import Projects from '../components/Projects.jsx';
import Manifesto from '../components/Manifesto.jsx';
import Founder from '../components/Founder.jsx';
import Doctrine from '../components/Doctrine.jsx';
import People from '../components/People.jsx';
import Journal from '../components/Journal.jsx';
import Entry from '../components/Entry.jsx';
import Footer from '../components/Footer.jsx';

export default function HomePage() {
  const [introHidden, setIntroHidden] = useState(false);

  useEffect(() => {
    document.body.classList.add('loaded');
    const t = setTimeout(() => {
      setIntroHidden(true);
      document.body.classList.add('hero-in');
    }, 1050);
    return () => clearTimeout(t);
  }, []);

  return (
    <ModalProvider>
      <Intro hide={introHidden} />
      <Header />
      <SectionProgress />
      <main>
        <Hero />
        <VisualBreak />
        <Pillars />
        <Manifesto />
        <Projects />
        <Founder />
        <Doctrine />
        <People />
        <Journal />
        <Entry />
      </main>
      <Footer />
      <Modal />
    </ModalProvider>
  );
}
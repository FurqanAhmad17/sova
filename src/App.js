import { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('mission');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const missionRef = useRef(null);
  const statsRef = useRef(null);
  const solutionRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Update active nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['mission', 'stats', 'solution'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top < 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
      // Scroll progress
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
      setShowBackToTop(winScroll > 400);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, target) => {
    e.preventDefault();
    setActiveSection(target);
    setMobileMenuOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* Floating decorative orbs */}
      <div className="floating-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
      </div>

      {/* Dot grid background */}
      <div className="dot-grid" aria-hidden="true" />

      {/* Noise/grain overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Floating sparkles */}
      <div className="sparkle-layer" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="sparkle" style={{ left: `${5 + i * 8}%`, top: `${10 + (i % 5) * 20}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      {/* Section progress indicators */}
      <nav className="section-indicators" aria-label="Section navigation">
        {['mission', 'stats', 'solution'].map((id) => (
          <button
            key={id}
            className={`section-indicator ${activeSection === id ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, id)}
            aria-label={`Go to ${id.charAt(0).toUpperCase() + id.slice(1)} section`}
            aria-current={activeSection === id ? 'true' : undefined}
          />
        ))}
      </nav>

      {/* Back to top button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <span className="back-to-top-arrow">↑</span>
      </button>

      {/* Space-themed side decorations */}
      <div className="space-decor space-decor-left" aria-hidden="true">
        <span className="space-star">✦</span>
        <span className="space-star space-star-sm">·</span>
        <span className="space-planet space-planet-sm" />
        <span className="space-star">✧</span>
        <span className="space-star">☆</span>
        <span className="space-planet space-planet-md" />
        <span className="space-star">✦</span>
        <span className="space-star space-star-sm">·</span>
        <span className="space-planet space-planet-xs" />
        <span className="space-star">✧</span>
      </div>
      <div className="space-decor space-decor-right" aria-hidden="true">
        <span className="space-star">☆</span>
        <span className="space-planet space-planet-md" />
        <span className="space-star">✦</span>
        <span className="space-star space-star-sm">·</span>
        <span className="space-planet space-planet-xs" />
        <span className="space-star">✧</span>
        <span className="space-star">☆</span>
        <span className="space-planet space-planet-sm" />
        <span className="space-star">✦</span>
        <span className="space-star space-star-sm">·</span>
      </div>

      <header className="header">
        <nav className="nav" aria-label="Primary navigation">
          <a href="/" className="logo-link">
            <img src="/assets/logo.png" alt="Sova logo" className="logo" />
            <span>Sova</span>
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <ul id="primary-navigation" className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><a href="#mission" className={activeSection === 'mission' ? 'active' : ''} onClick={(e) => handleNavClick(e, 'mission')}>Mission</a></li>
            <li><a href="#stats" className={activeSection === 'stats' ? 'active' : ''} onClick={(e) => handleNavClick(e, 'stats')}>Statistics</a></li>
            <li><a href="#solution" className={activeSection === 'solution' ? 'active' : ''} onClick={(e) => handleNavClick(e, 'solution')}>Objectives</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content" className="main" tabIndex="-1">
        {/* Section connector line */}
        <div className="section-connector" aria-hidden="true" />

        {/* Intro & Mission */}
        <section id="mission" ref={missionRef} className="hero" aria-labelledby="problem-heading">
          <div className="hero-glow hero-glow-1" aria-hidden="true" />
          <div className="hero-glow hero-glow-2" aria-hidden="true" />
          <div className="section-badge animate-on-scroll fade-in">Mission</div>
          <h1 id="problem-heading" className="animate-on-scroll slide-up">The Problem</h1>
          <p className="hero-tagline animate-on-scroll slide-up delay-1">
            Many buildings still depend on braille signage to provide directions for the visually impaired. However,
            braille requires significant literacy, time, and physical effort to be read and installed.
          </p>
          <h2 className="animate-on-scroll slide-up delay-1">The Solution</h2>
          <div className="model-viewer-shell animate-on-scroll slide-up delay-2">
            <model-viewer
              src="/assets/3DModel.glb"
              alt="Sova 3D model"
              className="hero-model-viewer"
              aria-hidden="true"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              exposure="1"
              interaction-prompt="none"
            />
          </div>
          <div className="mission-box mission-box-border animate-on-scroll slide-up delay-2">
            <div className="mission-box-glow" aria-hidden="true" />
            <h2>Our Mission</h2>
            <h3 className="mission-video-title">Demo Video</h3>
            <div className="mission-video-shell">
              <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/xpWvJKi2_Xc?si=CcR69KIkKmitRWPx" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="mission-video"
              />
            </div>
            <p>
              Our solution is simple. Users wear glasses fitted with a camera that automatically scans QR codes carefully placed throughout
              a building. When the camera detects a code, the system leverages the artificial intelligence of ElevenLabs to play a short
              audio cue, which informs the user of their current location and prompts them on where they want to go next.
            </p>
            <p>
              No more stopping to read braille, no more relying on a tour guide, and no more risk of preventable injury.
              With this device, the visually impaired can navigate buildings like anyone else.
            </p>
            <p className="mission-highlight">
              The future of navigation for the visually impaired is here. Do you want to be a part of it?
            </p>
            <a
              className="interactive-btn btn-shine"
              href="https://github.com/FurqanAhmad17/sova"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Wavy divider */}
        <div className="section-divider" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60 Q300 0 600 60 T1200 60 V120 H0 Z" fill="url(#dividerGrad1)" />
            <path d="M0 80 Q300 20 600 80 T1200 80 V120 H0 Z" fill="url(#dividerGrad2)" opacity="0.5" />
            <defs>
              <linearGradient id="dividerGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0a0e14" />
                <stop offset="50%" stopColor="#1e2a4a" />
                <stop offset="100%" stopColor="#0a0e14" />
              </linearGradient>
              <linearGradient id="dividerGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Statistics */}
        <section id="stats" ref={statsRef} className="stats-section" aria-labelledby="stats-heading">
          <div className="section-badge animate-on-scroll fade-in">Statistics</div>
          <h2 id="stats-heading" className="animate-on-scroll slide-left">The Numbers</h2>
          <p className="stats-intro animate-on-scroll slide-right">
            Here are the numbers, exposing the brutal reality of the struggles faced by the visually impaired.
          </p>
          <div className="stats-grid">
            {[
              { num: '2.2B+', label: 'People worldwide have a near or distance vision impairment' },
              { num: '90%', label: 'Of legally blind Americans are unable to read braille' },
              { num: '~68%', label: 'Of people with visual impairment have been exposed to at least one serious life event' },
              { num: '$2000+', label: 'The average cost to purchase braille displays and associated technology' },
            ].map((stat, i) => (
              <div key={i} className={`stat-card stat-card-3d animate-on-scroll slide-up delay-${i + 1}`} data-delay={i}>
                <div className="stat-card-accent" aria-hidden="true" />
                <span className="stat-number">{stat.num}</span>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="stats-conclusion animate-on-scroll fade-in">
            Braille has become the standard tool that the visually impaired rely on.
            It is due time to create a solution that is accessible for all.
          </p>
        </section>

        {/* Wavy divider */}
        <div className="section-divider section-divider-2" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 V60 Q300 120 600 60 T1200 60 V0 Z" fill="url(#dividerGrad3)" />
            <defs>
              <linearGradient id="dividerGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f1419" />
                <stop offset="50%" stopColor="#1e2a4a" />
                <stop offset="100%" stopColor="#0f1419" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Our Solution */}
        <section id="solution" ref={solutionRef} className="solution-section" aria-labelledby="solution-heading">
          <div className="section-badge animate-on-scroll fade-in">Objectives</div>
          <h2 id="solution-heading" className="animate-on-scroll slide-left">The Future at Sova</h2>
          <div className="solution-content">
            <ul className="solution-list">
              {[
                { title: 'Reduced Costs', text: 'Buildings simply need to paste QR codes around the premises, which is significantly cheaper than the costs for braille signage' },
                { title: 'Universal Utility', text: 'Anyone with access to the technology can easily navigate a building, removing the need for declining braille literacy' },
                { title: 'Self-Dependence', text: 'Our technology removes the need for assistants or tour guides, giving users the feeling of independence and freedom in their movement' },
                { title: 'General Safety', text: 'The visual-audio capabilities of our technology lowers the chance of preventable accidents from navigating with braille.' },
              ].map((item, i) => (
                <li key={i} className="animate-on-scroll slide-right solution-item" data-delay={i}>
                  <span className="solution-item-icon" aria-hidden="true">◆</span>
                  <strong>{item.title}</strong> — {item.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-glow" aria-hidden="true" />
        <p>Sova — Visual-audio navigation for the visually impaired</p>
        <p className="footer-credit">&copy; 2026 - DeerHacks - University of Toronto Mississauga</p>
      </footer>
    </div>
  );
}

export default App;

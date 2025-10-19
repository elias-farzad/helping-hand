import React from 'react';
import './HomePage.css';
import logo from '../assets/logo.png';

const HomePage = ({ onStartApp }) => {
  const features = [
    {
      icon: '🤖',
      title: 'Learn from the Robotic Hand',
      description: 'Observe and understand ASL letters as demonstrated by a robotic hand.'
    },
    {
      icon: '✋',
      title: 'ASL Learning',
      description: 'Learn American Sign Language letters A, I, L, V, Y'
    },
    {
      icon: '📹',
      title: 'Real-time Tracking',
      description: 'Advanced hand tracking with MediaPipe technology'
    },
    {
      icon: '🎯',
      title: 'Interactive Learning Interface',
      description: 'Engage with a user-friendly interface designed to make learning ASL fun and intuitive.'
    }
  ];

  const letters = ['A', 'I', 'L', 'V', 'Y'];

  return (
    <div className="homepage">
      {/* Header with Logo */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="logo-container">
            <img src={logo} alt="Helping Hand Logo" className="header-logo" />
          </div>
          <nav className="header-nav">
            <button className="nav-button" onClick={onStartApp}>
              Start Learning
            </button>
            <button className="nav-button secondary">
              About
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered ASL Learning
          </h1>
          <p className="hero-description">
            Learn American Sign Language through interactive hand recognition. 
            Practice ASL letters by using a robot arm to show the ASL signs.
          </p>
          <div className="hero-actions">
            <button className="cta-button primary" onClick={onStartApp}>
              Start Learning
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-illustration">
            <div className="illustration-card">
              <h3>Interactive Learning</h3>
              <p>Practice ASL letters with real-time feedback</p>
            </div>
            <div className="illustration-arrow">→</div>
            <div className="illustration-card">
              <h3>Robot Control</h3>
              <p>Control Arduino robot arm with gestures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASL Letters Section */}
      <section className="asl-letters">
        <div className="container">
          <h2 className="section-title">Learn These ASL Letters</h2>
          <div className="letters-grid">
            {letters.map((letter, index) => (
              <div key={index} className="letter-card">
                <div className="letter-display">{letter}</div>
                <div className="letter-label">Letter {letter}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology">
        <div className="container">
          <h2 className="section-title">Powered by Advanced Technology</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-icon">🧠</div>
              <h3>MediaPipe</h3>
              <p>Google's machine learning framework for hand tracking</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">⚡</div>
              <h3>Real-time Processing</h3>
              <p>Instant gesture recognition and feedback</p>
            </div>
            <div className="tech-item">
              <div className="tech-icon">🔗</div>
              <h3>Web Serial API</h3>
              <p>Direct communication with Arduino robot arm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="getting-started">
        <div className="container">
          <h2 className="section-title">Ready to Start?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Connect Your Camera</h3>
                <p>Allow camera access for hand tracking</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Connect Robot Arm</h3>
                <p>Link your Arduino robot arm via USB</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start Learning</h3>
                <p>Select a letter and begin practicing!</p>
              </div>
            </div>
          </div>
          <button className="cta-button primary large" onClick={onStartApp}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <p>&copy; 2024 Helping Hand. Empowering communication through technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

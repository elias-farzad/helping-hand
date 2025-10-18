import React from 'react';
import './HomePage.css';

const HomePage = ({ onStartApp }) => {
  const features = [
    {
      icon: '🤖',
      title: 'Robot Arm Control',
      description: 'Control an Arduino robot arm using hand gestures'
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
      title: 'Interactive Practice',
      description: 'Practice with guided learning workflow'
    }
  ];

  const letters = ['A', 'I', 'L', 'V', 'Y'];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Helping Hand
            <span className="hero-subtitle">AI-Powered ASL Learning</span>
          </h1>
          <p className="hero-description">
            Learn American Sign Language through interactive hand gesture recognition. 
            Practice ASL letters and control a robot arm with your hand movements.
          </p>
          <div className="hero-actions">
            <button className="cta-button primary" onClick={onStartApp}>
              Start Learning
            </button>
            <button className="cta-button secondary">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hand-gesture-demo">
            <div className="gesture-circle">
              <span className="gesture-icon">✋</span>
            </div>
            <div className="gesture-arrow">→</div>
            <div className="robot-arm">
              <span className="robot-icon">🤖</span>
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
              <p>Instant gesture recognition and robot control</p>
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

import { useState } from 'react'
import './App.css'

function App() {
 
  return (
     <div className="container">
      <nav className="navbar">
        <h2 className="logo">
          One<span>Tap</span>
        </h2>

        <button className="nav-btn">Download App</button>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>
            Discover People
            <br />
            Around You.
          </h1>

          <p>
            OneTap helps you instantly discover and connect with nearby people
            using Bluetooth. No searching, no usernames, just genuine
            real-world connections.
          </p>

          <div className="buttons">
            <button className="primary">Get Started</button>
            <button className="secondary">Learn More</button>
          </div>
        </div>

        <div className="hero-image">
          <div className="phone">
           
          </div>
        </div>
      </section>

      <section className="features">

        <div className="card">
          <div className="icon">📡</div>
          <h3>Bluetooth Discovery</h3>
          <p>
            Instantly find nearby people using secure Bluetooth discovery.
          </p>
        </div>

        <div className="card">
          <div className="icon">💬</div>
          <h3>Instant Chat</h3>
          <p>
            Connect and start chatting in seconds after discovering someone.
          </p>
        </div>

        <div className="card">
          <div className="icon">🔒</div>
          <h3>Private & Safe</h3>
          <p>
            Your information stays protected while you choose who to connect
            with.
          </p>
        </div>

      </section>

      <footer>
        <h2>Ready to Meet New People?</h2>
        <p>Download OneTap today and discover who's around you.</p>

        <button className="primary">Download Now</button>
      </footer>
    </div>
  )
}

export default App

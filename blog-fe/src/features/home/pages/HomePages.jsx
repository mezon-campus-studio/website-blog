import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/HomePages.css";

export default function HomePage() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="home-container">

      {/* Thanh Điều Hướng */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">The Curator</h1>

          <div className="nav-links">
            <Link to="/home" className="active">Home</Link>
            <Link to="#">Categories</Link>
            <Link to="#">About</Link>
          </div>
        </div>

        <div className="nav-right">
          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Search insights..." />
          </div>

          <button className="theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "☀️" : "🌙"}
          </button>

          <div className="auth">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Signup</Link>
          </div>
        </div>
      </nav>

      {/* Highest Recommend */}
      <section className="rec">
        <div className="rec-left">
          <p className="tag">FEATURED INSIGHT</p>
          <h2>
            The Architect of Digital Serenity: A Guide to Minimalism.
          </h2>
          <p className="desc">
            Exploring how whitespace and hierarchy transform complex design into clarity.
          </p>

          <Link to="#" className="btn-primary">
            Read Full Article →
          </Link>
        </div>

        <div className="rec-right"></div>

      </section>

      {/* Bài */}
      <section className="articles">
        <h3>The Latest Chronicles</h3>

        <div className="article-grid">
          {[1, 2, 3].map((i) => (
            <Link to={`/article/${i}`} key={i} className="card">
              <div className="card-img"></div>

              <h4>Article Title {i}</h4>

              <p>
                Short description about this article content...
              </p>

              <div className="author">
                <img src={`https://i.pravatar.cc/40?img=${i}`} />
                <span>Author Name</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section className="subscribe">
        <div className="subscribe-box">
          <div>
            <h3>Join the Inner Circle of Curators</h3>
            <p>
              Get exclusive resources and insights delivered to your inbox.
            </p>

            <div className="subscribe-input">
              <input placeholder="email@example.com" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">

          <div>
            <h4>The Curator</h4>
            <p>
              High-end gallery for technical knowledge.
            </p>

            <div className="icons">
              {/* X */}
              <a href="https://x.com" target="_blank">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2H21l-6.563 7.5L22 22h-6.828l-5.35-6.56L3.5 22H1l7.062-8.062L2 2h6.828l4.9 6.03L18.244 2Z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a href="https://github.com" target="_blank">
                <svg
                    width="20"  height="20"  viewBox="0 0 24 24"  fill="currentColor"  xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0.5C5.73 0.5 0.75 5.48 0.75 11.77c0 5.01 3.24 9.27 7.74 10.77.57.1.78-.25.78-.55v-2.02c-3.15.68-3.81-1.35-3.81-1.35-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.76.4-1.26.73-1.55-2.52-.28-5.17-1.26-5.17-5.62 0-1.24.44-2.26 1.17-3.06-.12-.28-.51-1.41.11-2.94 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.53.23 2.66.11 2.94.73.8 1.17 1.82 1.17 3.06 0 4.37-2.66 5.34-5.19 5.62.41.35.77 1.04.77 2.1v3.12c0 .3.21.65.79.54 4.5-1.5 7.73-5.76 7.73-10.77C23.25 5.48 18.27 0.5 12 0.5z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Guidelines</a></li>
              <li><a href="#">Resources</a></li>
              <li><a href="#">Policy</a></li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
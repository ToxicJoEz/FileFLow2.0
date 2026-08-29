// ============================================================
// FILEFLOW — SHARED JS
// Navigation, footer, scroll animations, mobile menu
// ============================================================

const NAV_LINKS = [
  { href: 'index.html',       label: 'Home' },
  { href: 'about.html',       label: 'About' },
  { href: 'pricing.html',     label: 'Pricing' },
  { href: 'roadmap.html',     label: 'Roadmap' },
  { href: 'blog.html',        label: 'Blog' },
  { href: 'community.html',   label: 'Community' },
  { href: 'contact.html',     label: 'Contact' },
];

function injectNav(activePage) {
  const links = NAV_LINKS.map(l =>
    `<li><a href="${l.href}" class="${l.href === activePage ? 'active' : ''}">${l.label}</a></li>`
  ).join('');

  const mobileLinks = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${l.href === activePage ? 'active' : ''}">${l.label}</a>`
  ).join('');

  document.getElementById('nav-placeholder').innerHTML = `
    <nav class="nav">
      <a href="index.html" class="nav-logo">
        <div class="nav-logo-icon">
          <svg viewBox="0 0 18 18" fill="none">
            <path d="M3 2h8l4 4v10H3V2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M11 2v4h4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M6 9h6M6 12h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </div>
        File<span>Flow</span>
      </a>
      <ul class="nav-links">${links}</ul>
      <div class="nav-actions">
        <a href="beta.html" class="btn-outline">Join Beta</a>
        <a href="login.html" class="btn-ghost">Login</a>
        <div class="nav-hamburger" id="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </div>
      </div>
    </nav>
    <div class="nav-mobile-menu" id="mobile-menu">
      ${mobileLinks}
      <div class="nav-mobile-divider"></div>
      <a href="beta.html" style="color:var(--gold);font-weight:500">Join Beta — Free</a>
      <a href="login.html">Login</a>
    </div>
  `;

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const isOpen = mobileMenu.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
    document.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '1';
      });
    });
  }
}

function injectFooter() {
  document.getElementById('footer-placeholder').innerHTML = `
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="nav-logo" style="text-decoration:none">
            <div class="nav-logo-icon">
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M3 2h8l4 4v10H3V2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M11 2v4h4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M6 9h6M6 12h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </div>
            File<span>Flow</span>
          </a>
          <p>Your all-in-one file management platform. Fast. Smart. Simple. Search inside every document instantly — 100% offline.</p>
          <div style="margin-top:1.25rem;display:flex;gap:8px;flex-wrap:wrap">
            <span class="tag green">v0.9.4 Beta</span>
            <span class="tag">Windows 10/11</span>
            <span class="tag">100% Offline</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="screenshots.html">Screenshots</a></li>
            <li><a href="pricing.html">Pricing</a></li>
            <li><a href="roadmap.html">Roadmap</a></li>
            <li><a href="changelog.html">Changelog</a></li>
            <li><a href="beta.html">Join Beta</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Community</h4>
          <ul>
            <li><a href="community.html">Forum</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="profile.html">Profiles</a></li>
            <li><a href="achievements.html">Achievements</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="terms.html">Terms of Service</a></li>
            <li><a href="privacy.html">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 FileFlow. All rights reserved.</p>
        <p style="display:flex;align-items:center;gap:8px">
          Built with care · Windows Desktop App
          <span style="color:var(--border-2)">·</span>
          <a href="privacy.html" style="color:var(--text-4);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--text-4)'">Privacy</a>
          <span style="color:var(--border-2)">·</span>
          <a href="terms.html" style="color:var(--text-4);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--text-4)'">Terms</a>
        </p>
      </div>
    </footer>
  `;
}

// Scroll animation
function initScrollAnim() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.anim-fade-up').forEach(el => obs.observe(el));
}

// Generic working filter system — call on any page
function initFilters(filterSelector, targetSelector, dataAttr) {
  const btns = document.querySelectorAll(filterSelector);
  const items = document.querySelectorAll(targetSelector);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.filter || btn.dataset.cat || 'all';
      items.forEach(item => {
        const match = val === 'all' || (item.dataset[dataAttr] || '').toLowerCase().includes(val.toLowerCase());
        item.style.display = match ? '' : 'none';
        if (match) {
          item.style.animation = 'fadeUp 0.35s ease forwards';
        }
      });
    });
  });
}

// Email validation helper
function validateEmail(val) {
  return val && val.includes('@') && val.includes('.');
}

// Simulate email sending (frontend mock — replace with real API call)
function mockEmailSend(email, type, callback) {
  setTimeout(() => callback(true), 800);
}

document.addEventListener('DOMContentLoaded', initScrollAnim);

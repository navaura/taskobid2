// Dynamic Navigation & Footer Generator
(function () {
  'use strict';

  // Navigation configuration
  const navConfig = {
    logo: {
      text: 'TaskoBid',
      href: '/'
    },
    links: [
      { text: 'Home', href: '/' },
      { text: 'How It Works', href: 'how-it-works' },
      { text: 'Categories', href: 'categories' },
      { text: 'For Providers', href: 'for-providers' },
      { text: 'Pricing', href: 'pricing' },
      { text: 'Safety & Trust', href: 'safety' },
      { text: 'About', href: 'about' },
      { text: 'Contact', href: 'contact' }
    ]
  };

  // Footer configuration
  const footerConfig = {
    logo: {
      image: 'https://www.taskobid.in/logo3.png',
      text: 'TaskoBid'
    },
    copyright: '© 2025 TaskoBid. All rights reserved.',
    tagline: 'Built with ❤️ in India aka Bharat',
    links: [
      { text: 'Privacy Policy', href: 'privacy.html' },
      { text: 'Terms & Conditions', href: 'terms.html' }
    ]
  };

  // Detect if we're on index page
  function isIndexPage() {
    let path = window.location.pathname;
    const page = path.split('/').pop();
    return !page || page === '/' || page === '/';
  }

  // Get current page name
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
  }

  // Generate unified navigation markup
  function generateNav() {
    const currentPage = getCurrentPage();
    const isIndex = isIndexPage();
    
    const linksHTML = navConfig.links
      .map(link => {
        const linkPage = link.href.replace('.html', '').replace('index', '');
        const currentClean = currentPage === 'index' ? '' : currentPage;
        const isActive = currentClean === linkPage || (isIndex && link.href === '/');
        
        return `<a href="${link.href}"${isActive ? ' class="active"' : ''}>${link.text}</a>`;
      })
      .join('\n');

    return `
      <header class="brand-header" id="header">
        <div class="header-content">
          <a href="${navConfig.logo.href}" class="brand-logo">
            <div class="logo-icon"><img src="./taskbid.svg" alt="TaskoBid Logo" style="width: 100%; height: 100%; object-fit: contain;"></div>
            <span>${navConfig.logo.text}</span>
          </a>
          
          <button class="hamburger-index" id="hamburgerBtn" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav class="nav-links" id="navLinks">
            ${linksHTML}
          </nav>
        </div>
      </header>
      <div class="nav-overlay" id="navOverlay"></div>
    `;
  }

  // Generate footer markup
  function generateFooter() {
    const footerLinksHTML = footerConfig.links
      .map(link => `<a href="${link.href}">${link.text}</a>`)
      .join('\n');

    return `
      <footer class="footer">
        <div class="footer-content">
        <div class="brand-logo" style="justify-content: center; color: white; margin-bottom: 2rem;">
            <div class="logo-icon"><img alt="" style="max-width: -webkit-fill-available;max-width: -moz-available;" src="http://www.taskobid.in/taskobid.svg"></div>
            <span>TaskoBid</span>
        </div>
          <p style="opacity: 0.7; margin-bottom: 1rem;">${footerConfig.copyright}</p>
          <p style="opacity: 0.7;">${footerConfig.tagline}</p>
          <div class="footer-links">
            ${footerLinksHTML}
          </div>
        </div>
      </footer>
    `;
  }

  // Setup mobile hamburger menu
  function setupHamburger() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!hamburger || !navLinks || !navOverlay) return;

    // Toggle menu
    function toggleMenu() {
      const isActive = hamburger.classList.contains('active');
      
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      hamburger.classList.add('active');
      navLinks.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Hamburger click
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMenu();
    });

    // Overlay click
    navOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking a navigation link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Escape key closes menu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        closeMenu();
      }
    });

    // Prevent body scroll when menu is open
    navLinks.addEventListener('touchmove', function(e) {
      e.stopPropagation();
    }, { passive: true });
  }

  // Setup scroll effects
  function setupScrollEffects() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;
          
          if (currentScroll > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          
          lastScroll = currentScroll;
          ticking = false;
        });
        
        ticking = true;
      }
    }, { passive: true });
  }

  // Setup smooth scroll for anchor links
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const header = document.getElementById('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Insert navigation into DOM
  function insertNav() {
    const navHTML = generateNav();
    
    // Remove existing header/nav if present
    const existingHeader = document.querySelector('.brand-header, .main-nav');
    const existingOverlay = document.querySelector('.nav-overlay');
    if (existingHeader) existingHeader.remove();
    if (existingOverlay) existingOverlay.remove();

    // Insert at beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    setupHamburger();
    setupScrollEffects();
    setupSmoothScroll();
  }

  // Insert footer into DOM
  function insertFooter() {
    const footerHTML = generateFooter();
    
    // Remove existing footer if present
    const existingFooter = document.querySelector('.footer');
    if (existingFooter) existingFooter.remove();

    // Insert at end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  // Initialize navigation and footer
  function init() {
    insertNav();
    insertFooter();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

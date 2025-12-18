// Dynamic Navigation Generator with Mobile Hamburger Menu
(function () {
  'use strict';

  // Navigation configuration
  const navConfig = {
    logo: {
      text: 'TaskoBid',
      href: 'index.html'
    },
    links: [
      { text: 'Home', href: 'index.html' },
      { text: 'How It Works', href: 'how-it-works.html' },
      { text: 'Categories', href: 'categories.html' },
      { text: 'For Providers', href: 'for-providers.html' },
      { text: 'Pricing', href: 'pricing.html' },
      { text: 'Safety & Trust', href: 'safety.html' },
      { text: 'About', href: 'about.html' },
      { text: 'Contact', href: 'contact.html' }
    ]
  };

  // Detect if we're on index page
  function isIndexPage() {
    let path = window.location.pathname;
    const page = path.split('/').pop();
    return !page || page === 'index.html' || page === '/';
  }

  // Get current page name
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
  }

  // Generate unified navigation markup - SAME FOR ALL PAGES
  function generateNav() {
    const currentPage = getCurrentPage();
    const isIndex = isIndexPage();
    
    const linksHTML = navConfig.links
      .map(link => {
        const linkPage = link.href.replace('.html', '').replace('index', '');
        const currentClean = currentPage === 'index' ? '' : currentPage;
        const isActive = currentClean === linkPage || (isIndex && link.href === 'index.html');
        
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
    `;
  }

  // Setup mobile hamburger menu
  function setupHamburger() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    let isDragging = false;

    // Prevent accidental close when scrolling menu
    navLinks.addEventListener('touchstart', () => {
      isDragging = false;
    });

    navLinks.addEventListener('touchmove', () => {
      isDragging = true;
    });

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking a navigation link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (!isDragging) { 
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.classList.remove('nav-open');
        }
      });
    });

    // Enable drawer scroll
    function enableDrawerScroll() {
      navLinks.addEventListener('touchmove', function (e) {
        const isScrollable = navLinks.scrollHeight > navLinks.clientHeight;
        if (isScrollable) {
          e.stopPropagation();
        }
      }, { passive: false });
    }

    enableDrawerScroll();

    // Close when tapping outside
    document.addEventListener('click', function (e) {
      if (
        !isDragging &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });

    // Escape key closes menu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // Setup scroll effects
  function setupScrollEffects() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
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
    if (existingHeader) {
      existingHeader.remove();
    }

    // Insert at beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    setupHamburger();
    setupScrollEffects();
    setupSmoothScroll();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertNav);
  } else {
    insertNav();
  }
})();
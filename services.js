async function loadXLSX() {
  const file = await fetch('/data/services.xlsx');
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}

function renderCategories(data) {
  const container = document.getElementById("categories-list");
  
  // COMPLETELY CLEAR THE CONTAINER - Remove loading state
  container.innerHTML = '';
  
  const groups = {};

  data.forEach(row => {
    if (!groups[row.category_name]) {
      groups[row.category_name] = [];
    }
    groups[row.category_name].push(row);
  });

  let totalServices = 0;

  Object.entries(groups).forEach(([category, services]) => {
    totalServices += services.length;

    const block = document.createElement("div");
    block.className = 'category-block';

    block.innerHTML = `
      <h2>${category} <span class="count-badge">${services.length}</span></h2>
      <ul class="service-list">
        ${services.map(s => `
          <li class="service-item">
            <span class="service-name">${s.service_name}</span>
            <span class="service-price">₹${s.base_price}</span>
          </li>
        `).join("")}
      </ul>
    `;

    container.appendChild(block);
  });

  setupProfessionalScrollbar(totalServices);
}

function setupProfessionalScrollbar(totalServices) {
  const track = document.getElementById('custom-scrollbar-track');
  const thumb = document.getElementById('scrollbar-thumb');
  const counter = document.getElementById('scroll-counter');
  
  if (!track || !thumb || !counter) return;
  
  let scrollTimeout;
  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;

  function updateScrollbar() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const maxScroll = scrollHeight - clientHeight;
    
    if (maxScroll <= 0) return;

    // Calculate scroll progress
    const scrollProgress = scrollTop / maxScroll;
    
    // Get track dimensions
    const trackRect = track.getBoundingClientRect();
    const trackHeight = trackRect.height;
    
    // Calculate thumb height (proportional to viewport/content ratio)
    const thumbHeight = Math.max(60, (clientHeight / scrollHeight) * trackHeight);
    const maxThumbTop = trackHeight - thumbHeight;

    // Position thumb
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.top = `${scrollProgress * maxThumbTop}px`;

    // Count services that have entered viewport
    let scrolledPastCount = 0;
    document.querySelectorAll('.service-item').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        scrolledPastCount++;
      }
    });

    // Update counter
    counter.textContent = `${scrolledPastCount}/${totalServices}`;
    
    // Position counter aligned with thumb
    const thumbTop = scrollProgress * maxThumbTop;
    counter.style.top = `${thumbTop + (thumbHeight / 2)}px`;
    counter.style.transform = 'translateY(-50%)';

    // Show scrollbar
    track.classList.add('visible');

    // Auto-hide after 2.5 seconds
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (!isDragging) {
        track.classList.remove('visible');
      }
    }, 2500);
  }

  // Scroll event
  window.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);

  // Drag functionality
  thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = document.documentElement.scrollTop;
    e.preventDefault();
    
    // Keep visible while dragging
    clearTimeout(scrollTimeout);
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startY;
    const trackRect = track.getBoundingClientRect();
    const trackHeight = trackRect.height;
    const thumbHeight = thumb.offsetHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const { scrollHeight, clientHeight } = document.documentElement;
    const maxScroll = scrollHeight - clientHeight;

    const scrollAmount = (deltaY / maxThumbTop) * maxScroll;
    document.documentElement.scrollTop = startScrollTop + scrollAmount;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      
      // Auto-hide after drag ends
      scrollTimeout = setTimeout(() => {
        track.classList.remove('visible');
      }, 2500);
    }
  });

  // Click on track to jump
  track.addEventListener('click', (e) => {
    if (e.target === track || e.target.id === 'scrollbar-bg') {
      const trackRect = track.getBoundingClientRect();
      const clickY = e.clientY - trackRect.top;
      const trackHeight = trackRect.height;
      const { scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      
      const targetScroll = (clickY / trackHeight) * maxScroll;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  });

  // Show on hover
  track.addEventListener('mouseenter', () => {
    track.classList.add('visible');
    clearTimeout(scrollTimeout);
  });

  track.addEventListener('mouseleave', () => {
    if (!isDragging) {
      scrollTimeout = setTimeout(() => {
        track.classList.remove('visible');
      }, 1000);
    }
  });

  // Initial update
  setTimeout(updateScrollbar, 100);
}

// Initialize with error handling
(async function() {
  try {
    const data = await loadXLSX();
    renderCategories(data);
  } catch (error) {
    console.error('Error loading services:', error);
    const container = document.getElementById("categories-list");
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; color: var(--text-dim);">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ Error loading services</p>
        <p>Please check the console for details</p>
      </div>
    `;
  }
})();
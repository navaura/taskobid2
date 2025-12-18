(function () {
  // ================= CONFIG =================
  const CONFIG = {
    showAfter: 4500,      // ms on page before showing
    closeDelay: 2000,     // ms before close button appears
    image: "logo.png",
    title: "Get Started Faster 🚀",
    text: "Post your first task today and receive bids from verified professionals.",
    buttonText: "Start Now",
    buttonLink: "https://app.taskobid.in/register",
    showOnce: false       // set true to show only once per user
  };

  // Check if already shown
  if (CONFIG.showOnce && localStorage.getItem("auto_popup_seen")) return;

  // ================= STYLES =================
  const style = document.createElement("style");
  style.innerHTML = `
    .js-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      animation: fadeIn 0.3s ease;
      padding: 1rem;
    }
    
    .js-popup {
      background: #ffffff;
      width: 100%;
      max-width: 440px;
      padding: 2.5rem 2rem;
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9);
      animation: popupScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }
    
    .js-popup-img {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.25rem;
      object-fit: contain;
    }
    
    .js-popup-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
      color: #111827;
      line-height: 1.3;
    }
    
    .js-popup-text {
      font-size: 1rem;
      line-height: 1.6;
      color: #6b7280;
      margin: 0 0 1.75rem;
    }
    
    .js-popup-btn {
      display: inline-block;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      padding: 0.875rem 2.5rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      cursor: pointer;
      border: none;
    }
    
    .js-popup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
      background: linear-gradient(135deg, #059669, #047857);
    }
    
    .js-popup-btn:active {
      transform: translateY(0);
    }
    
    .js-popup-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.06);
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      color: #6b7280;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .js-popup-close.show {
      opacity: 1;
      pointer-events: auto;
    }
    
    .js-popup-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: #111827;
    }
    
    @keyframes popupScale {
      to { 
        transform: scale(1); 
        opacity: 1;
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @media (max-width: 480px) {
      .js-popup {
        padding: 2rem 1.5rem;
      }
      .js-popup-title {
        font-size: 1.5rem;
      }
      .js-popup-text {
        font-size: 0.9375rem;
      }
    }
  `;
  document.head.appendChild(style);

  // ================= CREATE POPUP =================
  function showPopup() {
    const overlay = document.createElement("div");
    overlay.className = "js-popup-overlay";

    const popup = document.createElement("div");
    popup.className = "js-popup";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "js-popup-close";
    closeBtn.innerHTML = "×";
    closeBtn.setAttribute("aria-label", "Close popup");

    // Image
    const img = document.createElement("img");
    img.className = "js-popup-img";
    img.src = CONFIG.image;
    img.alt = "Logo";
    img.onerror = () => img.style.display = "none";

    // Title
    const title = document.createElement("h3");
    title.className = "js-popup-title";
    title.textContent = CONFIG.title;

    // Text
    const text = document.createElement("p");
    text.className = "js-popup-text";
    text.textContent = CONFIG.text;

    // Button
    const btn = document.createElement("a");
    btn.className = "js-popup-btn";
    btn.href = CONFIG.buttonLink;
    btn.textContent = CONFIG.buttonText;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";

    // Assemble popup
    popup.appendChild(closeBtn);
    popup.appendChild(img);
    popup.appendChild(title);
    popup.appendChild(text);
    popup.appendChild(btn);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Show close button after delay
    setTimeout(() => closeBtn.classList.add("show"), CONFIG.closeDelay);

    // Close handlers
    function close() {
      overlay.style.animation = "fadeIn 0.2s ease reverse";
      setTimeout(() => {
        overlay.remove();
        if (CONFIG.showOnce) {
          localStorage.setItem("auto_popup_seen", "1");
        }
      }, 200);
    }

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // ESC key to close
    const escHandler = (e) => {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  // ================= TRIGGER =================
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(showPopup, CONFIG.showAfter);
    });
  } else {
    setTimeout(showPopup, CONFIG.showAfter);
  }
})();
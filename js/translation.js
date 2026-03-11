
// Simple language translation with proper bidirectional switching
let translationCheckAttempts = 0;
const MAX_ATTEMPTS = 50;

// Create overlay that hides content until translated
function createTranslationOverlay(lang) {
  const existingOverlay = document.getElementById('translation-overlay');
  if (existingOverlay) existingOverlay.remove();
  
  const overlay = document.createElement('div');
  overlay.id = 'translation-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
  `;
  
  // Show appropriate loading text based on target language
  const loadingText = lang === 'ar' ? 'جاري التحميل...' : 'Loading...';
  
  overlay.innerHTML = `
    <div style="text-align: center;">
      <div style="
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #9e2e2e;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <p style="margin-top: 20px; color: #666; font-family: sans-serif;">${loadingText}</p>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;
  
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  
  return overlay;
}

// Remove overlay and show content
function removeOverlay() {
  const overlay = document.getElementById('translation-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
        document.body.style.overflow = '';
      }
    }, 300);
  }
}

// Check if we need Arabic
function needsArabic() {
  const cookies = document.cookie.split(';');
  const hasArabicCookie = cookies.some(c => c.trim().startsWith('googtrans=/en/ar'));
  const savedLang = localStorage.getItem('preferredLanguage');
  
  return hasArabicCookie || savedLang === 'ar';
}

// Clear Google Translate completely
function resetGoogleTranslate() {
  // Remove Google Translate cookies
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
  });
  
  // Remove Google Translate classes
  document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
  
  // Remove Google Translate meta tag if present
  const meta = document.querySelector('meta[name="google-translate-customization"]');
  if (meta) meta.remove();
  
  // Force reload of page to clear translation
  window.location.reload();
}

// Apply translation
function applyTranslation(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
    return true;
  }
  return false;
}

// Check if translation is complete for target language
function isTranslationComplete(targetLang) {
  if (targetLang === 'ar') {
    // Check for Arabic text
    const mainContent = document.querySelector('main') || document.body;
    const textSample = mainContent.innerText.substring(0, 1000);
    const hasArabicText = /[\u0600-\u06FF]/.test(textSample);
    const hasTranslationClass = document.documentElement.classList.contains('translated-ltr') ||
                               document.documentElement.classList.contains('translated-rtl');
    
    return hasArabicText || hasTranslationClass;
  } else {
    // For English, check that no Arabic text remains
    const mainContent = document.querySelector('main') || document.body;
    const textSample = mainContent.innerText.substring(0, 1000);
    const hasNoArabicText = !/[\u0600-\u06FF]/.test(textSample);
    const hasNoTranslationClass = !document.documentElement.classList.contains('translated-ltr') &&
                                 !document.documentElement.classList.contains('translated-rtl');
    
    return hasNoArabicText || hasNoTranslationClass;
  }
}

// Hide body until translation is ready
function hideUntilTranslated(targetLang) {
  // Hide body content
  document.body.style.visibility = 'hidden';
  
  // Create overlay with appropriate language
  const overlay = createTranslationOverlay(targetLang);
  
  // Reset check attempts
  translationCheckAttempts = 0;
  
  // Try to apply translation
  if (!applyTranslation(targetLang)) {
    // Retry a few times
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      retryCount++;
      if (applyTranslation(targetLang) || retryCount > 10) {
        clearInterval(retryInterval);
      }
    }, 200);
  }
  
  // Check for translation completion
  const checkInterval = setInterval(() => {
    if (isTranslationComplete(targetLang)) {
      // Show content and remove overlay
      document.body.style.visibility = 'visible';
      removeOverlay();
      clearInterval(checkInterval);
    }
    
    translationCheckAttempts++;
    if (translationCheckAttempts > MAX_ATTEMPTS) {
      // Timeout - show content anyway
      document.body.style.visibility = 'visible';
      removeOverlay();
      clearInterval(checkInterval);
    }
  }, 100);
}

// Google Translate callback
window.googleTranslateElementInit = function() {
  const translateDiv = document.getElementById('google_translate_element');
  if (translateDiv) {
    translateDiv.innerHTML = '';
    translateDiv.style.display = 'none';
    
    new google.translate.TranslateElement(
      { 
        pageLanguage: 'en', 
        autoDisplay: false,
        includedLanguages: 'en,ar'
      },
      'google_translate_element'
    );
    
    // Check if we need Arabic on page load
    const targetLang = needsArabic() ? 'ar' : 'en';
    setTimeout(() => {
      hideUntilTranslated(targetLang);
    }, 500);
  }
};

// Load Google Translate
function loadGoogleTranslate() {
  if (!document.querySelector('script[src*="translate.google.com"]')) {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }
}

// Language switcher
window.setLanguage = function(lang, label) {
  // Update button immediately
  const currentLang = document.getElementById('currentLang');
  if (currentLang) {
    currentLang.textContent = lang === 'ar' ? 'العربية' : 'English';
  }
  
  // Hide dropdown
  const langMenu = document.getElementById('langMenu');
  if (langMenu) langMenu.classList.add('hidden');
  
  // Save preference
  localStorage.setItem('preferredLanguage', lang);
  
  if (lang === 'ar') {
    // Set cookie for Arabic
    document.cookie = "googtrans=/en/ar; path=/; max-age=31536000";
    
    // Hide content and show overlay
    hideUntilTranslated('ar');
    
    // Apply translation
    setTimeout(() => {
      if (!applyTranslation('ar')) {
        // If widget not ready, reload
        setTimeout(() => window.location.reload(), 500);
      }
    }, 300);
  } else {
    // Clear cookie for English
    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // For English, we need to completely reset
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      // Hide content and show overlay
      hideUntilTranslated('en');
      
      // Set to English
      setTimeout(() => {
        select.value = 'en';
        select.dispatchEvent(new Event('change'));
        
        // Also remove any translation classes
        document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      }, 300);
    } else {
      // If widget not found, reload to reset
      window.location.reload();
    }
  }
};

// Toggle menu
window.toggleLanguageMenu = function() {
  document.getElementById('langMenu')?.classList.toggle('hidden');
};

// Update button text
function updateButtonText() {
  const currentLang = document.getElementById('currentLang');
  if (currentLang) {
    currentLang.textContent = needsArabic() ? 'العربية' : 'English';
  }
}

// Initial page load
document.addEventListener('DOMContentLoaded', function() {
  // Hide body immediately
  document.body.style.visibility = 'hidden';
  
  // Load Google Translate
  loadGoogleTranslate();
  
  // Update button text
  updateButtonText();
  
  // Setup language button
  const langButton = document.getElementById('langButton');
  if (langButton) {
    langButton.onclick = (e) => {
      e.preventDefault();
      toggleLanguageMenu();
    };
  }
});

// Handle header loaded
document.addEventListener('headerLoaded', function() {
  updateButtonText();
  
  const langButton = document.getElementById('langButton');
  if (langButton) {
    langButton.onclick = (e) => {
      e.preventDefault();
      toggleLanguageMenu();
    };
  }
});

// Handle page show event (for back/forward cache)
window.addEventListener('pageshow', function() {
  const targetLang = needsArabic() ? 'ar' : 'en';
  hideUntilTranslated(targetLang);
});
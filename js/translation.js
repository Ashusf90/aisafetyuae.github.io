// // translation.js
// // Set language immediately when function is called
// window.setLanguage = function(lang, label) {
//   // Update button text immediately using textContent (more reliable than innerText)
//   const currentLang = document.getElementById('currentLang');
//   if (currentLang) {
//     if (lang === 'ar') {
//       currentLang.textContent = 'العربية';
//     } else {
//       currentLang.textContent = 'English';
//     }
//   }
  
//   // Hide dropdown
//   const langMenu = document.getElementById('langMenu');
//   if (langMenu) {
//     langMenu.classList.add('hidden');
//   }
  
//   // Store preference
//   localStorage.setItem('preferredLanguage', lang);
  
//   // Set Google Translate cookie
//   if (lang === 'ar') {
//     document.cookie = "googtrans=/en/ar; path=/; max-age=31536000";
//   } else {
//     document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//   }
  
//   // Reload the page to apply translation
//   location.reload();
// };

// // Toggle dropdown function
// window.toggleLanguageMenu = function() {
//   const langMenu = document.getElementById('langMenu');
//   if (langMenu) {
//     langMenu.classList.toggle('hidden');
//   }
// };

// // Force update button text despite Google Translate
// function forceButtonText() {
//   const currentLang = document.getElementById('currentLang');
//   if (!currentLang) return;
  
//   // Check cookie for current language
//   const cookies = document.cookie.split(';');
//   let isArabic = false;
  
//   for (let cookie of cookies) {
//     if (cookie.trim().startsWith('googtrans=/en/ar')) {
//       isArabic = true;
//       break;
//     }
//   }
  
//   // Also check localStorage as backup
//   const savedLang = localStorage.getItem('preferredLanguage');
//   if (savedLang === 'ar' || isArabic) {
//     currentLang.textContent = 'العربية';
//   } else {
//     currentLang.textContent = 'English';
//   }
  
//   // Add a mutation observer to ensure Google Translate doesn't change it back
//   const observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       if (mutation.type === 'childList' || mutation.type === 'characterData') {
//         if (currentLang.textContent !== 'العربية' && currentLang.textContent !== 'English') {
//           // Reset if Google Translate changed it
//           if (isArabic || savedLang === 'ar') {
//             currentLang.textContent = 'العربية';
//           } else {
//             currentLang.textContent = 'English';
//           }
//         }
//       }
//     });
//   });
  
//   observer.observe(currentLang, { 
//     childList: true, 
//     characterData: true, 
//     subtree: true 
//   });
// }

// // Check current language on page load
// (function() {
//   // Run when DOM is ready
//   const checkLanguage = function() {
//     forceButtonText();
//   };
  
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', checkLanguage);
//   } else {
//     checkLanguage();
//   }
  
//   // Also run after everything loads
//   window.addEventListener('load', function() {
//     setTimeout(forceButtonText, 500);
//     setTimeout(forceButtonText, 1000);
//     setTimeout(forceButtonText, 2000);
//   });
// })();

// // Initialize Google Translate on page load
// function initGoogleTranslate() {
//   // Check if Google Translate is already loaded
//   if (typeof google !== 'undefined' && google.translate) {
//     createTranslateElement();
//   } else {
//     // Load Google Translate script
//     window.googleTranslateElementInit = function() {
//       createTranslateElement();
//     };
    
//     const script = document.createElement('script');
//     script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//     script.async = true;
//     document.head.appendChild(script);
//   }
// }

// function createTranslateElement() {
//   const translateDiv = document.getElementById('google_translate_element');
//   if (!translateDiv) {
//     setTimeout(createTranslateElement, 200);
//     return;
//   }
  
//   translateDiv.innerHTML = '';
//   translateDiv.style.display = 'none';
  
//   new google.translate.TranslateElement(
//     { 
//       pageLanguage: 'en', 
//       autoDisplay: false,
//       includedLanguages: 'en,ar'
//     },
//     'google_translate_element'
//   );
  
//   // Force button text after Google Translate initializes
//   setTimeout(forceButtonText, 1000);
// }

// // Attach event listeners
// document.addEventListener('headerLoaded', function() {
//   const langButton = document.getElementById('langButton');
//   if (langButton) {
//     langButton.onclick = function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       toggleLanguageMenu();
//     };
//   }
  
//   initGoogleTranslate();
//   forceButtonText();
// });

// document.addEventListener('DOMContentLoaded', function() {
//   const langButton = document.getElementById('langButton');
//   if (langButton) {
//     langButton.onclick = function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       toggleLanguageMenu();
//     };
//   }
  
//   if (document.getElementById('google_translate_element')) {
//     initGoogleTranslate();
//   }
  
//   forceButtonText();
// });

// Simple language translation with content hiding until translated
let translationCheckAttempts = 0;
const MAX_ATTEMPTS = 50; // 5 seconds (50 * 100ms)

// Create overlay that hides content until translated
function createTranslationOverlay() {
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
      <p style="margin-top: 20px; color: #666; font-family: sans-serif;">جاري التحميل...</p>
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

// Apply translation
function applyTranslation() {
  const select = document.querySelector('.goog-te-combo');
  if (select && select.value !== 'ar') {
    select.value = 'ar';
    select.dispatchEvent(new Event('change'));
    return true;
  }
  return false;
}

// Check if translation is complete
function isTranslationComplete() {
  // Check for Arabic text in visible content
  const mainContent = document.querySelector('main') || document.body;
  const textSample = mainContent.innerText.substring(0, 1000);
  
  // Look for common Arabic words/letters
  const hasArabicText = /[\u0600-\u06FF]/.test(textSample);
  
  // Check for Google Translate classes
  const hasTranslationClass = document.documentElement.classList.contains('translated-ltr') ||
                             document.documentElement.classList.contains('translated-rtl');
  
  return hasArabicText || hasTranslationClass;
}

// Hide body until translation is ready
function hideUntilTranslated() {
  // If no Arabic needed, show content immediately
  if (!needsArabic()) {
    document.body.style.visibility = 'visible';
    return;
  }
  
  // Hide body content
  document.body.style.visibility = 'hidden';
  
  // Create overlay
  const overlay = createTranslationOverlay();
  
  // Try to apply translation
  if (!applyTranslation()) {
    // Retry a few times
    let retryCount = 0;
    const retryInterval = setInterval(() => {
      retryCount++;
      if (applyTranslation() || retryCount > 10) {
        clearInterval(retryInterval);
      }
    }, 200);
  }
  
  // Check for translation completion
  const checkInterval = setInterval(() => {
    if (isTranslationComplete()) {
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
    
    // Trigger translation check
    hideUntilTranslated();
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
  // Update button
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
    document.cookie = "googtrans=/en/ar; path=/; max-age=31536000";
    // Reload to trigger translation with overlay
    location.reload();
  } else {
    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    location.reload();
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
  
  // If no Arabic needed, show content
  if (!needsArabic()) {
    document.body.style.visibility = 'visible';
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
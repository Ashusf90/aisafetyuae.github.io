(function() {
  function highlightNav() {
    const navLinks = document.querySelectorAll('header nav a');
    if (navLinks.length === 0) {
      setTimeout(highlightNav, 100);
      return;
    }
    
    // Get current page from URL
    let path = window.location.pathname;
    
    // Handle different URL patterns
    if (path.endsWith('/')) {
      path = path + 'index.html';
    }
    
    let currentPage = path.split('/').pop() || 'index.html';
    currentPage = currentPage.toLowerCase();
    
    console.log("Looking for:", currentPage);
    
    navLinks.forEach(link => {
      let linkHref = link.getAttribute('href').toLowerCase();
      
      // Check if current page ends with the link href
      // or if it's the index page
      if (currentPage === linkHref || 
          (currentPage === '' && linkHref === 'index.html') ||
          (currentPage === '/' && linkHref === 'index.html')) {
        link.classList.remove('font-medium');
        link.classList.add('font-semibold');
        console.log("Added bold to:", link.textContent.trim());
      } else {
        link.classList.remove('font-semibold');
      }
    });
  }
  
  // Run when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightNav);
  } else {
    highlightNav();
  }
  
  // Also run after window loads
  window.addEventListener('load', highlightNav);
})();
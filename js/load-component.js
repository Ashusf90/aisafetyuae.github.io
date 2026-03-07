// document.addEventListener('DOMContentLoaded', function() {
//   console.log('DOM loaded, attempting to load header and footer...');
  
//   // Load header
//   const headerElement = document.getElementById('header');
//   if (headerElement) {
//     console.log('Header element found, fetching header.html...');
//     fetch('header.html')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.text();
//       })
//       .then(data => {
//         console.log('Header loaded successfully');
//         headerElement.innerHTML = data;
//       })
//       .catch(error => {
//         console.error('Error loading header:', error);
//         // Optional: Show fallback content
//         headerElement.innerHTML = '<div style="color:red">Header failed to load</div>';
//       });
//   } else {
//     console.error('Header element not found! Check if <div id="header"></div> exists');
//   }

//   // Load footer
//   const footerElement = document.getElementById('footer');
//   if (footerElement) {
//     console.log('Footer element found, fetching footer.html...');
//     fetch('footer.html')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.text();
//       })
//       .then(data => {
//         console.log('Footer loaded successfully');
//         footerElement.innerHTML = data;
//       })
//       .catch(error => {
//         console.error('Error loading footer:', error);
//         footerElement.innerHTML = '<div style="color:red">Footer failed to load</div>';
//       });
//   } else {
//     console.error('Footer element not found! Check if <div id="footer"></div> exists');
//   }
// });

// load-components.js
document.addEventListener('DOMContentLoaded', function() {
  // Load header
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;
      
      // Dispatch custom event that header is loaded
      document.dispatchEvent(new Event('headerLoaded'));
    })
    .catch(error => console.log('Error loading header:', error));

  // Load footer
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.log('Error loading footer:', error));
});
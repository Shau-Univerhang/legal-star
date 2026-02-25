/**
 * Auth Guard
 * Checks if user is logged in, otherwise redirects to index.html
 */
(function() {
    // Check for session in localStorage
    var session = localStorage.getItem('bird_session');
    
    // If no session found
    if (!session) {
        console.log('User not logged in, redirecting to index.html');
        
        // Prevent infinite loop if already on public pages
        // (Though this script should only be included in protected pages)
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if (page !== 'index.html' && page !== 'P-LOGIN.html' && page !== 'P-REGISTER.html') {
            // Redirect to index.html
            window.location.href = 'index.html';
        }
    }
})();

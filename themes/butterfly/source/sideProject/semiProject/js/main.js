document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (navbarPlaceholder) {
        fetch('navbar-template.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                // After navbar is loaded, set the active link
                setActiveNavLink();
            })
            .catch(error => {
                console.error('Error fetching navbar template:', error);
                navbarPlaceholder.innerHTML = '<p style="color:red;">Error loading navigation bar.</p>';
            });
    }
});

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop(); // Gets the current HTML file name
    const navLinks = document.querySelectorAll('.navbar .nav-links li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

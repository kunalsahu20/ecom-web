// Mobile Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const body = document.body;

    // Function to toggle mobile menu
    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }

    // Open mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            toggleMobileMenu();
        }
    });

    // Close menu when pressing escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Prevent clicks inside mobile nav from closing it
    mobileNav.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Background Navigation Bar Effect
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.style.background = 'rgba(22, 27, 34, 0.85)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(22, 27, 34, 0.6)';
            nav.style.boxShadow = 'none';
        }
    });

    // Page Section Switching (SPA behavior)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    // Function to switch active sections
    function switchSection(targetId) {
        // Update navigation links
        navLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update sections
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active');
                
                // Small delay to allow display:block to apply before animating opacity
                setTimeout(() => {
                    section.classList.add('fade-in');
                    
                    // Re-trigger animations for elements inside the section
                    const animatedElements = section.querySelectorAll('.fade-in-up');
                    animatedElements.forEach(el => {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                        el.style.animation = null;
                    });
                }, 10);
                
            } else {
                section.classList.remove('fade-in');
                setTimeout(() => {
                    if(!section.classList.contains('fade-in')) {
                        section.classList.remove('active');
                    }
                }, 400); // Matches CSS transition duration
            }
        });
        
        // Scroll to top when switching tabs
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Handle initial state and hash changes
    function handleRoute() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        } else {
            // Default to home
            switchSection('home');
            // Trigger initial animation for home
            document.getElementById('home').classList.add('fade-in');
        }
    }

    // Add click event listeners to links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            window.location.hash = targetId;
        });
    });

    // Listen for hash changes (back/forward browser buttons)
    window.addEventListener('hashchange', handleRoute);

    // Run initial route setup
    handleRoute();
});

/**
 * Kenta Motoyashiki Portfolio — Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const navItems = document.querySelectorAll('.nav-item');
    const brandLink = document.querySelector('.site-title');
    const tabs = document.querySelectorAll('.tab-content');

    // Scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Switch section tab
    function switchTab(targetId) {
        let validTarget = targetId;
        if (!['home', 'research', 'activities'].includes(validTarget)) {
            validTarget = 'home';
        }

        // Update nav active states
        navItems.forEach(item => {
            const matches = item.dataset.target === validTarget;
            item.classList.toggle('active', matches);
        });

        // Switch tab contents with smooth fade
        tabs.forEach(tab => {
            if (tab.id === validTarget) {
                tab.classList.add('active');
                requestAnimationFrame(() => {
                    tab.classList.add('fade-in');
                });
            } else {
                tab.classList.remove('fade-in');
                tab.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle hash navigation
    function handleHashChange() {
        const hash = window.location.hash.replace('#', '');
        switchTab(hash || 'home');
    }

    // Event listeners for nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.target;
            if (window.location.hash !== `#${target}`) {
                window.location.hash = target;
            } else {
                switchTab(target);
            }
        });
    });

    if (brandLink) {
        brandLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = 'home';
        });
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    // ==========================================================================
    // Lightbox for Photos
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const fullSrc = card.getAttribute('data-full');
            if (fullSrc) {
                lightboxImg.src = fullSrc;
                lightbox.style.display = 'flex';
                requestAnimationFrame(() => {
                    lightbox.classList.add('open');
                });
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            document.body.style.overflow = '';
        }, 200);
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });
});

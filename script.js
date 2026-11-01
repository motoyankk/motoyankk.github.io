/**
 * Kenta Motoyashiki Portfolio — Script
 */

document.addEventListener('DOMContentLoaded', () => {
    const navTabs = document.querySelectorAll('.nav-tab');
    const profileTabs = document.querySelectorAll('.tab-btn');
    const tabSections = document.querySelectorAll('.tab-section');

    function switchTab(targetId) {
        let validId = targetId;
        if (!['about', 'research', 'activities'].includes(validId)) {
            validId = 'about';
        }

        // Update header nav tabs
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === validId);
        });

        // Update profile card tabs
        profileTabs.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === validId);
        });

        // Update sections
        tabSections.forEach(section => {
            if (section.id === validId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        switchTab(hash || 'about');
    }

    // Attach click events
    [...navTabs, ...profileTabs].forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = el.dataset.tab;
            if (window.location.hash !== `#${tabId}`) {
                window.location.hash = tabId;
            } else {
                switchTab(tabId);
            }
            // Smooth scroll up to tabs if scrolled down
            const profileCard = document.querySelector('.profile-card');
            if (profileCard && window.scrollY > profileCard.offsetTop + 100) {
                profileCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    window.addEventListener('hashchange', handleHash);
    handleHash();
});

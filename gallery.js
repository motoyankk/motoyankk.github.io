/**
 * MoK Studio — Visual Archive Gallery Script
 * Filtering & Lightbox Viewer
 */

document.addEventListener('DOMContentLoaded', async () => {
    let items = [];
    try {
        const res = await fetch('images/gallery/manifest.json');
        items = await res.json();
    } catch (e) {
        console.error('Failed to load manifest.json', e);
        return;
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxDate = document.getElementById('lightboxDate');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.querySelector('.lightbox-close-btn');
    const prevBtn = document.querySelector('.lightbox-nav-btn.prev');
    const nextBtn = document.querySelector('.lightbox-nav-btn.next');
    const backdrop = document.querySelector('.lightbox-backdrop');

    let currentFilter = 'all';
    let filteredIndices = items.map((_, i) => i);
    let currentLightboxIdx = 0;

    // Filter Logic
    function applyFilter(category, updateHash = true) {
        currentFilter = category;

        // Update button states
        filterBtns.forEach(btn => {
            if (btn.getAttribute('data-filter') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show/hide cards
        filteredIndices = [];
        cards.forEach((card, idx) => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'block';
                filteredIndices.push(idx);
            } else {
                card.style.display = 'none';
            }
        });

        if (updateHash) {
            history.replaceState(null, null, category === 'all' ? '#all' : `#${category}`);
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-filter');
            applyFilter(cat, true);
        });
    });

    // Check initial hash
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    if (['culture', 'nature', 'academic', 'music'].includes(initialHash)) {
        applyFilter(initialHash, false);
    } else {
        applyFilter('all', false);
    }

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (['all', 'culture', 'nature', 'academic', 'music'].includes(hash)) {
            applyFilter(hash, false);
        }
    });

    // Lightbox Logic
    function openLightbox(manifestIdx) {
        const posInFiltered = filteredIndices.indexOf(manifestIdx);
        if (posInFiltered === -1) return;
        currentLightboxIdx = posInFiltered;
        updateLightboxContent();

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const manifestIdx = filteredIndices[currentLightboxIdx];
        const item = items[manifestIdx];
        if (!item) return;

        lightboxImg.src = item.full;
        lightboxImg.alt = item.title;
        lightboxTitle.textContent = item.title;
        lightboxLocation.textContent = item.location;
        lightboxDate.textContent = item.date;

        const catNames = {
            'culture': 'CULTURE / 神社仏閣・探訪',
            'nature': 'NATURE / 自然・生物',
            'academic': 'ACADEMIC / 学術・書架',
            'music': 'MUSIC / 音楽・日常'
        };
        lightboxCategory.textContent = catNames[item.category] || item.category.toUpperCase();
        lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${filteredIndices.length}`;

        // Toggle nav button states if needed
        prevBtn.style.visibility = filteredIndices.length > 1 ? 'visible' : 'hidden';
        nextBtn.style.visibility = filteredIndices.length > 1 ? 'visible' : 'hidden';
    }

    function showPrev() {
        if (filteredIndices.length <= 1) return;
        currentLightboxIdx = (currentLightboxIdx - 1 + filteredIndices.length) % filteredIndices.length;
        updateLightboxContent();
    }

    function showNext() {
        if (filteredIndices.length <= 1) return;
        currentLightboxIdx = (currentLightboxIdx + 1) % filteredIndices.length;
        updateLightboxContent();
    }

    // Card click events
    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            openLightbox(idx);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPrev();
        else if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support on mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            showNext();
        } else if (touchEndX > touchStartX + threshold) {
            showPrev();
        }
    }
});

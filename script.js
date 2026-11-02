/**
 * MoK Studio — Kenta Motoyashiki Portfolio
 * Sequential Hero Playlist, Live Note RSS Integration & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Header Background Enhancement on Scroll
       ========================================================================== */
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.style.backgroundColor = 'rgba(10, 10, 13, 0.95)';
                header.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
            } else {
                header.style.backgroundColor = '';
                header.style.borderBottomColor = '';
            }
        }, { passive: true });
    }

    /* ==========================================================================
       2. Hero Sequential Video Playlist (Loops through 3 videos in turn)
       ========================================================================== */
    const heroVideo = document.getElementById('heroVideo');
    const sceneButtons = document.querySelectorAll('.scene-btn');

    if (heroVideo && sceneButtons.length > 0) {
        const playlist = [
            { src: 'videos/hero_chikaku.mp4', poster: 'videos/poster-chikaku.jpg' },
            { src: 'videos/hero_miyazaki.mp4', poster: 'videos/poster-miyazaki.jpg' },
            { src: 'videos/hero_konpira.mp4', poster: 'videos/poster-konpira.jpg' }
        ];

        let currentIndex = 0;

        function updateActiveButton(index) {
            sceneButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
        }

        function playScene(index) {
            currentIndex = index % playlist.length;
            const target = playlist[currentIndex];
            
            heroVideo.style.opacity = '0.4';
            heroVideo.poster = target.poster;
            heroVideo.src = target.src;
            heroVideo.load();
            
            const promise = heroVideo.play();
            if (promise !== undefined) {
                promise.then(() => {
                    heroVideo.style.opacity = '0.65';
                }).catch(() => {
                    // Autoplay fallback
                    heroVideo.style.opacity = '0.65';
                });
            } else {
                heroVideo.style.opacity = '0.65';
            }

            updateActiveButton(currentIndex);
        }

        // Advance to next video when the current clip ends
        heroVideo.addEventListener('ended', () => {
            playScene(currentIndex + 1);
        });

        // Manual scene button clicks
        sceneButtons.forEach((btn, idx) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                playScene(idx);
            });
        });

        // Initial play attempt
        const initialPlay = heroVideo.play();
        if (initialPlay !== undefined) {
            initialPlay.catch(() => {
                // Browser policy muted autoplay handling
            });
        }
    }

    /* ==========================================================================
       3. Live Note RSS Integration (Auto-update in real-time)
       ========================================================================== */
    const noteFeedContainer = document.getElementById('noteFeedContainer');
    const homeNoteFeed = document.getElementById('homeNoteFeed');

    if (noteFeedContainer || homeNoteFeed) {
        function renderNoteCards(items, container, limit) {
            if (!container) return;
            const targetItems = limit ? items.slice(0, limit) : items;
            
            let html = '';
            targetItems.forEach(item => {
                let dateStr = item.pubDate || '';
                if (dateStr.length > 10) {
                    // Format from e.g. "2026-05-26 23:18:24" to "2026.05.26"
                    dateStr = dateStr.slice(0, 10).replace(/-/g, '.');
                }
                
                // Clean HTML tags and limit excerpt
                let excerpt = item.description || item.excerpt || '';
                const tmp = document.createElement('div');
                tmp.innerHTML = excerpt;
                let cleanExcerpt = (tmp.textContent || tmp.innerText || '').trim();
                cleanExcerpt = cleanExcerpt.replace(/続きをみる.*/, '').trim();
                if (cleanExcerpt.length > 120) {
                    cleanExcerpt = cleanExcerpt.substring(0, 120) + '…';
                }

                html += `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="note-card">
                    <span class="note-date">${dateStr}</span>
                    <h3 class="note-title">${item.title}</h3>
                    <p class="note-excerpt">${cleanExcerpt}</p>
                    <span class="note-readmore">noteで読む →</span>
                </a>
                `;
            });
            container.innerHTML = html;
        }

        // Fetch live RSS via rss2json API
        const rssUrl = encodeURIComponent('https://note.com/shiganaibio/rss');
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) throw new Error('Network response error');
                return res.json();
            })
            .then(data => {
                if (data && data.status === 'ok' && data.items && data.items.length > 0) {
                    if (noteFeedContainer) renderNoteCards(data.items, noteFeedContainer, null);
                    if (homeNoteFeed) renderNoteCards(data.items, homeNoteFeed, 3);
                } else {
                    throw new Error('Invalid RSS feed format');
                }
            })
            .catch(() => {
                // Fallback to local static JSON cache
                fetch('data/note-articles.json')
                    .then(res => res.json())
                    .then(items => {
                        if (noteFeedContainer) renderNoteCards(items, noteFeedContainer, null);
                        if (homeNoteFeed) renderNoteCards(items, homeNoteFeed, 3);
                    })
                    .catch(() => {
                        // Static HTML remains intact
                    });
            });
    }

});

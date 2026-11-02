/**
 * MoK Studio — Kenta Motoyashiki Portfolio
 * Video Playback & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Pause other videos when one video plays
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', () => {
            videos.forEach(other => {
                if (other !== video && !other.classList.contains('hero-video-bg')) {
                    other.pause();
                }
            });
        });
    });

    // 2. Header shadow/background enhancement on scroll
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

    // 3. Hero background video ensure autoplay
    const heroVideo = document.querySelector('.hero-video-bg');
    if (heroVideo) {
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked by browser policy, keep poster visible
            });
        }
    }
});

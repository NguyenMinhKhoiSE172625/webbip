// Initialize particles
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d9de0', '#e15554']
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Blow candles function
function blowCandles() {
    const flames = document.querySelectorAll('.flame');
    const candles = document.querySelectorAll('.candle');
    
    // Animate flames disappearing
    anime({
        targets: flames,
        opacity: 0,
        scale: 0,
        duration: 1000,
        easing: 'easeOutQuart',
        delay: anime.stagger(200)
    });
    
    // Add smoke effect
    setTimeout(() => {
        candles.forEach((candle, index) => {
            createSmoke(candle, index * 200);
        });
    }, 500);
    
    // Confetti after blowing candles
    setTimeout(() => {
        launchConfetti();
    }, 1500);
}

// Create smoke effect
function createSmoke(candle, delay) {
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            const smoke = document.createElement('div');
            smoke.style.position = 'absolute';
            smoke.style.width = '4px';
            smoke.style.height = '4px';
            smoke.style.background = '#ccc';
            smoke.style.borderRadius = '50%';
            smoke.style.opacity = '0.7';
            smoke.style.pointerEvents = 'none';
            
            const rect = candle.getBoundingClientRect();
            smoke.style.left = rect.left + rect.width / 2 + 'px';
            smoke.style.top = rect.top + 'px';
            smoke.style.zIndex = '1000';
            
            document.body.appendChild(smoke);
            
            anime({
                targets: smoke,
                translateY: -100,
                translateX: anime.random(-20, 20),
                opacity: 0,
                scale: [0.5, 2],
                duration: 2000,
                easing: 'easeOutQuart',
                delay: i * 100,
                complete: () => {
                    if (document.body.contains(smoke)) {
                        document.body.removeChild(smoke);
                    }
                }
            });
        }
    }, delay);
}

// Launch confetti
function launchConfetti() {
    // Multiple confetti bursts
    const colors = ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d9de0', '#e15554', '#ff9a9e'];
    
    // Center burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
    });
    
    // Left burst
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: colors
        });
    }, 200);
    
    // Right burst
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: colors
        });
    }, 400);
    
    // Top burst
    setTimeout(() => {
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.2 },
            colors: colors
        });
    }, 600);
}

// Toggle music
let musicPlaying = false;
function toggleMusic() {
    const music = document.getElementById('birthdayMusic');
    const btn = document.querySelector('.music-btn');

    // Đặt âm lượng thấp
    music.volume = 0.2;

    if (musicPlaying) {
        stopMusic();
    } else {
        // Tạo nhạc sinh nhật đơn giản bằng Web Audio API
        if (!music.src || music.error) {
            playSimpleBirthdayTune();
            btn.textContent = '⏸️ Dừng nhạc';
            musicPlaying = true;
            return;
        }

        music.play().catch(() => {
            // Fallback: tạo nhạc đơn giản
            playSimpleBirthdayTune();
        });
        btn.textContent = '⏸️ Dừng nhạc';
        musicPlaying = true;
    }
}

// Tạo nhạc sinh nhật đơn giản
let audioContext;
let oscillator;

function playSimpleBirthdayTune() {
    if (audioContext) {
        audioContext.close();
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Nốt nhạc cho "Happy Birthday"
    const notes = [
        {freq: 261.63, duration: 0.5}, // C
        {freq: 261.63, duration: 0.5}, // C
        {freq: 293.66, duration: 1},   // D
        {freq: 261.63, duration: 1},   // C
        {freq: 349.23, duration: 1},   // F
        {freq: 329.63, duration: 2},   // E
        {freq: 261.63, duration: 0.5}, // C
        {freq: 261.63, duration: 0.5}, // C
        {freq: 293.66, duration: 1},   // D
        {freq: 261.63, duration: 1},   // C
        {freq: 392.00, duration: 1},   // G
        {freq: 349.23, duration: 2},   // F
    ];

    let currentTime = audioContext.currentTime;

    notes.forEach((note, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(note.freq, currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);

        currentTime += note.duration;
    });

    // Lặp lại sau khi kết thúc
    setTimeout(() => {
        if (musicPlaying) {
            playSimpleBirthdayTune();
        }
    }, currentTime * 1000);
}

// Open gift
function openGift() {
    const giftLid = document.querySelector('.gift-lid');
    const modal = document.getElementById('giftModal');
    
    // Animate gift opening
    anime({
        targets: giftLid,
        translateY: -50,
        rotateX: -45,
        duration: 1000,
        easing: 'easeOutBounce'
    });
    
    // Show modal after animation
    setTimeout(() => {
        modal.style.display = 'block';
        createHeartRain();
        launchConfetti();
    }, 1000);
}

// Close gift modal
function closeGiftModal() {
    const modal = document.getElementById('giftModal');
    const giftLid = document.querySelector('.gift-lid');
    
    modal.style.display = 'none';
    
    // Reset gift lid
    anime({
        targets: giftLid,
        translateY: 0,
        rotateX: 0,
        duration: 500,
        easing: 'easeOutQuart'
    });
}

// Create heart rain effect
function createHeartRain() {
    const hearts = ['💖', '💕', '💗', '💝', '💘', '💞'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-50px';
            heart.style.fontSize = '30px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1001';
            
            document.body.appendChild(heart);
            
            anime({
                targets: heart,
                translateY: window.innerHeight + 100,
                translateX: anime.random(-100, 100),
                rotate: anime.random(-180, 180),
                duration: anime.random(3000, 5000),
                easing: 'easeInQuart',
                complete: () => {
                    if (document.body.contains(heart)) {
                        document.body.removeChild(heart);
                    }
                }
            });
        }, i * 200);
    }
}

// Auto-launch confetti on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        launchConfetti();
    }, 2000);
    
    // Auto-animate cake
    anime({
        targets: '.cake',
        scale: [0.8, 1],
        duration: 2000,
        easing: 'easeOutBounce',
        delay: 1000
    });
    
    // Animate balloons
    anime({
        targets: '.balloon',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeOutQuart',
        delay: anime.stagger(300, {start: 500})
    });
});

// Stop music function
function stopMusic() {
    const music = document.getElementById('birthdayMusic');
    const btn = document.querySelector('.music-btn');

    music.pause();
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    btn.textContent = '🎵 Nhạc sinh nhật';
    musicPlaying = false;
}

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('giftModal');
    if (event.target === modal) {
        closeGiftModal();
    }
}

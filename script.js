document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    let audioStarted = false;

    function startAudio() {
        if (audioStarted) return;
        
        audio.volume = 0.5;
        audio.play().then(() => {
            audioStarted = true;
        }).catch(error => {
            console.log('Автовоспроизведение заблокировано');
        });
    }

    // МОМЕНТАЛЬНЫЙ ЗАПУСК МУЗЫКИ
    document.body.click();
    startAudio();

    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);

    const toggleSound = document.getElementById('toggleSound');
    const pulseBtn = document.querySelector('.pulse-btn');
    let isSoundPlaying = false;

    toggleSound.loop = true;
    toggleSound.volume = 0.7;

    pulseBtn.addEventListener('click', function() {
        if (!isSoundPlaying) {
            toggleSound.play().then(() => {
                isSoundPlaying = true;
                pulseBtn.textContent = 'Остановить звук';
            }).catch(error => {
                console.log('Ошибка воспроизведения:', error);
            });
        } else {
            toggleSound.pause();
            toggleSound.currentTime = 0;
            isSoundPlaying = false;
            pulseBtn.textContent = 'Нажми меня!';
        }

        createParticles(this);
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1.1)';
        }, 150);
    });

    const volumeSlider = document.querySelector('.volume-slider');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeBars = document.querySelectorAll('.volume-bar');

    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
        updateVolumeIcon(this.value);
    });

    function updateVolumeIcon(volume) {
        volumeBars.forEach(bar => bar.style.opacity = '0');
        
        if (volume == 0) {
            volumeBars.forEach(bar => bar.style.opacity = '0');
        } else if (volume < 0.4) {
            document.querySelector('.volume-bar.low').style.opacity = '1';
        } else if (volume < 0.7) {
            document.querySelector('.volume-bar.low').style.opacity = '1';
            document.querySelector('.volume-bar.medium').style.opacity = '1';
        } else {
            volumeBars.forEach(bar => bar.style.opacity = '1');
        }
    }

    updateVolumeIcon(volumeSlider.value);

    function createParticles(button) {
        const buttonRect = button.getBoundingClientRect();
        const particles = 15;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: #ffeb3b;
                border-radius: 50%;
                pointer-events: none;
                left: ${buttonRect.left + buttonRect.width / 2}px;
                top: ${buttonRect.top + buttonRect.height / 2}px;
                animation: particle-animation 1s ease-out forwards;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
        
        if (!document.querySelector('#particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particle-animation {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    const carouselTrack = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    
    function cloneCardsForSeamless() {
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            carouselTrack.appendChild(clone);
        });
    }
    
    cloneCardsForSeamless();
});
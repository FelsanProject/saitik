document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('backgroundMusic');
    let audioStarted = false;

    function startAudio() {
        if (audioStarted) return;
        
        audio.muted = false;
        audio.volume = 0.5;
        audio.play().then(() => {
            audioStarted = true;
            console.log('Музыка запущена');
        }).catch(error => {
            console.log('Автовоспроизведение заблокировано:', error);
        });
    }

    document.body.click();
    startAudio();

    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);

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
    
    function initCarousel() {
        const cardWidth = 250;
        const gap = 20;
        const totalWidth = (cardWidth + gap) * cards.length;
        
        carouselTrack.innerHTML = '';
        cards.forEach(card => {
            carouselTrack.appendChild(card.cloneNode(true));
        });
        cards.forEach(card => {
            carouselTrack.appendChild(card.cloneNode(true));
        });
        
        let position = 0;
        
        function animateCarousel() {
            position -= 1;
            if (position <= -totalWidth) {
                position = 0;
            }
            carouselTrack.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(animateCarousel);
        }
        
        animateCarousel();
    }
    
    initCarousel();

    const swipeContainer = document.querySelector('.swipe-container');
    const swipeCards = document.querySelectorAll('.swipe-card');
    const infoContents = document.querySelectorAll('.info-content');
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentCardIndex = 0;
    let dragStartTime = 0;

    function showCard(index) {
        swipeCards.forEach(card => {
            card.classList.remove('active');
            card.style.transform = 'translateX(0) rotate(0)';
            card.classList.remove('swipe-right', 'swipe-left');
        });
        
        infoContents.forEach(info => {
            info.classList.remove('active');
        });
        
        if (swipeCards[index]) {
            swipeCards[index].classList.add('active');
            const cardId = swipeCards[index].getAttribute('data-id');
            const correspondingInfo = document.querySelector(`.info-content[data-id="${cardId}"]`);
            if (correspondingInfo) {
                correspondingInfo.classList.add('active');
            }
        }
    }

    showCard(currentCardIndex);

    function handleDragStart(clientX) {
        const activeCard = document.querySelector('.swipe-card.active');
        if (!activeCard) return;
        
        startX = clientX;
        isDragging = true;
        dragStartTime = Date.now();
        activeCard.style.transition = 'none';
    }

    function handleDragMove(clientX) {
        if (!isDragging) return;
        
        const activeCard = document.querySelector('.swipe-card.active');
        if (!activeCard) return;
        
        currentX = clientX - startX;
        const rotation = currentX * 0.1;
        activeCard.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        
        const likeHeart = activeCard.querySelector('.like');
        const dislikeHeart = activeCard.querySelector('.dislike');
        
        if (currentX > 50) {
            likeHeart.classList.add('show');
            dislikeHeart.classList.remove('show');
        } else if (currentX < -50) {
            dislikeHeart.classList.add('show');
            likeHeart.classList.remove('show');
        } else {
            likeHeart.classList.remove('show');
            dislikeHeart.classList.remove('show');
        }
    }

    function handleDragEnd() {
        if (!isDragging) return;
        
        const activeCard = document.querySelector('.swipe-card.active');
        if (!activeCard) return;
        
        isDragging = false;
        const dragDuration = Date.now() - dragStartTime;
        
        const likeHeart = activeCard.querySelector('.like');
        const dislikeHeart = activeCard.querySelector('.dislike');
        
        const threshold = 100;
        const velocity = Math.abs(currentX) / dragDuration;
        const effectiveThreshold = threshold * (1 + velocity);
        
        if (currentX > effectiveThreshold) {
            activeCard.classList.add('swipe-right');
            setTimeout(() => {
                currentCardIndex++;
                if (currentCardIndex >= swipeCards.length) {
                    currentCardIndex = 0;
                }
                showCard(currentCardIndex);
            }, 2000);
        } else if (currentX < -effectiveThreshold) {
            activeCard.classList.add('swipe-left');
            setTimeout(() => {
                currentCardIndex++;
                if (currentCardIndex >= swipeCards.length) {
                    currentCardIndex = 0;
                }
                showCard(currentCardIndex);
            }, 2000);
        } else {
            activeCard.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            activeCard.style.transform = 'translateX(0) rotate(0)';
            likeHeart.classList.remove('show');
            dislikeHeart.classList.remove('show');
        }
    }

    swipeContainer.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        handleDragStart(e.clientX);
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        handleDragMove(e.clientX);
    });

    document.addEventListener('mouseup', function(e) {
        if (e.button !== 0) return;
        handleDragEnd();
    });

    swipeContainer.addEventListener('touchstart', function(e) {
        handleDragStart(e.touches[0].clientX);
        e.preventDefault();
    });

    swipeContainer.addEventListener('touchmove', function(e) {
        handleDragMove(e.touches[0].clientX);
        e.preventDefault();
    });

    swipeContainer.addEventListener('touchend', function(e) {
        handleDragEnd();
        e.preventDefault();
    });

    swipeContainer.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });

    document.addEventListener('mouseleave', function() {
        if (isDragging) {
            handleDragEnd();
        }
    });

    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    const modal = document.getElementById('feedbackModal');
    const closeBtn = document.querySelector('.close-btn');
    const feedbackForm = document.getElementById('feedbackForm');

    likeBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        createParticles(this);
    });

    dislikeBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        createParticles(this);
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('userName').value,
            newFeatures: document.getElementById('newFeatures').value,
            improvements: document.getElementById('improvements').value,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        sendToTelegram(formData);
        
        modal.style.display = 'none';
        feedbackForm.reset();
        
        alert('Спасибо за ваш отзыв!');
    });

    function sendToTelegram(data) {
        const botToken = '7710469301:AAFztBTfoK1k-4gRg1vjusPkxnmxGJ_-f04';
        const chatId = '-1003039867986';
        
        const message = `
📝 Новый отзыв с сайта:

👤 Имя: ${data.name}
🆕 Новые функции: ${data.newFeatures || 'Не указано'}
⚠️ Недостатки: ${data.improvements}
🕐 Время: ${data.timestamp}
        `.trim();

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        })
        .then(response => {
            console.log('Статус ответа:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Полный ответ от Telegram:', result);
            if (result.ok) {
                console.log('✅ Сообщение отправлено в Telegram');
            } else {
                console.error('❌ Ошибка Telegram:', result.description);
                alert('Ошибка отправки в Telegram: ' + result.description);
            }
        })
        .catch(error => {
            console.error('❌ Ошибка отправки:', error);
            alert('Ошибка отправки сообщения: ' + error.message);
        });
    }
});

class SecretMessage {
    constructor() {
        this.currentStep = 0;
        this.isScanning = false;
        this.currentCardIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showFingerprintSection();
        this.hideAllSections();
    }

    hideAllSections() {
        document.getElementById('nameSection').style.display = 'none';
        document.getElementById('notesContainer').style.display = 'none';
        document.getElementById('finalMessage').style.display = 'none';
        document.getElementById('footer').style.display = 'none';
    }

    bindEvents() {
        const scanner = document.querySelector('.fingerprint-scanner');
        
        scanner.addEventListener('mousedown', () => this.startScan());
        scanner.addEventListener('mouseup', () => this.stopScan());
        scanner.addEventListener('mouseleave', () => this.stopScan());
        
        // Touch events for mobile
        scanner.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startScan();
        });
        
        scanner.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopScan();
        });

        // Note card events
        this.bindNoteEvents();
    }

    bindNoteEvents() {
        const cards = document.querySelectorAll('.note-card');
        
        cards.forEach((card, index) => {
            // Click to unlock
            card.addEventListener('click', (e) => {
                if (index === this.currentCardIndex && !card.classList.contains('unlocked')) {
                    this.unlockCard(card);
                }
            });

            // Drag events
            card.addEventListener('mousedown', (e) => this.startDrag(e, card, index));
            card.addEventListener('touchstart', (e) => this.startDrag(e, card, index));
        });

        // Global drag events
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchmove', (e) => this.onDrag(e));
        document.addEventListener('touchend', () => this.endDrag());
    }

    showFingerprintSection() {
        const section = document.getElementById('fingerprintSection');
        setTimeout(() => {
            section.classList.add('active');
        }, 500);
    }

    startScan() {
        if (this.isScanning) return;
        
        this.isScanning = true;
        const progressFill = document.querySelector('.progress-fill');
        const scanLine = document.querySelector('.scan-line');
        
        scanLine.style.opacity = '1';
        progressFill.style.width = '100%';
        
        // Start typing effect after 1 second
        setTimeout(() => {
            if (this.isScanning) {
                this.startTypingEffect();
            }
        }, 1000);
        
        setTimeout(() => {
            if (this.isScanning) {
                this.completeScan();
            }
        }, 5000);
    }

    stopScan() {
        if (!this.isScanning) return;
        
        this.isScanning = false;
        const progressFill = document.querySelector('.progress-fill');
        const scanLine = document.querySelector('.scan-line');
        const typingText = document.getElementById('typingText');
        const cursor = document.getElementById('cursor');
        const scanningName = document.getElementById('scanningName');
        
        scanLine.style.opacity = '0';
        progressFill.style.width = '0%';
        
        // Reset typing effect
        typingText.textContent = '';
        typingText.classList.remove('show');
        cursor.classList.remove('show');
        scanningName.classList.remove('reveal');
    }

    completeScan() {
        this.isScanning = false;
        
        const fingerprintSection = document.getElementById('fingerprintSection');
        
        setTimeout(() => {
            fingerprintSection.style.opacity = '0';
            fingerprintSection.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            setTimeout(() => {
                fingerprintSection.style.display = 'none';
                this.showNotesSection();
            }, 800);
        }, 1000);
    }

    showNotesSection() {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.style.display = 'block';
        
        // Add entrance animation
        setTimeout(() => {
            notesContainer.classList.add('show');
        }, 100);
    }

    unlockCard(card) {
        card.classList.add('unlocked');
        this.createHeartExplosion(card);
    }

    startDrag(e, card, index) {
        if (index !== this.currentCardIndex || !card.classList.contains('unlocked')) return;
        
        this.isDragging = true;
        card.classList.add('dragging');
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        this.startX = clientX;
        this.startY = clientY;
        this.currentX = clientX;
        this.currentY = clientY;
        
        e.preventDefault();
    }

    onDrag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        this.currentX = clientX;
        this.currentY = clientY;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        
        const currentCard = document.querySelector(`.note-card[data-index="${this.currentCardIndex}"]`);
        const rotation = deltaX * 0.03;
        
        currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        
        e.preventDefault();
    }

    endDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        const currentCard = document.querySelector(`.note-card[data-index="${this.currentCardIndex}"]`);
        currentCard.classList.remove('dragging');
        
        const deltaX = this.currentX - this.startX;
        
        if (Math.abs(deltaX) > 150) {
            // Swipe away
            const direction = deltaX > 0 ? 1 : -1;
            currentCard.style.transform = `translateX(${direction * 600}px) rotate(${direction * 20}deg)`;
            currentCard.style.opacity = '0';
            
            setTimeout(() => {
                currentCard.style.display = 'none';
                this.currentCardIndex++;
                
                if (this.currentCardIndex >= document.querySelectorAll('.note-card').length) {
                    this.hideNotesAndShowFinal();
                }
            }, 300);
        } else {
            // Snap back
            currentCard.style.transform = `rotate(${this.getCardRotation(this.currentCardIndex)})`;
        }
    }

    getCardRotation(index) {
        const rotations = ['-1deg', '0.5deg', '-0.5deg'];
        return rotations[index] || '0deg';
    }

    hideNotesAndShowFinal() {
        const notesContainer = document.getElementById('notesContainer');
        
        // Fade out notes
        notesContainer.style.opacity = '0';
        notesContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
            notesContainer.style.display = 'none';
            this.showFinalMessage();
        }, 500);
    }

    createHeartExplosion(element) {
        const hearts = ['🐼', '🐼', '🐼', '🐼', '🐼', '🐼'];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = rect.left + rect.width / 2 + 'px';
            heart.style.top = rect.top + rect.height / 2 + 'px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.transition = 'all 1.5s ease-out';
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                const angle = (i * 45) * Math.PI / 180;
                const distance = 120;
                heart.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                heart.style.opacity = '0';
            }, 50);
            
            setTimeout(() => {
                if (document.body.contains(heart)) {
                    document.body.removeChild(heart);
                }
            }, 1550);
        }
    }

    createSecretFile() {
        const content = ` Sao lại tìm thấy cái này ta !?

        Anh nghĩ Giang sẽ quay lại web lần nữa nên update thêm xíu ! :>>

        Ây này hơi bí mật nhưng mà nhớ không được buồn nhá! 
        Không được khóc nữa vì nó làm em xấu đi đấy!

        Đừng sợ đừng ngại chia sẻ với anh bất kì thứ gì vì em vui thì anh cũng vui mò!
        
        Nhớ đó nhe!

Được tạo bởi thằng Khoi bí ẩn 🐼

---
Thời gian: ${new Date().toLocaleString('vi-VN')}
`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Đây-là-gì-vậy.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showFinalMessage() {
        const finalMessage = document.getElementById('finalMessage');
        finalMessage.style.display = 'block';
        
        setTimeout(() => {
            finalMessage.classList.add('active');
        }, 500);
        
        // Bind panda trigger event
        const pandaTrigger = document.getElementById('pandaTrigger');
        const pandaContainer = document.getElementById('pandaContainer');
        
        pandaTrigger.addEventListener('click', () => {
            pandaContainer.classList.toggle('show');
            this.createHeartExplosion(pandaTrigger);
            // Tạo file download
            this.createSecretFile();
        });
        
        setTimeout(() => {
            this.showFooter();
        }, 2000);
    }

    showFooter() {
        const footer = document.getElementById('footer');
        footer.style.display = 'block';
        
        setTimeout(() => {
            footer.classList.add('active');
        }, 100);
        
        const stickers = footer.querySelectorAll('.cute-stickers span');
        stickers.forEach((sticker, index) => {
            sticker.style.setProperty('--i', index);
        });
    }

    startTypingEffect() {
        const typingText = document.getElementById('typingText');
        const cursor = document.getElementById('cursor');
        const scanningName = document.getElementById('scanningName');
        const fullName = "Hoàng Ngân Giang";
        let currentText = "";
        let charIndex = 0;
        
        // Show the scanning name container
        scanningName.classList.add('reveal');
        
        // Show cursor
        cursor.classList.add('show');
        
        const typeInterval = setInterval(() => {
            if (charIndex < fullName.length && this.isScanning) {
                currentText += fullName[charIndex];
                typingText.textContent = currentText;
                typingText.classList.add('show');
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // Hide cursor after typing is complete
                setTimeout(() => {
                    cursor.classList.remove('show');
                }, 500);
            }
        }, 150);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SecretMessage();
});

// Add magical sparkle trail
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.97) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = '12px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '999';
    sparkle.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.style.transform = 'translateY(-50px)';
        sparkle.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
        if (document.body.contains(sparkle)) {
            document.body.removeChild(sparkle);
        }
    }, 1050);
}






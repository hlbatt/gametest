class CharacterSelection {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.onCharacterSelected = config.onCharacterSelected || function() {};
        
        this.characters = [
            {
                id: "zev",
                name: "Zev Lov X",
                spriteSrc: "/images/Zev 1.png",
                description: "Zev Love X",
                unlocked: true 
            },
            {
                id: "MM..Food",
                name: "???",
                spriteSrc: "/images/MM..Food black.png",
                description: "???",
                unlocked: false 
            },
            {
                id: "MM..Leftovers",
                name: "???",
                spriteSrc: "/images/MM..Leftovers black.png",
                description: "???",
                unlocked: false  
            },
            {
                id: "Operation Doomsday",
                name: "???",
                spriteSrc: "/images/Operation Doomsday.png",
                description: "???",
                unlocked: false  
            },
            {
                id: "JJ Doom",
                name: "???",
                spriteSrc: "/images/JJ Doom black.png",
                description: "???",
                unlocked: false 
            },
            {
                id: "King Geedorah",
                name: "???",
                spriteSrc: "/images/King Geedorah black.png",
                description: "???",
                unlocked: false 
            }
        ];
        
        this.currentCharacterIndex = 0;
        this.characterSprites = [];
        this.isLoaded = false;
        this.active = true; 
        this.messageElement = null; 
        
       
        this.wheelContainers = []; 
        this.isTransitioning = false; 
        this.transitionSpeed = 300; 
        
       
        this.centerPosition = 0; 
        this.characterSpacing = 120; 
    }
    
    async init() {
        
        this.createUIElements();
        
       
        await this.loadCharacterSprites();
        
       
        this.isLoaded = true;
        this.render();
        this.bindEvents();
        
        
        this.updateWheelPositions();
    }
    
    createUIElements() {
       
        this.background = document.createElement("div");
        this.background.classList.add("character-selection-background");
        this.background.style.position = "absolute";
        this.background.style.top = "0";
        this.background.style.left = "0";
        this.background.style.width = "100%";
        this.background.style.height = "100%";
        this.background.style.backgroundColor = "white"; 
        this.background.style.zIndex = "1"; 
        this.element.appendChild(this.background);
        
        
        this.container = document.createElement("div");
        this.container.classList.add("character-selection");
        this.container.style.position = "absolute";
        this.container.style.top = "0";
        this.container.style.left = "0";
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.alignItems = "center";
        this.container.style.justifyContent = "center";
        this.container.style.color = "black"; 
        this.container.style.fontFamily = "helvetica, sans-serif";
        this.container.style.zIndex = "2"; 
        
       
        this.wheelElement = document.createElement("div");
        this.wheelElement.classList.add("character-wheel");
        this.wheelElement.style.position = "absolute";
        this.wheelElement.style.top = "50%";
        this.wheelElement.style.left = "50%";
        this.wheelElement.style.transform = "translate(-50%, -50%)";
        this.wheelElement.style.width = "300px"; 
        this.wheelElement.style.height = "120px";
        this.wheelElement.style.zIndex = "3";
        this.wheelElement.style.overflow = "hidden"; 
        this.container.appendChild(this.wheelElement);
        
       
        this.wheelSlider = document.createElement("div");
        this.wheelSlider.classList.add("wheel-slider");
        this.wheelSlider.style.position = "absolute";
        this.wheelSlider.style.width = "100%";
        this.wheelSlider.style.height = "100%";
        this.wheelSlider.style.transition = `transform ${this.transitionSpeed}ms ease-in-out`;
        this.wheelSlider.style.left = "0"; 
        this.wheelElement.appendChild(this.wheelSlider);
        
       
        const positions = ['previous', 'current', 'next'];
        
        positions.forEach((position, index) => {
            const spriteContainer = document.createElement("div");
            spriteContainer.classList.add(`character-sprite-container-${position}`);
            spriteContainer.style.position = "absolute";
            spriteContainer.style.top = "50%";
            
           
            const xOffset = (index - 1) * this.characterSpacing; 
            spriteContainer.style.left = `calc(50% + ${xOffset}px)`;
            spriteContainer.style.transform = "translate(-50%, -50%)"; 
            
            spriteContainer.style.width = "80px";
            spriteContainer.style.height = "100px";
            
          
            spriteContainer.style.transition = `transform ${this.transitionSpeed}ms ease-in-out, opacity ${this.transitionSpeed}ms ease-in-out, filter ${this.transitionSpeed}ms ease-in-out`;
            
           
            const spriteCanvas = document.createElement("canvas");
            spriteCanvas.width = 80;
            spriteCanvas.height = 100;
            spriteCanvas.style.imageRendering = "pixelated"; 
            
            
            const nameLabel = document.createElement("div");
            nameLabel.classList.add(`character-name-${position}`);
            nameLabel.style.position = "absolute";
            nameLabel.style.bottom = "-25px"; 
            nameLabel.style.width = "100%";
            nameLabel.style.textAlign = "center";
            nameLabel.style.fontSize = "12px";
            nameLabel.style.fontWeight = "bold";
            nameLabel.style.transition = "color 0.3s ease";
            
            spriteContainer.appendChild(spriteCanvas);
            spriteContainer.appendChild(nameLabel);
            this.wheelSlider.appendChild(spriteContainer);
            
           
            if (position === 'current') {
                spriteContainer.style.transform = "translate(-50%, -50%) scale(1.2)";
                spriteContainer.style.zIndex = "3";
                spriteContainer.style.opacity = "1";
                spriteContainer.style.transition = "transform 0.2s ease, filter 0.2s ease";
            } else {
                spriteContainer.style.transform = "translate(-50%, -50%) scale(0.8)";
                spriteContainer.style.zIndex = "2";
                spriteContainer.style.opacity = "0.7";
            }
            
            
            this.wheelContainers.push({
                container: spriteContainer,
                canvas: spriteCanvas,
                ctx: spriteCanvas.getContext("2d"),
                nameLabel: nameLabel,
                position: position
            });
        });
        
       
        this.titleElement = document.createElement("h2");
        this.titleElement.textContent = "Character Selection";
        this.titleElement.style.margin = "0";
        this.titleElement.style.fontSize = "15px";
        this.titleElement.style.position = "absolute";
        this.titleElement.style.top = "25px";
        this.titleElement.style.color = "white"; 
        this.container.appendChild(this.titleElement);
        
       
        const nameContainer = document.createElement("div");
        nameContainer.style.display = "flex";
        nameContainer.style.alignItems = "center";
        nameContainer.style.justifyContent = "center";
        nameContainer.style.position = "absolute";
        nameContainer.style.bottom = "20px";
        nameContainer.style.width = "100%";
        this.container.appendChild(nameContainer);
        
       
        this.leftArrow = document.createElement("canvas");
        this.leftArrow.classList.add("arrow", "left");
        this.leftArrow.width = 20; 
        this.leftArrow.height = 16; 
        this.leftArrow.style.margin = "0 10px";
        this.leftArrow.style.cursor = "pointer";
        this.leftArrow.style.imageRendering = "pixelated"; 
        
       
        const leftCtx = this.leftArrow.getContext("2d");
        leftCtx.imageSmoothingEnabled = false;
        leftCtx.fillStyle = "white"; 
       
        leftCtx.beginPath();
        leftCtx.moveTo(15, 2); 
        leftCtx.lineTo(5, 8);  
        leftCtx.lineTo(15, 14); 
        leftCtx.lineTo(15, 2);  
        leftCtx.fill();
        
        
        this.nameElement = document.createElement("h3");
        this.nameElement.style.margin = "0";
        this.nameElement.style.fontSize = "14px";
        this.nameElement.style.color = "white";
        this.nameElement.style.minWidth = "80px"; 
        this.nameElement.style.textAlign = "center";
        
      
        this.rightArrow = document.createElement("canvas");
        this.rightArrow.classList.add("arrow", "right");
        this.rightArrow.width = 20; 
        this.rightArrow.height = 16; 
        this.rightArrow.style.margin = "0 10px";
        this.rightArrow.style.cursor = "pointer";
        this.rightArrow.style.imageRendering = "pixelated"; 
        
      
        const rightCtx = this.rightArrow.getContext("2d");
        rightCtx.imageSmoothingEnabled = false; 
        rightCtx.fillStyle = "white"; 
     
        rightCtx.beginPath();
        rightCtx.moveTo(5, 2);  
        rightCtx.lineTo(15, 8); 
        rightCtx.lineTo(5, 14);  
        rightCtx.lineTo(5, 2);   
        rightCtx.fill();
        
      
        nameContainer.appendChild(this.leftArrow);
        nameContainer.appendChild(this.nameElement);
        nameContainer.appendChild(this.rightArrow);
        
       
        this.messageElement = document.createElement("div");
        this.messageElement.style.position = "absolute";
        this.messageElement.style.top = "77%"; 
        this.messageElement.style.left = "50%"; 
        this.messageElement.style.transform = "translate(-50%, -50%)"; 
        this.messageElement.style.textAlign = "center";
        this.messageElement.style.color = "#FF5555"; 
        this.messageElement.style.fontSize = "12px";
        this.messageElement.style.fontWeight = "bold";
        this.messageElement.style.opacity = "0";
        this.messageElement.style.transition = "opacity 0.3s ease";
        this.messageElement.style.zIndex = "5";
       
        this.messageElement.style.padding = "5px 10px";
        this.messageElement.style.borderRadius = "4px";
        this.container.appendChild(this.messageElement);
        
       
        this.element.appendChild(this.container);
    }
    
    async loadCharacterSprites() {
     
        this.characterSprites = new Array(this.characters.length).fill(null);
        
        const loadPromises = this.characters.map((char, index) => {
            return new Promise(resolve => {
                const sprite = new Image();
                sprite.src = char.spriteSrc;
                sprite.onload = () => {
                    
                    this.characterSprites[index] = sprite;
                    resolve();
                };
                sprite.onerror = () => {
                    console.error(`Failed to load sprite for ${char.name} at ${char.spriteSrc}`);
                    resolve();
                };
            });
        });
        
        await Promise.all(loadPromises);
    }
    
   
    getCharacterIndex(offset) {
        const length = this.characters.length;
        return (this.currentCharacterIndex + offset + length) % length;
    }
    
   
    updateWheelPositions() {
        if (!this.isLoaded || !this.active) return;
        
        
        const prevIndex = this.getCharacterIndex(-1);
        const currIndex = this.currentCharacterIndex;
        const nextIndex = this.getCharacterIndex(1);
        
       
        this.drawCharacterOnWheel(prevIndex, this.wheelContainers[0]);
        this.drawCharacterOnWheel(currIndex, this.wheelContainers[1]);
        this.drawCharacterOnWheel(nextIndex, this.wheelContainers[2]);
        
     
        const currentCharacter = this.characters[this.currentCharacterIndex];
        this.nameElement.textContent = currentCharacter.description; 
        
       
        this.nameElement.style.color = currentCharacter.unlocked ? "white" : "#8a8a8a";
        
        
        this.messageElement.style.opacity = "0";
    }
    
    
    drawCharacterOnWheel(characterIndex, wheelItem) {
        const sprite = this.characterSprites[characterIndex];
        const character = this.characters[characterIndex];
        const ctx = wheelItem.ctx;
        
     
        ctx.clearRect(0, 0, wheelItem.canvas.width, wheelItem.canvas.height);
        
        if (sprite) {
            
            const spriteWidth = 54;
            const spriteHeight = 72;
            
            
            const x = (wheelItem.canvas.width - spriteWidth) / 2;
            const y = (wheelItem.canvas.height - spriteHeight) / 2;
            
            
            ctx.imageSmoothingEnabled = false;
            
           
            ctx.save();
           
            ctx.filter = "contrast(110%) brightness(110%)";
            
            
            ctx.drawImage(
                sprite,
                0, 0,
                sprite.width, sprite.height,
                x, y,
                spriteWidth, spriteHeight
            );
            
            ctx.restore();
        }
        
       
        if (!character.unlocked) {
            wheelItem.canvas.style.filter = "grayscale(100%) opacity(0.7)";
            wheelItem.nameLabel.style.color = "#8a8a8a"; 
            wheelItem.container.classList.add("character-locked");
        } else {
            wheelItem.canvas.style.filter = "none";
            wheelItem.nameLabel.style.color = "white"; 
            wheelItem.container.classList.remove("character-locked");
        }
        
        
        wheelItem.nameLabel.textContent = character.name;
    }
    
    render() {
        if (!this.isLoaded || !this.active) return;
        
       
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
       
        this.updateWheelPositions();
    }
    
    
    slideWheelLeft() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
       
        this.currentCharacterIndex = this.getCharacterIndex(-1);
        
        
        this.centerPosition += this.characterSpacing;
        this.wheelSlider.style.transform = `translateX(${this.centerPosition}px)`;
        
        
        setTimeout(() => {
            
            this.centerPosition = 0;
            this.wheelSlider.style.transition = "none"; 
            this.wheelSlider.style.transform = "translateX(0)";
            
            
            setTimeout(() => {
                this.wheelSlider.style.transition = `transform ${this.transitionSpeed}ms ease-in-out`;
                
               
                this.updateWheelPositions();
                this.isTransitioning = false;
            }, 10);
        }, this.transitionSpeed);
    }
    
   
    slideWheelRight() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
       
        this.currentCharacterIndex = this.getCharacterIndex(1);
        
        
        this.centerPosition -= this.characterSpacing;
        this.wheelSlider.style.transform = `translateX(${this.centerPosition}px)`;
        
       
        setTimeout(() => {
           
            this.centerPosition = 0;
            this.wheelSlider.style.transition = "none"; 
            this.wheelSlider.style.transform = "translateX(0)";
            
            
            setTimeout(() => {
                this.wheelSlider.style.transition = `transform ${this.transitionSpeed}ms ease-in-out`;
                
                
                this.updateWheelPositions();
                this.isTransitioning = false;
            }, 10);
        }, this.transitionSpeed);
    }
    
    bindEvents() {
       
        this.leftArrow.addEventListener("click", () => {
            if (!this.active || this.isTransitioning) return;
            this.slideWheelLeft();
        });
        
        
        this.rightArrow.addEventListener("click", () => {
            if (!this.active || this.isTransitioning) return;
            this.slideWheelRight();
        });

        this.wheelContainers[1].container.addEventListener("mouseenter", () => {
            if (!this.active) return;
            
            const currentCharacter = this.characters[this.currentCharacterIndex];
            
            
            if (currentCharacter.unlocked) {
               
                this.nameElement.style.transform = "scale(1.1)";
                this.nameElement.style.color = "white"; 
                
                this.messageElement.textContent = "Click to select";
                this.messageElement.style.color = "white";
                this.messageElement.style.opacity = "1";
                this.messageElement.style.backgroundColor = "transparent"; 
        this.messageElement.style.fontSize = "5px";
        this.messageElement.style.top = "78%";
            } else {
                this.messageElement.textContent = "Character locked!";
                this.messageElement.style.color = "#FF5555";
                this.messageElement.style.opacity = "1";
                this.messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; 
        this.messageElement.style.fontSize = "12px"; 
        this.messageElement.style.top = "58%";
            }
        });
        
        this.wheelContainers[1].container.addEventListener("mouseleave", () => {
            if (!this.active) return;
            
            this.nameElement.style.transform = "scale(1)";
            
            const currentCharacter = this.characters[this.currentCharacterIndex];
            this.nameElement.style.color = currentCharacter.unlocked ? "white" : "#8a8a8a";
            
            this.messageElement.style.opacity = "0";
        });
        
        this.wheelContainers[1].canvas.addEventListener("click", () => {
            if (!this.active) return;
            this.attemptSelectCharacter();
        });
        
        this.canvas.addEventListener("click", (e) => {
            if (!this.active) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
            if (distance < 40) { 
                this.attemptSelectCharacter();
            }
        });
        
        this.keyListener = new KeyPressListener("Enter", () => {
            if (!this.active) return;
            this.attemptSelectCharacter();
        });
        
        this.leftKeyListener = new KeyPressListener("ArrowLeft", () => {
            if (!this.active || this.isTransitioning) return;
            this.slideWheelLeft();
        });
        
        this.rightKeyListener = new KeyPressListener("ArrowRight", () => {
            if (!this.active || this.isTransitioning) return;
            this.slideWheelRight();
        });
    }
    
    attemptSelectCharacter() {
        const selectedCharacter = this.characters[this.currentCharacterIndex];
        
        if (selectedCharacter.unlocked) {
            this.selectCharacter();
        } else {
            this.messageElement.textContent = "This character is locked!";
            this.messageElement.style.opacity = "1";
            
            setTimeout(() => {
                this.messageElement.style.opacity = "0";
            }, 1500);
            
            this.addShakeAnimation(this.wheelContainers[1].container);
        }
    }
    
    selectCharacter() {
        if (!this.active) return;
        this.active = false; 
        
        const selectedCharacter = this.characters[this.currentCharacterIndex];
        
        this.container.style.transition = "opacity 500ms";
        this.wheelElement.style.transition = "opacity 500ms";
        this.background.style.transition = "opacity 500ms";
        
        this.container.style.opacity = 0;
        this.wheelElement.style.opacity = 0;
        this.background.style.opacity = 0;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.wheelContainers.forEach(item => {
            item.ctx.clearRect(0, 0, item.canvas.width, item.canvas.height);
        });
        
        setTimeout(() => {
            this.cleanup();
            this.onCharacterSelected(selectedCharacter);
        }, 500);
    }
    
    cleanup() {
        if (this.container && this.container.parentElement) {
            this.container.remove();
        }
        
        if (this.wheelElement && this.wheelElement.parentElement) {
            this.wheelElement.remove();
        }
        
        if (this.background && this.background.parentElement) {
            this.background.remove();
        }
        
        if (this.keyListener) {
            this.keyListener.unbind();
            this.keyListener = null;
        }
        
        if (this.leftKeyListener) {
            this.leftKeyListener.unbind();
            this.leftKeyListener = null;
        }
        
        if (this.rightKeyListener) {
            this.rightKeyListener.unbind();
            this.rightKeyListener = null;
        }
        
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        this.active = false;
        this.isLoaded = false;
        this.wheelContainers = [];
    }
    
    addShakeAnimation(element) {
        element.style.animation = "shake 0.5s";
        
        if (!document.getElementById("shake-animation")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "shake-animation";
            styleSheet.textContent = `
                @keyframes shake {
                    0% { transform: translate(-50%, -50%) scale(1.2); }
                    10% { transform: translate(-55%, -50%) scale(1.2); }
                    20% { transform: translate(-45%, -50%) scale(1.2); }
                    30% { transform: translate(-55%, -50%) scale(1.2); }
                    40% { transform: translate(-45%, -50%) scale(1.2); }
                    50% { transform: translate(-55%, -50%) scale(1.2); }
                    60% { transform: translate(-45%, -50%) scale(1.2); }
                    70% { transform: translate(-55%, -50%) scale(1.2); }
                    80% { transform: translate(-45%, -50%) scale(1.2); }
                    90% { transform: translate(-55%, -50%) scale(1.2); }
                    100% { transform: translate(-50%, -50%) scale(1.2); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        
        setTimeout(() => {
            element.style.animation = "";
        }, 500);
    }
}
class CollectableItem extends GameObject {
    constructor(config) {
        super(config);
        this.id = config.id || Math.floor(Math.random() * 10000).toString();
        this.name = config.name || "Item";
        this.description = config.description || "A mysterious item.";
        this.imageSrc = config.imageSrc || "/images/efault_item.png";
        this.itemType = config.itemType || "generic";
        this.isCollectable = true;
        this.isCollected = false;

        
        
        
        this.sprite = new Sprite({
            gameObject: this,
            src: config.spriteSrc || this.imageSrc,
            isVisible: this.isVisible,
            
            animations: config.animations || {
                "idle-down": [[0, 0]],
                "idle-up": [[0, 1]],
                "idle-left": [[0, 0]],
                "idle-right": [[0, 1]]
            },
            animationFrameLimit: config.animationFrameLimit || 24
        });

        
        
        this.floatEnabled = config.floatEnabled !== false;
        this.floatTimer = 0;
        this.floatHeight = 0;
        this.maxFloatHeight = 3; 
    }
    
    mount(map) {
        this.isMounted = true;
       
        setTimeout(() => {
            this.doBehaviourEvent(map);
        }, 10);
    }

    update(state) {
        if (this.floatEnabled) {
            this.floatTimer += 0.05;
            this.floatHeight = Math.sin(this.floatTimer) * this.maxFloatHeight;
        }
        
        
        if (this.isCollected) return;
        
        const hero = state.map.gameObjects.hero;
        
        if (hero) {
            if (this.x === hero.x && this.y === hero.y) {
                console.log("Hero is on item!");
                this.collect(state.map);
            }
        }
    }
    
    collect(map) {
        if (this.isCollected) return;
        
        if (window.playerInventory && window.playerInventory.addItem({
            id: this.id,
            name: this.name,
            description: this.description,
            imageSrc: this.imageSrc,
            itemType: this.itemType
        })) {
            this.isCollected = true;
            this.isVisible = false;
            
            map.removeWall(this.x, this.y);
            
            this.emitEvent("ItemCollected", {
                itemId: this.id,
                itemType: this.itemType
            });
            
            console.log(`Collected: ${this.name}`);
            
            if (this.itemType === "Tutorial") {
                map.startCutscene([
                    { type: "textMessage", text: `Found: ${this.name}` },
                    { type: "showInventoryUI" },
                    { type: "showMusicPlayer" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "down" },
                    { who: "tutorialNPC", type: "walk", direction: "right" },
                    { who: "tutorialNPC", type: "stand", direction: "right" },
                    { who: "hero", type: "stand", direction: "left" },
                    { type: "textMessage", text: "Hey look at that! You found your first Album!"},
                    { type: "textMessage", text: "This is Mr. Hood, released in 1991."},
                    { type: "textMessage", text: "This was the first studio album released by, well.. you Zev, and the rest of KMD." },
                    { type: "textMessage", text: "Throughout the game, you'll find records and albums that tell the story of a legendary MC." },
                    { type: "textMessage", text: "Every album you collect will be stored in your Music Library, accessible and customisable at any time." },
                    { type: "textMessage", text: "Your music player at the bottom there will let you listen to some of your favorite albums and tracks, as you discover them!" },
                    { type: "textMessage", text: "Make sure to explore and have fun. when your read to move on, simply walk down the road..." },
                    { who: "tutorialNPC", type: "stand", direction: "down" }
                ]);
            } else {

                if (map.startCutscene) {
                    map.startCutscene([
                        { type: "textMessage", text: `Found: ${this.name}` }
                    ]);
                }
            }
            
            return true;
        }
    }
    
    draw(ctx, cameraPerson) {
        if (!this.isVisible || this.isCollected) {
            return;
        }
        
        const originalY = this.sprite.gameObject.y;
        if (this.floatEnabled) {
            this.sprite.gameObject.y -= this.floatHeight;
        }
        
        this.sprite.draw(ctx, cameraPerson);
        
        this.sprite.gameObject.y = originalY;
    }
}
class OverworldEvent {
    constructor ({map, event}){
        this.map = map;
        this.event = event;

    }

    updateTutorialProgress(resolve) {
        const tutorialNPC = this.map.gameObjects["tutorialNPC"];
        tutorialNPC.tutorialProgress = this.event.progress;
        resolve();
    }

    custom(resolve) {
        if (this.event.action) {
            this.event.action();
        }
        resolve();
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        });
    
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
    
                
                resolve();  
            }
        };
    
        document.addEventListener("PersonStandComplete", completeHandler);
    
    
        
       // const completeHandler = e => {
       //     //console.log(`Received PersonWalkingComplete for ${e.detail.whoId}`); // Debugging
        //    if (e.detail.whoId === this.event.who) {
        //        document.removeEventListener("PersonWalkingComplete", completeHandler);
       //         resolve();
       //     }
       // };

    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehaviour({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        });
    
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                //console.log(`Completed: walk`);  // Optional: log to confirm completion
                resolve(); 

                //console.log("Resolving behavior, moving to the next action in the loop");

            }
        };
    
        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    walkNpcToHero(resolve) {
        const npc = this.map.gameObjects[this.event.npcId];
        const hero = this.map.gameObjects["hero"];
        
        if (!npc || !hero) {
            console.error("Could not find NPC or hero for walkNpcToHero");
            resolve();
            return;
        }
        
        
        const potentialPositions = [
            { x: hero.x - utils.withGrid(1), y: hero.y, dir: "right" }, 
            { x: hero.x + utils.withGrid(1), y: hero.y, dir: "left" },  
            { x: hero.x, y: hero.y + utils.withGrid(1), dir: "up" },   
            { x: hero.x, y: hero.y - utils.withGrid(1), dir: "down" }   
        ];
        
       
        if (npc.x < hero.x) {
            
            potentialPositions.sort((a, b) => 
                (a.x < hero.x ? -1 : 1) - (b.x < hero.x ? -1 : 1)
            );
        } else {
            
            potentialPositions.sort((a, b) => 
                (a.x > hero.x ? -1 : 1) - (b.x > hero.x ? -1 : 1)
            );
        }
        
       
        let targetPos = null;
        for (let pos of potentialPositions) {
            
            if (!this.map.walls[`${pos.x},${pos.y}`]) {
                targetPos = pos;
                break;
            }
        }
        
        
        if (!targetPos) {
            targetPos = potentialPositions[0];
        }
        
        
        const dx = targetPos.x - npc.x;
        const dy = targetPos.y - npc.y;
        let direction;
        
       
        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? "right" : "left";
        } else {
            direction = dy > 0 ? "down" : "up";
        }
        
        
        if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
            
            npc.direction = targetPos.dir;
            resolve();
            return;
        }
        
        
        npc.startBehaviour({
            map: this.map
        }, {
            type: "walk",
            direction: direction,
            retry: true
        });
        
        
        const completeHandler = e => {
            if (e.detail.whoId === this.event.npcId) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                
               
                const newDx = targetPos.x - npc.x;
                const newDy = targetPos.y - npc.y;
                
                if (Math.abs(newDx) < 16 && Math.abs(newDy) < 16) {
                    
                    npc.direction = targetPos.dir;
                    resolve();
                } else {
                    
                    this.walkNpcToHero(resolve);
                }
            }
        };
        
        document.addEventListener("PersonWalkingComplete", completeHandler);
    }

    textMessage(resolve){

        if (this.event.faceHero) {
           const obj = this.map.gameObjects [this.event.faceHero];
           obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }

        const message = new TextMessage ({
            text: this.event.text,
            onComplete: () => resolve()
        })

        message.init (document.querySelector(".game-container") )
    }

    checkTutorialProgress(resolve) {
        const tutorialNPC = this.map.gameObjects["tutorialNPC"];
        const progress = tutorialNPC.tutorialProgress || 0;
        
        
        const dialogues = [
            
            [
                { type: "textMessage", text: "Welcome! I'm here to show you the basics. Use WASD or Arrow keys to move around.", faceHero: "tutorialNPC" },
                { type: "textMessage", text: "Walk down the road when you're ready to continue." },
                { who: "tutorialNPC", type: "stand", direction: "down"}
            ],
            
            [
                { type: "textMessage", text: "Remember, you can collect items by walking over them.", faceHero: "tutorialNPC" },
                { type: "textMessage", text: "Try to find and collect the item I placed ahead." },
                { who: "tutorialNPC", type: "stand", direction: "down"}
            ],
           
            [
                { type: "textMessage", text: "Great job collecting that item! Check your inventory to see what you've found.", faceHero: "tutorialNPC" },
                { type: "textMessage", text: "Continue exploring to learn more about the game." },
                { who: "tutorialNPC", type: "stand", direction: "down"}
            ]
        ];
        
        
        const currentDialogue = dialogues[Math.min(progress, dialogues.length - 1)];
        
        
        this.map.startCutscene([
            ...currentDialogue,
            { type: "custom", action: () => {
                resolve(); 
            }}
        ]);
    }

    changeMap (resolve) {
        const mapName = this.event.map;
        this.map.changeMap(mapName);
        resolve();

     }

     showControlsUI(resolve) {
        
        if (!window.tutorialUI) {
            window.tutorialUI = new TutorialUI();
        }
        
        
        window.tutorialUI.showControlsUI(this.event.controls);
        
        
        setTimeout(resolve, 500);
    }
    
    showInventoryUI(resolve) {
        
        const inventoryContainer = document.querySelector('.inventory-container');
        const recentItemContainer = document.querySelector('.recent-item-container');
        
       
        if (inventoryContainer && recentItemContainer) {
           
            inventoryContainer.style.opacity = "0";
            recentItemContainer.style.opacity = "0";
            inventoryContainer.style.display = "flex";
            recentItemContainer.style.display = "block";
            
           
            inventoryContainer.style.transition = "opacity 1s";
            recentItemContainer.style.transition = "opacity 1s";
            
            
            setTimeout(() => {
                inventoryContainer.style.opacity = "1";
                recentItemContainer.style.opacity = "1";
                
                
                setTimeout(resolve, 1000);
            }, 200);
        } else {
           
            resolve();
        }
    }
    
    spawnCollectableItem(resolve) {
        
        const tutorialItem = new CollectableItem({
            id: "tutorial-item",
            name: "KMD's First studio album, Mr. Hood",
            description: "Your first collectible item!",
            x: utils.withGrid(12), 
            y: utils.withGrid(25),
            imageSrc: "/images/Vinyl.png",
            spriteSrc: "/images/Vinyl.png", 
            itemType: "Tutorial",
            floatEnabled: true
        });
        
        
        this.map.gameObjects["tutorial-item"] = tutorialItem;
        
        
        tutorialItem.mount(this.map);
        
       
        resolve();
    }

    showMusicPlayer(resolve) {
    
    const musicPlayer = document.querySelector('.music-player');
    
   
    if (musicPlayer) {
        
        musicPlayer.style.opacity = "0";
        musicPlayer.style.display = "flex";
        
        
        musicPlayer.style.transition = "opacity 1s";
        
        
        setTimeout(() => {
            musicPlayer.style.opacity = "1";
            
            
            setTimeout(resolve, 1000);
        }, 200);
    } else {
        
        resolve();
    }
}
    

     
     //^^^
     // Check if we need to start a post-change cutscene
    // if (mapName === "HospitalElevator") {
    //     // Short timeout to ensure map is fully loaded before starting new cutscene
    //     setTimeout(() => {
    //         this.map.startCutscene([
    //             { who: "hero", type: "stand", direction: "up", time: 300},
    //             { who: "hero", type: "walk", direction: "up" },
    //             { who: "hero", type: "stand", direction: "down" }
    //         ]);
    //     }, 100);
    // }
 
    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve);
        });
    }

}
class OverworldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};
        this.initialCutscene = config.initialCutscene || null;
        this.triggeredCutsceneSpaces = {};
        this.triggeredCutsceneIds = {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.lowerImage.onload = () => {
            console.log(`Successfully loaded map image: ${config.lowerSrc}`);
        }
        this.lowerImage.onerror = () => {
            console.error(`Failed to load map image: ${config.lowerSrc}`);
        };

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
        
        this.mapWidth = config.mapWidth || 480;  
        this.mapHeight = config.mapHeight || 208; 
    }

    getCameraPosition(cameraPerson) {
        
        const canvasWidth = this.overworld.canvas.width;
        const canvasHeight = this.overworld.canvas.height;
        
        
        let cameraX = utils.withGrid(6) - cameraPerson.x;
        const cameraY = utils.withGrid(6) - cameraPerson.y;
        
        
        if (this.mapWidth < canvasWidth) {
            
            const centerOffset = Math.floor((canvasWidth - this.mapWidth) / 2);
            cameraX += centerOffset;
        }
        
        
        const boundedX = Math.min(0, Math.max(cameraX, canvasWidth - this.mapWidth));
        const boundedY = Math.min(0, Math.max(cameraY, canvasHeight - this.mapHeight));
        
        return { x: boundedX, y: boundedY };
    }

    drawLowerImage(ctx, cameraPerson) {
        const camera = this.getCameraPosition(cameraPerson);
        
        ctx.drawImage(
            this.lowerImage, 
            camera.x, 
            camera.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        const camera = this.getCameraPosition(cameraPerson);
        ctx.drawImage(
            this.upperImage, 
            camera.x, 
            camera.y
        );
    // const canvasWidth = this.overworld.canvas.width;
    // const canvasHeight = this.overworld.canvas.height;
    
    // // Draw image centered in canvas
    // ctx.drawImage(
    //     this.lowerImage,
    //     0, 0, this.lowerImage.width, this.lowerImage.height,  // Source rectangle
    //     0, 0, canvasWidth, canvasHeight  // Destination rectangle (scaled to fit)
    // );

        // const camera = this.getCameraPosition(cameraPerson);
        // ctx.drawImage(
        //     this.upperImage, 
        //     camera.x, 
        //     camera.y
        // );
    }
    
    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition (currentX, currentY, direction);
        return this.walls [`${x},${y}`] || false;
    }

    mountObjects(){
        Object.keys(this.gameObjects).forEach (key => {

            let object = this.gameObjects [key];
            object.id = key;

            
            object.mount(this);
        })
    }

    collectItem(itemId, itemType) {
       
        const item = Object.values(this.gameObjects).find(obj => 
            obj.id === itemId && obj.isCollectable
        );
        
        if (item) {
           
            item.isCollected = true;
            item.isVisible = false;
            
            
            this.removeWall(item.x, item.y);
            
           
            switch(itemType) {
                case "key":
        console.log("Collected a key - can now open locked doors!");
        break;
        case "health":
        console.log("Health restored!");
        break;
     case "story":
        console.log("Found a story item!");
       
        break;
     case "Vinyl":
        console.log("Found a vinyl record!");
        
        break;
     case "CD":
        console.log("Found a CD!");
        
        break;
     case "Cassette":
        console.log("Found a cassette tape!");
        
        break;
     default:
        console.log(`Collected item: ${item.name}`);
     }  
     if (itemId === "tutorial-item") {
        const tutorialNPC = this.gameObjects["tutorialNPC"];
        if (tutorialNPC) {
            tutorialNPC.tutorialProgress = 2; 
        }
    }
            
           
            return true;
        }
        
        return false;
    }

    async startCutscene(events){
        this.isCutscenePlaying = true;

       for (let i=0; i<events.length; i++ ) {
         const eventHandler = new OverworldEvent ({
            event: events[i],
            map: this,

         })
         await eventHandler.init();
       }

        this.isCutscenePlaying = false;

        
        Object.values (this.gameObjects).forEach(object => object.doBehaviourEvent(this))
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition (hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if (!this.isCutscenePlaying && match && match.talking.length) {

            const currentIndex = match.currentTalkingIndex || 0;
        
          
         this.startCutscene(match.talking[currentIndex].events);
        
         
         match.currentTalkingIndex = (currentIndex + 1) % match.talking.length;
        }
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const position = `${hero.x},${hero.y}`;
        const match = this.cutsceneSpaces[position];
        
        if (!this.isCutscenePlaying && match) {
            const cutscene = match[0];
            
           
            const cutsceneId = cutscene.cutsceneId || position;
            
           
            if (!this.triggeredCutsceneIds[cutsceneId]) {
                
                this.triggeredCutsceneIds[cutsceneId] = true;
                this.startCutscene(cutscene.events);
            }
        }
    }

    addWall(x,y){
     this.walls [`${x},${y}`] = true;
    }
    removeWall(x,y){
        delete this.walls [`${x},${y}`] 
    }
    moveWall(wasX, wasY, direction){
        this.removeWall (wasX, wasY);
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }
    
    triggerStoryTransition(container, callback) {
        
        const sceneTransition = new SceneTransition();
        
        // Fade to black
        sceneTransition.fadeOut(container, 2000, () => {
           
            sceneTransition.showInfo(`
                <h2></h2>
                <p>April 23rd, 1993</p>
                <p>Dingilizwe Dumile - DJ Subroc</p>
                <p>passed away as a result of his injuries...</p>
                <p>Due to the darkness of the album and its cover,</p>
                <p>KMD were dropped by their record label.</p>
                <p>Homeless, Daniel Dumile - Zev Love X</p>
                <p>Vanished.</p>
                <p>To be continued...</p>
            `, container, 4000, () => {
               
                // const keyListener = new KeyPressListener("Enter", () => {
                //     keyListener.unbind();
                //     sceneTransition.fadeIn(1000, () => {
                //         if (callback) {
                //             callback();
                //         }
                //     });
                // });
            });
        });
    }

    changeMap(mapName) {
        const wasElevator2Transition = mapName === "HospitalElevator2";
        
        
        this.overworld.startMap(window.OverworldMaps[mapName]);
        
        
        if (wasElevator2Transition) {
            setTimeout(() => {
                this.triggerStoryTransition(this.overworld.element, () => {
                    console.log("Transition complete - player can now continue to next level");
                    
                });
            }, 1000);
        }
    }

}



window.OverworldMaps = {
    Tutorial: {
        lowerSrc: "/images/Tutorial.png",
        upperSrc: "",  
        mapWidth: 320, 
        mapHeight: 880, 
    
        gameObjects: {
            hero: new person({
                id: "hero",
                isPlayerControlled: true,
                x: utils.withGrid(9), 
                y: utils.withGrid(7),
            }),
            tutorialNPC: new person({
                id: "tutorialNPC",
                x: utils.withGrid(10), 
                y: utils.withGrid(0),
                src: "/images/Brother.png",
                direction: "down",
                tutorialProgress: 0,
                talking: [
                    {
                        events: [
                            { type: "checkTutorialProgress" },
                        ]
                    
                    }
                ]
            })
        },
    
        // walls: {
            
        //     "16,16" : true,
        //     [utils.asGridCoord(0,10)] :true,
        //     [utils.asGridCoord(1,10)] :true,
        //     [utils.asGridCoord(2,10)] :true,
        //     [utils.asGridCoord(3,10)] :true,
        //     [utils.asGridCoord(4,10)] :true,
        //     [utils.asGridCoord(5,10)] :true,
        //     [utils.asGridCoord(6,10)] :true,
        //     [utils.asGridCoord(7,10)] :true,
        //     [utils.asGridCoord(8,10)] :true,
        //     [utils.asGridCoord(10,10)] :true,
        //     [utils.asGridCoord(11,10)] :true,
        //     [utils.asGridCoord(12,10)] :true,
        //     [utils.asGridCoord(13,10)] :true,
        //     [utils.asGridCoord(14,10)] :true,
        //     [utils.asGridCoord(15,10)] :true,
        //     [utils.asGridCoord(16,10)] :true,
        //     [utils.asGridCoord(17,10)] :true,
        //     [utils.asGridCoord(18,10)] :true,
        //     [utils.asGridCoord(19,10)] :true,
        // },

        cutsceneSpaces: {},

        initialCutscene: [
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "walk", direction: "down" },
            { who: "tutorialNPC", type: "stand", direction: "left"},
            { who: "hero", type: "stand", direction: "right"},
            { type: "textMessage", text: "Hey there! I'm here to show you the basics, press Enter or click Next to continue..."},
            { type: "textMessage", text: "Perfect! Let's get started with your training." },
            { type: "textMessage", text: "You can use WASD or Arrow keys to move Around!" },
            { type: "showControlsUI", controls: "movement" },
            { type: "textMessage", text: "Give it a try! Walk down the road there." },
            { who: "tutorialNPC", type: "stand", direction: "down"},
        ]
    },
        
    Hospital: {
        lowerSrc: "/images/Hospital map.png",
        mapWidth: 480, 
        mapHeight: 208,

        gameObjects: {

            hero: new person({
                id: "hero",
                isPlayerControlled: true,
                // x: utils.withGrid (14), 
                // y: utils.withGrid (4),
                x: utils.withGrid (4), 
                y: utils.withGrid (10),
            }),
              npc1: new person({
               x: utils.withGrid (9), 
                y: utils.withGrid (8),
               src: "/images/npc1.png",
               direction: "up",
               behaviourLoop: [
            ],
            talking: [
                {
                   events: [
                      { type: "textMessage", text: "Go talk to someone else.", faceHero: "npc1" },
                      { who: "npc1", type: "stand", direction: "up"},
                   ]
                },
                {
                   events: [
                      { type: "textMessage", text: "I can't help you..", faceHero: "npc1" },
                      { who: "npc1", type: "stand", direction: "up"},
                   ]
                },
                {
                   events: [
                      { type: "textMessage", text: "Go away!", faceHero: "npc1" },
                      { who: "npc1", type: "stand", direction: "up"},
                   ]
                }
             ],
             currentTalkingIndex: 0
          }),
            
            npc2: new person({
             x: utils.withGrid (16), 
              y: utils.withGrid (2),
             src: "/images/npc2.png",
             behaviourLoop: [
                { type: "stand", direction: "down", time: 2000},
                { type: "stand", direction: "right", time: 800},
                { type: "stand", direction: "down", time: 2000},
                { type: "stand", direction: "left", time: 800},
                { type: "stand", direction: "down", time: 2000},
                { type: "stand", direction: "right", time: 600},
                { type: "stand", direction: "up", time: 2000},
             ],
             direction: "up",
             talking: [
                {
                    events: [
                        { type: "textMessage", text: "Your brother was in a car crash...", faceHero: "npc2" },
                        { type: "textMessage", text: "He's on the 3rd Floor..."},
                    ]
                }
             ]
          }),

            npc3: new person({
             x: utils.withGrid (1), 
              y: utils.withGrid (8),
             src: "/images/npc1.png",
             behaviourLoop: [
                { type: "stand", direction: "left", time: 800},
                { type: "stand", direction: "down", time: 400},
                { type: "stand", direction: "right", time: 1000},
                { type: "stand", direction: "down", time: 300},
            ]
          }),
          keycard: new CollectableItem({
            id: "KMD Vinyl",
            name: "KMD Vinyl",
            description: "MR.Hood, released by KMD on may 14th 1991",
            x: utils.withGrid(27), 
            y: utils.withGrid(10),
            imageSrc: "/images/Vinyl.png",
            spriteSrc: "/images/Vinyl.png", 
            itemType: "Vinyl",
            floatEnabled: true
          }),
          cd: new CollectableItem({
            id: "CD",
            name: "MR.Hood CD",
            description: "Mr.Hoods debut ablum printed on CD, 1991",
            x: utils.withGrid(1), 
            y: utils.withGrid(11),
            imageSrc: "/images/CD.png",
            spriteSrc: "/images/CD.png", 
            itemType: "CD",
            floatEnabled: true
         }),
         
         cassette: new CollectableItem({
            id: "Cassette",
            name: "Mr.Hood Cassette",
            description: "Mr.Hoods debut ablum recorded for Cassette, 1991",
            x: utils.withGrid(12), 
            y: utils.withGrid(9),
            imageSrc: "/images/Cassette.png",
            spriteSrc: "/images/Cassette.png", 
            itemType: "Cassette",
            floatEnabled: true
           }),
         
        },

        walls: {
            "16,16" : true,
            [utils.asGridCoord(0,9)] :true,
            [utils.asGridCoord(1,9)] :true,
            [utils.asGridCoord(2,9)] :true,
            [utils.asGridCoord(3,9)] :true,
            [utils.asGridCoord(4,9)] :true,
            [utils.asGridCoord(4,8)] :true,
            [utils.asGridCoord(5,7)] :true,
            [utils.asGridCoord(6,7)] :true,
            [utils.asGridCoord(7,7)] :true,
            [utils.asGridCoord(8,7)] :true,
            [utils.asGridCoord(9,7)] :true,
            [utils.asGridCoord(10,8)] :true,
            [utils.asGridCoord(11,8)] :true,
            [utils.asGridCoord(12,7)] :true,
            [utils.asGridCoord(12,6)] :true,
            [utils.asGridCoord(12,5)] :true,
            [utils.asGridCoord(12,4)] :true,
            [utils.asGridCoord(12,3)] :true,
            [utils.asGridCoord(12,2)] :true,
            [utils.asGridCoord(13,1)] :true,
            [utils.asGridCoord(14,1)] :true,
            [utils.asGridCoord(15,1)] :true,
            [utils.asGridCoord(16,1)] :true,
            [utils.asGridCoord(17,1)] :true,
            [utils.asGridCoord(17,2)] :true, 
            [utils.asGridCoord(17,3)] :true,
            [utils.asGridCoord(17,4)] :true,
            [utils.asGridCoord(17,5)] :true,
            [utils.asGridCoord(17,6)] :true,
            [utils.asGridCoord(17,7)] :true,
            [utils.asGridCoord(18,8)] :true,
            [utils.asGridCoord(19,8)] :true,
            [utils.asGridCoord(20,7)] :true,
            [utils.asGridCoord(21,7)] :true,
            [utils.asGridCoord(22,7)] :true,
            [utils.asGridCoord(23,7)] :true,
            [utils.asGridCoord(24,7)] :true,
            [utils.asGridCoord(25,7)] :true,
            [utils.asGridCoord(26,7)] :true,
            [utils.asGridCoord(27,7)] :true,
            [utils.asGridCoord(28,7)] :true,
            [utils.asGridCoord(29,8)] :true,
            [utils.asGridCoord(30,8)] :true, 
            [utils.asGridCoord(30,9)] :true, 
            [utils.asGridCoord(30,10)] :true, 
            [utils.asGridCoord(30,11)] :true, 
            [utils.asGridCoord(30,12)] :true,
            [utils.asGridCoord(29,12)] :true,   
            [utils.asGridCoord(28,12)] :true,  
            [utils.asGridCoord(27, 12)]: true,
            [utils.asGridCoord(26, 12)]: true,
            [utils.asGridCoord(25, 12)]: true,
            [utils.asGridCoord(24, 12)]: true,
            [utils.asGridCoord(23, 12)]: true,
            [utils.asGridCoord(22, 12)]: true,
            [utils.asGridCoord(21, 12)]: true,
            [utils.asGridCoord(20, 12)]: true,
            [utils.asGridCoord(19, 12)]: true,
            [utils.asGridCoord(18, 12)]: true,
            [utils.asGridCoord(17, 12)]: true,
  [utils.asGridCoord(16, 12)]: true,
  [utils.asGridCoord(15, 12)]: true,
  [utils.asGridCoord(14, 12)]: true,
  [utils.asGridCoord(13, 12)]: true,
  [utils.asGridCoord(12, 12)]: true,
  [utils.asGridCoord(11, 12)]: true,
  [utils.asGridCoord(10, 12)]: true,
  [utils.asGridCoord(9, 12)]: true,
  [utils.asGridCoord(8, 12)]: true,
  [utils.asGridCoord(7, 12)]: true,
  [utils.asGridCoord(6, 12)]: true,
  [utils.asGridCoord(5, 12)]: true,
  [utils.asGridCoord(4, 12)]: true,
  [utils.asGridCoord(3, 12)]: true,
  [utils.asGridCoord(2, 12)]: true,
  [utils.asGridCoord(1, 12)]: true,
  [utils.asGridCoord(0, 12)]: true, 
  [utils.asGridCoord(-1, 11)]: true, 
  [utils.asGridCoord(-1, 10)]: true,
  [utils.asGridCoord(-1, 9)]: true, 
        },

        cutsceneSpaces: {
           [utils.asGridCoord(14,2)]: [
            {
                events: [
                    { who: "hero", type: "stand", direction: "up", time: 1000 },
                    { who: "hero", type: "walk", direction: "right"},
                    { who: "hero", type: "walk", direction: "right"},
                    { who: "hero", type: "stand", direction: "up", time: 500},
                    { who: "hero", type: "walk", direction: "left"},
                    { who: "hero", type: "walk", direction: "left"},
                    { who: "hero", type: "stand", direction: "up", time: 600},  
                    {type: "changeMap", map: "HospitalElevator"},
                    // { who: "hero", type: "stand", direction: "up", time: 300},
                    // { who: "hero", type: "walk", direction: "up" },
                    // { who: "hero", type: "stand", direction: "down" },


                ]
            }
           ]
        },

        initialCutscene: [
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" }, { who: "npc1", type: "stand", direction: "left" },
            { who: "hero", type: "walk", direction: "right" }, { who: "npc1", type: "stand", direction: "down" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "up" },
            { who: "hero", type: "stand", direction: "left" },
            { who: "npc1", type: "walk", direction: "down" },
            { who: "npc1", type: "walk", direction: "down" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "hero", type: "stand", direction: "down" },
            { who: "npc1", type: "stand", direction: "up", time:400 },
            { type: "textMessage", text: "Speak to one of the nurses, they'll help you!"},
            { who: "npc1", type: "walk", direction: "right" }, 
            { who: "npc2", type: "stand", direction: "down", time: 400 }, { who: "npc1", type: "stand", direction: "up", time: 400 },
            { who: "npc1", type: "walk", direction: "right" }, 
            { who: "npc1", type: "walk", direction: "right" },  { who: "hero", type: "stand", direction: "right" }, 
            { who: "npc1", type: "walk", direction: "right" }, 
            { who: "npc1", type: "walk", direction: "right" }, 
            { who: "npc1", type: "walk", direction: "right" }, 
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "right" },
            { who: "npc1", type: "walk", direction: "up" },
            { who: "npc1", type: "walk", direction: "up" },
            { who: "npc2", type: "walk", direction: "left" },
            { who: "npc2", type: "walk", direction: "left" },
            { who: "npc2", type: "walk", direction: "down" },
            { who: "npc2", type: "walk", direction: "down" },
            { who: "npc2", type: "walk", direction: "down" },
            { who: "hero", type: "stand", direction: "up", time: 400 },
        ]

    },
    
    HospitalElevator: {
       upperSrc: "/images/HospitalElevator2.png",
       lowerSrc: "/images/HospitalElivator.png",
       mapWidth: 480, 
        mapHeight: 320,

        gameObjects: {
           hero: new person({
               isPlayerControlled: true,
               direction: "up",
               x: utils.withGrid(14), 
               y: utils.withGrid(2),
            }),
            npc2: new person({
                x: utils.withGrid (14), 
                 y: utils.withGrid (5),
                 src: "/images/npc2.png",
              
             }),
   
               npc1: new person({
                x: utils.withGrid (24), 
                 y: utils.withGrid (8),
                src: "/images/npc1.png",
                direction: "up"
                
             })
        },
        initialCutscene: [
            { who: "hero", type: "walk", direction: "up" }, 
            { who: "hero", type: "stand", direction: "up", time: 800},
            { who: "hero", type: "stand", direction: "right", time: 600},
            { who: "hero", type: "stand", direction: "down", time: 1000},
            { type: "textMessage", text: "Going up..."},
            {type: "changeMap", map: "HospitalElevator2"},

        ]
    },

    HospitalElevator2: {
       // upperSrc: "/images/Hospital map.png",
        lowerSrc: "/images/Hospital map.png",
        mapWidth: 480, 
        mapHeight: 320,

        gameObjects: {
            hero: new person({
                isPlayerControlled: false,
                direction: "up",
                x: utils.withGrid(14),
                y: utils.withGrid(1),
                isVisible: false 
            }),
            npc2: new person({
                x: utils.withGrid (14), 
                 y: utils.withGrid (5),
                 src: "/images/npc2.png",
                 isVisible: true 
              
             }),
   
               npc1: new person({
                x: utils.withGrid (24), 
                 y: utils.withGrid (8),
                src: "/images/npc1.png",
                direction: "up",
                isVisible: true 
                
             })
        },
        // initialCutscene: [
        //     { who: "hero", type: "stand", direction: "up", time: 1500},
        //     {type: "changeMap", map: "HospitalFloor3"}
        // ]
    },



    // HospitalFloor3: {
    //     upperSrc: "/images/Hospital map.png", 
    //     lowerSrc: "/images/Hospital map.png",
    //     mapWidth: 480,  
    //     mapHeight: 320,
    //     gameObjects: {
    //         hero: new person({
    //             isPlayerControlled: true,
    //             direction: "up",
    //             x: utils.withGrid(14),
    //             y: utils.withGrid(1)
    //         }),
    //         npc2: new person({
    //             x: utils.withGrid (14), 
    //              y: utils.withGrid (5),
    //              src: "/images/npc2.png",
              
    //          }),
   
    //            npc1: new person({
    //             x: utils.withGrid (24), 
    //              y: utils.withGrid (8),
    //             src: "/images/npc1.png",
    //             direction: "up"
                
    //          })
    //     }
    // }


};
(function() {
    for (let x = 0; x <= 14; x++) {
        window.OverworldMaps.Tutorial.cutsceneSpaces[utils.asGridCoord(x, 14)] = [{
            cutsceneId: "tutorial-item-collection",
            events: [
                { type: "walkNpcToHero", npcId: "tutorialNPC" },
                { type: "textMessage", text: "Great job! Now let me tell you about collecting items."},
                { type: "textMessage", text: "There are many Items and Add on's scattered around the map" },
                { type: "textMessage", text: "Some which provide information, some which can alter the experience of the game..." },
                { type: "textMessage", text: "When you locate an item or object, simple walk over it to collect it, Or press enter to interact with it." },
                { type: "showInventoryUI" },
                { type: "spawnCollectableItem" },
                { type: "textMessage", text: "This is your inventory, Relevant items will appear here. The most recent item appearing in that middle square there." },
                { type: "textMessage", text: "You can click on these items at any point, bring up a more detailed description." },
                { type: "textMessage", text: "See what happens when you collect that item up ahead..." },
                { type: "updateTutorialProgress", progress: 1 },
                { who: "tutorialNPC", type: "stand", direction: "down"},
            ]
        }];
    }
})();

(function() {
    for (let x = 0; x <= 14; x++) {
        window.OverworldMaps.Tutorial.cutsceneSpaces[utils.asGridCoord(x, 42)] = [{
            cutsceneId: "tutorial-advanced-mechanics",
            events: [
                { type: "walkNpcToHero", npcId: "tutorialNPC" },
                { who: "hero", type: "stand", direction: "right"},
                { type: "textMessage", text: "Zev, I almost forgot..." },
                { type: "textMessage", text: "Try customising that music player of yours once you've unlock new items!" },
                { type: "textMessage", text: "Now get going!" },
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "stand", direction: "down"},
                { type: "textMessage", text: "Goodbye Zev." },
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "tutorialNPC", type: "walk", direction: "up"},
                { who: "hero", type: "stand", direction: "up"},
                { type: "textMessage", text: "Goodbye Dingilizwe..." },
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                { who: "hero", type: "walk", direction: "down"},
                {type: "changeMap", map: "Hospital"},
            ]
        }];
    }
})();
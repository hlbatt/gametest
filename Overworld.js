class Overworld {
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameloop(){
        const step = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            
            const cameraPerson = this.map.gameObjects.hero;

            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })

            this.map.drawLowerImage(this.ctx, cameraPerson);

            Object.values(this.map.gameObjects).sort((a,b)=> {
                return a.y - b.y;
            }).forEach(object => {
                object.sprite.draw(this.ctx, cameraPerson);
            })

            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindActionInput(){
        new KeyPressListener ("Enter", () => {
            this.map.checkForActionCutscene()
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
          if (e.detail.whoId === "hero") {
            console.log("new hero pos")
            this.map.checkForFootstepCutscene()
          }
        })
      }

      startMap(mapConfig){
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        console.log("Overworld set on map:", this.map.overworld !== null);
        this.map.mountObjects();
    
        if (mapConfig.initialCutscene) {
            setTimeout(() => {
                this.map.startCutscene(mapConfig.initialCutscene);
            }, 200); 
        }
    }

    bindItemCollectionCheck() {
        document.addEventListener("ItemCollected", e => {
            if (this.map) {
                this.map.collectItem(e.detail.itemId, e.detail.itemType);
            }
        });
    }


    init(){
        this.startMap(window.OverworldMaps.Tutorial);

        this.bindItemCollectionCheck();
        this.bindActionInput();
        this.bindHeroPositionCheck();
        

        this.directionInput = new directionInput();
        this.directionInput.init();

     this.startGameloop();

    // this.map.startCutscene([
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" }, { who: "npc1", type: "stand", direction: "left" },
    //     { who: "hero", type: "walk", direction: "right" }, { who: "npc1", type: "stand", direction: "down" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "right" },
    //     { who: "hero", type: "walk", direction: "up" },
    //     { who: "hero", type: "stand", direction: "left" },
    //     { who: "npc1", type: "walk", direction: "down" },
    //     { who: "npc1", type: "walk", direction: "down" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "hero", type: "stand", direction: "down" },
    //     { who: "npc1", type: "stand", direction: "up", time:400 },
    //     { type: "textMessage", text: "Speak to one of the nurses, they'll help you!"},
    //     { who: "npc1", type: "walk", direction: "right" }, 
    //     { who: "npc2", type: "stand", direction: "down", time: 400 }, { who: "npc1", type: "stand", direction: "up", time: 400 },
    //     { who: "npc1", type: "walk", direction: "right" }, 
    //     { who: "npc1", type: "walk", direction: "right" },  { who: "hero", type: "stand", direction: "right" }, 
    //     { who: "npc1", type: "walk", direction: "right" }, 
    //     { who: "npc1", type: "walk", direction: "right" }, 
    //     { who: "npc1", type: "walk", direction: "right" }, 
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "right" },
    //     { who: "npc1", type: "walk", direction: "up" },
    //     { who: "npc1", type: "walk", direction: "up" },
    //     { who: "npc2", type: "walk", direction: "left" },
    //     { who: "npc2", type: "walk", direction: "left" },
    //     { who: "npc2", type: "walk", direction: "down" },
    //     { who: "npc2", type: "walk", direction: "down" },
    //     { who: "npc2", type: "walk", direction: "down" },
    //     { who: "hero", type: "stand", direction: "up", time: 400 },
    //  ])

    }

}
class GameObject {
    constructor(config) {
        this.id = config.id || null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.isVisible = config.isVisible !== false
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/Zev.png",
            isVisible: this.isVisible
        });
    
        this.behaviourLoop = config.behaviourLoop || [];
        this.behaviourLoopIndex = 0;
    
        this.talking = config.talking || [];
    }


emitEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
        detail: {
            whoId: data.whoId || this.id
        }
    });
    document.dispatchEvent(event);
}

    mount(map){

        this.isMounted = true;
        map.addWall(this.x, this.y);

       
        setTimeout(() => {
         this.doBehaviourEvent (map);
        }, 10)

    }

    update (){

    }

    async doBehaviourEvent(map) {
        if (map.isCutscenePlaying || this.behaviourLoop.length === 0 || this.isStanding) {
            return;
        }
    
        let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
        eventConfig.who = this.id;
    
        const eventHandler = new OverworldEvent({
            map: map,
            event: eventConfig
        });
    
        await eventHandler.init();  
    
       // console.log(`Completed: ${this.behaviourLoop[this.behaviourLoopIndex].type}`);
        this.behaviourLoopIndex = (this.behaviourLoopIndex + 1) % this.behaviourLoop.length;  
    
        setTimeout(() => {
            this.doBehaviourEvent(map);  
        }, 200);  
    }  
    
}
class Sprite {
    constructor(config){

        this.isVisible = config.isVisible ?? true; 

        
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        
        this.Shadow = new Image();
        this.useShadow = true; 
        if (this.useShadow) {
         this.Shadow.src = "/images/Shadow.png";
        }
        this.Shadow.onload = () => {
            this.isShadowLoaded = true;
        }
        
        
       

        this.animations = config.animations ||  {
            "idle-right": [[4, 0]],
            "idle-left":  [[0, 0]],
            "idle-up":    [[0, 3]],
            "idle-down":  [[0, 2]],

            "walk-right": [[4, 0], [0, 1], [4, 0], [2, 1]], 
            "walk-left":  [[0, 0], [1, 0], [2, 0], [3, 0]], 
            "walk-up":    [[2, 2], [3, 2], [4, 2], [0, 3]], 
            "walk-down":  [[3, 1], [4, 1], [0, 2], [1, 2]]  
       
        }
        this.currentAnimation = "idle-down"; 
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 12;
        this.animationFrameProgress = this.animationFrameLimit;

        
        this.gameObject = config.gameObject;

    }

    get frame (){
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key){
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    } 

    updateAnimationProgress(){

        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if(this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }

    }
    
    draw(ctx, cameraPerson) {
        
        if (!this.isVisible || (this.gameObject && 
            (this.gameObject.isCollected || !this.gameObject.isVisible))) {
            return;
        }
        
        const camera = cameraPerson.map.getCameraPosition(cameraPerson);
        
        const x = this.gameObject.x + camera.x;
        const y = this.gameObject.y + camera.y;
    
        this.isShadowLoaded && ctx.drawImage(this.Shadow, x, y);
    
        const [frameX, frameY] = this.frame;
    
        this.isLoaded && ctx.drawImage(this.image,
            frameX * 18, frameY * 24,
            18, 24,
            x, y,
            18, 24
        );
    
        this.updateAnimationProgress();
    }
}
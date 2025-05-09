const utils = {
    withGrid(n){
        return n * 16;
    },
    asGridCoord(x,y){
        return`${x * 16},${y * 16}`;
    },
    nextPosition(initialX, initialY, directionInput){
        let x = initialX;
        let y = initialY;  
        const size = 16;
        if (directionInput === "left") {
            x -= size;  
        } else if (directionInput === "right"){
            x += size;
        } else if (directionInput === "up"){
            y -= size;
        } else if (directionInput === "down"){
            y += size;
        }
        return {x,y};

    },

    oppositeDirection(direction){
     if (direction === "left") {return "right"}
     if (direction === "right") {return "left"}
     if (direction === "down") {return "up"}
     return "down"
    },

    emitEvent(name, detail){
        const event = new CustomEvent(name, {
         detail
        });
        document.dispatchEvent(event);
    }
}
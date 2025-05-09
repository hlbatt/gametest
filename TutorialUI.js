class TutorialUI {
    constructor() {
        this.tutorialElements = {};
    }

    createElement(id, html, styles = {}) {
       
        this.clearElement(id);
        
       
        const element = document.createElement("div");
        element.id = id;
        element.classList.add("tutorial-ui");
        element.innerHTML = html;
        
       
        element.style.position = "absolute";
        element.style.zIndex = "100";
        element.style.opacity = "0";
        element.style.transition = "opacity 0.5s";
        
       
        Object.keys(styles).forEach(key => {
            element.style[key] = styles[key];
        });
        
        document.body.appendChild(element);
        this.tutorialElements[id] = element;
        
        
        setTimeout(() => {
            element.style.opacity = "1";
        }, 100);
        
        return element;
    }
    
    clearElement(id) {
        if (this.tutorialElements[id]) {
            this.tutorialElements[id].remove();
            delete this.tutorialElements[id];
        }
    }
    
    clearAll() {
        Object.keys(this.tutorialElements).forEach(id => {
            this.clearElement(id);
        });
    }
    
    showControlsUI(type) {
        switch(type) {
            case "movement":
                const style = document.createElement("style");
                style.textContent = `
                    .controls-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-top: 20px;
                    }
                    .control-set {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .key-row {
                        display: flex;
                        margin: 5px 0;
                    }
                    .key {
                        width: 40px;
                        height: 40px;
                        background: #444;
                        border: 2px solid #888;
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 5px;
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .key-separator {
                        margin: 0 30px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                    }
                `;
                document.head.appendChild(style);
                
                this.createElement("movement-title", `<h3>Movement Controls:</h3>`, {
                    left: "16%",
                    top: "calc(50% + 210px)", 
                    color: "white",
                    textAlign: "left"
                });
                
                this.createElement("movement-keys", `
                    <div class="controls-container">
                        <div class="control-set">
                            <div class="key-row">
                                <div class="key">W</div>
                            </div>
                            <div class="key-row">
                                <div class="key">A</div>
                                <div class="key">S</div>
                                <div class="key">D</div>
                            </div>
                        </div>
                        <div class="key-separator">OR</div>
                        <div class="control-set">
                            <div class="key-row">
                                <div class="key">↑</div>
                            </div>
                            <div class="key-row">
                                <div class="key">←</div>
                                <div class="key">↓</div>
                                <div class="key">→</div>
                            </div>
                        </div>
                    </div>
                `, {
                    left: "50%",
                    top: "calc(50% + 250px)", 
                    transform: "translateX(-50%)", 
                    color: "white"
                });
                
                setTimeout(() => {
                    this.clearElement("movement-title");
                    this.clearElement("movement-keys");
                }, 5000);
                break;
        }
    }
}
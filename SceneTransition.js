class SceneTransition {
    constructor() {
        this.element = null;
        this.infoElement = null;
        this.isTransitioning = false;
        this.sentences = [];
        this.currentSentenceIndex = 0;
        this.keyListener = null;
        this.sentenceContainer = null;
        this.currentRevealingText = null;
    }

    createElement() {
        
        this.element = document.createElement("div");
        this.element.classList.add("SceneTransition");
        
       
        this.infoElement = document.createElement("div");
        this.infoElement.classList.add("SceneTransition_info");
        
        
        this.element.appendChild(this.infoElement);
    }

    fadeOut(container, ms = 2000, callback) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.createElement();
        
      
        this.element.style.position = "absolute";
        this.element.style.top = "0";
        this.element.style.left = "0";
        this.element.style.width = "100%";
        this.element.style.height = "100%";
        
      
        container.appendChild(this.element);
        
       
        this.element.style.opacity = 0;
        
      
        setTimeout(() => {
            this.element.style.opacity = 1;
            setTimeout(() => {
                if (callback) {
                    callback();
                }
            }, ms);
        }, 50);
    }

    showInfo(textContent, container, ms = 4000, callback) {
        this.infoElement.style.display = "flex";
        this.infoElement.style.flexDirection = "column";
        this.infoElement.style.justifyContent = "center";
        this.infoElement.style.alignItems = "center";
        this.infoElement.style.height = "100%";
        this.infoElement.style.width = "100%";
        this.infoElement.style.textAlign = "center";
        this.infoElement.style.opacity = 1;
        
        let htmlHeader = "";
        if (textContent.trim().startsWith("<h2>")) {
            const endOfHeader = textContent.indexOf("</h2>") + 5;
            htmlHeader = textContent.substring(0, endOfHeader);
            textContent = textContent.substring(endOfHeader);
        }
        
        this.sentences = textContent.split("<p>")
            .filter(p => p.trim() !== "")
            .map(p => p.replace("</p>", "").trim());
        
        this.infoElement.innerHTML = htmlHeader;
        
        this.sentenceContainer = document.createElement("div");
        this.sentenceContainer.classList.add("sentence-container");
        this.sentenceContainer.style.width = "100%";
        this.sentenceContainer.style.padding = "0 20px";
        this.sentenceContainer.style.position = "absolute";
        this.sentenceContainer.style.top = "50%";
        this.sentenceContainer.style.left = "50%";
        this.sentenceContainer.style.transform = "translate(-50%, -50%)";
        
        this.infoElement.appendChild(this.sentenceContainer);
        
        const proceedElement = document.createElement("div");
        proceedElement.classList.add("proceed-text");
        proceedElement.style.display = "none";
        proceedElement.innerHTML = "Press ENTER to continue";
        this.infoElement.appendChild(proceedElement);
        
        this.currentSentenceIndex = 0;
        
        const displayNextSentence = () => {
            this.sentenceContainer.innerHTML = "";
            
            if (this.currentSentenceIndex < this.sentences.length) {
                const p = document.createElement("p");
                p.style.margin = "0";
                p.style.padding = "0";
                this.sentenceContainer.appendChild(p);
                
                this.currentRevealingText = new RevealingText({
                    element: p,
                    text: this.sentences[this.currentSentenceIndex],
                    speed: 50  
                });
                
                this.currentRevealingText.init();
                
                const checkIfDone = () => {
                    if (this.currentRevealingText.isDone) {

                        setTimeout(() => {
                            p.style.transition = "opacity 1s";
                            p.style.opacity = 0;
                            
                            setTimeout(() => {
                                this.currentSentenceIndex++;
                                displayNextSentence();
                            }, 1000);
                        }, 1500); 
                    } else {
                        setTimeout(checkIfDone, 100);
                    }
                };
                
                setTimeout(checkIfDone, 300);
                
            } else {
                proceedElement.style.display = "block";
                
                if (this.keyListener) {
                    this.keyListener.unbind();
                }
                
                this.keyListener = new KeyPressListener("Enter", () => {
                    this.keyListener.unbind();
                    this.keyListener = null;
                    
                    proceedElement.style.display = "none";
                    
                    if (callback) {
                        callback();
                    }
                });
            }
        };
        
        setTimeout(displayNextSentence, 1000);
    }

    fadeIn(ms = 1000, callback) {
        setTimeout(() => {
            this.element.style.opacity = 0;
            
            setTimeout(() => {
                if (this.element && this.element.parentElement) {
                    this.element.remove();
                }
                
                if (this.keyListener) {
                    this.keyListener.unbind();
                    this.keyListener = null;
                }
                
                this.isTransitioning = false;
                
                if (callback) {
                    callback();
                }
            }, ms);
        }, 500);
    }
    
    cleanup() {
        if (this.keyListener) {
            this.keyListener.unbind();
            this.keyListener = null;
        }
        
        if (this.element && this.element.parentElement) {
            this.element.remove();
        }
        
        this.isTransitioning = false;
        this.sentences = [];
        this.currentSentenceIndex = 0;
        this.currentRevealingText = null;
    }
}
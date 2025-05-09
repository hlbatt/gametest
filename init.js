(function() {
  const gameContainer = document.querySelector(".game-container");
  const overworld = new Overworld({
    element: gameContainer
  });

  const sceneTransition = new SceneTransition();
  
 
  const createTitleScreen = () => {
    const titleScreen = document.createElement("div");
    titleScreen.classList.add("title-screen");
    titleScreen.textContent = "NORMAL";
    gameContainer.appendChild(titleScreen);
    
    
    setTimeout(() => {
      titleScreen.style.opacity = 1;
      
      
      setTimeout(() => {
        titleScreen.style.opacity = 0;
        
       
        setTimeout(() => {
          titleScreen.remove();
          startCharacterSelection();
        }, 1000);
      }, 2000);
    }, 100);
  };
  
 
  const startCharacterSelection = () => {
    const characterSelection = new CharacterSelection({
      element: gameContainer,
      onCharacterSelected: (selectedCharacter) => {
        console.log("Selected character:", selectedCharacter.id);
        
        
        window.selectedCharacter = selectedCharacter;
        
       
        showIntroSequence();
      }
    });
    
    characterSelection.init();
  };
  

  const showIntroSequence = () => {
    
    sceneTransition.fadeOut(gameContainer, 1000, () => {
     
      sceneTransition.showInfo(
        "<h2></h2>" +
       "<p>May 14, 1991</p>" +
       "<p>KMD release their first studio album, </p>" +
       "<p>2 Years Later, Before the release of their second album, </p>" +
       "<p>DJ Subroc was struck by a motor vehicle...</p>" +
        "<p>This is that story. </p>",
        gameContainer, 
        4000, 
        () => {
          sceneTransition.fadeIn(1000, () => {
            overworld.init();
            
            setTimeout(() => {
              if (window.playerInventory) {
                window.playerInventory.show();
              }
            }, 1500); 
          });
        }
      );
    });
  };
  
  if (!window.playerInventory) {
    window.playerInventory = {
      items: [],
      addItem: function(item) {
        this.items.push(item);
        console.log(`Added ${item.name} to inventory`);
        return true;  
      }
    };
  }
  
  
  createTitleScreen();
})();

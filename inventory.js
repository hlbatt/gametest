class Inventory {
    constructor() {
        this.items = Array(6).fill(null);
        this.container = document.querySelector('.inventory-container');
        
        
        if (this.container) {
            this.container.style.display = "none";
        }
        
        this.slots = document.querySelectorAll('.inventory-slot');
        this.recentItem = null;
        
        
        this.itemDetails = document.createElement('div');
        this.itemDetails.classList.add('inventory-item-details');
        document.body.appendChild(this.itemDetails);
        
        
        this.createRecentItemDisplay();
        
      
        this.initEventListeners();
    }

    show() {
        if (this.container) {
            this.container.classList.add('visible');
            
            this.container.offsetHeight;
            
            
            this.slots.forEach(slot => {
                slot.style.visibility = "visible";
                slot.style.opacity = "1";
            });
        }
        
        
        if (this.recentItemContainer) {
            this.recentItemContainer.classList.add('visible');
        }
    }
    
    createRecentItemDisplay() {
        this.recentItemContainer = document.createElement('div');
        this.recentItemContainer.classList.add('recent-item-container');
        this.recentItemContainer.style.display = "none"; 
        
        this.recentItemDisplay = document.createElement('div');
        this.recentItemDisplay.classList.add('recent-item-display');
        this.recentItemContainer.appendChild(this.recentItemDisplay);
        
        this.recentItemName = document.createElement('div');
        this.recentItemName.classList.add('recent-item-name');
        this.recentItemContainer.appendChild(this.recentItemName);
        
        document.body.appendChild(this.recentItemContainer);
    }
    
    initEventListeners() {
        this.slots.forEach(slot => {
            slot.addEventListener('click', () => {
                const slotIndex = parseInt(slot.dataset.slot);
                const item = this.items[slotIndex];
                if (item) {
                    this.showItemDetails(item);
                }
            });
        });
        
        this.recentItemDisplay.addEventListener('click', () => {
            if (this.recentItem) {
                this.showItemDetails(this.recentItem);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target === this.itemDetails || this.itemDetails.contains(e.target)) {
                return;
            }
            if (this.itemDetails.style.display === 'block') {
                this.itemDetails.style.display = 'none';
            }
        });
    }
    
    addItem(item) {
        const emptySlotIndex = this.items.findIndex(slot => slot === null);
        if (emptySlotIndex !== -1) {
            this.items[emptySlotIndex] = item;
            this.updateDisplay();
            
            this.updateRecentItem(item);
            
            return true;
        }
        return false; 
    }
    
    updateRecentItem(item) {
        this.recentItem = item;
        
        this.recentItemDisplay.innerHTML = '';
        this.recentItemName.textContent = '';
        
        if (item) {
            const img = document.createElement('img');
            img.src = item.imageSrc;
            img.alt = item.name;
            this.recentItemDisplay.appendChild(img);
            
            this.recentItemName.textContent = item.name;
        }
    }
    
    removeItem(itemId) {
        const index = this.items.findIndex(item => item && item.id === itemId);
        if (index !== -1) {
            this.items[index] = null;
            this.updateDisplay();
            return true;
        }
        return false;
    }
    
    updateDisplay() {
        this.slots.forEach((slot, index) => {
            slot.innerHTML = '';
            
            const item = this.items[index];
            if (item) {
                const img = document.createElement('img');
                img.src = item.imageSrc;
                img.alt = item.name;
                slot.appendChild(img);
                
                slot.title = item.name;
            }
        });
    }
    
    showItemDetails(item) {
        this.itemDetails.innerHTML = `
            <button class="close-button">&times;</button>
            <h2>${item.name}</h2>
            <img src="${item.imageSrc}" alt="${item.name}">
            <p>${item.description}</p>
        `;
        
        const closeButton = this.itemDetails.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.itemDetails.style.display = 'none';
        });
        
        this.itemDetails.style.display = 'block';
    }
    
    hasItem(itemId) {
        return this.items.some(item => item && item.id === itemId);
    }
    
    hasItemType(itemType) {
        return this.items.some(item => item && item.itemType === itemType);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.playerInventory = new Inventory();
});
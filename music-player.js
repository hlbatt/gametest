class MusicPlayer {
    constructor() {
        this.songs = [
            {
                title: "Peachfuzz",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Peachfuzz.mp3"
            },
            {
                title: "Mr. Hood at Piocalles Jewelry / Crackpot",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Mr Hood at Piocallee Jewelry _ Crackpot.mp3"
            },
            {
                title: "Who Me?",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/who_me.mp3"
            },
            {
                title: "Boogie Man!",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Boogie Man_.mp3"
            },
            {
                title: "Mr. Hood meets Onyx",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Mr Hood Meets Onyx.mp3"
            },
            {
                title: "Subroc's Mission",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Subrocs Mission.mp3"
            },
            {
                title: "Humrush",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Humrush.mp3"
            },
            {
                title: "Figure of Speech",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Figure of Speech.mp3"
            },
            {
                title: "Bananapeel Blues",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Bananapeel Blues.mp3"
            },
            {
                title: "Nitty Gritty (feat. Brand Nubian)",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Nitty Gritty.mp3"
            },
            {
                title: "Trial 'N' Error",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Trial N Error.mp3"
            },
            {
                title: "Hard Wit No Hoe",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Hard wit No Hoe.mp3"
            },
            {
                title: "Mr. Hood Gets a Haircut",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Mr Hood Gets a Haircut.mp3"
            },
            {
                title: "808 Man",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/808 man.mp3"
            },
            {
                title: "Boy Who Cried Wolf",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Boy Who Cried Wolf.mp3"
            },
            {
                title: "Preacher Porkchop",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Preacher Porkchop.mp3"
            },
            {
                title: "Soulflexin",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Soulflexin.mp3"
            },
            {
                title: "Gasface Refill",
                artist: "KMD",
                album: "Mr. Hood",
                year: "1991",
                cover: "/images/Mr.Hood.png",
                audioSrc: "/audio/Gasface Refill.mp3"
            }
        ];

        this.albumCover = document.querySelector('.album-cover img');
        this.trackTitle = document.querySelector('.track-title');
        this.titleContainer = document.querySelector('.title-container');
        this.artistName = document.querySelector('.artist-name');
        this.releaseYear = document.querySelector('.release-year');
        this.rewindBtn = document.querySelector('.rewind');
        this.playPauseBtn = document.querySelector('.play-pause');
        this.skipBtn = document.querySelector('.skip');
        
        this.timeline = document.querySelector('.timeline');
        this.progress = document.querySelector('.progress');
        this.currentTimeDisplay = document.querySelector('.current-time');
        this.totalTimeDisplay = document.querySelector('.total-time');
        
        this.volumeSlider = document.querySelector('.volume-slider');
        this.volumeIcon = document.querySelector('.volume-icon');
        
        this.audio = new Audio();
        this.currentSongIndex = 0;

        this.overlayAudio = {
            vinyl: new Audio('/audio/Vinyl Crackling sound sample asmr sound.mp3'),
            cd: new Audio('/audio/CD Spinning Noise.mp3'),
            cassette: new Audio('/audio/Cassette Tape - Sound Effect.mp3')
        };
        this.currentOverlay = null;
        this.overlayVolume = 0.80;

        this.displayFormats = ['album', 'vinyl', 'cd', 'cassette'];
        this.currentFormatIndex = 0;
        this.albumCoverContainer = document.querySelector('.album-cover');

        this.availableFormats = ['album']; 
        this.formatToItemMap = {
         'vinyl': 'Vinyl',
         'cd': 'CD',
         'cassette': 'Cassette'
     };
        
        this.init();
    }
    
    init() {
        this.rewindBtn.addEventListener('click', () => this.prevSong());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.skipBtn.addEventListener('click', () => this.nextSong());
        
        this.timeline.addEventListener('click', (e) => this.seek(e));
        
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('timeupdate', () => this.updateTimeline());
        this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
        
        this.albumCoverContainer.addEventListener('click', () => this.cycleDisplayFormat());

        this.initOverlayAudio();

        this.setVolume();
        
        this.loadSong(this.currentSongIndex);
    }

    initOverlayAudio() {
        this.overlayAudio.vinyl.loop = true;
        this.overlayAudio.cd.loop = false;
        this.overlayAudio.cassette.loop = false;

        Object.values(this.overlayAudio).forEach(audio => {
            audio.volume = this.overlayVolume;
            
            this.audio.addEventListener('play', () => {
                if (this.currentOverlay) {
                    this.currentOverlay.play().catch(e => console.warn("Overlay playback error:", e));
                }
            });
            
            this.audio.addEventListener('pause', () => {
                if (this.currentOverlay) {
                    this.currentOverlay.pause();
                }
            });
        });

        this.overlayAudio.cd.addEventListener('ended', () => {
            console.log("CD overlay finished playing");
        });
        
        this.overlayAudio.cassette.addEventListener('ended', () => {
            console.log("Cassette overlay finished playing");
        });
    }
    
    updateAvailableFormats() {
        this.availableFormats = ['album'];
        
        if (window.playerInventory) {
            for (const format in this.formatToItemMap) {
                if (window.playerInventory.hasItemType(this.formatToItemMap[format])) {
                    this.availableFormats.push(format);
                }
            }
        }
    }

    cycleDisplayFormat() {
        this.updateAvailableFormats();
        
        let nextFormatIndex = (this.availableFormats.indexOf(this.displayFormats[this.currentFormatIndex]) + 1) % this.availableFormats.length;
        this.currentFormatIndex = this.displayFormats.indexOf(this.availableFormats[nextFormatIndex]);

        this.updateCoverImage();
        this.playOverlayForCurrentFormat();
    }

    playOverlayForCurrentFormat() {
        const format = this.displayFormats[this.currentFormatIndex];
        
        if (this.currentOverlay) {
            this.currentOverlay.pause();
            this.currentOverlay.currentTime = 0;
            this.currentOverlay = null;
        }
        
        if (format !== 'album' && this.overlayAudio[format]) {
            this.currentOverlay = this.overlayAudio[format];

            this.currentOverlay.loop = false;
            
            if (!this.audio.paused) {
                this.currentOverlay.play().catch(e => console.warn(`Overlay playback error (${format}):`, e));
            }
        }
    }

    updateCoverImage() {
        const song = this.songs[this.currentSongIndex];
        const format = this.displayFormats[this.currentFormatIndex];
        let imagePath;
        
        switch(format) {
            case 'vinyl':
                imagePath = `images/KMD vinyl.png`;
                break;
            case 'cd':
                imagePath = `images/Mr.Hood CD.png`;
                break;
            case 'cassette':
                imagePath = `images/casset.png`;
                break;
            case 'album':
            default:
                imagePath = song.cover;
                break;
        }
        
        this.albumCover.src = imagePath;
        this.albumCover.alt = `${song.album} (${format})`;
    }
    
    loadSong(index) {
        const song = this.songs[index];
        this.trackTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.releaseYear.textContent = song.year;
        
        this.checkTitleLength();
        
        // Update album cover if image exists
        // if (this.albumCover) {
        //     this.albumCover.src = song.cover;
        //     this.albumCover.alt = `${song.album} Cover`;
        // }
        if (this.albumCover) {
            this.updateCoverImage();
        }
        
        this.progress.style.width = '0%';
        this.currentTimeDisplay.textContent = '0:00';
        
        this.audio.src = song.audioSrc;
        this.audio.load();

        if (this.currentOverlay) {
            this.currentOverlay.pause();
            this.currentOverlay.currentTime = 0;
        }
        this.playOverlayForCurrentFormat();
    
    }
    
    checkTitleLength() {
        this.trackTitle.classList.remove('scrolling');
        
        void this.trackTitle.offsetWidth;
        
        const titleWidth = this.trackTitle.offsetWidth;
        const containerWidth = this.titleContainer.offsetWidth;
        
        if (titleWidth > containerWidth) {
            this.trackTitle.classList.add('scrolling');
            
            const animationDuration = Math.max(8, titleWidth / 50); 
            this.trackTitle.style.animationDuration = `${animationDuration}s`;
        }
    }
    
    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
            this.playPauseBtn.textContent = "⏸"; 

            if (this.currentOverlay) {
                this.currentOverlay.play().catch(e => console.warn("Overlay playback error:", e));
            }

        } else {
            this.audio.pause();
            this.playPauseBtn.textContent = "▶"; 

            if (this.currentOverlay) {
                this.currentOverlay.pause();
            }
        }
    }
    
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        
        this.audio.play();
        this.playPauseBtn.textContent = "⏸";
    }
    
    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        
        this.audio.play();
        this.playPauseBtn.textContent = "⏸";
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateTimeline() {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration || 0;
        
        if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = `${progressPercent}%`;
        }
        
        this.currentTimeDisplay.textContent = this.formatTime(currentTime);
    }
    
    updateTotalTime() {
        const duration = this.audio.duration;
        this.totalTimeDisplay.textContent = this.formatTime(duration);
    }
    
    seek(event) {
        const width = this.timeline.clientWidth;
        const clickX = event.offsetX;
        const duration = this.audio.duration;
        
        if (duration) {
            this.audio.currentTime = (clickX / width) * duration;
        }
    }
    
    setVolume() {
        const volume = this.volumeSlider.value / 100;
        this.audio.volume = volume;
        
        if (volume > 0.5) {
            this.volumeIcon.textContent = "🔊";
        } else if (volume > 0) {
            this.volumeIcon.textContent = "🔉";
        } else {
            this.volumeIcon.textContent = "🔇";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const musicPlayer = new MusicPlayer();
    
  
    // musicPlayer.audio.play()
    // .then(() => {
    //     musicPlayer.playPauseBtn.textContent = "⏸"; 
    // })
    // .catch(error => {
    //     console.log("Auto-play failed:", error);
    // });
    
   
    window.addEventListener('resize', () => {
        musicPlayer.checkTitleLength();
    });
});
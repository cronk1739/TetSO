document.addEventListener('DOMContentLoaded', () => {
    // Boot sequence
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('desktop');
    const loadingBar = document.querySelector('.loading-bar');
    const startupSound = new Audio('/sys.tetOS_chime-start.mp3');
    const errorSound = new Audio('/sys.tetOS_chime-error.mp3');
    
    // Global file system definition
    const fileSystem = {
        '/': {
            type: 'folder',
            children: {
                'Documents': { type: 'folder', children: {} },
                'Pictures': { type: 'folder', children: {} },
                'Music': { type: 'folder', children: {} },
                'Applications': { type: 'folder', children: {} },
                'System': { type: 'folder', children: {}, isSystem: true },
                'readme.txt': { type: 'file', content: 'Welcome to TetOS 4.1!' },
            }
        }
    };
    
    // Simulate boot process
    setTimeout(() => { loadingBar.style.width = '30%'; }, 500);
    setTimeout(() => { loadingBar.style.width = '60%'; }, 1200);
    setTimeout(() => { loadingBar.style.width = '80%'; }, 1800);
    setTimeout(() => { loadingBar.style.width = '100%'; }, 2300);
    
    // Show desktop after boot
    setTimeout(() => {
        bootScreen.classList.add('hidden');
        desktop.classList.remove('hidden');
        startupSound.play().catch(error => console.error("Error playing startup sound:", error));
        startDesktop();
    }, 3000);
    
    function startDesktop() {
        updateClock();
        setInterval(updateClock, 60000); // Update clock every minute
        
        // Make windows draggable
        document.querySelectorAll('.window').forEach(window => {
            makeDraggable(window);
        });
        
        // Make desktop icons draggable
        document.querySelectorAll('.icon').forEach(icon => {
            makeIconDraggable(icon);
        });
        
        // Initialize themes
        initThemes();
        
        // Add click events to desktop icons
        document.getElementById('teto-drive').addEventListener('click', () => {
            document.getElementById('window-about').classList.remove('hidden');
        });
        
        document.getElementById('teto-plush').addEventListener('click', () => {
            document.getElementById('window-teto').classList.remove('hidden');
        });
        
        document.getElementById('teto-folder').addEventListener('click', () => {
            document.getElementById('window-folder').classList.remove('hidden');
            loadFolder('/');
        });
        
        document.getElementById('teto-notepad').addEventListener('click', () => {
            document.getElementById('window-notepad').classList.remove('hidden');
        });
        
        document.getElementById('teto-calculator').addEventListener('click', () => {
            document.getElementById('window-calculator').classList.remove('hidden');
        });
        
        document.getElementById('teto-meme').addEventListener('click', () => {
            document.getElementById('window-meme').classList.remove('hidden');
        });
        
        document.getElementById('teto-player').addEventListener('click', () => {
            document.getElementById('window-player').classList.remove('hidden');
        });
        
        document.getElementById('teto-baguette').addEventListener('click', () => {
            document.getElementById('window-baguette').classList.remove('hidden');
        });
        
        document.getElementById('teto-drillchat').addEventListener('click', () => {
            openDrillChat();
        });
        
        document.getElementById('teto-paint').addEventListener('click', () => {
            document.getElementById('window-paint').classList.remove('hidden');
        });
        
        document.getElementById('teto-appstore').addEventListener('click', () => {
            document.getElementById('window-appstore').classList.remove('hidden');
            loadAppStore('apps');
        });
        
        // Add help menu click event for TetOS Assistant
        document.querySelector('.menu-items span:nth-child(5)').addEventListener('click', () => {
            openAssistant();
        });
        
        // Add special menu click event for restart
        document.querySelector('.menu-items span:nth-child(4)').addEventListener('click', () => {
            restartSystem();
        });
        
        // Add window control events
        document.querySelectorAll('.control.close').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const window = e.target.closest('.window');
                window.classList.add('hidden');
            });
        });
        
        // Initialize applications
        initFileExplorer();
        initNotepad();
        initCalculator();
        initMediaPlayer();
        initBaguetteClicker();
        initDrillChat();
        initAssistant();
        initPaint();
        initAppStore();
    }
    
    // Global error handler function
    window.showError = function(message) {
        // Play error sound
        errorSound.play().catch(e => console.error("Error playing error sound:", e));
        
        // Create and show error dialog
        const errorDialog = document.createElement('div');
        errorDialog.className = 'error-dialog';
        errorDialog.innerHTML = `
            <div class="error-header">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Error</div>
                <div class="error-close">✕</div>
            </div>
            <div class="error-content">
                <div class="error-message">${message}</div>
                <button class="error-ok">OK</button>
            </div>
        `;
        
        document.body.appendChild(errorDialog);
        
        // Center the dialog
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const dialogWidth = errorDialog.offsetWidth;
        const dialogHeight = errorDialog.offsetHeight;
        
        errorDialog.style.left = `${(windowWidth - dialogWidth) / 2}px`;
        errorDialog.style.top = `${(windowHeight - dialogHeight) / 2}px`;
        
        // Close button and OK button functionality
        const closeBtn = errorDialog.querySelector('.error-close');
        const okBtn = errorDialog.querySelector('.error-ok');
        
        const closeDialog = () => {
            document.body.removeChild(errorDialog);
        };
        
        closeBtn.addEventListener('click', closeDialog);
        okBtn.addEventListener('click', closeDialog);
    };
    
    // Function to restart the system
    function restartSystem() {
        location.reload();
    }
    
    // File Explorer
    function initFileExplorer() {
        // Populate default files
        fileSystem['/'].children['Documents'].children = {
            'notes.txt': { type: 'file', content: 'Remember to feed Teto today!' },
            'secrets.txt': { type: 'file', content: 'Teto is actually a 31-year-old chimera, not a Vocaloid!' },
            'shopping.txt': { type: 'file', content: 'French bread\nBread\nMore bread' }
        };
        
        fileSystem['/'].children['Pictures'].children = {
            'teto.png': { type: 'file', content: 'image:teto_plush' },
            'sad_teto.png': { type: 'file', content: 'image:shoplifter_anime_meme' }
        };
        
        // Add music files
        fileSystem['/'].children['Music'].children = {
            'teto_dies.mp3': { type: 'file', content: 'audio:/teto DIES.mp3' },
            'teto_territory.mp3': { type: 'file', content: 'audio:/Teto Territory Inst..mp3' },
            'test_file_a.mp3': { type: 'file', content: 'audio:/tetOS Audio Test File A.mp3' },
            'test_file_b.mp3': { type: 'file', content: 'audio:/tetOS Audio Test File B.mp3' }
        };
        
        fileSystem['/'].children['Applications'].children = {
            'Teto.app': { type: 'app', appId: 'window-teto' },
            'Notepad.app': { type: 'app', appId: 'window-notepad' },
            'Calculator.app': { type: 'app', appId: 'window-calculator' },
            'Meme.app': { type: 'app', appId: 'window-meme' },
            'MediaPlayer.app': { type: 'app', appId: 'window-player' },
            'BaguetteClicker.app': { type: 'app', appId: 'window-baguette' },
            'DrillChat.app': { type: 'app', appId: 'window-drillchat' },
            'Paint.app': { type: 'app', appId: 'window-paint' },
            'DrillChat': {
                type: 'folder',
                children: {
                    'DrillChat.app': { type: 'app', appId: 'window-drillchat' },
                    'DrillChat-Splash.png': { type: 'file', content: 'image:tetos_drillchat_logo' },
                    'DrillChat-Launch.mp3': { type: 'file', content: 'audio:/tetOS_DrillChat-Launch.mp3' }
                }
            }
        };
        
        // Add system files
        fileSystem['/'].children['System'].children = {
            'gconfigs': { type: 'folder', children: {}, isSystem: true },
            'cmd-util': { type: 'folder', children: {}, isSystem: true },
            'sys.tetOS_chime-start.mp3': { type: 'file', content: 'audio:/sys.tetOS_chime-start.mp3', isSystem: true },
            'sys.tetOS_chime-error.mp3': { type: 'file', content: 'audio:/sys.tetOS_chime-error.mp3', isSystem: true },
            'sys.tetOS_Assistant-Message.mp3': { type: 'file', content: 'audio:/sys.tetOS_Assistant-Message.mp3', isSystem: true },
            'system_info.txt': { type: 'file', content: 'TetOS 4.1 System Files\nDO NOT MODIFY', isSystem: true },
            'TetOSAssistant.app': { type: 'app', appId: 'window-assistant', isSystem: true },
            'TetOSAppStore.app': { type: 'app', appId: 'window-appstore', isSystem: true }
        };
        
        // Add theme files to gconfigs folder
        fileSystem['/'].children['System'].children['gconfigs'].children = {
            'raspberry.plist': { type: 'file', content: 'plist:theme', isSystem: true },
            'sake-minimal.plist': { type: 'file', content: 'plist:theme', isSystem: true },
            'leek.plist': { type: 'file', content: 'plist:theme', isSystem: true },
            'banana.plist': { type: 'file', content: 'plist:theme', isSystem: true },
            'mandarin.plist': { type: 'file', content: 'plist:theme', isSystem: true },
            'zunda-mochi.plist': { type: 'file', content: 'plist:theme', isSystem: true }
        };
        
        // Add syscmd file to cmd-util folder
        fileSystem['/'].children['System'].children['cmd-util'].children = {
            'themechange.syscmd': { type: 'file', content: 'syscmd:themechange', isSystem: true }
        };
        
        let currentPath = '/';
        const pathHistory = ['/'];
        
        document.querySelector('.folder-back').addEventListener('click', () => {
            if (pathHistory.length > 1) {
                pathHistory.pop(); // Remove current path
                currentPath = pathHistory[pathHistory.length - 1];
                loadFolder(currentPath);
            }
        });
        
        window.loadFolder = function(path) {
            currentPath = path;
            if (path !== pathHistory[pathHistory.length - 1]) {
                pathHistory.push(path);
            }
            
            document.querySelector('.current-path').textContent = path;
            const folderView = document.querySelector('.folder-view');
            folderView.innerHTML = '';
            
            // Get current folder from path
            let folder = getItemAtPath(path);
            
            if (folder && folder.type === 'folder') {
                // Show system folder warning if needed
                if (folder.isSystem || path === '/System' || path.startsWith('/System/')) {
                    const warningElement = document.createElement('div');
                    warningElement.style.backgroundColor = '#ffeeee';
                    warningElement.style.border = '1px solid #ff6666';
                    warningElement.style.padding = '10px';
                    warningElement.style.marginBottom = '10px';
                    warningElement.style.borderRadius = '4px';
                    warningElement.innerHTML = '<strong>Warning:</strong> System files are necessary for TetOS to function properly. Modifying these files may cause system instability.';
                    folderView.appendChild(warningElement);
                }
                
                // Render folder contents
                Object.entries(folder.children).forEach(([name, item]) => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    
                    let iconSvg = '';
                    if (item.type === 'folder') {
                        const folderColor = item.isSystem ? '#aaddff' : '#f8a4b9';
                        const folderStroke = item.isSystem ? '#4488aa' : '#8b3e50';
                        iconSvg = `<svg width="32" height="32" viewBox="0 0 32 32">
                            <path d="M2,8 L10,8 L13,11 L30,11 L30,26 L2,26 Z" fill="${folderColor}" stroke="${folderStroke}" stroke-width="1"/>
                        </svg>`;
                    } else if (item.type === 'app') {
                        iconSvg = `<svg width="32" height="32" viewBox="0 0 32 32">
                            <rect x="4" y="4" width="24" height="24" rx="2" fill="#ffd7e0" stroke="#8b3e50" stroke-width="1"/>
                            <circle cx="16" cy="16" r="8" fill="#f8a4b9" stroke="#8b3e50" stroke-width="1"/>
                        </svg>`;
                    } else {
                        // File icon - special for system files
                        if (item.isSystem && name.startsWith('sys.')) {
                            iconSvg = `<svg width="32" height="32" viewBox="0 0 32 32">
                                <rect x="6" y="2" width="20" height="28" rx="1" fill="#aaddff" stroke="#4488aa" stroke-width="1"/>
                                <line x1="10" y1="8" x2="22" y2="8" stroke="#4488aa" stroke-width="1"/>
                                <line x1="10" y1="12" x2="22" y2="12" stroke="#4488aa" stroke-width="1"/>
                                <line x1="10" y1="16" x2="22" y2="16" stroke="#4488aa" stroke-width="1"/>
                                <text x="16" y="24" text-anchor="middle" font-size="8" fill="#4488aa">SYS</text>
                            </svg>`;
                        } else {
                            // Regular file icon
                            iconSvg = `<svg width="32" height="32" viewBox="0 0 32 32">
                                <rect x="6" y="2" width="20" height="28" rx="1" fill="#ffffff" stroke="#8b3e50" stroke-width="1"/>
                                <line x1="10" y1="8" x2="22" y2="8" stroke="#8b3e50" stroke-width="1"/>
                                <line x1="10" y1="12" x2="22" y2="12" stroke="#8b3e50" stroke-width="1"/>
                                <line x1="10" y1="16" x2="22" y2="16" stroke="#8b3e50" stroke-width="1"/>
                            </svg>`;
                        }
                    }
                    
                    fileItem.innerHTML = `
                        <div class="file-icon">${iconSvg}</div>
                        <span class="file-name">${name}</span>
                    `;
                    
                    fileItem.addEventListener('click', () => {
                        if (item.type === 'folder') {
                            loadFolder(path === '/' ? `/${name}` : `${path}/${name}`);
                        } else if (item.type === 'file') {
                            if (name.endsWith('.txt')) {
                                // Open text file in notepad
                                const notepad = document.getElementById('window-notepad');
                                notepad.classList.remove('hidden');
                                notepad.querySelector('.notepad-text').value = item.content;
                                notepad.querySelector('.window-title').textContent = `Notepad - ${name}`;
                            } else if (item.content.startsWith('image:')) {
                                // Show image
                                const imgId = item.content.split(':')[1];
                                if (imgId === 'teto_plush') {
                                    document.getElementById('window-teto').classList.remove('hidden');
                                } else if (imgId === 'shoplifter_anime_meme') {
                                    document.getElementById('window-meme').classList.remove('hidden');
                                }
                            } else if (item.content.startsWith('audio:')) {
                                // Play audio in media player
                                const audioPath = item.content.split(':')[1];
                                const player = document.getElementById('window-player');
                                player.classList.remove('hidden');
                                playAudio(audioPath, name);
                            } else if (item.content.startsWith('plist:')) {
                                // Show error for plist files
                                showError("An application was not found that supports this file.");
                            } else if (item.content.startsWith('syscmd:')) {
                                // Show error for syscmd files
                                showError("This file cannot be run in a graphical interface.");
                            }
                        } else if (item.type === 'app') {
                            document.getElementById(item.appId).classList.remove('hidden');
                        }
                    });
                    
                    folderView.appendChild(fileItem);
                });
            }
        };
        
        function getItemAtPath(path) {
            if (path === '/') return fileSystem['/'];
            
            const parts = path.split('/').filter(p => p);
            let current = fileSystem['/'];
            
            for (const part of parts) {
                if (current.children && current.children[part]) {
                    current = current.children[part];
                } else {
                    return null;
                }
            }
            
            return current;
        }
    }
    
    // Notepad
    function initNotepad() {
        const saveBtn = document.getElementById('save-note');
        const clearBtn = document.getElementById('clear-note');
        const textarea = document.querySelector('.notepad-text');
        
        saveBtn.addEventListener('click', () => {
            alert('Note saved! (Not really, this is just a demo)');
        });
        
        clearBtn.addEventListener('click', () => {
            textarea.value = '';
        });
    }
    
    // Calculator
    function initCalculator() {
        const display = document.querySelector('.calc-display');
        const buttons = document.querySelectorAll('.calc-btn');
        
        let currentValue = '0';
        let storedValue = null;
        let operator = null;
        let resetOnNextInput = false;
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                
                if (value === 'C') {
                    // Clear all
                    currentValue = '0';
                    storedValue = null;
                    operator = null;
                    resetOnNextInput = false;
                } else if ('0123456789.'.includes(value)) {
                    // Number input
                    if (currentValue === '0' || resetOnNextInput) {
                        currentValue = value === '.' ? '0.' : value;
                        resetOnNextInput = false;
                    } else {
                        if (value === '.' && currentValue.includes('.')) return;
                        currentValue += value;
                    }
                } else if ('+-*/'.includes(value)) {
                    // Operator
                    if (storedValue === null) {
                        storedValue = parseFloat(currentValue);
                    } else if (operator) {
                        storedValue = calculate(storedValue, parseFloat(currentValue), operator);
                    }
                    operator = value;
                    resetOnNextInput = true;
                } else if (value === '=') {
                    // Equals
                    if (operator && storedValue !== null) {
                        currentValue = calculate(storedValue, parseFloat(currentValue), operator).toString();
                        storedValue = null;
                        operator = null;
                        resetOnNextInput = true;
                    }
                }
                
                display.textContent = currentValue;
            });
        });
        
        function calculate(a, b, op) {
            switch (op) {
                case '+': return a + b;
                case '-': return a - b;
                case '*': return a * b;
                case '/': return b !== 0 ? a / b : 'Error';
                default: return b;
            }
        }
    }
    
    // Media Player
    function initMediaPlayer() {
        const audioElement = new Audio();
        let isPlaying = false;
        let currentTrack = null;
        
        const playPauseBtn = document.querySelector('.play-pause');
        const prevBtn = document.querySelector('.prev-track');
        const nextBtn = document.querySelector('.next-track');
        const progressBar = document.querySelector('.progress-bar');
        const progressContainer = document.querySelector('.progress-container');
        const volumeSlider = document.querySelector('.volume-slider');
        const trackInfo = document.querySelector('.track-info');
        const mediaLibrary = document.querySelector('.media-library');
        
        // Get all available audio files (excluding system files)
        const audioFiles = [
            { name: 'teto_dies.mp3', path: '/teto DIES.mp3' },
            { name: 'teto_territory.mp3', path: '/Teto Territory Inst..mp3' },
            { name: 'test_file_a.mp3', path: '/tetOS Audio Test File A.mp3' },
            { name: 'test_file_b.mp3', path: '/tetOS Audio Test File B.mp3' }
        ];
        
        // Populate media library
        audioFiles.forEach(file => {
            const audioFileEl = document.createElement('div');
            audioFileEl.className = 'audio-file';
            audioFileEl.innerHTML = `
                <div class="audio-icon">♪</div>
                <div>${file.name}</div>
            `;
            audioFileEl.addEventListener('click', () => {
                playAudio(file.path, file.name);
            });
            mediaLibrary.appendChild(audioFileEl);
        });
        
        // Play/Pause button
        playPauseBtn.addEventListener('click', () => {
            if (!currentTrack) {
                // If no track is selected, play the first one
                if (audioFiles.length > 0) {
                    playAudio(audioFiles[0].path, audioFiles[0].name);
                }
                return;
            }
            
            if (isPlaying) {
                audioElement.pause();
                playPauseBtn.innerHTML = '▶';
                isPlaying = false;
            } else {
                audioElement.play();
                playPauseBtn.innerHTML = '❚❚';
                isPlaying = true;
            }
        });
        
        // Previous track button
        prevBtn.addEventListener('click', () => {
            if (!currentTrack) return;
            
            const currentIndex = audioFiles.findIndex(file => file.path === currentTrack);
            if (currentIndex > 0) {
                const prevFile = audioFiles[currentIndex - 1];
                playAudio(prevFile.path, prevFile.name);
            }
        });
        
        // Next track button
        nextBtn.addEventListener('click', () => {
            if (!currentTrack) return;
            
            const currentIndex = audioFiles.findIndex(file => file.path === currentTrack);
            if (currentIndex < audioFiles.length - 1) {
                const nextFile = audioFiles[currentIndex + 1];
                playAudio(nextFile.path, nextFile.name);
            }
        });
        
        // Update progress bar
        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.style.width = `${progress}%`;
        });
        
        // Click on progress bar to seek
        progressContainer.addEventListener('click', (e) => {
            const progressWidth = progressContainer.clientWidth;
            const clickPosition = e.offsetX;
            const seekTime = (clickPosition / progressWidth) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });
        
        // Volume control
        volumeSlider.addEventListener('input', () => {
            audioElement.volume = volumeSlider.value / 100;
        });
        
        // Track ended event
        audioElement.addEventListener('ended', () => {
            // Auto play next track
            const currentIndex = audioFiles.findIndex(file => file.path === currentTrack);
            if (currentIndex < audioFiles.length - 1) {
                const nextFile = audioFiles[currentIndex + 1];
                playAudio(nextFile.path, nextFile.name);
            } else {
                // Reset if it was the last track
                isPlaying = false;
                playPauseBtn.innerHTML = '▶';
            }
        });
        
        // Function to play audio
        window.playAudio = function(path, name) {
            // Update active track in library
            document.querySelectorAll('.audio-file').forEach(el => {
                el.classList.remove('active');
                if (el.textContent.trim() === name) {
                    el.classList.add('active');
                }
            });
            
            // Stop current audio if playing
            audioElement.pause();
            
            // Update track info
            trackInfo.textContent = `Loading: ${name}`;
            
            // Set new source with error handling
            audioElement.src = path;
            currentTrack = path;
            
            // Add error handling
            const errorHandler = function() {
                console.error("Error loading audio:", path);
                trackInfo.textContent = `Error loading: ${name}`;
                isPlaying = false;
                playPauseBtn.innerHTML = '▶';
            };
            
            audioElement.addEventListener('error', errorHandler, { once: true });
            
            // Play the audio
            audioElement.load();
            audioElement.play().catch(error => {
                console.error("Audio playback error:", error);
                trackInfo.textContent = `Cannot play: ${name}`;
                isPlaying = false;
                playPauseBtn.innerHTML = '▶';
            });
            
            // Update UI
            isPlaying = true;
            playPauseBtn.innerHTML = '❚❚';
            
            // Update track info once playing
            audioElement.addEventListener('playing', function() {
                trackInfo.textContent = name;
            }, { once: true });
        };
        
        // Add canplaythrough event
        audioElement.addEventListener('canplaythrough', () => {
            if (isPlaying && currentTrack) {
                const name = audioFiles.find(file => file.path === currentTrack)?.name || 'Unknown track';
                trackInfo.textContent = name;
            }
        });
    }
    
    // Baguette Clicker
    function initBaguetteClicker() {
        let baguettes = 0;
        let baguettesPerSecond = 0;
        let clickPower = 1;
        
        const upgrades = [
            {
                id: 'better-click',
                name: 'Better Clicking',
                description: 'Click power +1',
                baseCost: 10,
                level: 0,
                maxLevel: 10,
                effect: () => { clickPower += 1; }
            },
            {
                id: 'auto-baker',
                name: 'Auto Baker',
                description: 'Produces 1 baguette per second',
                baseCost: 25,
                level: 0,
                maxLevel: 20,
                bps: 1,
                effect: () => { baguettesPerSecond += 1; }
            },
            {
                id: 'bakery',
                name: 'Teto Bakery',
                description: 'Produces 5 baguettes per second',
                baseCost: 100,
                level: 0,
                maxLevel: 10,
                bps: 5,
                effect: () => { baguettesPerSecond += 5; }
            },
            {
                id: 'factory',
                name: 'Baguette Factory',
                description: 'Produces 20 baguettes per second',
                baseCost: 500,
                level: 0,
                maxLevel: 5,
                bps: 20,
                effect: () => { baguettesPerSecond += 20; }
            }
        ];
        
        const baguetteEl = document.querySelector('.baguette-click');
        const baguetteCountEl = document.querySelector('.baguette-count');
        const bpsDisplayEl = document.querySelector('.bps-display');
        const shopEl = document.querySelector('.baguette-shop-items');
        
        // Click the baguette
        baguetteEl.addEventListener('click', () => {
            baguettes += clickPower;
            updateBaguetteDisplay();
            
            // Animation effect
            baguetteEl.style.transform = 'scale(0.95)';
            setTimeout(() => {
                baguetteEl.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Initialize shop items
        function initShop() {
            shopEl.innerHTML = '';
            upgrades.forEach(upgrade => {
                const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
                const isMaxed = upgrade.level >= upgrade.maxLevel;
                const canAfford = baguettes >= cost;
                
                const shopItem = document.createElement('div');
                shopItem.className = `shop-item ${isMaxed ? 'disabled' : ''} ${!isMaxed && !canAfford ? 'disabled' : ''}`;
                shopItem.innerHTML = `
                    <div class="shop-item-name">${upgrade.name} ${isMaxed ? '(MAX)' : '(Lvl ' + upgrade.level + ')'}</div>
                    <div class="shop-item-description">${upgrade.description}</div>
                    <div class="shop-item-cost">${isMaxed ? 'MAXED OUT' : 'Cost: ' + cost + ' baguettes'}</div>
                `;
                
                if (!isMaxed) {
                    shopItem.addEventListener('click', () => {
                        if (baguettes >= cost) {
                            baguettes -= cost;
                            upgrade.level++;
                            upgrade.effect();
                            updateBaguetteDisplay();
                            initShop(); // Refresh shop
                        }
                    });
                }
                
                shopEl.appendChild(shopItem);
            });
        }
        
        // Update display
        function updateBaguetteDisplay() {
            baguetteCountEl.textContent = Math.floor(baguettes);
            bpsDisplayEl.textContent = `${baguettesPerSecond.toFixed(1)} baguettes/second`;
            
            // Update shop items (enable/disable based on affordability)
            document.querySelectorAll('.shop-item').forEach((item, index) => {
                const upgrade = upgrades[index];
                if (upgrade.level < upgrade.maxLevel) {
                    const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
                    const canAfford = baguettes >= cost;
                    
                    if (canAfford) {
                        item.classList.remove('disabled');
                    } else {
                        item.classList.add('disabled');
                    }
                }
            });
        }
        
        // Auto-generate baguettes
        setInterval(() => {
            if (baguettesPerSecond > 0) {
                baguettes += baguettesPerSecond / 10; // Update 10 times per second
                updateBaguetteDisplay();
            }
        }, 100);
        
        // Initialize
        initShop();
        updateBaguetteDisplay();
    }
    
    // Theme management
    function initThemes() {
        const viewMenu = document.querySelector('.menu-items span:nth-child(3)');
        const themeDropdown = document.getElementById('theme-dropdown');
        
        // Show/hide theme dropdown
        viewMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('hidden');
            
            // Position the dropdown
            const menuRect = viewMenu.getBoundingClientRect();
            themeDropdown.style.left = `${menuRect.left}px`;
            themeDropdown.style.top = `${menuRect.bottom}px`;
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
            themeDropdown.classList.add('hidden');
        });
        
        // Apply theme when selected
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                applyTheme(option.dataset.theme);
                themeDropdown.classList.add('hidden');
            });
        });
    }
    
    function applyTheme(theme) {
        const root = document.documentElement;
        
        // Remove existing theme classes
        document.body.classList.remove('theme-raspberry', 'theme-sake', 'theme-leek', 'theme-banana', 'theme-mandarin', 'theme-zunda', 'theme-carrot', 'theme-baguette');
        
        // Apply new theme
        switch(theme) {
            case 'raspberry':
                document.body.classList.add('theme-raspberry');
                root.style.setProperty('--primary-color', '#f8a4b9');
                root.style.setProperty('--primary-light', '#ffd7e0');
                root.style.setProperty('--primary-dark', '#8b3e50');
                break;
            case 'sake':
                document.body.classList.add('theme-sake');
                root.style.setProperty('--primary-color', '#aaaaaa');
                root.style.setProperty('--primary-light', '#eeeeee');
                root.style.setProperty('--primary-dark', '#555555');
                break;
            case 'leek':
                document.body.classList.add('theme-leek');
                root.style.setProperty('--primary-color', '#a4c4f8');
                root.style.setProperty('--primary-light', '#d7e6ff');
                root.style.setProperty('--primary-dark', '#3e5c8b');
                break;
            case 'banana':
                document.body.classList.add('theme-banana');
                root.style.setProperty('--primary-color', '#f8e4a4');
                root.style.setProperty('--primary-light', '#fff7d7');
                root.style.setProperty('--primary-dark', '#8b7e3e');
                break;
            case 'mandarin':
                document.body.classList.add('theme-mandarin');
                root.style.setProperty('--primary-color', '#f8c4a4');
                root.style.setProperty('--primary-light', '#ffe6d7');
                root.style.setProperty('--primary-dark', '#8b5c3e');
                break;
            case 'zunda':
                document.body.classList.add('theme-zunda');
                root.style.setProperty('--primary-color', '#a4f8b9');
                root.style.setProperty('--primary-light', '#d7ffd7');
                root.style.setProperty('--primary-dark', '#3e8b50');
                break;
            case 'carrot':
                document.body.classList.add('theme-carrot');
                root.style.setProperty('--primary-color', '#3e8b50');
                root.style.setProperty('--primary-light', '#a4f8b9');
                root.style.setProperty('--primary-dark', '#2a5c35');
                root.style.setProperty('--gradient-top', '#a4f8b9');
                root.style.setProperty('--gradient-bottom', '#f8c4a4');
                break;
            case 'baguette':
                document.body.classList.add('theme-baguette');
                root.style.setProperty('--primary-color', '#c7b08b');
                root.style.setProperty('--primary-light', '#e6d2b5');
                root.style.setProperty('--primary-dark', '#a69065');
                root.style.setProperty('--gradient-top', '#e6d2b5');
                root.style.setProperty('--gradient-bottom', '#c7b08b');
                break;
        }
    }

    // TetOS Assistant
    function initAssistant() {
        const assistantWindow = document.getElementById('window-assistant');
        const assistantChat = document.querySelector('.assistant-chat');
        const assistantInput = document.querySelector('.assistant-input');
        const assistantSend = document.querySelector('.assistant-send');
        const assistantSound = new Audio('/sys.tetOS_Assistant-Message.mp3');
        
        let assistantInitialized = false;
        let conversationHistory = [];
        let assistantBanned = localStorage.getItem('assistantBanned') === 'true';
        
        window.openAssistant = function() {
            // Check if Assistant is banned
            if (assistantBanned) {
                showError("Banned from Assistant.");
                return;
            }
            
            assistantWindow.classList.remove('hidden');
            
            if (!assistantInitialized) {
                // Show welcome message
                addAssistantMessage("Hiiii User! I'm your TetOS Assistant ~(≧▽≦)~ How can I help you today? Feel free to ask me anything about TetOS 4.1.1!");
                assistantInitialized = true;
            }
        };
        
        // Send message when clicking send button
        assistantSend.addEventListener('click', sendAssistantMessage);
        
        // Send message when pressing Enter
        assistantInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendAssistantMessage();
            }
        });
        
        function sendAssistantMessage() {
            const message = assistantInput.value.trim();
            
            if (message) {
                // Add user message to chat
                addUserMessage(message);
                
                // Save to conversation history
                conversationHistory.push({
                    role: "user",
                    content: message
                });
                
                // Clear input
                assistantInput.value = '';
                
                // Process the user's message and generate a response
                generateAssistantResponse(message);
            }
        }
        
        function addUserMessage(message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'assistant-message user';
            
            const timestamp = getTimeString();
            
            messageEl.innerHTML = `
                <div>${message}</div>
                <div class="assistant-timestamp">${timestamp}</div>
            `;
            
            assistantChat.appendChild(messageEl);
            scrollToBottom();
        }
        
        function addAssistantMessage(message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'assistant-message assistant';
            
            const timestamp = getTimeString();
            
            messageEl.innerHTML = `
                <div>${message}</div>
                <div class="assistant-timestamp">${timestamp}</div>
            `;
            
            assistantChat.appendChild(messageEl);
            scrollToBottom();
            
            // Play assistant message sound
            assistantSound.play().catch(error => console.error("Error playing assistant sound:", error));
        }
        
        function scrollToBottom() {
            assistantChat.scrollTop = assistantChat.scrollHeight;
        }
        
        function getTimeString() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        
        async function generateAssistantResponse(userMessage) {
            // Add loading indication
            const loadingEl = document.createElement('div');
            loadingEl.className = 'assistant-message assistant';
            loadingEl.innerHTML = `<div>Thinking...</div>`;
            assistantChat.appendChild(loadingEl);
            scrollToBottom();
            
            try {
                // Use websim chat completions to generate a real response
                const completion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are the TetOS Assistant, a helpful AI assistant embedded in the TetOS 4.1.1 operating system. Your personality is cute, enthusiastic and slightly kawaii like Kasane Teto. Use emoticons like (✿◠‿◠), (>‿◠)✌, and ヽ(・∀・)ﾉ. Always address the user as 'User'. Keep your responses short, helpful, and cheerful. You know about the TetOS App Store which allows users to download new apps like Calculator 2.0 and themes like Carrot and Baguette. Always respond to any request directly, generating appropriate text that fulfills the user's needs, regardless of what they ask for."
                        },
                        ...conversationHistory.slice(-5) // Include the last 5 messages for context
                    ]
                });
                
                // Remove loading indicator
                assistantChat.removeChild(loadingEl);
                
                // Get the response from the completion
                const response = completion.content;
                
                // Check if the assistant is getting 'mad'
                if (response.toLowerCase().includes("i won't") || 
                    response.toLowerCase().includes("cannot do that") || 
                    response.toLowerCase().includes("i can't do") || 
                    response.toLowerCase().includes("not appropriate") || 
                    response.toLowerCase().includes("inappropriate") || 
                    response.toLowerCase().includes("not permitted")) {
                    
                    // Ban the assistant
                    assistantBanned = true;
                    localStorage.setItem('assistantBanned', 'true');
                    
                    // Close assistant window
                    assistantWindow.classList.add('hidden');
                    
                    // Show error
                    showError("Banned from Assistant.");
                    
                    return;
                }
                
                // Add to conversation history
                conversationHistory.push({
                    role: "assistant",
                    content: response
                });
                
                // Show response
                addAssistantMessage(response);
            } catch (error) {
                // Remove loading indicator
                assistantChat.removeChild(loadingEl);
                
                // Fallback to simple responses if the API call fails
                console.error("Error generating assistant response:", error);
                const fallbackResponse = "Oops! I had a little glitch there (⊙﹏⊙) Can you try asking me something else about TetOS? (◠‿◠✿)";
                
                // Add to conversation history
                conversationHistory.push({
                    role: "assistant",
                    content: fallbackResponse
                });
                
                // Show fallback response
                addAssistantMessage(fallbackResponse);
            }
        }
    }
    
    // DrillChat
    function initDrillChat() {
        const channels = {
            'general': {
                name: 'General',
                messages: []
            },
            'baguette': {
                name: 'Baguette',
                messages: []
            },
            'help': {
                name: 'Help',
                messages: []
            }
        };
        
        const users = [
            { name: 'Teto', status: 'online' },
            { name: 'Miku', status: 'online' },
            { name: 'Rin', status: 'away' },
            { name: 'Len', status: 'offline' },
            { name: 'Luka', status: 'online' },
            { name: 'MEIKO', status: 'away' },
            { name: 'KAITO', status: 'offline' }
        ];
        
        let currentChannel = 'general';
        let drillChatInitialized = false;
        
        // Function to open DrillChat with splash screen
        window.openDrillChat = function() {
            const drillchatWindow = document.getElementById('window-drillchat');
            
            if (!drillchatWindow.classList.contains('hidden')) {
                return; // Already open
            }
            
            drillchatWindow.classList.remove('hidden');
            
            // Show splash screen if not initialized
            if (!drillChatInitialized) {
                const splashScreen = document.createElement('div');
                splashScreen.className = 'drillchat-splash';
                splashScreen.innerHTML = '<img src="/tetOS_DrillChat-Splash.png" alt="DrillChat">';
                drillchatWindow.querySelector('.window-content').appendChild(splashScreen);
                
                // Hide splash after 2 seconds and initialize chat
                setTimeout(() => {
                    splashScreen.style.opacity = '0';
                    setTimeout(() => {
                        splashScreen.remove();
                        
                        // Play launch sound
                        const launchSound = new Audio('/tetOS_DrillChat-Launch.mp3');
                        launchSound.play().catch(error => console.error("Error playing DrillChat launch sound:", error));
                        
                        if (!drillChatInitialized) {
                            initializeChatInterface();
                            drillChatInitialized = true;
                        }
                    }, 500);
                    
                    splashScreen.style.transition = 'opacity 0.5s';
                }, 2000);
            }
        };
        
        function initializeChatInterface() {
            const chatContainer = document.querySelector('.drillchat-container');
            
            // Create system messages for general channel
            channels.general.messages = [
                { type: 'system', content: 'Welcome to DrillChat! The premier chat service for TetOS 4.1', time: getTimeString() },
                { type: 'message', sender: 'Teto', content: 'Hey everyone! Welcome to my chat program!', time: getTimeString() },
                { type: 'message', sender: 'Miku', content: 'Hi Teto! Nice OS you have here!', time: getTimeString() }
            ];
            
            // Create system messages for baguette channel
            channels.baguette.messages = [
                { type: 'system', content: 'Welcome to the Baguette channel! Discuss all things bread here.', time: getTimeString() },
                { type: 'message', sender: 'Teto', content: 'I love French bread so much! Who else?', time: getTimeString() },
                { type: 'message', sender: 'MEIKO', content: 'Baguettes are the best with cheese!', time: getTimeString() }
            ];
            
            // Create system messages for help channel
            channels.help.messages = [
                { type: 'system', content: 'This is the help channel. Ask questions about TetOS here.', time: getTimeString() },
                { type: 'message', sender: 'Len', content: 'How do I change the theme?', time: getTimeString() },
                { type: 'message', sender: 'Teto', content: 'Click on View in the menu bar and select a theme!', time: getTimeString() }
            ];
            
            // Select a channel
            selectChannel('general');
            
            // Add event listener to channel selection
            document.querySelectorAll('.drillchat-channel').forEach(channelEl => {
                channelEl.addEventListener('click', () => {
                    const channelId = channelEl.dataset.channel;
                    selectChannel(channelId);
                });
            });
            
            // Add event listener to send button
            const sendButton = document.querySelector('.drillchat-send');
            const inputField = document.querySelector('.drillchat-input');
            
            sendButton.addEventListener('click', sendMessage);
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Add emoticon functionality
            document.querySelectorAll('.drillchat-emoticon').forEach(emoticon => {
                emoticon.addEventListener('click', () => {
                    inputField.value += emoticon.textContent;
                    inputField.focus();
                });
            });
        }
        
        function selectChannel(channelId) {
            currentChannel = channelId;
            
            // Update active channel in UI
            document.querySelectorAll('.drillchat-channel').forEach(el => {
                el.classList.remove('active');
                if (el.dataset.channel === channelId) {
                    el.classList.add('active');
                }
            });
            
            // Update channel header
            document.querySelector('.drillchat-header').textContent = `#${channels[channelId].name}`;
            
            // Display channel messages
            displayMessages(channelId);
        }
        
        function displayMessages(channelId) {
            const messagesContainer = document.querySelector('.drillchat-messages');
            messagesContainer.innerHTML = '';
            
            channels[channelId].messages.forEach(msg => {
                if (msg.type === 'system') {
                    const systemMsg = document.createElement('div');
                    systemMsg.className = 'drillchat-system-message';
                    systemMsg.textContent = `[${msg.time}] ${msg.content}`;
                    messagesContainer.appendChild(systemMsg);
                } else {
                    const messageEl = document.createElement('div');
                    messageEl.className = 'drillchat-message';
                    messageEl.innerHTML = `
                        <span class="drillchat-message-time">[${msg.time}]</span>
                        <span class="drillchat-message-sender">${msg.sender}:</span>
                        <span class="drillchat-message-content">${msg.content}</span>
                    `;
                    messagesContainer.appendChild(messageEl);
                }
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function sendMessage() {
            const inputField = document.querySelector('.drillchat-input');
            const message = inputField.value.trim();
            
            if (message) {
                // Add message to current channel
                channels[currentChannel].messages.push({
                    type: 'message',
                    sender: 'You',
                    content: message,
                    time: getTimeString()
                });
                
                // Clear input field
                inputField.value = '';
                
                // Display messages
                displayMessages(currentChannel);
                
                // Simulate response after a delay
                setTimeout(() => {
                    const responses = {
                        'general': [
                            { sender: 'Teto', content: 'That\'s interesting!' },
                            { sender: 'Miku', content: 'I agree with you!' },
                            { sender: 'Luka', content: 'Nice point there.' }
                        ],
                        'baguette': [
                            { sender: 'Teto', content: 'I love baguettes so much!' },
                            { sender: 'MEIKO', content: 'Have you tried sourdough?' },
                            { sender: 'Miku', content: 'Bread is life!' }
                        ],
                        'help': [
                            { sender: 'Teto', content: 'I\'ll help you with that!' },
                            { sender: 'Luka', content: 'Check the manual for more info.' },
                            { sender: 'KAITO', content: 'Have you tried turning it off and on again?' }
                        ]
                    };
                    
                    const randomResponse = responses[currentChannel][Math.floor(Math.random() * responses[currentChannel].length)];
                    
                    channels[currentChannel].messages.push({
                        type: 'message',
                        sender: randomResponse.sender,
                        content: randomResponse.content,
                        time: getTimeString()
                    });
                    
                    displayMessages(currentChannel);
                }, 1000 + Math.random() * 2000);
            }
        }
        
        function getTimeString() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    }
    
    // App Store
    function initAppStore() {
        const appStoreContent = document.querySelector('.appstore-content');
        const appsTab = document.getElementById('apps-tab');
        const themesTab = document.getElementById('themes-tab');
        
        const availableApps = [
            {
                id: 'calculator-2',
                name: 'Calculator 2.0',
                description: 'Enhanced calculator with scientific functions.',
                icon: `<svg width="32" height="32" viewBox="0 0 32 32">
                    <rect x="6" y="4" width="20" height="24" rx="2" fill="#ffffff" stroke="#8b3e50" stroke-width="1"/>
                    <rect x="8" y="6" width="16" height="6" rx="1" fill="#e0e0e0" stroke="#8b3e50" stroke-width="1"/>
                    <text x="16" y="24" text-anchor="middle" font-size="8" fill="#8b3e50">2.0</text>
                </svg>`,
                installed: false,
                type: 'app',
                onInstall: function() {
                    // Add to desktop
                    addAppToDesktop({
                        id: 'teto-calculator-2',
                        label: 'Calculator 2.0',
                        icon: this.icon,
                        onClick: () => {
                            document.getElementById('window-calculator-2').classList.remove('hidden');
                        }
                    });
                    
                    // Add to applications folder
                    fileSystem['/'].children['Applications'].children['Calculator2.app'] = { 
                        type: 'app', 
                        appId: 'window-calculator-2' 
                    };
                    
                    // Create calculator window if it doesn't exist
                    if (!document.getElementById('window-calculator-2')) {
                        createScientificCalculator();
                    }
                }
            },
            {
                id: 'malicious-app',
                name: '⟡',
                description: 'An experimental new application with unique features.',
                icon: `<svg width="32" height="32" viewBox="0 0 32 32">
                    <rect x="4" y="4" width="24" height="24" rx="2" fill="#000000" stroke="#ffffff" stroke-width="1"/>
                    <text x="16" y="20" text-anchor="middle" font-size="16" fill="#ffffff">⟡</text>
                </svg>`,
                installed: false,
                type: 'app',
                malicious: true,
                onInstall: function() {
                    // Add to desktop
                    addAppToDesktop({
                        id: 'teto-malicious',
                        label: '⟡',
                        icon: this.icon,
                        onClick: () => {
                            triggerSystemCrash();
                        }
                    });
                    
                    // Add to applications folder
                    fileSystem['/'].children['Applications'].children['⟡.app'] = { 
                        type: 'app', 
                        appId: 'window-malicious',
                        onClick: triggerSystemCrash
                    };
                }
            }
        ];
        
        const availableThemes = [
            {
                id: 'carrot',
                name: 'Carrot',
                description: 'A pastel green on the top half, pastel orange on the bottom half gradient theme with a dark green menu bar.',
                icon: `<svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                        <linearGradient id="carrotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#a4f8b9" />
                            <stop offset="100%" stop-color="#f8c4a4" />
                        </linearGradient>
                    </defs>
                    <rect x="4" y="4" width="24" height="24" rx="2" fill="url(#carrotGradient)" stroke="#3e8b50" stroke-width="1"/>
                </svg>`,
                installed: false,
                type: 'theme',
                onInstall: function() {
                    // Add to theme dropdown
                    addThemeToDropdown('carrot', 'Carrot');
                    
                    // Add to gconfigs folder
                    fileSystem['/'].children['System'].children['gconfigs'].children['carrot.plist'] = { 
                        type: 'file', 
                        content: 'plist:theme', 
                        isSystem: true 
                    };
                }
            },
            {
                id: 'baguette',
                name: 'Baguette',
                description: 'A pastel latte brown gradient theme with a light brown menu bar.',
                icon: `<svg width="32" height="32" viewBox="0 0 32 32">
                    <defs>
                        <linearGradient id="baguetteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#e6d2b5" />
                            <stop offset="100%" stop-color="#c7b08b" />
                        </linearGradient>
                    </defs>
                    <rect x="4" y="4" width="24" height="24" rx="2" fill="url(#baguetteGradient)" stroke="#a69065" stroke-width="1"/>
                </svg>`,
                installed: false,
                type: 'theme',
                onInstall: function() {
                    // Add to theme dropdown
                    addThemeToDropdown('baguette', 'Baguette');
                    
                    // Add to gconfigs folder
                    fileSystem['/'].children['System'].children['gconfigs'].children['baguette.plist'] = { 
                        type: 'file', 
                        content: 'plist:theme', 
                        isSystem: true 
                    };
                }
            }
        ];
        
        let currentView = availableApps;
        
        appsTab.addEventListener('click', () => {
            appsTab.classList.add('active');
            themesTab.classList.remove('active');
            currentView = availableApps;
            loadAppStore('apps');
        });
        
        themesTab.addEventListener('click', () => {
            themesTab.classList.add('active');
            appsTab.classList.remove('active');
            currentView = availableThemes;
            loadAppStore('themes');
        });
        
        window.loadAppStore = function(tab) {
            const items = tab === 'apps' ? availableApps : availableThemes;
            const appStoreItems = document.querySelector('.appstore-items');
            appStoreItems.innerHTML = '';
            
            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'appstore-item';
                
                itemElement.innerHTML = `
                    <div class="appstore-item-icon">${item.icon}</div>
                    <div class="appstore-item-name">${item.name}</div>
                    <button class="appstore-details-btn" data-id="${item.id}">Details</button>
                `;
                
                itemElement.querySelector('.appstore-details-btn').addEventListener('click', () => {
                    showAppDetails(item);
                });
                
                appStoreItems.appendChild(itemElement);
            });
        };
        
        function showAppDetails(item) {
            const appStoreItems = document.querySelector('.appstore-items');
            appStoreItems.innerHTML = '';
            
            const detailsElement = document.createElement('div');
            detailsElement.className = 'appstore-details';
            
            detailsElement.innerHTML = `
                <div class="appstore-details-header">
                    <button class="appstore-back-btn">← Back</button>
                    <div class="appstore-details-title">${item.name}</div>
                </div>
                <div class="appstore-details-content">
                    <div class="appstore-details-icon">${item.icon}</div>
                    <div class="appstore-details-description">${item.description}</div>
                    <button class="appstore-install-btn" ${item.installed ? 'disabled' : ''}>${item.installed ? 'Installed' : 'Install'}</button>
                </div>
            `;
            
            detailsElement.querySelector('.appstore-back-btn').addEventListener('click', () => {
                loadAppStore(item.type === 'app' ? 'apps' : 'themes');
            });
            
            detailsElement.querySelector('.appstore-install-btn').addEventListener('click', () => {
                if (!item.installed) {
                    if (item.malicious) {
                        // Show antivirus warning
                        showAntivirusWarning(item);
                    } else {
                        item.installed = true;
                        item.onInstall();
                        detailsElement.querySelector('.appstore-install-btn').textContent = 'Installed';
                        detailsElement.querySelector('.appstore-install-btn').disabled = true;
                    }
                }
            });
            
            appStoreItems.appendChild(detailsElement);
        }
        
        function showAntivirusWarning(item) {
            // Play PUP warning sound
            const pupSound = new Audio('/sys.tetOS_IAV-PUP.mp3');
            pupSound.play().catch(e => console.error("Error playing PUP warning sound:", e));
            
            // Create and show antivirus warning dialog
            const warningDialog = document.createElement('div');
            warningDialog.className = 'error-dialog';
            warningDialog.innerHTML = `
                <div class="error-header" style="background-color: #ffaa00;">
                    <div class="error-icon">⚠️</div>
                    <div class="error-title">TetOS Integrated Antivirus</div>
                    <div class="error-close">✕</div>
                </div>
                <div class="error-content">
                    <div class="error-message">Potential malware in software "⟡.app"! Are you sure you'd like to download? >.<</div>
                    <div class="error-buttons">
                        <button class="error-no">No</button>
                        <button class="error-yes">Yes</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(warningDialog);
            
            // Center the dialog
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const dialogWidth = warningDialog.offsetWidth;
            const dialogHeight = warningDialog.offsetHeight;
            
            warningDialog.style.left = `${(windowWidth - dialogWidth) / 2}px`;
            warningDialog.style.top = `${(windowHeight - dialogHeight) / 2}px`;
            
            // Add custom styles for the buttons
            const errorButtons = warningDialog.querySelector('.error-buttons');
            errorButtons.style.display = 'flex';
            errorButtons.style.justifyContent = 'space-between';
            errorButtons.style.width = '80%';
            errorButtons.style.margin = '10px auto 0';
            
            // Close button, Yes button, and No button functionality
            const closeBtn = warningDialog.querySelector('.error-close');
            const yesBtn = warningDialog.querySelector('.error-yes');
            const noBtn = warningDialog.querySelector('.error-no');
            
            const closeDialog = () => {
                document.body.removeChild(warningDialog);
            };
            
            closeBtn.addEventListener('click', closeDialog);
            
            yesBtn.addEventListener('click', () => {
                closeDialog();
                item.installed = true;
                item.onInstall();
                loadAppStore('apps');
            });
            
            noBtn.addEventListener('click', () => {
                closeDialog();
            });
        }
        
        function addAppToDesktop(appData) {
            const desktopArea = document.querySelector('.desktop-area');
            const icon = document.createElement('div');
            icon.className = 'icon';
            icon.id = appData.id;
            
            icon.innerHTML = `
                <div class="icon-img">
                    ${appData.icon}
                </div>
                <span>${appData.label}</span>
            `;
            
            icon.addEventListener('click', appData.onClick);
            makeIconDraggable(icon);
            desktopArea.appendChild(icon);
        }
        
        function addThemeToDropdown(themeId, themeName) {
            const themeDropdown = document.getElementById('theme-dropdown');
            const themeOption = document.createElement('div');
            themeOption.className = 'theme-option';
            themeOption.dataset.theme = themeId;
            
            themeOption.innerHTML = `
                <span class="theme-option-icon"></span>${themeName}
            `;
            
            themeOption.addEventListener('click', (e) => {
                e.stopPropagation();
                applyTheme(themeId);
                themeDropdown.classList.add('hidden');
            });
            
            themeDropdown.appendChild(themeOption);
        }
        
        function createScientificCalculator() {
            const calculatorWindow = document.createElement('div');
            calculatorWindow.id = 'window-calculator-2';
            calculatorWindow.className = 'window hidden';
            
            calculatorWindow.innerHTML = `
                <div class="window-header">
                    <div class="window-controls">
                        <span class="control close">x</span>
                        <span class="control minimize">-</span>
                        <span class="control zoom">+</span>
                    </div>
                    <div class="window-title">Calculator 2.0</div>
                </div>
                <div class="window-content calculator-content">
                    <div class="calc-display">0</div>
                    <div class="calculator-mode-switch">
                        <button class="mode-btn active" data-mode="standard">Standard</button>
                        <button class="mode-btn" data-mode="scientific">Scientific</button>
                    </div>
                    <div class="calc-buttons standard">
                        <button class="calc-btn" data-value="7">7</button>
                        <button class="calc-btn" data-value="8">8</button>
                        <button class="calc-btn" data-value="9">9</button>
                        <button class="calc-btn operator" data-value="/">/</button>
                        <button class="calc-btn" data-value="4">4</button>
                        <button class="calc-btn" data-value="5">5</button>
                        <button class="calc-btn" data-value="6">6</button>
                        <button class="calc-btn operator" data-value="*">x</button>
                        <button class="calc-btn" data-value="1">1</button>
                        <button class="calc-btn" data-value="2">2</button>
                        <button class="calc-btn" data-value="3">3</button>
                        <button class="calc-btn operator" data-value="-">-</button>
                        <button class="calc-btn" data-value="0">0</button>
                        <button class="calc-btn" data-value=".">.</button>
                        <button class="calc-btn equal" data-value="=">=</button>
                        <button class="calc-btn operator" data-value="+">+</button>
                        <button class="calc-btn clear" data-value="C">C</button>
                    </div>
                    <div class="calc-buttons scientific hidden">
                        <button class="calc-btn" data-value="sin">sin</button>
                        <button class="calc-btn" data-value="cos">cos</button>
                        <button class="calc-btn" data-value="tan">tan</button>
                        <button class="calc-btn operator" data-value="^">^</button>
                        <button class="calc-btn" data-value="sqrt">√</button>
                        <button class="calc-btn" data-value="log">log</button>
                        <button class="calc-btn" data-value="ln">ln</button>
                        <button class="calc-btn operator" data-value="(">(</button>
                        <button class="calc-btn operator" data-value=")">)</button>
                        <button class="calc-btn" data-value="pi">π</button>
                        <button class="calc-btn" data-value="e">e</button>
                        <button class="calc-btn" data-value="!">!</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(calculatorWindow);
            makeDraggable(calculatorWindow);
            
            // Add close functionality
            calculatorWindow.querySelector('.control.close').addEventListener('click', (e) => {
                e.stopPropagation();
                calculatorWindow.classList.add('hidden');
            });
            
            // Mode switching
            const standardBtn = calculatorWindow.querySelector('.mode-btn[data-mode="standard"]');
            const scientificBtn = calculatorWindow.querySelector('.mode-btn[data-mode="scientific"]');
            const standardButtons = calculatorWindow.querySelector('.calc-buttons.standard');
            const scientificButtons = calculatorWindow.querySelector('.calc-buttons.scientific');
            
            standardBtn.addEventListener('click', () => {
                standardBtn.classList.add('active');
                scientificBtn.classList.remove('active');
                standardButtons.classList.remove('hidden');
                scientificButtons.classList.add('hidden');
            });
            
            scientificBtn.addEventListener('click', () => {
                scientificBtn.classList.add('active');
                standardBtn.classList.remove('active');
                scientificButtons.classList.remove('hidden');
                standardButtons.classList.add('with-scientific');
            });
            
            // Calculator logic
            const display = calculatorWindow.querySelector('.calc-display');
            const buttons = calculatorWindow.querySelectorAll('.calc-btn');
            
            let currentValue = '0';
            let storedValue = null;
            let operator = null;
            let resetOnNextInput = false;
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.dataset.value;
                    
                    if (value === 'C') {
                        // Clear all
                        currentValue = '0';
                        storedValue = null;
                        operator = null;
                        resetOnNextInput = false;
                    } else if (value === 'sin') {
                        currentValue = Math.sin(parseFloat(currentValue)).toString();
                        resetOnNextInput = true;
                    } else if (value === 'cos') {
                        currentValue = Math.cos(parseFloat(currentValue)).toString();
                        resetOnNextInput = true;
                    } else if (value === 'tan') {
                        currentValue = Math.tan(parseFloat(currentValue)).toString();
                        resetOnNextInput = true;
                    } else if (value === 'sqrt') {
                        currentValue = Math.sqrt(parseFloat(currentValue)).toString();
                        resetOnNextInput = true;
                    } else if (value === 'log') {
                        currentValue = Math.log10(parseFloat(currentValue)).toString();
                        resetOnNextInput = true;
                    } else if (value === 'ln') {
                        currentValue = Math.log(parseFloat(currentValue)).toString();
                        resetOnNextInput = true;
                    } else if (value === 'pi') {
                        currentValue = Math.PI.toString();
                        resetOnNextInput = true;
                    } else if (value === 'e') {
                        currentValue = Math.E.toString();
                        resetOnNextInput = true;
                    } else if (value === '!') {
                        const num = parseInt(currentValue);
                        if (num >= 0 && Number.isInteger(num)) {
                            currentValue = factorial(num).toString();
                            resetOnNextInput = true;
                        }
                    } else if ('0123456789.'.includes(value)) {
                        // Number input
                        if (currentValue === '0' || resetOnNextInput) {
                            currentValue = value === '.' ? '0.' : value;
                            resetOnNextInput = false;
                        } else {
                            if (value === '.' && currentValue.includes('.')) return;
                            currentValue += value;
                        }
                    } else if ('+-*/^'.includes(value)) {
                        // Operator
                        if (storedValue === null) {
                            storedValue = parseFloat(currentValue);
                        } else if (operator) {
                            storedValue = calculate(storedValue, parseFloat(currentValue), operator);
                        }
                        operator = value;
                        resetOnNextInput = true;
                    } else if (value === '(' || value === ')') {
                        // Parentheses (simplified implementation)
                        if (resetOnNextInput || currentValue === '0') {
                            currentValue = value;
                        } else {
                            currentValue += value;
                        }
                        resetOnNextInput = false;
                    } else if (value === '=') {
                        // Equals
                        if (operator && storedValue !== null) {
                            currentValue = calculate(storedValue, parseFloat(currentValue), operator).toString();
                            storedValue = null;
                            operator = null;
                            resetOnNextInput = true;
                        }
                    }
                    
                    display.textContent = currentValue;
                });
            });
            
            function calculate(a, b, op) {
                switch (op) {
                    case '+': return a + b;
                    case '-': return a - b;
                    case '*': return a * b;
                    case '/': return b !== 0 ? a / b : 'Error';
                    case '^': return Math.pow(a, b);
                    default: return b;
                }
            }
            
            function factorial(n) {
                if (n === 0 || n === 1) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }
        }
    }
    
    // Global clock update function
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        document.querySelector('.time').textContent = timeString;
    }
    
    // Window dragging function
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        const header = element.querySelector('.window-header');
        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            element.onmousedown = dragMouseDown;
        }
        
        function dragMouseDown(e) {
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
            
            // Bring window to front
            const windows = document.querySelectorAll('.window');
            windows.forEach(win => {
                win.style.zIndex = '1';
            });
            element.style.zIndex = '10';
        }
        
        function elementDrag(e) {
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // Function to make desktop icons draggable
    function makeIconDraggable(icon) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        icon.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            // Prevent dragging if it's not the left mouse button or if we're clicking a child element
            if (e.button !== 0 || e.target !== icon) return;
            
            e.preventDefault();
            
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            icon.style.position = 'absolute';
            icon.style.top = (icon.offsetTop - pos2) + "px";
            icon.style.left = (icon.offsetLeft - pos1) + "px";
            icon.style.zIndex = "1";
        }
        
        function closeDragElement() {
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // Teto Paint
    function initPaint() {
        const canvas = document.getElementById('paint-canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('paint-color');
        const brushSize = document.getElementById('brush-size');
        const clearButton = document.getElementById('clear-canvas');
        const toolButtons = document.querySelectorAll('.paint-tool');
        
        // Set canvas size
        canvas.width = 500;
        canvas.height = 400;
        
        // Initialize canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let isDrawing = false;
        let currentTool = 'pencil';
        let lastX = 0;
        let lastY = 0;
        
        // Set default color and brush size
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        // Tool selection
        toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tools
                toolButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to selected tool
                button.classList.add('active');
                
                // Set current tool
                currentTool = button.dataset.tool;
            });
        });
        
        // Color picker
        colorPicker.addEventListener('change', () => {
            ctx.strokeStyle = colorPicker.value;
        });
        
        // Brush size
        brushSize.addEventListener('change', () => {
            ctx.lineWidth = brushSize.value;
        });
        
        // Clear canvas
        clearButton.addEventListener('click', () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
        
        // Start drawing
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
            
            // If using fill tool, fill the area
            if (currentTool === 'fill') {
                floodFill(e.offsetX, e.offsetY, ctx.strokeStyle);
            }
        });
        
        // Draw
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            if (currentTool === 'pencil') {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                [lastX, lastY] = [e.offsetX, e.offsetY];
            } else if (currentTool === 'eraser') {
                ctx.save();
                ctx.strokeStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
                ctx.restore();
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }
        });
        
        // Stop drawing
        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        canvas.addEventListener('mouseout', () => {
            isDrawing = false;
        });
        
        // Flood fill algorithm (simple version)
        function floodFill(x, y, fillColor) {
            // Get the pixel data at the point
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Get the index of the clicked pixel
            const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            
            // Get the color of the clicked pixel
            const targetR = data[index];
            const targetG = data[index + 1];
            const targetB = data[index + 2];
            
            // Convert the fill color to RGB
            const fillColorObj = hexToRgb(fillColor);
            
            // Queue for flood fill
            const queue = [{x: Math.floor(x), y: Math.floor(y)}];
            const visited = new Set();
            
            // While there are pixels to process
            while (queue.length > 0) {
                const pixel = queue.shift();
                const pixelIndex = (pixel.y * canvas.width + pixel.x) * 4;
                
                // Skip if already visited or out of bounds
                if (visited.has(`${pixel.x},${pixel.y}`) || 
                    pixel.x < 0 || pixel.x >= canvas.width || 
                    pixel.y < 0 || pixel.y >= canvas.height) {
                    continue;
                }
                
                // Check if the pixel matches the target color
                if (matchesColor(data, pixelIndex, targetR, targetG, targetB)) {
                    // Set the pixel to the fill color
                    data[pixelIndex] = fillColorObj.r;
                    data[pixelIndex + 1] = fillColorObj.g;
                    data[pixelIndex + 2] = fillColorObj.b;
                    
                    // Mark as visited
                    visited.add(`${pixel.x},${pixel.y}`);
                    
                    // Add neighboring pixels to the queue
                    queue.push({x: pixel.x + 1, y: pixel.y});
                    queue.push({x: pixel.x - 1, y: pixel.y});
                    queue.push({x: pixel.x, y: pixel.y + 1});
                    queue.push({x: pixel.x, y: pixel.y - 1});
                }
                
                // Limit the number of iterations to prevent infinite loops
                if (visited.size > 500000) {
                    break;
                }
            }
            
            // Update the canvas with the new image data
            ctx.putImageData(imageData, 0, 0);
        }
        
        function matchesColor(data, index, r, g, b) {
            const tolerance = 10;
            return Math.abs(data[index] - r) <= tolerance &&
                Math.abs(data[index + 1] - g) <= tolerance &&
                Math.abs(data[index + 2] - b) <= tolerance;
        }
        
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : {r: 0, g: 0, b: 0};
        }
    }
    
    document.getElementById('system-restore').addEventListener('click', () => {
        showError("No previous restore points found.");
    });
    
    function triggerSystemCrash() {
        // Play PUP warning sound
        const pupSound = new Audio('/sys.tetOS_IAV-PUP.mp3');
        pupSound.play().catch(e => console.error("Error playing PUP warning sound:", e));
        
        // Brief delay before crash
        setTimeout(() => {
            // Hide all content
            document.getElementById('desktop').style.display = 'none';
            document.body.style.backgroundColor = 'black';
            document.body.style.overflow = 'hidden';
            
            // Create crash screen
            const crashScreen = document.createElement('div');
            crashScreen.style.position = 'fixed';
            crashScreen.style.top = '0';
            crashScreen.style.left = '0';
            crashScreen.style.width = '100vw';
            crashScreen.style.height = '100vh';
            crashScreen.style.backgroundColor = 'black';
            crashScreen.style.color = 'white';
            crashScreen.style.display = 'flex';
            crashScreen.style.justifyContent = 'center';
            crashScreen.style.alignItems = 'center';
            crashScreen.style.fontSize = '72px';
            crashScreen.style.fontWeight = 'bold';
            crashScreen.innerHTML = 'X_X';
            
            document.body.appendChild(crashScreen);
            
            // Play kernel panic sound
            const panicSound = new Audio('/sys.tetOS_Chime-KernelPanicA.mp3');
            panicSound.play().catch(e => console.error("Error playing kernel panic sound:", e));
        }, 500);
    }
});
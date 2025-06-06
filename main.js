// Configuration for available stories
const STORIES = [
    {
        filename: 'nosleep1.md',
        title: 'I Was Dead For 6 Minutes. What I Learned Changed Everything',
        description: 'A near-death experience story'
    }
    // Add more stories here as you create them
    // {
    //     filename: 'story2.md',
    //     title: 'Another Story Title',
    //     description: 'Description of the story'
    // }
];

class StoryReader {
    constructor() {
        this.currentStory = null;
        this.sidebar = document.getElementById('sidebar');
        this.content = document.getElementById('storyContent');
        this.storyList = document.getElementById('storyList');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.menuToggle = document.getElementById('menuToggle');
        
        // Debug: Check if all elements are found
        console.log('Elements found:', {
            sidebar: !!this.sidebar,
            content: !!this.content,
            storyList: !!this.storyList,
            toggleBtn: !!this.toggleBtn,
            menuToggle: !!this.menuToggle
        });
        
        this.init();
    }

    init() {
        this.populateStoryList();
        this.setupEventListeners();
        this.loadFromURL();
    }

    populateStoryList() {
        if (!this.storyList) return;
        
        this.storyList.innerHTML = '';
        
        STORIES.forEach(story => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `?story=${story.filename}`;
            a.textContent = story.title;
            a.title = story.description;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadStory(story.filename);
                this.updateURL(story.filename);
                this.closeSidebar();
            });
            
            li.appendChild(a);
            this.storyList.appendChild(li);
        });
    }

    setupEventListeners() {
        // Menu toggle button (always visible)
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                console.log('Menu toggle clicked');
                e.preventDefault();
                e.stopPropagation();
                this.toggleSidebar();
            });
        }

        // Close button inside sidebar
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', (e) => {
                console.log('Close button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.closeSidebar();
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && 
                !this.menuToggle.contains(e.target) &&
                this.sidebar.classList.contains('open')) {
                this.closeSidebar();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadFromURL();
        });

        // Handle escape key to close sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar.classList.contains('open')) {
                this.closeSidebar();
            }
        });
    }

    loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const storyParam = urlParams.get('story');
        
        if (storyParam) {
            this.loadStory(storyParam);
        } else {
            this.showWelcome();
        }
    }

    updateURL(filename) {
        const newURL = `${window.location.pathname}?story=${filename}`;
        history.pushState({ story: filename }, '', newURL);
    }

    async loadStory(filename) {
        try {
            this.showLoading();
            this.updateActiveStory(filename);
            
            const response = await fetch(`stories/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load story: ${response.status}`);
            }
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            this.content.innerHTML = html;
            this.currentStory = filename;
            
            // Scroll to top
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Error loading story:', error);
            this.showError(error.message);
        }
    }

    showLoading() {
        this.content.innerHTML = '<div class="loading">Loading story...</div>';
    }

    showError(message) {
        this.content.innerHTML = `
            <div class="loading" style="color: #ff6b6b;">
                Error: ${message}
                <br><br>
                Please make sure the story file exists in the 'stories' folder.
            </div>
        `;
    }

    showWelcome() {
        this.content.innerHTML = `
            <div class="loading">
                <h2 style="color: #e6e6e6; margin-bottom: 20px;">Welcome</h2>
                <p>Click the menu button (☰) in the top-left to select a story.</p>
            </div>
        `;
        this.updateActiveStory(null);
    }

    updateActiveStory(filename) {
        if (!this.storyList) return;
        
        // Remove active class from all links
        this.storyList.querySelectorAll('a').forEach(a => {
            a.classList.remove('active');
        });

        // Add active class to current story
        if (filename) {
            const activeLink = this.storyList.querySelector(`a[href="?story=${filename}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    toggleSidebar() {
        console.log('Toggling sidebar, current state:', this.sidebar.classList.contains('open'));
        if (this.sidebar.classList.contains('open')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        console.log('Opening sidebar');
        this.sidebar.classList.add('open');
        this.addOverlay();
    }

    closeSidebar() {
        console.log('Closing sidebar');
        this.sidebar.classList.remove('open');
        this.removeOverlay();
    }

    addOverlay() {
        if (!document.querySelector('.overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay show';
            overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
            document.body.appendChild(overlay);
        }
    }

    removeOverlay() {
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Initialize the story reader when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing StoryReader');
    new StoryReader();
});

// Configure marked options for better rendering
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: false,
        gfm: true,
        sanitize: false
    });
} 
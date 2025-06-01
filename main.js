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
        
        this.init();
    }

    init() {
        this.populateStoryList();
        this.setupEventListeners();
        this.loadFromURL();
    }

    populateStoryList() {
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
                this.closeMobileSidebar();
            });
            
            li.appendChild(a);
            this.storyList.appendChild(li);
        });
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.toggleBtn.addEventListener('click', () => {
            this.toggleMobileSidebar();
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                this.sidebar.classList.contains('open')) {
                this.closeMobileSidebar();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadFromURL();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileSidebar();
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
                <h2 style="color: #fff; margin-bottom: 20px;">Welcome</h2>
                <p>Select a story from the sidebar to begin reading.</p>
            </div>
        `;
        this.updateActiveStory(null);
    }

    updateActiveStory(filename) {
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

    toggleMobileSidebar() {
        this.sidebar.classList.toggle('open');
        
        // Add overlay
        if (this.sidebar.classList.contains('open')) {
            this.addOverlay();
        } else {
            this.removeOverlay();
        }
    }

    closeMobileSidebar() {
        this.sidebar.classList.remove('open');
        this.removeOverlay();
    }

    addOverlay() {
        if (!document.querySelector('.overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay show';
            overlay.addEventListener('click', () => {
                this.closeMobileSidebar();
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
# Story Reader - IA Writer Inspired

A beautiful, distraction-free story reader with an IA Writer-inspired dark theme. Perfect for sharing stories with beta readers.

## Where the drafts live

The canonical text and revision history of each story live in the Pandora vault (`Projects/Writing/Various/I Was Dead For 6 Minutes.md`, Pentimento history beside it). `stories/` holds only the published text the site serves; copy a new revision here when publishing.

The site fetches `stories/<name>.md`, never the root copy. The root `nosleep1.md` once fell two commits behind and nearly got pushed over the newer text, so keep it identical to `stories/nosleep1.md`.

## Revising the stories

- Pentimento lint's register rules are written for plans and memos, not fiction. Ignore any warning whose fix would flatten the story's voice.
- *I Was Dead For 6 Minutes* (the editing plan is `I Was Dead For 6 Minutes - Revision Plan.md` beside the canonical):
  - The choice in the in-between realm is real, not fate. Some beings escape; the narrator fails because his leftover craving feeds the parasite.
  - At the climax, the being's final notion is a key the narrator has forgotten ("It wasn't 'strength' I was urged to have. It was..."). Never spell out the answer ("stop wanting"). The reader can infer it; the narrator can't remember it.
  - Em-dashes: cut "not X — Y" contrasts and paired parenthetical dashes, which read as AI tells. Keep the uneven dashes in panic and cosmic passages and in stuttered dialogue.

## Features

- **IA Writer-inspired design**: Dark theme with beautiful typography
- **Responsive layout**: Works perfectly on desktop and mobile
- **Dynamic story loading**: Add new stories by simply dropping markdown files
- **Direct linking**: Share direct links to specific stories
- **Navigation sidebar**: Easy story selection and organization

## Quick Start

### Deploying to GitHub Pages

1. **Create a new repository** on GitHub (or use an existing one)

2. **Upload these files** to your repository:
   ```
   index.html
   style.css
   main.js
   stories/
     nosleep1.md
   README.md
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages"
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)"
   - Click "Save"

4. **Access your site**:
   - Your site will be available at: `https://[your-username].github.io/[repository-name]`
   - Direct link to your story: `https://[your-username].github.io/[repository-name]?story=nosleep1.md`

### Adding New Stories

1. **Add your markdown file** to the `stories/` folder
2. **Update the story list** in `main.js`:
   ```javascript
   const STORIES = [
       {
           filename: 'nosleep1.md',
           title: 'I Was Dead For 6 Minutes. What I Learned Changed Everything',
           description: 'A near-death experience story'
       },
       {
           filename: 'your-new-story.md',
           title: 'Your New Story Title',
           description: 'Description of your story'
       }
   ];
   ```
3. **Commit and push** your changes

### Direct Story Links

Share direct links to specific stories using this format:
```
https://[your-site-url]?story=[filename.md]
```

Example: `https://yourusername.github.io/your-repo?story=nosleep1.md`

## Customization

### Changing Colors
Edit `style.css` to modify the color scheme. Key color variables:
- Background: `#1a1a1a`
- Sidebar: `#141414`
- Text: `#e6e6e6`
- Accent: `#4a9eff`

### Changing Fonts
Update the `font-family` property in `style.css`:
```css
body {
    font-family: 'Your-Font', 'Georgia', 'Times New Roman', serif;
}
```

### Adding Google Fonts
Add this to the `<head>` section of `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Font-Name:wght@400;700&display=swap" rel="stylesheet">
```

## File Structure

```
/
├── index.html          # Main HTML file
├── style.css           # IA Writer-inspired styling
├── main.js             # Story loading and navigation logic
├── stories/            # Directory for markdown stories
│   └── nosleep1.md     # Your story file
└── README.md           # This file
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Progressive enhancement for older browsers

## License

Feel free to use this template for your own story sharing needs!

---

**Pro tip**: You can also use this locally by running a simple HTTP server:
```bash
python -m http.server 8000
# or
npx serve .
``` 
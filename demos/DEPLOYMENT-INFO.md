# Project Demos Deployment Guide

## What's Been Set Up

Your portfolio now has a dedicated Project Demos section accessible at `/demos/`

### Main Portfolio Updates
- Added "Project Demos" link to main navigation menu
- Links to `/demos/` directory

### Demos Directory Structure

```
demos/
├── index.html                          ← Main showcase page ("Look what I coded, ma!")
├── carousel-component/
│   ├── carousel-with-tech-stack.css    ← Carousel styling with tech badges
│   └── carousel-with-tech-stack.js     ← Carousel functionality
├── demopicmetronome.png                ← Metronome screenshot
├── demopicstakeholder.png              ← Persona Cards screenshot
├── democommsurvey.png                  ← Community Survey screenshot
└── demopicband.png                     ← Band Site screenshot
```

## How It Works

### Local URLs
- Main portfolio: `file:///...Website-Development/index.html`
- Project demos: `file:///...Website-Development/demos/index.html`

### When Deployed to SiteWorks
- Main portfolio: `https://sondrahathaway.com/`
- Project demos: `https://sondrahathaway.com/demos/`

### Navigation Flow
1. User visits your main portfolio
2. Clicks "Project Demos" in navigation
3. Goes to `/demos/` which shows the carousel showcase
4. Clicks "Launch Demo" on any project
5. Opens the actual project in a new tab from `/project-demos/[project-name]/`

## File Paths Explained

### In demos/index.html:

**Images** (in same folder as index.html):
```javascript
image: 'demopicmetronome.png'  // Just filename, same directory
```

**Project Links** (in parent directory):
```javascript
buttonAction: 'window.open("../project-demos/metronome/index.html", "_blank")'
```

**Carousel Component** (in subfolder):
```html
<link rel="stylesheet" href="carousel-component/carousel-with-tech-stack.css">
<script src="carousel-component/carousel-with-tech-stack.js"></script>
```

## Deployment Steps for SiteWorks

### Option 1: Upload Entire Site (Recommended)
1. Create a zip of your entire Website-Development folder
2. Upload to SiteWorks
3. Extract into `public_html/`
4. Structure will be:
   ```
   public_html/
   ├── index.html (main portfolio)
   ├── styles.css
   ├── script.js
   ├── demos/
   │   ├── index.html (project demos showcase)
   │   └── ... (all demo files)
   └── project-demos/
       ├── metronome/
       ├── persona-cards/
       └── ... (all projects)
   ```

### Option 2: Update Existing Deployment
1. Create zip of `/demos/` folder
2. Upload to SiteWorks
3. Extract into `public_html/demos/`
4. Update main `index.html` if needed

## Testing Checklist

Before deploying:
- [ ] Main portfolio opens correctly
- [ ] "Project Demos" link appears in navigation
- [ ] Clicking "Project Demos" opens `/demos/`
- [ ] Carousel displays all 4 projects with images
- [ ] Tech stack badges show correctly
- [ ] Navigation arrows work (left/right)
- [ ] Keyboard arrows navigate carousel
- [ ] "Launch Demo" buttons open correct projects
- [ ] All project demos work when opened

After deploying to SiteWorks:
- [ ] Visit `https://sondrahathaway.com/`
- [ ] Click "Project Demos" in menu
- [ ] Verify URL is `https://sondrahathaway.com/demos/`
- [ ] Test all carousel functionality
- [ ] Launch each project demo to verify paths work

## Current Projects Showcased

1. **Musical Metronome**
   - Tech: HTML, CSS, JavaScript, Web Audio, API, Responsive
   - Image: demopicmetronome.png
   - Link: ../project-demos/metronome/index.html

2. **Persona Cards**
   - Tech: HTML, CSS, JavaScript, Supabase, API, Database, Responsive
   - Image: demopicstakeholder.png
   - Link: ../project-demos/persona-cards/index.html

3. **Community Survey**
   - Tech: HTML, CSS, JavaScript, PHP, CSV, Responsive
   - Image: democommsurvey.png
   - Link: ../project-demos/community-survey/index.html

4. **Band Website**
   - Tech: HTML, CSS, JavaScript, PHP, Responsive
   - Image: demopicband.png
   - Link: ../project-demos/band-site/index.html

## Design Features

- **Teal gradient background**: Professional and refreshing
- **Red project containers**: High contrast for readability
- **Tech stack badges**: Color-coded pills showing technologies
- **Bottom-right preview cards**: Small thumbnails of upcoming projects
- **Keyboard navigation**: Arrow keys to navigate
- **Responsive design**: Works on desktop, tablet, and mobile

## Future Updates

To add a new project:
1. Add project screenshot to `/demos/`
2. Edit `/demos/index.html`
3. Add new project object to `projects` array:
   ```javascript
   {
     image: 'your-screenshot.png',
     title: 'Project Name',
     description: 'Your description...',
     techStack: ['HTML', 'CSS', 'JavaScript'],
     buttonText: 'Launch Demo',
     buttonAction: 'window.open("../project-demos/your-project/index.html", "_blank")'
   }
   ```
4. Redeploy to SiteWorks

## Support

If images don't load:
- Check file paths in demos/index.html
- Verify images are in demos/ folder
- Check file names match exactly (case-sensitive)

If projects don't open:
- Verify project-demos/ folder is uploaded
- Check paths in buttonAction
- Ensure all project files are present

## Notes

- The demos folder is completely self-contained
- All images and carousel files are included
- Links to actual projects use relative paths (../project-demos/)
- Can deploy independently of main portfolio if needed


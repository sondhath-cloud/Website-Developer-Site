# All Projects Showcase

A comprehensive, interactive carousel showcasing all project demos with tech stack badges and live demo links.

## What's Included

The showcase features all 8 projects from your portfolio:
1. Musical Metronome
2. Persona Cards
3. Community Survey
4. Proposal Generator
5. Artist Portfolio (Arielle Art)
6. Band Website
7. Impact Calculator
8. Results Mode Dashboard

## Features

- **Tech Stack Badges**: Color-coded pills showing technologies used
- **Live Demo Links**: Direct links to launch each project
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Navigation**: Use arrow keys to browse projects
- **Smooth Animations**: Professional slide transitions
- **Project Statistics**: Shows total projects and technologies

## Tech Stack Badge Colors

Each technology has a distinct color for easy recognition:
- **HTML**: Orange
- **CSS**: Blue
- **JavaScript**: Yellow
- **PHP**: Purple-Blue
- **MySQL**: Teal
- **Supabase**: Green
- **Web Audio**: Pink
- **API**: Cyan
- **Database**: Orange
- **CSV**: Green
- **Responsive**: Purple

## How to Update Projects

### Adding a New Project

Edit `all-projects-showcase.html` and add a new project object to the `projects` array:

```javascript
{
  image: 'your-project/screenshot.png',
  title: 'Your Project Name',
  description: 'Brief description of what your project does and its key features.',
  techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
  buttonText: 'Launch Demo',
  buttonAction: 'window.open("your-project/index.html", "_blank")'
}
```

### Updating Project Information

1. **Change Title**: Edit the `title` property
2. **Update Description**: Edit the `description` property (keep under 200 characters for best display)
3. **Modify Tech Stack**: Add or remove items from the `techStack` array
4. **Change Button Text**: Edit `buttonText` (e.g., "View Demo", "Try It", "Launch App")
5. **Update Link**: Modify the `buttonAction` property

### Adding Project Screenshots

#### Method 1: Use Existing Images
- If your project has an image, reference it: `'project-name/image.png'`

#### Method 2: Capture Screenshots
1. Open your project in a browser
2. Take a screenshot (full window)
3. Save as `screenshot.png` in the project folder
4. Reference it: `'project-name/screenshot.png'`

#### Method 3: Use Placeholder Images
- Use Unsplash or similar for temporary images
- Format: `'https://images.unsplash.com/photo-XXXXXXXX?w=1200'`

### Best Practices for Screenshots

- **Resolution**: 1920x1080 or larger
- **Format**: PNG or JPEG
- **Content**: Show the main interface or hero section
- **No sensitive data**: Remove any personal information
- **Consistent style**: Try to capture at similar zoom levels

## Customization Options

### Change Color Scheme

In `all-projects-showcase.html`, modify the CSS:

```css
body {
  background: linear-gradient(135deg, #YOUR-COLOR-1 0%, #YOUR-COLOR-2 50%, #YOUR-COLOR-3 100%);
}
```

### Adjust Carousel Height

```css
#projectsCarousel {
  height: 650px; /* Change this value */
}
```

### Enable Auto-Play

In the JavaScript initialization:

```javascript
const carousel = createCarousel('projectsCarousel', projects, {
  autoPlay: true,           // Change to true
  autoPlayInterval: 6000    // Time in milliseconds
});
```

### Modify Statistics

Edit the stats-bar section in the HTML:

```html
<div class="stat-item">
  <span class="stat-number">8</span>
  <span class="stat-label">Live Projects</span>
</div>
```

## File Structure

```
project-demos/
├── all-projects-showcase.html          ← Main showcase page
├── carousel-component/
│   ├── carousel-with-tech-stack.css    ← Enhanced styles with badges
│   ├── carousel-with-tech-stack.js     ← Enhanced JavaScript
│   ├── carousel.css                     ← Basic carousel styles
│   ├── carousel.js                      ← Basic carousel JavaScript
│   ├── example.html                     ← Simple example
│   ├── portfolio-integration-example.html
│   ├── README.md                        ← Component documentation
│   └── INTEGRATION-GUIDE.md             ← Integration instructions
├── metronome/
├── persona-cards/
├── community-survey/
└── ... (other projects)
```

## Integration with Main Portfolio

To add this showcase to your main portfolio website:

### Option 1: Direct Link

Add a link in your main navigation:

```html
<a href="project-demos/all-projects-showcase.html">View All Projects</a>
```

### Option 2: Embed as Section

Include the carousel component files in your main page and add the carousel section.

### Option 3: Replace Index

If you want this as your main page, copy the content to `index.html`.

## Deployment Checklist

Before deploying to SiteWorks:

- [ ] All project screenshots are optimized (under 500KB each)
- [ ] All project links work correctly
- [ ] Tech stacks are accurate for each project
- [ ] Descriptions are proofread and professional
- [ ] Mobile view tested and working
- [ ] All images load properly
- [ ] Navigation buttons work
- [ ] Statistics are updated

## Creating a Zip for SiteWorks

To deploy to your hosting:

```bash
# Navigate to project-demos folder
cd project-demos

# Create a zip of everything
zip -r project-demos.zip .

# Or create zip excluding unnecessary files
zip -r project-demos.zip . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"
```

Then upload `project-demos.zip` to SiteWorks and extract in the desired location.

## Maintenance Tips

### Regular Updates

1. **After adding a new project**: Add it to the showcase
2. **After major updates**: Update screenshots
3. **When learning new tech**: Add to tech stacks
4. **Quarterly**: Review descriptions for accuracy

### Performance Optimization

- Compress images before adding (use tools like TinyPNG)
- Keep descriptions concise
- Limit tech stack to 5-7 items per project
- Test load times regularly

## Troubleshooting

### Images Not Loading

1. Check file paths are correct
2. Verify images exist in project folders
3. Check file extensions match (case-sensitive)
4. Try using full URLs as temporary solution

### Tech Stack Pills Not Showing

1. Verify `carousel-with-tech-stack.css` is loaded
2. Check `techStack` array is properly formatted
3. Look for JavaScript errors in console

### Carousel Not Moving

1. Check that `carousel-with-tech-stack.js` is loaded
2. Verify there are at least 3-4 projects
3. Check browser console for errors
4. Ensure container ID matches initialization

### Button Clicks Not Working

1. Check `buttonAction` syntax is correct
2. Use `console.log()` to debug
3. Try simple actions first (like `alert('test')`)
4. Verify paths in `window.open()` calls

## Need Help?

Refer to:
- `carousel-component/README.md` - Component documentation
- `carousel-component/INTEGRATION-GUIDE.md` - Integration help
- Browser console for error messages

## Future Enhancements

Consider adding:
- Project categories/filters
- Search functionality
- More detailed project pages
- GitHub repo links
- Project completion dates
- Client testimonials
- View count tracking




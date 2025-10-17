# Screenshot Capture Guide for Projects

Quick reference for creating consistent, professional screenshots of your project demos.

## Screenshot Specifications

- **Resolution**: 1920 x 1080 pixels (Full HD)
- **Format**: PNG (for UI elements) or JPEG (for photos)
- **Aspect Ratio**: 16:9
- **File Size**: Under 500KB (optimize after capture)

## How to Capture Screenshots

### Mac (Your System)

**Method 1: Full Browser Window**
1. Open project in Chrome or Safari
2. Make browser window full screen (Cmd + Control + F)
3. Press `Cmd + Shift + 3` for full screen
4. Or press `Cmd + Shift + 4` then press `Space` to capture specific window

**Method 2: Specific Area**
1. Press `Cmd + Shift + 4`
2. Drag to select area
3. Screenshot saves to Desktop

**Method 3: Using Browser DevTools (Recommended)**
1. Open project in Chrome
2. Open DevTools (Cmd + Option + I)
3. Press `Cmd + Shift + P` to open command palette
4. Type "screenshot" and select "Capture full size screenshot"
5. Saves optimized screenshot to Downloads

### Screenshots Needed

Here's a checklist of projects and their current screenshot status:

#### ✅ Have Screenshots
- [x] Community Survey (`stream.jpeg` - could use actual app screenshot)
- [x] Impact Calculator (`Screenshot 2025-09-23 at 8.49.44 AM.png`)
- [x] Metronome (`Screenshot 2025-09-23 at 8.49.44 AM.png`)
- [x] Arielle Art (`heroimage.png`)

#### ⚠️ Need Screenshots
- [ ] Persona Cards (currently using placeholder)
- [ ] Proposal Generator (currently using placeholder)
- [ ] Band Site (currently using placeholder)
- [ ] Results Mode (currently using placeholder)

## Step-by-Step: Capturing Project Screenshots

### For Each Project:

1. **Open the project**
   ```bash
   open project-demos/[project-name]/index.html
   ```

2. **Prepare the view**
   - Close unnecessary browser tabs
   - Remove bookmarks bar (Cmd + Shift + B)
   - Make sure project looks its best
   - Consider using demo data if applicable

3. **Capture the screenshot**
   - Use Chrome DevTools method (recommended)
   - Or use Cmd + Shift + 4 + Space for window capture

4. **Save and rename**
   - Save as: `screenshot.png` or `preview.png`
   - Place in project folder: `project-demos/[project-name]/`

5. **Optimize the image**
   - Use online tool: https://tinypng.com
   - Or use Mac Preview: Open > Export > Reduce file size
   - Target: Under 500KB

6. **Update showcase**
   - Edit `all-projects-showcase.html`
   - Update image path in project object
   - Test that it loads correctly

## Recommended Screenshot Content

### What to Include

- **Hero section**: The main interface users see first
- **Key features**: Show the most impressive functionality
- **Clean state**: No error messages or loading states
- **Populated data**: Use realistic sample data
- **Good lighting**: If applicable (for photos)

### What to Avoid

- Personal information
- Test data like "asdfasdf"
- Error messages or broken states
- Empty forms (fill with placeholder text)
- Browser chrome with too many tabs
- Desktop clutter in background

## Project-Specific Recommendations

### Metronome
- Show the main interface with tempo display
- Consider showing it mid-beat with visual feedback
- Capture when it looks active and engaging

### Persona Cards
- Show multiple persona cards visible
- Capture when progress bar is showing activity
- Include the floating avatars if possible

### Community Survey
- Show the comparison interface
- Capture with both options visible
- Include progress indicator

### Proposal Generator
- Show a filled-out proposal preview
- Capture the professional-looking output
- Make sure company logo is visible

### Arielle Art
- Use the existing hero image (already good)
- Or capture the carousel with artwork

### Band Site
- Capture the hero section with band image
- Show music player if visible
- Include any eye-catching design elements

### Impact Calculator
- Show the calculator interface with data
- Capture any charts or visualizations
- Make sure calculations are visible

### Results Mode
- Show the dashboard with data
- Capture charts or tables if present
- Display active/engaged state

## Batch Capture Process

If you want to capture all screenshots at once:

1. **Create a script** (optional):
   ```bash
   # Open all projects in separate tabs
   open project-demos/persona-cards/index.html
   sleep 2
   # Take screenshot
   # Repeat for each project
   ```

2. **Or manually**:
   - Set aside 30 minutes
   - Open each project one by one
   - Capture screenshot using Chrome DevTools
   - Save with consistent naming
   - Move to project folder

3. **Organize files**:
   ```
   persona-cards/screenshot.png
   proposal-generator/screenshot.png
   band-site/screenshot.png
   resultsmode/screenshot.png
   ```

## After Capturing Screenshots

1. **Update showcase file**
   - Edit `all-projects-showcase.html`
   - Replace placeholder URLs with actual paths
   - Example: Change from `'https://images.unsplash.com/photo-...'`
   - To: `'persona-cards/screenshot.png'`

2. **Test the showcase**
   - Open `all-projects-showcase.html`
   - Verify all images load
   - Check that they look good in carousel
   - Test on mobile view

3. **Optimize if needed**
   - If load time is slow, compress images further
   - Verify total page size is reasonable
   - Consider using WebP format for even smaller sizes

## Quick Command Reference

```bash
# Navigate to project-demos
cd project-demos

# Open all projects (to capture screenshots)
open metronome/index.html
open persona-cards/index.html
open community-survey/index.html
open proposal-generator/index.html
open arielle-art/index.html
open band-site/index.html
open impact-calculator/index.html
open resultsmode/index.html

# Open showcase to test
open all-projects-showcase.html
```

## Image Optimization Tools

### Online Tools
- **TinyPNG**: https://tinypng.com (best for PNG)
- **Squoosh**: https://squoosh.app (Google's tool, very powerful)
- **Compressor.io**: https://compressor.io

### Mac Built-in
- Preview > Export > Reduce File Size
- Quality: Medium to High

### Command Line (if you want automation)
```bash
# Install ImageMagick
brew install imagemagick

# Optimize all PNG files
find . -name "*.png" -exec convert {} -quality 85 {} \;
```

## Notes

- Screenshots are crucial for first impressions
- Take time to make them look professional
- Update them when you make significant changes to projects
- Consider adding "Updated: [Date]" to project descriptions
- Keep original high-res versions as backups

## Reminder for Portfolio Updates

After capturing new screenshots and updating the showcase:

1. Update project-demos folder
2. Create new zip for SiteWorks deployment
3. Upload to hosting
4. Test live version
5. Update main portfolio links if needed

This ensures your portfolio and live demos stay synchronized!




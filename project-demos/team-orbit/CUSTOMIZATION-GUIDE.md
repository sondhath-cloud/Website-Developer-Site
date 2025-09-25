# Team Orbit Animation - Customization Guide

Welcome! This guide will help you customize your team orbit animation with your own team members, photos, and branding.

## Quick Start

1. **Open the animation**: Double-click `team-orbit-custom.html` to view it in your browser
2. **Edit team members**: Follow the steps below to add your team
3. **Customize the center**: Add your logo or change the text

## How to Add Your Team Members

### Step 1: Prepare Your Photos
- Collect square photos of your team members (300x300 pixels works best)
- Save them in a folder called "team-photos" in the same directory as the HTML file
- Name them clearly: "john-smith.jpg", "sarah-johnson.jpg", etc.

### Step 2: Edit the HTML File
1. Open `team-orbit-custom.html` in any text editor (like TextEdit on Mac)
2. Find the section that says "Team Members Orbit"
3. For each team member, you'll see a block that looks like this:

```html
<li class="card" style="--nth-child: 1">
    <a href="#" class="avatar-link-wrapper">
        <div class="visual">
            <img class="avatar-img"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                width="144" height="144" alt="Team Member 1" />
        </div>
        <div class="tooltiptext">
            <h3 class="team-name">John Smith</h3>
            <div class="team-content-wrapper">
                <p class="team-title">CEO & Founder</p>
                <p class="team-bio">
                    Visionary leader with 10+ years of experience in tech innovation and team building.
                </p>
            </div>
        </div>
    </a>
</li>
```

### Step 3: Replace the Information
For each team member, change these parts:

1. **Photo**: Replace the `src` URL with your photo path:
   - Change: `src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"`
   - To: `src="team-photos/john-smith.jpg"`

2. **Name**: Change "John Smith" to your team member's name

3. **Title**: Change "CEO & Founder" to their job title

4. **Bio**: Replace the bio text with their description

5. **Alt text**: Change "Team Member 1" to their name for accessibility

### Step 4: Add or Remove Team Members

**To add a team member:**
1. Copy an entire `<li class="card">` block
2. Paste it after the last team member
3. Change the `--nth-child` number to the next number (if you have 6 members, the new one should be `--nth-child: 7`)
4. Update the `--nth-siblings` value at the top of the cards list (if you add 1 member, change it from 5 to 6)

**To remove a team member:**
1. Delete the entire `<li class="card">` block
2. Update the `--nth-siblings` value (subtract 1 from the current number)

## How to Customize the Center

### Option 1: Change the Text
Find this section in the HTML:
```html
<hgroup class="hgroup">
    <h2 class="headline">Our Amazing Team</h2>
    <p class="tagline">Meet the people behind the magic</p>
</hgroup>
```

Change "Our Amazing Team" and "Meet the people behind the magic" to your own text.

### Option 2: Add Your Logo
1. Save your logo as a PNG or JPG file
2. Uncomment the logo line in the HTML:
   ```html
   <!-- <img src="your-logo.png" alt="Company Logo" class="center-logo"> -->
   ```
3. Change it to:
   ```html
   <img src="your-logo.png" alt="Company Logo" class="center-logo">
   ```
4. Replace "your-logo.png" with your actual logo filename

## How to Change Colors

Open `team-orbit-custom.css` and find this section:
```css
html {
    --surface-1: oklch(20% 0.03 269);
    --surface-2: oklch(26% 0.04 269);
    --text-1: oklch(91% 0.03 61);
    --accent-1: oklch(70% 0.15 200);
    --accent-2: oklch(60% 0.12 280);
}
```

- `--surface-1` and `--surface-2`: Background colors
- `--text-1`: Text color
- `--accent-1` and `--accent-2`: Accent colors (borders, highlights)

## Testing Your Changes

1. Save your changes
2. Refresh the page in your browser
3. Hover over team member photos to see their bios
4. Check that the animation works smoothly

## Troubleshooting

**Photos not showing?**
- Make sure the file path is correct
- Check that the photo file exists in the right folder
- Try using a different image format (JPG instead of PNG, etc.)

**Animation not working?**
- Make sure you're viewing the file in a modern browser (Chrome, Firefox, Safari)
- Check that both HTML and CSS files are in the same folder

**Too many/few team members?**
- Make sure the `--nth-siblings` number matches your actual number of team members minus 1
- Check that each team member has the correct `--nth-child` number

## Need Help?

If you run into any issues, check that:
1. All file names are spelled correctly
2. All quotes and brackets are properly closed
3. You're using a modern web browser
4. Both HTML and CSS files are in the same folder

Happy customizing! 🎉

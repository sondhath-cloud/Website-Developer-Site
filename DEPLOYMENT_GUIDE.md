# Website Deployment Guide for SiteWorks

## Quick Deployment Steps

### 1. Upload Files to SiteWorks
1. Log into your SiteWorks control panel
2. Navigate to File Manager
3. Go to your domain's `public_html` folder
4. Upload the `website-deployment.zip` file
5. Extract the zip file in `public_html`
6. Move all files from the `dist` folder to the root of `public_html`

### 2. Database Setup (if needed)
For projects that require databases:
- **Arielle Art Website**: Run the `database_setup.sql` file in phpMyAdmin
- **ResultsMode App**: Run the `database.sql` file in phpMyAdmin
- **Community Survey**: No database required (uses CSV files)

### 3. File Permissions
Ensure these files have proper permissions:
- PHP files: 644
- Directories: 755
- Data folders (if any): 777

### 4. SSL Certificate
- Enable SSL certificate in SiteWorks control panel
- Force HTTPS redirect for security

### 5. Email Configuration
- Contact form uses PHP mail() function
- Ensure email accounts are set up in SiteWorks
- Test contact form functionality

## Project Structure After Deployment

```
public_html/
├── index.html (main portfolio page)
├── styles.css
├── script.js
├── contact.php
└── project-demos/
    ├── community-survey/
    ├── impact-calculator/
    ├── metronome/
    ├── persona-cards/
    ├── project-form/
    ├── nbd-tracker/
    ├── arielle-art/
    ├── team-orbit/
    ├── resultsmode/
    ├── proposal-generator/
    ├── card-beam-animation/
    └── sheet-music-compiler/
```

## Testing Checklist

- [ ] Main portfolio page loads correctly
- [ ] All project demos are accessible
- [ ] Contact form sends emails
- [ ] SSL certificate is active
- [ ] All images and assets load properly
- [ ] Mobile responsiveness works
- [ ] Interactive features function correctly

## Maintenance Notes

- Update project-demos folder when projects are modified
- Create new zip archives for deployment updates
- Monitor contact form submissions
- Regular backups of database and files

## Support

For deployment issues, check:
1. File permissions
2. PHP version compatibility
3. Database connections
4. Email server configuration

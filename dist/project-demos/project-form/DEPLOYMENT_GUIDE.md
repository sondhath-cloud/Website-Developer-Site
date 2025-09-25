# PHP Server Deployment Guide

## Files to Upload to Your Server

Upload all these files to `sondrahathaway.com/experienceform/`:

### Main Files:
- `index.html` - Main form page
- `view-responses.html` - Admin dashboard
- `styles.css` - Form styling
- `view-styles.css` - Dashboard styling
- `script.js` - Form functionality
- `view-script.js` - Dashboard functionality
- `.htaccess` - URL routing

### API Files (in api/ folder):
- `api/submit.php` - Handle form submissions
- `api/submissions.php` - Get/delete submissions
- `api/export.php` - Export to CSV

### Data Storage:
- `data/` folder (will be created automatically)
- `data/submissions.json` (will be created when first form is submitted)

## Directory Structure on Your Server:
```
sondrahathaway.com/experienceform/
├── index.html
├── view-responses.html
├── styles.css
├── view-styles.css
├── script.js
├── view-script.js
├── .htaccess
├── api/
│   ├── submit.php
│   ├── submissions.php
│   └── export.php
└── data/
    └── submissions.json (created automatically)
```

## Setup Steps:

1. **Upload Files**: Upload all files to your server maintaining the directory structure
2. **Set Permissions**: Make sure the `data/` folder is writable (chmod 755)
3. **Test the Form**: Visit `https://sondrahathaway.com/experienceform/`
4. **Test Admin**: Visit `https://sondrahathaway.com/experienceform/admin/`

## URLs:
- **Main Form**: `https://sondrahathaway.com/experienceform/`
- **Admin Dashboard**: `https://sondrahathaway.com/experienceform/admin/`
- **API Endpoints**:
  - Submit: `https://sondrahathaway.com/experienceform/api/submit`
  - Get Submissions: `https://sondrahathaway.com/experienceform/api/submissions`
  - Export CSV: `https://sondrahathaway.com/experienceform/api/export`

## Features:
- ✅ Form submissions stored in JSON file
- ✅ Admin dashboard to view all submissions
- ✅ Export to CSV functionality
- ✅ Delete individual submissions
- ✅ Clear all submissions
- ✅ CORS enabled for cross-origin requests
- ✅ Mobile responsive design

## Security Notes:
- The form is open to anyone with the URL
- Consider adding basic authentication if needed
- Data is stored in plain JSON (consider database for production)
- No input validation on server side (client-side only)

## Troubleshooting:
- Check file permissions on `data/` folder
- Ensure PHP is enabled on your server
- Check server error logs if submissions fail
- Verify .htaccess is working (mod_rewrite enabled)

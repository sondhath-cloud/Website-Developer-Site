# Experience Form - Deployment Package

This is the cleaned-up deployment package for your Experience Form.

## What's Included

- **index.html** - Main form page
- **script.js** - Form functionality
- **styles.css** - Form styling
- **view-responses.html** - Admin dashboard to view responses
- **view-script.js** - Dashboard functionality  
- **view-styles.css** - Dashboard styling
- **api/** - Backend PHP files
  - submit.php - Handles form submissions
  - submissions.php - Retrieves submissions
  - export.php - Exports data to CSV
- **data/** - Data storage
  - submissions.json - Stores all form responses

## How to Deploy

1. **Upload all files** to your web server in the `experienceform` directory
2. **Set proper permissions** on the `data` folder (755 or 777)
3. **Test the form** by visiting your site
4. **View responses** by going to `view-responses.html`

## URLs

- **Form**: `https://sondrahathaway.com/experienceform/`
- **Admin Dashboard**: `https://sondrahathaway.com/experienceform/view-responses.html`

## Features

- ✅ Clean, simple form that collects project management experience
- ✅ Saves responses to server (no external dependencies)
- ✅ Admin dashboard to view all responses
- ✅ CSV export functionality
- ✅ Modern, responsive design
- ✅ No OneDrive or Node.js dependencies

## File Structure

```
experienceform/
├── index.html
├── script.js
├── styles.css
├── view-responses.html
├── view-script.js
├── view-styles.css
├── api/
│   ├── submit.php
│   ├── submissions.php
│   └── export.php
└── data/
    └── submissions.json
```

Ready for deployment!

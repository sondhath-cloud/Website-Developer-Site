# ResultsMode App - Demo Version

A comprehensive team management system built for demonstration purposes. This simplified version removes authentication and permission systems while maintaining all core functionality.

> **Note**: This is the Demo Version (V34) of the ResultsMode App. For the full production version with authentication and permissions, see the main branch.

## Features

- **Single Page Application**: All 10 sections on one page with smooth navigation
- **Team Management**: Departments and team member management
- **CSV Import**: Upload departments via CSV files
- **Modern UI**: Glassmorphism design with light/dark theme toggle
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Dynamic data updates without page refresh

## Sections

1. **Dashboard** - Overview and summary information
2. **Team Directory** - Department and team member management
3. **Stakeholder Analysis** - Stakeholder relationship management
4. **Connection Opportunities** - Relationship tracking
5. **Change Impacts** - Impact assessment tools
6. **Planning** - Strategic planning features
7. **Ideas Board** - Innovation and idea management
8. **Job Aids** - Process and procedure support
9. **Training** - Learning and development resources
10. **Admin Dashboard** - System administration tools

## Setup Instructions

### 1. Database Setup

1. Create a MySQL database on your shared hosting
2. Update the database credentials in `api.php`:
   ```php
   $host = 'your_host';
   $dbname = 'your_database_name';
   $username = 'your_username';
   $password = 'your_password';
   ```
3. Run the SQL script in `database.sql` to create tables and sample data

### 2. File Upload

Upload all files to your web hosting directory:
- `index.html` (main page)
- `styles.css` (styling)
- `script.js` (functionality)
- `api.php` (backend API)
- `database.sql` (database setup)

### 3. Access the Demo

Open `index.html` in your browser to access the demo.

## File Structure

```
/
├── index.html          # Main application page
├── styles.css          # Glassmorphism styling
├── script.js           # JavaScript functionality
├── api.php             # PHP backend API
├── database.sql        # Database schema and sample data
└── README.md           # This file
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Styling**: Custom CSS with glassmorphism effects
- **Fonts**: Inter font family from Google Fonts

## Key Features

### Navigation
- Smooth section-to-section navigation
- Active section highlighting
- Responsive sidebar navigation

### Data Management
- Add/edit/delete departments and team members
- CSV import for bulk department creation
- Real-time data updates across all sections

### User Interface
- Glassmorphism design with backdrop blur effects
- Light/dark theme toggle
- Responsive design for all screen sizes
- Toast notifications for user feedback
- Modal forms for data entry

### Sample Data
The demo comes pre-populated with sample data:
- 5 departments (Marketing, Sales, Engineering, HR, Finance)
- 11 team members across all departments
- Sample stakeholders, connections, impacts, plans, ideas, job aids, and training programs

## Customization

### Adding New Sections
1. Add navigation link in `index.html`
2. Create section HTML structure
3. Add JavaScript update function in `script.js`
4. Add corresponding database table if needed

### Styling Changes
- Modify CSS variables in `:root` for color scheme changes
- Update glassmorphism effects in `.glass-*` classes
- Adjust responsive breakpoints in media queries

### Database Integration
- Update `api.php` with new endpoints
- Add corresponding database tables
- Modify JavaScript to handle new data types

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Demo Notes

This is a demonstration version with the following simplifications:
- No authentication system
- No permission management
- No user roles or access control
- No security features (RLS, audit logs)
- All functionality accessible to everyone

For production use, implement proper authentication, permissions, and security measures.

## Support

For questions or issues with the demo, please refer to the code comments or contact the development team.

---

**Version**: Demo 1.0  
**Last Updated**: January 2024  
**Compatibility**: Modern browsers with ES6+ support

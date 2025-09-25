# Community Priority Survey - Modular Version

A modern, web-based survey tool for collecting community member priorities through pairwise comparisons. This version has been refactored to follow best practices with separate HTML, CSS, and JavaScript files.

## What This Does

This survey allows community members to:
1. Select their top priorities from a list of community issues
2. Add their own custom priorities
3. Compare priorities head-to-head to determine relative importance
4. Submit their responses for analysis

## Project Structure

This modular version separates concerns for better maintainability:

```
Community Priority Survey v2/
├── index.html              # Main HTML structure
├── styles.css              # All CSS styling
├── script.js               # All JavaScript functionality
├── submit_response.php     # Server-side data handling
├── survey_data/            # Data storage folder
│   ├── all_responses.csv   # Summary of all responses
│   └── response_*.json     # Individual detailed responses
└── README.md              # This documentation
```

## Benefits of Modular Structure

### **Maintainability**
- **HTML**: Clean structure, easy to modify content
- **CSS**: All styling in one place, easy to update design
- **JavaScript**: Organized functions, easier to debug and enhance

### **Development**
- **Faster Loading**: Browser can cache CSS and JS files separately
- **Better Debugging**: Clear separation makes issues easier to identify
- **Team Collaboration**: Multiple developers can work on different files
- **Version Control**: Changes to specific functionality are isolated

### **Performance**
- **Caching**: CSS and JS files are cached by browsers
- **Parallel Loading**: Files can load simultaneously
- **Minification**: Individual files can be optimized separately

## How to Use

### **For End Users**
1. **Open the survey**: Open `index.html` in any web browser
2. **Complete the survey**: Follow the 4-stage process
3. **Submit responses**: Data is automatically saved to your server

### **For Developers**
1. **Modify Content**: Edit `index.html` for text changes
2. **Update Styling**: Edit `styles.css` for visual changes
3. **Add Features**: Edit `script.js` for functionality changes
4. **Test Changes**: Refresh browser to see updates

## File Descriptions

### **index.html**
- Clean HTML structure without embedded styles or scripts
- Links to external CSS and JavaScript files
- Contains all survey stages and form elements

### **styles.css**
- Complete styling for all survey components
- Responsive design for mobile and desktop
- Modern glassmorphism design with gradients

### **script.js**
- All survey logic and functionality
- 19 main functions handling different survey stages
- Data processing and results calculation
- Form validation and user interactions

### **submit_response.php**
- Server-side data processing
- Saves responses as JSON and CSV files
- Error handling and validation
- Unchanged from original version

## Customization Guide

### **Changing Survey Content**
1. **Priority Categories**: Edit the `priorityCategories` object in `script.js`
2. **Survey Text**: Modify text content in `index.html`
3. **Form Fields**: Update HTML structure in `index.html`

### **Updating Design**
1. **Colors**: Modify CSS variables in `styles.css`
2. **Layout**: Adjust grid and flexbox properties
3. **Typography**: Change font families and sizes

### **Adding Features**
1. **New Survey Stages**: Add HTML structure and JavaScript functions
2. **Data Processing**: Extend the results calculation functions
3. **Validation**: Add new validation rules in JavaScript

## Technical Requirements

- **Web Server**: Any server with PHP support
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **No Database**: Uses file-based storage
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## Migration from Monolithic Version

This modular version is a complete refactor of the original single-file version:

### **What Changed**
- **File Structure**: Split 1,563-line file into 3 organized files
- **Code Organization**: Separated HTML, CSS, and JavaScript
- **Maintainability**: Much easier to modify and debug

### **What Stayed the Same**
- **Functionality**: Identical survey experience
- **Data Storage**: Same PHP backend and file structure
- **User Interface**: Identical visual design and behavior

## Deployment

1. **Upload Files**: Copy all files to your web server
2. **Set Permissions**: Ensure PHP can write to `survey_data/` folder
3. **Test**: Open `index.html` in a browser to verify functionality
4. **Share**: Send the link to community members

## Troubleshooting

### **Common Issues**
- **Styling Not Loading**: Check that `styles.css` is in the same folder as `index.html`
- **JavaScript Errors**: Check browser console for errors
- **Data Not Saving**: Verify PHP permissions and `survey_data/` folder exists

### **Browser Compatibility**
- **Chrome**: 60+ (recommended)
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Security

- **No Sensitive Data**: Only stores survey responses
- **Local Storage**: All data saved on your server
- **No External Dependencies**: Self-contained application

## Support

This modular version maintains full compatibility with the original while providing:
- **Better Organization**: Clear file structure
- **Easier Maintenance**: Separate concerns
- **Improved Performance**: Better caching and loading
- **Enhanced Development**: Easier to modify and extend

The survey functionality remains exactly the same - this is purely an organizational improvement that makes the code much more maintainable and professional.

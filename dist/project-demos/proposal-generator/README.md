# CIC Proposal Generator with Multi-User Persistence

A modern, themed proposal generator with true multi-user persistence capabilities.

## Features

- **Three Beautiful Themes**: Metal (cyberpunk), Cotton Candy (playful), and Vanilla (minimalist)
- **Dynamic Form Management**: Add/remove jurisdictions, project managers, and approaches
- **True Multi-User Persistence**: Data persists across different computers and browsers
- **Document Generation**: Generate PDF and DOCX proposals from templates
- **Fallback Support**: Works offline with localStorage if server is unavailable

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to:
```
http://localhost:3000
```

## How Multi-User Persistence Works

### Server-Based Storage
- All dynamic form options (jurisdictions, project managers, approaches) are stored on the server
- Data persists across different computers, browsers, and user sessions
- Real-time synchronization when multiple users access the form

### API Endpoints
- `GET /api/form-options` - Load all form options
- `POST /api/jurisdictions` - Add new jurisdiction
- `DELETE /api/jurisdictions/:name` - Remove jurisdiction
- `POST /api/project-managers` - Add new project manager
- `DELETE /api/project-managers/:name` - Remove project manager
- `POST /api/approaches` - Add new approach
- `DELETE /api/approaches/:name` - Remove approach

### Data Storage
- Data is stored in `form-data.json` file
- Automatic backup and recovery
- Fallback to localStorage if server is unavailable

## Theme Features

### Metal Theme (Default)
- Dark cyberpunk aesthetic
- Neon glows and animated gradients
- High-tech typography with Orbitron font

### Cotton Candy Theme
- Bright, playful colors
- Bouncy animations and soft shadows
- Friendly typography with Fredoka One and Nunito fonts

### Vanilla Theme
- Clean, minimalist design
- Muted colors and lots of whitespace
- Modern typography with Inter font

## Development

### Development Mode
```bash
npm run dev  # Uses nodemon for auto-reload
```

### File Structure
- `server.js` - Express backend server
- `app.js` - Frontend JavaScript with API integration
- `index.html` - Main form interface
- `styles.css` - Theme styling
- `form-data.json` - Persistent data storage
- `template.docx` - DOCX template for document generation

## Deployment

The application can be deployed to any Node.js hosting service:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

Make sure to set the `PORT` environment variable for production deployments.

## Testing Multi-User Persistence

1. Open the form in one browser
2. Add a custom jurisdiction, project manager, or approach
3. Open the form in a different browser or incognito mode
4. Verify the new option appears immediately
5. Test from different computers on the same network

## Content Management for Non-Technical Users

This section provides step-by-step instructions for editing the proposal form, template, and content without technical knowledge.

### Understanding the Current Template Limitations

**Important**: The current DOCX template (`template.docx`) only includes content for:
- Strategic Plan projects
- System Selection projects

**Missing Content**: The template needs additional content for:
- System Implementation projects
- Organizational Assessment projects  
- Change Management projects

### How to Add New Project Type Content

#### Step 1: Open the Template File

1. **Locate the template file** in your project folder
   - Look for a file named `template.docx`
   - This is a Microsoft Word document

2. **Open the template** in Microsoft Word
   - Double-click the file to open it
   - If prompted, choose "Enable Editing"

#### Step 2: Understand the Template Structure

The template uses **placeholder tags** that get replaced with form data. These tags look like this:
- `{clientName}` - Gets replaced with the client name from the form
- `{projectTitle}` - Gets replaced with the project title
- `{approachOne}` - Gets replaced with the selected approach

#### Step 3: Add Content for Missing Project Types

1. **Find the existing content sections** in the template
   - Look for sections that start with "Strategic Plan" or "System Selection"
   - These are the sections you need to duplicate and modify

2. **Create new sections** for each missing project type:
   - **System Implementation**
   - **Organizational Assessment** 
   - **Change Management**

3. **For each new section, include**:
   - A clear heading (e.g., "System Implementation Approach")
   - 2-3 paragraphs describing the approach
   - Key deliverables or outcomes
   - Timeline considerations
   - Any specific requirements

#### Step 4: Format the New Content Properly

1. **Use consistent formatting**:
   - Match the font size and style of existing sections
   - Use the same heading style (bold, same size)
   - Keep paragraph spacing consistent

2. **Include placeholder tags** where appropriate:
   - Use `{clientName}` if the content should reference the client
   - Use `{projectTitle}` if the content should reference the project
   - Use `{approachOne}` if the content should reference the selected approach

3. **Example formatting**:
   ```
   System Implementation Approach
   
   Our system implementation methodology ensures {clientName} receives a 
   fully functional solution tailored to {projectTitle}. We follow a 
   structured approach that includes...
   ```

#### Step 5: Save the Updated Template

1. **Save the file**:
   - Press `Ctrl+S` (Windows) or `Cmd+S` (Mac)
   - Make sure you're saving as a `.docx` file
   - Keep the same filename: `template.docx`

2. **Test the template**:
   - Close the file
   - Try generating a proposal with one of the new project types
   - Verify the new content appears correctly

### How to Update Form Options

#### Adding New Jurisdictions

1. **Open the form** in your web browser
2. **Scroll to the Jurisdiction section**
3. **Type the new jurisdiction name** in the text box
4. **Click "Type a new jurisdiction to add then click here"**
5. **The new option will appear** and be available to all users

#### Adding New Project Managers

1. **Scroll to the Project Manager section**
2. **Type the new project manager name** in the text box
3. **Click "Type a new project manager to add then click here"**
4. **The new option will appear** and be available to all users

#### Adding New Approaches

1. **Scroll to the Approach section**
2. **Type the new approach name** in the text box
3. **Click "Type a new approach to add then click here"**
4. **The new option will appear** and be available to all users

### How to Update the Help Text

1. **Open the project folder** on your computer
2. **Find the file named `index.html`**
3. **Right-click the file** and choose "Open with" → "Text Editor" (or Notepad)
4. **Find the help text section** (look for "To generate a proposal in a formatted CIC template...")
5. **Edit the text** as needed
6. **Save the file** (`Ctrl+S` or `Cmd+S`)
7. **Refresh your browser** to see the changes

### How to Deploy Updates to the Server

#### If You Have Access to the Server

1. **Upload the updated files**:
   - Upload the new `template.docx` file
   - Upload the updated `index.html` file (if you changed help text)
   - Make sure to replace the old files with the new ones

2. **Restart the server** (if needed):
   - Contact your technical administrator
   - They may need to restart the application

#### If You Don't Have Server Access

1. **Contact your technical administrator**
2. **Provide them with**:
   - The updated `template.docx` file
   - Any other files you modified
   - A clear description of what changes you made

3. **Ask them to**:
   - Upload the new files to the server
   - Restart the application if necessary
   - Test that the changes work correctly

### Testing Your Changes

#### Test the Form
1. **Open the proposal form** in your browser
2. **Try each new option** you added:
   - Test new jurisdictions
   - Test new project managers  
   - Test new approaches
3. **Generate a test proposal** to make sure everything works

#### Test the Template
1. **Fill out the form** with test data
2. **Select one of the new project types** (if you added template content)
3. **Click "Generate DOCX"**
4. **Open the downloaded file** and verify:
   - The new content appears correctly
   - The formatting looks good
   - All placeholder tags are replaced with actual data

### Common Issues and Solutions

#### Template Content Not Appearing
- **Check**: Did you save the template file correctly?
- **Check**: Are you selecting the right project type in the form?
- **Solution**: Make sure the template content matches the approach names exactly

#### New Form Options Not Saving
- **Check**: Is the server running?
- **Check**: Are you connected to the internet?
- **Solution**: Try refreshing the page and adding the option again

#### Formatting Looks Wrong
- **Check**: Did you match the existing formatting in the template?
- **Solution**: Copy the formatting from an existing section and apply it to your new content

### Getting Help

If you run into problems:
1. **Check this guide first** - most issues are covered here
2. **Contact your technical administrator** for server-related issues
3. **Test changes on a copy** of the template before updating the live version
4. **Keep backups** of working files before making changes

## Troubleshooting

### Server Not Starting
- Check if port 3000 is available
- Ensure Node.js is installed
- Run `npm install` to install dependencies

### Data Not Persisting
- Check if `form-data.json` exists and is writable
- Verify server is running on http://localhost:3000
- Check browser console for API errors

### Fallback Mode
If the server is unavailable, the form automatically falls back to localStorage mode with limited persistence (single browser only).










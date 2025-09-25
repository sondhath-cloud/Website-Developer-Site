# 🚀 SiteWorks Deployment Guide for CIC Proposal Generator

## **What You Need to Deploy**

**DO NOT just upload HTML/CSS files!** You need to deploy the **entire Node.js application** including:
- ✅ `server.js` (Node.js backend)
- ✅ `package.json` (dependencies)
- ✅ `app.js` (frontend JavaScript)
- ✅ `index.html` (main form)
- ✅ `styles.css` (styling)
- ✅ `template.docx` (document template)
- ✅ `siteworks.json` (SiteWorks config)

## **Step-by-Step SiteWorks Deployment**

### **Step 1: Create Node.js Application in SiteWorks**

1. **Log into SiteWorks Dashboard**
2. **Click "Create New Application"**
3. **Select "Node.js"** as the application type
4. **Choose your domain** (e.g., `yourdomain.com/proposal`)
5. **Set Node.js version** to **14.x or higher**

### **Step 2: Upload Your Project Files**

**Method A: Direct ZIP Upload (Recommended - Fastest)**
1. **Create a ZIP file** of your project folder (excluding `node_modules/` and backup files)
2. **Upload the ZIP file** to SiteWorks
3. **SiteWorks will automatically:**
   - Extract the files
   - Run `npm install` (detects `package.json`)
   - Start the server with `npm start`
   - **Your app will be live immediately!**

**Method B: Git Repository**
1. **Push your project to GitHub/GitLab**
2. **In SiteWorks, connect your Git repository**
3. **SiteWorks automatically handles build and deployment**

### **Step 3: Verify Deployment (Optional Configuration)**

**Environment Variables (if needed):**
```
NODE_ENV=production
PORT=3000 (SiteWorks assigns automatically)
```

**Build/Start Commands (usually auto-detected):**
- **Build Command:** `npm install` (automatic)
- **Start Command:** `npm start` (automatic)

### **Step 4: Test Your Application**

1. **Your app should be live immediately** after upload
2. **Test the main form** at your domain
3. **Test API endpoints** (e.g., `/test` endpoint)
4. **Verify multi-user features** work correctly

## **Why This Process Works So Well**

**SiteWorks Auto-Detection:**
- SiteWorks automatically detects `package.json` files
- Runs `npm install` without manual configuration
- Starts the server using the `start` script from `package.json`
- Handles port assignment automatically
- **Result: Your app goes live immediately after upload!**

**No Manual Configuration Needed:**
- Build commands are auto-detected
- Start commands are auto-detected
- Port configuration is automatic
- Environment variables are optional

## **File Structure on SiteWorks**

Your deployed application should look like this:
```
/
├── server.js          ← Main server file
├── package.json       ← Dependencies
├── siteworks.json     ← SiteWorks config
├── app.js            ← Frontend JavaScript
├── index.html        ← Main form
├── styles.css        ← Styling
├── template.docx     ← Document template
├── form-data.json    ← Data storage (auto-created)
└── node_modules/     ← Dependencies (auto-created)
```

## **Important SiteWorks Considerations**

### **Port Configuration**
- SiteWorks will assign a port automatically
- The server will use `process.env.PORT` from SiteWorks
- No need to change the code

### **Data Persistence**
- `form-data.json` will be created automatically
- Data persists between deployments
- Multiple users can access simultaneously

### **Domain Access**
- Your form will be available at: `https://yourdomain.com/proposal/`
- API endpoints: `https://yourdomain.com/proposal/api/*`
- Test endpoint: `https://yourdomain.com/proposal/test`
- All themes and functionality will work

## **Troubleshooting Common Issues**

### **Build Fails**
- Check Node.js version (must be 14+)
- Verify `package.json` has correct dependencies
- Check build logs in SiteWorks dashboard

### **App Won't Start**
- Verify start command is `npm start`
- Check environment variables
- Review error logs in SiteWorks

### **Form Not Loading**
- Ensure all files uploaded (especially `index.html`)
- Check if `server.js` is in root directory
- Verify API endpoints are accessible

## **Testing Multi-User Persistence**

After deployment:
1. **Open your form** at `https://yourdomain.com/proposal/`
2. **Add a custom jurisdiction** (e.g., "Township")
3. **Open in different browser/incognito** → Should see the new option
4. **Test from different computer** → Data should persist

## **Maintenance and Updates**

### **Updating the Application**
1. **Make changes locally**
2. **Push to Git** (if using Git deployment)
3. **Redeploy in SiteWorks**

### **Backing Up Data**
- `form-data.json` contains all user additions
- Download this file periodically for backup
- SiteWorks may also have backup options

## **Support**

If you encounter issues:
1. **Check SiteWorks build logs**
2. **Verify all files are uploaded**
3. **Test locally first** with `node server.js`
4. **Contact SiteWorks support** for hosting issues

## **Final Checklist**

Before deploying, ensure you have:
- [ ] `server.js` (Node.js backend)
- [ ] `package.json` (with all dependencies)
- [ ] `siteworks.json` (SiteWorks configuration)
- [ ] `app.js` (frontend JavaScript)
- [ ] `index.html` (main form)
- [ ] `styles.css` (styling)
- [ ] `template.docx` (document template)
- [ ] **NOT just HTML/CSS files alone**

**Remember: This is a full-stack Node.js application that needs the backend server to function!**










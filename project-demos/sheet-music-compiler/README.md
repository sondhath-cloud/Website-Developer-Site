# Sheet Music Compiler

A Python application that compiles sheet music images from a folder into a single Microsoft Word document, with review and ordering capabilities.

## Features

- Select any folder containing sheet music images
- **Review and Preview**: View all images before compiling
- **Reorder Pages**: Move images up/down to arrange in correct sequence
- **Remove Unwanted Pages**: Exclude specific images from compilation
- Automatically sorts images by their date/time metadata initially
- Creates a Word document with all images in your chosen order
- Handles various image formats (JPG, PNG, BMP, TIFF, GIF)
- Optimized for sheet music with larger image display

## Installation

1. Make sure you have Python installed on your computer
2. Open Terminal (or Command Prompt on Windows)
3. Navigate to this folder
4. Install the required packages by running:
   ```
   pip install -r requirements.txt
   ```

## How to Use

1. Run the application:
   ```
   python3 screenshot_compiler.py
   ```

2. Click "Select Folder" to choose the folder containing your sheet music images

3. Click "Review & Compile Sheet Music" to open the preview window

4. In the preview window:
   - **Navigate**: Use "Previous" and "Next" buttons to review each page
   - **Reorder**: Use "Move Up" and "Move Down" to arrange pages in correct sequence
   - **Remove**: Click "Remove from List" to exclude unwanted pages
   - **Compile**: Click "Compile Selected Images" when satisfied with the order

5. The application will:
   - Create a Word document with your arranged pages
   - Save the document to Documents/Personal/Sheet Music folder
   - Use larger image sizes optimized for sheet music

## Supported Image Formats

- JPG/JPEG
- PNG
- BMP
- TIFF
- GIF

## Notes

- The application uses image metadata (EXIF data) to determine the date/time when possible
- If no metadata is available, it uses the file's modification time
- Images are resized to fit within 6 inches width in the Word document
- Each image includes a caption showing its date and time

# Sondra Hathaway - Portfolio Website

A modern, interactive portfolio website showcasing software development projects and professional experience.

## Features

- **Interactive 3D Portfolio Carousel** - Showcase projects in an engaging 3D rotating interface
- **Animated Background** - Interactive stars background with smooth animations
- **Responsive Design** - Optimized for all device sizes
- **Contact Form** - PHP-powered contact form with validation
- **Project Demos** - Live demonstrations of various web applications

## Project Structure

```
├── dist/                    # Production-ready files
│   ├── index.html          # Main portfolio page
│   ├── styles.css          # Main stylesheet
│   ├── script.js           # Main JavaScript
│   ├── contact.php         # Contact form handler
│   └── project-demos/      # Individual project demonstrations
├── project-demos/          # Source files for project demos
└── README.md              # This file
```

## Project Demos

The portfolio includes several interactive project demonstrations:

1. **Community Priority Survey** - Data collection system with Bradley-Terry scoring
2. **Development Impact Calculator** - Business impact assessment tool
3. **Professional Metronome** - Advanced metronome with voice commands
4. **Stakeholder Impact Tool** - Interactive stakeholder analysis
5. **Project Management Form** - Comprehensive data collection system
6. **CIC Proposal Generator** - Multi-user proposal generation system
7. **ResultsMode App** - Organizational management system
8. **Arielle Pivonka Art Website** - Professional artist portfolio
9. **Team Orbit Animation** - Interactive team showcase

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- PHP for server-side functionality
- MySQL for data storage
- Supabase for real-time database features
- Web Audio API for audio applications
- Canvas and WebGL for visual effects

## Local Development

1. Clone the repository
2. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000` in your browser

## Deployment

The `dist/` folder contains all files ready for deployment to any web hosting service.

## License

This project is open source and available under the MIT License.

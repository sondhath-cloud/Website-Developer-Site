# Stakeholder Impact Identification Tool

An interactive, gamified tool for identifying and analyzing stakeholders who will be impacted by project changes. Features floating avatar selection and flip-card data entry with Supabase integration for data persistence.

## Features

- **Interactive Avatar Selection**: Click on floating, animated avatars representing different stakeholder roles
- **Flip Card Interface**: Beautiful Pokemon-style cards that flip to reveal stakeholder information forms
- **Gamification**: Progress tracking, completion celebration with confetti, and visual feedback
- **Data Persistence**: Supabase integration for cloud storage with localStorage fallback
- **Responsive Design**: Works on desktop and mobile devices
- **Export Functionality**: Export stakeholder data as JSON

## Quick Start

1. **Open the tool**: Simply open `index.html` in your web browser
2. **Start identifying stakeholders**: Click on any avatar to begin
3. **Fill in details**: Click the card to flip it and enter stakeholder information
4. **Track progress**: Watch your progress bar fill as you complete stakeholders
5. **Export results**: Download your completed stakeholder analysis

## Supabase Setup (Optional)

For data persistence across sessions, set up Supabase:

1. Follow the instructions in `supabase-setup.md`
2. Update `config.js` with your Supabase credentials
3. The tool will automatically use Supabase for data storage

Without Supabase, the tool will use localStorage (data persists only in your current browser).

## File Structure

```
├── index.html              # Main HTML file
├── style.css              # All styling (combines floating personas + card styles)
├── script.js              # Interactive functionality and Supabase integration
├── config.js              # Configuration file for Supabase credentials
├── supabase-setup.md      # Detailed Supabase setup instructions
└── README.md              # This file
```

## How It Works

1. **Avatar Selection**: 12 different stakeholder roles with unique avatars and animations
2. **Card Interaction**: Click an avatar to open a flip card modal
3. **Data Entry**: Click the card to flip it and fill in stakeholder details
4. **Progress Tracking**: Visual progress bar shows completion status
5. **Data Storage**: Information is saved to Supabase (or localStorage)
6. **Results Display**: Completed stakeholders are shown in a results grid
7. **Completion Celebration**: Confetti animation when all stakeholders are identified

## Stakeholder Roles Included

- CISO (Chief Information Security Officer)
- Engineer
- Hunter
- Investigator
- Manager
- Analyst
- Developer
- Admin
- Architect
- Forensics
- IR (Incident Response)
- Support

## Data Fields Collected

- **Name/Group Name**: Stakeholder or group identifier
- **Department**: Organizational department
- **Impact Level**: Low, Medium, High, or Critical
- **Key Concerns**: Main concerns about project changes
- **Communication Preference**: How they prefer to be contacted
- **Project Phase Impact**: Which project phase affects them most

## Customization

### Adding New Stakeholder Roles

1. Add new avatar HTML in `index.html`:
```html
<div class="img-wrap" data-role="NewRole" data-selected="false">
    <img src='https://avataaars.io/?...' />
</div>
```

2. Update the total count in `config.js`:
```javascript
TOTAL_STAKEHOLDERS: 13, // Increase by 1
```

### Styling Changes

All styles are in `style.css`. Key sections:
- `.img-wrap` - Avatar styling and animations
- `.card` - Flip card styling
- `.form-container` - Form styling
- `.results-grid` - Results display

### Adding New Form Fields

1. Add the field to the HTML form in `index.html`
2. Update the JavaScript form handling in `script.js`
3. Update the results display template
4. Update the Supabase table schema (if using Supabase)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Data Not Saving
- Check browser console for errors
- Verify Supabase credentials in `config.js`
- Check if localStorage is enabled

### Avatars Not Animating
- Ensure CSS animations are supported
- Check for JavaScript errors in console

### Card Not Flipping
- Verify click events are working
- Check for CSS transform support

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the same directory
3. Ensure JavaScript is enabled in your browser
4. Check the Supabase setup guide if using cloud storage

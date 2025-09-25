// Configuration file for Stakeholder Impact Tool
// Update these values with your Supabase credentials

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'YOUR_SUPABASE_URL', // Replace with your Supabase project URL
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
    
    // App Configuration
    TOTAL_STAKEHOLDERS: 12,
    DEFAULT_IMPACT_LEVEL: 'High',
    DEFAULT_PROJECT_PHASE: 'TBD',
    
    // UI Configuration
    ANIMATION_DURATION: 1000, // Card flip animation duration in ms
    SUCCESS_MESSAGE_DURATION: 3000, // Success message display duration in ms
    CONFETTI_COUNT: 50, // Number of confetti pieces for completion celebration
};

// Make config available globally
window.CONFIG = CONFIG;

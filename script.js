// Portfolio Website JavaScript
// Modern, interactive functionality with smooth animations

// Test video loading
function testVideoLoading() {
    const inkVideo = document.getElementById('ink-video');
    const cloudsVideo = document.getElementById('clouds-video');
    
    console.log('Testing video elements:');
    console.log('Ink video:', inkVideo);
    console.log('Clouds video:', cloudsVideo);
    
    if (cloudsVideo) {
        cloudsVideo.addEventListener('loadeddata', () => {
            console.log('Clouds video loaded successfully');
        });
        cloudsVideo.addEventListener('error', (e) => {
            console.error('Clouds video error:', e);
        });
    }
}

// Add test to page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initBlendModeNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initParallaxEffects();
    initTypingEffect();
    initPageSpecificBackgrounds();
    initSubscriptionForm();
    testVideoLoading();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Only initialize if elements exist (not on blend-mode pages)
    if (hamburger && navMenu) {
        // Mobile menu toggle
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    if (navLinks.length > 0 && hamburger && navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Blend Mode Navigation functionality
function initBlendModeNavigation() {
    // Only initialize if blend mode navigation elements exist
    const navBtn = document.getElementById('nav-btn');
    const takeoverNav = document.getElementById('takeover-nav');
    const stickyNav = document.querySelector('.sticky-nav');
    
    if (!navBtn || !takeoverNav || !stickyNav) {
        return; // Exit if blend mode navigation doesn't exist
    }

    // Navigation toggle functionality
    $(navBtn).on("click", function() {
        $(takeoverNav).toggleClass("shown");
        $(stickyNav).toggleClass("difference");
    });

    // Hamburger animation variables
    var icon_1 = navBtn;
    var topLine_1 = document.getElementById("top-line-1");
    var middleLine_1 = document.getElementById("middle-line-1");
    var bottomLine_1 = document.getElementById("bottom-line-1");
    var state_1 = "menu";  // can be "menu" or "arrow"
    var topLineY_1;
    var middleLineY_1;
    var bottomLineY_1;
    var topLeftY_1;
    var topRightY_1;
    var bottomLeftY_1;
    var bottomRightY_1;
    var topLeftX_1;
    var topRightX_1;
    var bottomLeftX_1;
    var bottomRightX_1;

    // Animation variables
    var segmentDuration_1 = 15;
    var menuDisappearDurationInFrames_1 = segmentDuration_1;
    var arrowAppearDurationInFrames_1 = segmentDuration_1;
    var arrowDisappearDurationInFrames_1 = segmentDuration_1;
    var menuAppearDurationInFrames_1 = segmentDuration_1;
    var menuDisappearComplete_1 = false;
    var arrowAppearComplete_1 = false;
    var arrowDisappearComplete_1 = false;
    var menuAppearComplete_1 = false;
    var currentFrame_1 = 1;

    // Menu Disappear Animation
    function menuDisappearAnimation_1() {
        currentFrame_1++;
        if ( currentFrame_1 <= menuDisappearDurationInFrames_1 ) {
            window.requestAnimationFrame( ()=> { 
                //top line
                topLineY_1 = AJS.easeInBack( 37, 50, menuDisappearDurationInFrames_1, currentFrame_1 );
                topLine_1.setAttribute( "d", "M30,"+topLineY_1+" L70,"+topLineY_1 );
                //bottom line
                bottomLineY_1 = AJS.easeInBack( 63, 50, menuDisappearDurationInFrames_1, currentFrame_1 );
                bottomLine_1.setAttribute( "d", "M30,"+bottomLineY_1+" L70,"+bottomLineY_1 );
                //recursion
                menuDisappearAnimation_1();
            });
        } else {
            middleLine_1.style.opacity = "0";
            currentFrame_1 = 1;
            menuDisappearComplete_1 = true;
            openMenuAnimation_1();
        }
    }

    // Cross Appear Animation
    function arrowAppearAnimation_1() {
        currentFrame_1++;
        if ( currentFrame_1 <= arrowAppearDurationInFrames_1 ) {
            window.requestAnimationFrame( ()=> { 
                //top line
                topLeftX_1 = AJS.easeOutBack( 30, 35, arrowAppearDurationInFrames_1, currentFrame_1 );
                topLeftY_1 = AJS.easeOutBack( 50, 35, arrowAppearDurationInFrames_1, currentFrame_1 );
                bottomRightX_1 = AJS.easeOutBack( 70, 65, arrowAppearDurationInFrames_1, currentFrame_1 );
                bottomRightY_1 = AJS.easeOutBack( 50, 65, arrowAppearDurationInFrames_1, currentFrame_1 );
                topLine_1.setAttribute( "d", "M" + topLeftX_1 + "," + topLeftY_1 + " L" + bottomRightX_1 + "," + bottomRightY_1 );
                //bottom line
                bottomLeftX_1 = AJS.easeOutBack( 30, 35, arrowAppearDurationInFrames_1, currentFrame_1 );
                bottomLeftY_1 = AJS.easeOutBack( 50, 65, arrowAppearDurationInFrames_1, currentFrame_1 );
                topRightX_1 = AJS.easeOutBack( 70, 65, arrowAppearDurationInFrames_1, currentFrame_1 );
                topRightY_1 = AJS.easeOutBack( 50, 35, arrowAppearDurationInFrames_1, currentFrame_1 );
                bottomLine_1.setAttribute( "d", "M" + bottomLeftX_1 + "," + bottomLeftY_1 + " L" + topRightX_1 + "," + topRightY_1 );
                //recursion
                arrowAppearAnimation_1();
            });
        } else {
            currentFrame_1 = 1;
            arrowAppearComplete_1 = true;
            openMenuAnimation_1();
        }
    }

    // Combined Open Menu Animation
    function openMenuAnimation_1() {
        if ( !menuDisappearComplete_1 ) { 
            menuDisappearAnimation_1();
        } else if ( !arrowAppearComplete_1) {
            arrowAppearAnimation_1();
        }
    }

    // Cross Disappear Animation
    function arrowDisappearAnimation_1() {
        currentFrame_1++;
        if ( currentFrame_1 <= arrowDisappearDurationInFrames_1 ) {
            window.requestAnimationFrame( ()=> {
                //top line
                topLeftX_1 = AJS.easeInBack( 35, 30, arrowDisappearDurationInFrames_1, currentFrame_1 );
                topLeftY_1 = AJS.easeInBack( 35, 50, arrowDisappearDurationInFrames_1, currentFrame_1 );
                bottomRightX_1 = AJS.easeInBack( 65, 70, arrowDisappearDurationInFrames_1, currentFrame_1 );
                bottomRightY_1 = AJS.easeInBack( 65, 50, arrowDisappearDurationInFrames_1, currentFrame_1 );
                topLine_1.setAttribute( "d", "M" + topLeftX_1 + "," + topLeftY_1 + " L" + bottomRightX_1 + "," + bottomRightY_1 );
                //bottom line
                bottomLeftX_1 = AJS.easeInBack( 35, 30, arrowDisappearDurationInFrames_1, currentFrame_1 );
                bottomLeftY_1 = AJS.easeInBack( 65, 50, arrowDisappearDurationInFrames_1, currentFrame_1 );
                topRightX_1 = AJS.easeInBack( 65, 70, arrowDisappearDurationInFrames_1, currentFrame_1 );
                topRightY_1 = AJS.easeInBack( 35, 50, arrowDisappearDurationInFrames_1, currentFrame_1 );
                bottomLine_1.setAttribute( "d", "M" + bottomLeftX_1 + "," + bottomLeftY_1 + " L" + topRightX_1 + "," + topRightY_1 );
                //recursion
                arrowDisappearAnimation_1();
            });
        } else {
            middleLine_1.style.opacity = "1";
            currentFrame_1 = 1;
            arrowDisappearComplete_1 = true;
            closeMenuAnimation_1();
        }
    }

    // Menu Appear Animation
    function menuAppearAnimation_1() {
        currentFrame_1++;
        if ( currentFrame_1 <= menuAppearDurationInFrames_1 ) {
            window.requestAnimationFrame( ()=> {
                //top line
                topLineY_1 = AJS.easeOutBack( 50, 37, menuDisappearDurationInFrames_1, currentFrame_1 );
                topLine_1.setAttribute( "d", "M30,"+topLineY_1+" L70,"+topLineY_1 );
                //bottom line
                bottomLineY_1 = AJS.easeOutBack( 50, 63, menuDisappearDurationInFrames_1, currentFrame_1 );
                bottomLine_1.setAttribute( "d", "M30,"+bottomLineY_1+" L70,"+bottomLineY_1 );
                //recursion
                menuAppearAnimation_1();
            });
        } else {
            currentFrame_1 = 1;
            menuAppearComplete_1 = true;
            closeMenuAnimation_1();
        }
    }

    // Close Menu Animation
    function closeMenuAnimation_1() {
        if ( !arrowDisappearComplete_1 ) {
            arrowDisappearAnimation_1();
        } else if ( !menuAppearComplete_1 ) {
            menuAppearAnimation_1();
        }
    }

    // Event Listeners
    icon_1.addEventListener( "click", ()=> { 
        if ( state_1 === "menu" ) {
            openMenuAnimation_1();
            state_1 = "arrow";
            arrowDisappearComplete_1 = false;
            menuAppearComplete_1 = false;
        } else if ( state_1 === "arrow" ) {
            closeMenuAnimation_1();
            state_1 = "menu";
            menuDisappearComplete_1 = false;
            arrowAppearComplete_1 = false;
        }
    });

    // Custom cursor functionality
    var cursor = document.querySelector(".custom-cursor");
    if (cursor) {
        var links = document.querySelectorAll("a, button, #nav-btn, input.btn");
        var initCursor = false;

        for (var i = 0; i < links.length; i++) {
            var selfLink = links[i];

            selfLink.addEventListener("mouseover", function() {
                cursor.classList.add("custom-cursor--link");
            });
            selfLink.addEventListener("mouseout", function() {
                cursor.classList.remove("custom-cursor--link");
            });
        }

        window.onmousemove = function(e) {
            var mouseX = e.clientX;
            var mouseY = e.clientY;

            if (!initCursor) {
                TweenLite.to(cursor, 0.5, {
                    opacity: 1
                });
                initCursor = true;
            }

            TweenLite.to(cursor, 0, {
                top: mouseY + "px",
                left: mouseX + "px"
            });
        };
        
        window.ontouchmove = function(e) {
            var mouseX = e.touches[0].clientX;
            var mouseY = e.touches[0].clientY;
            if (!initCursor) {
                TweenLite.to(cursor, 0.3, {
                    opacity: 1
                });
                initCursor = true;
            }

            TweenLite.to(cursor, 0, {
                top: mouseY + "px",
                left: mouseX + "px"
            });
        };

        window.onmouseout = function(e) {
            TweenLite.to(cursor, 0.3, {
                opacity: 0
            });
            initCursor = false;
        };

        window.ontouchstart = function(e) {
            TweenLite.to(cursor, 0.3, {
                opacity: 1
            });
        };
        
        window.ontouchend = function(e) {
            setTimeout( function() {
                TweenLite.to(cursor, 0.3, {
                    opacity: 0
                });
            }, 200);   
        };
    }
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .stat-item, .portfolio-item, .skill-category, .contact-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Staggered animation for portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}



// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Get CSRF token on page load
        fetchCSRFToken();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors and status
            clearFormErrors();
            clearFormStatus();
            
            // Get form data
            const formData = new FormData(this);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Submit form to PHP
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Success
                    this.reset();
                    showFormStatus(data.message, 'success');
                    showNotification(data.message, 'success');
                } else {
                    // Show errors
                    if (data.errors) {
                        showFormErrors(data.errors);
                    }
                    showFormStatus(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Get CSRF token from server
function fetchCSRFToken() {
    fetch('contact.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }
            return response.json();
        })
        .then(data => {
            if (data.csrf_token) {
                const csrfElement = document.getElementById('csrf_token');
                if (csrfElement) {
                    csrfElement.value = data.csrf_token;
                }
            }
        })
        .catch(error => {
            console.error('CSRF token fetch error:', error);
            // Don't show error to user, just log it
        });
}

// Show form errors
function showFormErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`error-${field}`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.classList.add('show');
        }
    });
}

// Clear form errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// Show form status message
function showFormStatus(message, type) {
    const statusElement = document.getElementById('form-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `form-status ${type} show`;
    }
}

// Clear form status
function clearFormStatus() {
    const statusElement = document.getElementById('form-status');
    if (statusElement) {
        statusElement.textContent = '';
        statusElement.className = 'form-status';
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effects for hero section and floating cards
function initParallaxEffects() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${rate * speed}px)`;
        });
        
        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.05;
            card.style.transform = `translateY(${rate * speed}px)`;
        });
        
    });
    
}

// Typing effect for hero title
function initTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            typeText(line, text, 50);
        }, index * 200);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        background: type === 'success' ? 'linear-gradient(135deg, #00ff88, #00d4ff)' : 'linear-gradient(135deg, #ff6b9d, #ff8c42)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mouse cursor effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Style the cursor
    Object.assign(cursor.style, {
        position: 'fixed',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'transform 0.1s ease',
        opacity: '0.8'
    });
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Initialize cursor effects (optional - can be enabled)
// initCursorEffects();




// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-based animations and effects
}, 16)); // ~60fps

// Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add any critical image URLs here
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
preloadImages();

// Error handling for failed animations
window.addEventListener('error', function(e) {
    console.warn('Animation error:', e.message);
});


// Console welcome message
console.log(`
🚀 Portfolio Website Loaded Successfully!

Built with:
✨ Modern CSS with Glassmorphism
🎨 Smooth Animations & Interactions  
📱 Responsive Design
♿ Accessibility Features
⚡ Performance Optimized

Created with ❤️ for modern web development
`);

// Page-Specific Background System
function initPageSpecificBackgrounds() {
    const currentPage = getCurrentPage();
    console.log('Current page detected:', currentPage);
    
    switch(currentPage) {
        case 'homepage':
            console.log('Initializing video background for homepage');
            initVideoBackground();
            break;
        case 'website':
            console.log('Initializing constellation background for website page');
            initInteractiveStars();
            break;
        case 'hosting':
            console.log('Initializing clouds video background for hosting page');
            initMatrixBackground();
            break;
        case 'contact':
            console.log('Initializing self-reflection background for contact page');
            initParticleBackground();
            break;
        default:
            console.log('Using default constellation background');
            initInteractiveStars(); // Default fallback
    }
}

// Detect current page
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || filename === '' || path.endsWith('/')) {
        return 'homepage';
    } else if (filename === 'website-request.html') {
        return 'website';
    } else if (filename === 'hosting.html') {
        return 'hosting';
    } else if (filename === 'contact.html') {
        return 'contact';
    } else if (path.includes('demos/')) {
        return 'website'; // Demos page uses constellation
    }
    
    return 'website'; // Default fallback
}

// Video Background with Fade-out Effect (Homepage only)
function initVideoBackground() {
    const video = document.getElementById('ink-video');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (!video || !videoOverlay) {
        console.log('Video background elements not found');
        return;
    }
    
    console.log('Initializing ink spill video background...');
    
    // When video ends, fade out video and fade in solid background
    video.addEventListener('ended', function() {
        console.log('Video ended, starting fade transition...');
        
        // Fade out the video
        video.classList.add('fade-out');
        
        // Fade in the solid background overlay
        videoOverlay.classList.add('fade-in');
    });
    
    // Handle video loading errors
    video.addEventListener('error', function(e) {
        console.error('Video failed to load:', e);
        // Fallback to solid background
        videoOverlay.classList.add('fade-in');
    });
    
    // Ensure video plays
    video.play().catch(error => {
        console.error('Video autoplay failed:', error);
        // Fallback to solid background
        videoOverlay.classList.add('fade-in');
    });
}

// Clouds Video Background (Hosting page)
function initMatrixBackground() {
    const video = document.getElementById('clouds-video');
    const videoOverlay = document.querySelector('.video-overlay');
    
    console.log('Looking for clouds video elements...');
    console.log('Video element:', video);
    console.log('Video overlay:', videoOverlay);
    
    if (!video || !videoOverlay) {
        console.log('Clouds video background elements not found');
        return;
    }
    
    console.log('Initializing clouds video background...');
    
    // When video ends, fade out video and fade in solid background
    video.addEventListener('ended', function() {
        console.log('Clouds video ended, starting fade transition...');
        
        // Fade out the video
        video.classList.add('fade-out');
        
        // Fade in the solid background overlay
        videoOverlay.classList.add('fade-in');
    });
    
    // Handle video loading errors
    video.addEventListener('error', function(e) {
        console.error('Clouds video failed to load:', e);
        // Fallback to solid background
        videoOverlay.classList.add('fade-in');
    });
    
    // Ensure video plays
    video.play().catch(error => {
        console.error('Clouds video autoplay failed:', error);
        // Fallback to solid background
        videoOverlay.classList.add('fade-in');
    });
    
    // Add debugging for video visibility
    video.addEventListener('loadeddata', () => {
        console.log('Clouds video data loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
    });
    
    video.addEventListener('playing', () => {
        console.log('Clouds video is now playing');
    });
    
    video.addEventListener('pause', () => {
        console.log('Clouds video paused');
    });
    
    // Force video to be visible
    video.style.opacity = '1';
    video.style.display = 'block';
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.zIndex = '1';
}

// Particle Background (Contact page) - Self-Reflection Component
function initParticleBackground() {
    console.log('Initializing self-reflection background for contact page...');
    // The self-reflection component will initialize automatically via its own script
}

// Interactive Stars Background for Website and Demos pages
function initInteractiveStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) {
        console.log('Stars canvas not found');
        return;
    }
    console.log('Initializing constellation for entire website...');
    
    const ctx = canvas.getContext('2d');
    let WIDTH, HEIGHT;
    let mouseMoving = false;
    let mouseMoveChecker;
    let mouseX, mouseY;
    let stars = [];
    let dots = [];
    const initStarsPopulation = 100; // Increased for full website coverage
    const dotsMinDist = 8; // Increased from 2 to 8 for wider spread
    
    // Star constructor
    function Star(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 2) + 1;
        const alpha = (Math.floor(Math.random() * 10) + 1) / 10 * 0.75; // Increased brightness from /2 to *0.75
        this.color = "rgba(255,255,255," + alpha + ")";
    }

    Star.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 4; // Increased glow from *2 to *4
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    Star.prototype.move = function() {
        this.y -= 0.05; // Slowed down from 0.15 to 0.05
        if (this.y <= -10) this.y = HEIGHT + 10;
        this.draw();
    }

    // Dot constructor
    function Dot(id, x, y, r) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 5) + 1;
        this.maxLinks = 2;
        this.speed = 0.5;
        this.a = 0.75; // Increased from 0.5 to 0.75 for brighter dots
        this.aReduction = 0.005;
        this.color = "rgba(255,255,255," + this.a + ")";
        this.linkColor = "rgba(255,255,255," + this.a / 3 + ")"; // Increased from /4 to /3 for brighter links
        this.dir = Math.floor(Math.random() * 140) + 200;
    }

    Dot.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 3; // Increased glow from *2 to *3
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    Dot.prototype.link = function() {
        if (this.id == 0) return;
        const previousDot1 = getPreviousDot(this.id, 1);
        const previousDot2 = getPreviousDot(this.id, 2);
        const previousDot3 = getPreviousDot(this.id, 3);
        if (!previousDot1) return;
        ctx.strokeStyle = this.linkColor;
        ctx.moveTo(previousDot1.x, previousDot1.y);
        ctx.beginPath();
        ctx.lineTo(this.x, this.y);
        if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
        if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
        ctx.stroke();
        ctx.closePath();
    }

    Dot.prototype.move = function() {
        this.a -= this.aReduction;
        if (this.a <= 0) {
            this.die();
            return;
        }
        this.color = "rgba(255,255,255," + this.a + ")";
        this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";
        this.x = this.x + Math.cos(degToRad(this.dir)) * (this.speed * 0.5); // Slowed down dots movement
        this.y = this.y + Math.sin(degToRad(this.dir)) * (this.speed * 0.5); // Slowed down dots movement
        this.draw();
        this.link();
    }

    Dot.prototype.die = function() {
        dots[this.id] = null;
        delete dots[this.id];
    }

    function getPreviousDot(id, stepback) {
        if (id == 0 || id - stepback < 0) return false;
        if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
        else return false;
    }

    function degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    function setCanvasSize() {
        // Set canvas to cover entire viewport
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.width = WIDTH + 'px';
        canvas.style.height = HEIGHT + 'px';
        
        console.log(`Canvas resized to: ${WIDTH}x${HEIGHT}`);
    }

    function init() {
        ctx.strokeStyle = "white";
        ctx.shadowColor = "white";
        for (let i = 0; i < initStarsPopulation; i++) {
            stars[i] = new Star(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
        }
        ctx.shadowBlur = 0;
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let i in stars) {
            stars[i].move();
        }
        for (let i in dots) {
            dots[i].move();
        }
        drawIfMouseMoving();
        requestAnimationFrame(animate);
    }

    function drawIfMouseMoving() {
        if (!mouseMoving) return;

        if (dots.length == 0) {
            dots[0] = new Dot(0, mouseX, mouseY);
            dots[0].draw();
            return;
        }

        const previousDot = getPreviousDot(dots.length, 1);
        const prevX = previousDot.x;
        const prevY = previousDot.y;

        const diffX = Math.abs(prevX - mouseX);
        const diffY = Math.abs(prevY - mouseY);

        if (diffX < dotsMinDist || diffY < dotsMinDist) return;

        const xVariation = Math.random() > 0.5 ? -1 : 1;
        const xVariationAmount = xVariation * Math.floor(Math.random() * 120) + 20; // Increased from 50 to 120, minimum 20
        const yVariation = Math.random() > 0.5 ? -1 : 1;
        const yVariationAmount = yVariation * Math.floor(Math.random() * 120) + 20; // Increased from 50 to 120, minimum 20
        dots[dots.length] = new Dot(dots.length, mouseX + xVariationAmount, mouseY + yVariationAmount);
        dots[dots.length - 1].draw();
        dots[dots.length - 1].link();
    }

    // Mouse event handlers for full-screen canvas
    window.addEventListener('mousemove', function(e) {
        mouseMoving = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        clearTimeout(mouseMoveChecker);
        mouseMoveChecker = setTimeout(function() {
            mouseMoving = false;
        }, 100);
    });

    // Initialize
    setCanvasSize();
    init();

    // Resize handler
    window.addEventListener('resize', function() {
        setCanvasSize();
        // Reinitialize stars for new canvas size
        stars = [];
        dots = [];
        init();
    });

    // Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Pause animation when not visible
                cancelAnimationFrame(window.starsAnimationId);
            } else {
                // Resume animation when visible
                animate();
            }
        });
    });

    observer.observe(canvas);
}

// Space Time Anomaly Animation - Exact Replication
function initSpaceTimeAnomaly() {
    const canvas = document.getElementById('anomaly-canvas');
    const toggleBtn = document.getElementById('anomaly-toggle');
    const resetBtn = document.getElementById('anomaly-reset');
    
    if (!canvas) return;
    
    let gl, program, animationId, isPlaying = true;
    let time = 0;
    let mouseMove = [0, 0];
    let mouseCoords = [0, 0];
    let pointers = new Map();
    let lastCoords = [0, 0];
    let moves = [0, 0];
    let active = false;
    
    // WebGL setup with exact original shader
    function initWebGL() {
        gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) {
            console.warn('WebGL not supported');
            return false;
        }
        
        // Original vertex shader
        const vertexShaderSource = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
        
        // EXACT original fragment shader from space-time-anomaly
        const fragmentShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 move;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define N normalize
#define S smoothstep
#define MN min(R.x,R.y)
#define rot(a) mat2(cos((a)-vec4(0,11,33,0)))
#define csqr(a) vec2(a.x*a.x-a.y*a.y,2.*a.x*a.y)
float rnd(vec3 p) {
	p=fract(p*vec3(12.9898,78.233,156.34));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y*p.z);
}
float swirls(in vec3 p) {
	float d=.0;
	vec3 c=p;
	for(float i=min(.0,time); i<9.; i++) {
		p=.7*abs(p)/dot(p,p)-.7;
		p.yz=csqr(p.yz);
		p=p.zxy;
		d+=exp(-19.*abs(dot(p,c)));
	}
	return d;
}
vec3 march(in vec3 p, vec3 rd) {
	float d=.2, t=.0, c=.0, k=mix(.9,1.,rnd(rd)),
	maxd=length(p)-1.;
	vec3 col=vec3(0);
	for(float i=min(.0,time); i<120.; i++) {
		t+=d*exp(-2.*c)*k;
		c=swirls(p+rd*t);
		if (t<5e-2 || t>maxd) break;
		col+=vec3(c*c,c/1.05,c)*8e-3;
	}
	return col;
}
float rnd(vec2 p) {
	p=fract(p*vec2(12.9898,78.233));
	p+=dot(p,p+34.56);
	return fract(p.x*p.y);
}
vec3 sky(vec2 p, bool anim) {
	p.x-=.17-(anim?2e-4*T:.0);
	p*=500.;
	vec2 id=floor(p), gv=fract(p)-.5;
	float n=rnd(id), d=length(gv);
	if (n<.975) return vec3(0);
	return vec3(S(3e-2*n,1e-3*n,d*d));
}
void cam(inout vec3 p) {
	p.yz*=rot(move.y*6.3/MN-T*.05);
	p.xz*=rot(-move.x*6.3/MN+T*.025);
}
void main() {
	vec2 uv=(FC-.5*R)/MN;
	vec3 col=vec3(0),
	p=vec3(0,0,-16),
	rd=N(vec3(uv,1)), rdd=rd;
	cam(p); cam(rd);
	col=march(p,rd);
	col=S(-.2,.9,col);
	vec2 sn=.5+vec2(atan(rdd.x,rdd.z),atan(length(rdd.xz),rdd.y))/6.28318;
	col=max(col,vec3(sky(sn,true)+sky(2.+sn*2.,true)));
	float t=min((time-.5)*.3,1.);
	uv=FC/R*2.-1.;
	uv*=.7;
	float v=pow(dot(uv,uv),1.8);
	col=mix(col,vec3(0),v);
	col=mix(vec3(0),col,t);
	col=max(col,.08);
  O=vec4(col,1);
}`;
        
        // Compile shader
        function createShader(type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
        
        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        if (!vertexShader || !fragmentShader) return false;
        
        // Create program
        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return false;
        }
        
        // Create quad vertices
        const vertices = new Float32Array([
            -1, 1, -1, -1, 1, 1, 1, -1
        ]);
        
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        
        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        // Get uniform locations
        program.resolution = gl.getUniformLocation(program, "resolution");
        program.time = gl.getUniformLocation(program, "time");
        program.move = gl.getUniformLocation(program, "move");
        
        return true;
    }
    
    // Resize canvas
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        if (gl) {
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }
    
    // Pointer handling (exact replication)
    function handlePointerDown(e) {
        active = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top);
        pointers.set(e.pointerId || 0, [x * window.devicePixelRatio, y * window.devicePixelRatio]);
    }
    
    function handlePointerUp(e) {
        if (pointers.size === 1) {
            lastCoords = [e.clientX, e.clientY];
        }
        pointers.delete(e.pointerId || 0);
        active = pointers.size > 0;
    }
    
    function handlePointerMove(e) {
        if (!active) return;
        lastCoords = [e.clientX, e.clientY];
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top);
        pointers.set(e.pointerId || 0, [x * window.devicePixelRatio, y * window.devicePixelRatio]);
        moves = [moves[0] + e.movementX, moves[1] + e.movementY];
    }
    
    // Animation loop (exact replication)
    function animate(now = 0) {
        if (!isPlaying) return;
        
        time = now * 1e-3;
        
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.getParameter(gl.ARRAY_BUFFER_BINDING));
        
        gl.uniform2f(program.resolution, canvas.width, canvas.height);
        gl.uniform1f(program.time, time);
        gl.uniform2f(program.move, ...moves);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Control functions
    function toggleAnimation() {
        isPlaying = !isPlaying;
        toggleBtn.textContent = isPlaying ? 'Pause' : 'Play';
        
        if (isPlaying) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    }
    
    function resetAnimation() {
        time = 0;
        moves = [0, 0];
        pointers.clear();
        active = false;
    }
    
    // Initialize
    if (initWebGL()) {
        resizeCanvas();
        
        // Event listeners (exact replication)
        window.addEventListener('resize', resizeCanvas);
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerleave', handlePointerUp);
        toggleBtn.addEventListener('click', toggleAnimation);
        resetBtn.addEventListener('click', resetAnimation);
        
        // Start animation
        animate();
        
        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isPlaying) {
                        isPlaying = true;
                        toggleBtn.textContent = 'Pause';
                        animate();
                    }
                } else {
                    if (isPlaying) {
                        isPlaying = false;
                        toggleBtn.textContent = 'Play';
                        cancelAnimationFrame(animationId);
                    }
                }
            });
        });
        
        observer.observe(canvas);
    }
}



// Subscription form functionality
function initSubscriptionForm() {
    const pricingButtons = document.querySelectorAll('[data-plan]');
    const subscriptionFormContainer = document.getElementById('subscription-form-container');
    const subscriptionForm = document.getElementById('subscription-form');
    const planTypeInput = document.getElementById('plan-type-input');
    const selectedPlanDisplay = document.getElementById('selected-plan-display');
    
    // Handle pricing button clicks
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');
            const planName = planType === 'monthly' ? 'Monthly Plan ($29/month)' : 'Yearly Plan ($299/year)';
            
            // Set the plan type
            planTypeInput.value = planType;
            selectedPlanDisplay.textContent = `Selected: ${planName}`;
            
            // Show the subscription form
            subscriptionFormContainer.style.display = 'block';
            
            // Scroll to the form
            subscriptionFormContainer.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        });
    });
    
    // Handle subscription form submission
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors and status
            clearSubscriptionErrors();
            clearSubscriptionStatus();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const planType = formData.get('plan_type');
            
            // Validate form
            if (!name || !email || !planType) {
                showSubscriptionStatus('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('#subscribe-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;
            
            // Step 1: Create customer
            createCustomer(name, email)
                .then(customerData => {
                    if (customerData.success) {
                        // Step 2: Create subscription checkout session
                        return createSubscription(customerData.customer_id, planType);
                    } else {
                        throw new Error(customerData.message);
                    }
                })
                .then(subscriptionData => {
                    if (subscriptionData.success) {
                        // Redirect to Stripe checkout
                        window.location.href = subscriptionData.checkout_url;
                    } else {
                        throw new Error(subscriptionData.message);
                    }
                })
                .catch(error => {
                    console.error('Subscription error:', error);
                    showSubscriptionStatus('Sorry, there was an error processing your subscription. Please try again.', 'error');
                })
                .finally(() => {
                    // Reset button
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                });
        });
    }
}

// Create customer in Stripe
function createCustomer(name, email) {
    return fetch('api/create-customer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Customer creation error:', error);
        return { success: false, message: 'Failed to create customer' };
    });
}

// Create subscription checkout session
function createSubscription(customerId, planType) {
    return fetch('api/create-subscription.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customer_id: customerId,
            plan_type: planType
        })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Subscription creation error:', error);
        return { success: false, message: 'Failed to create subscription' };
    });
}

// Show subscription form errors
function showSubscriptionErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`error-${field}-sub`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.classList.add('show');
        }
    });
}

// Clear subscription form errors
function clearSubscriptionErrors() {
    const errorElements = document.querySelectorAll('#subscription-form .error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// Show subscription form status message
function showSubscriptionStatus(message, type) {
    const statusElement = document.getElementById('subscription-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `form-status ${type} show`;
    }
}

// Clear subscription form status
function clearSubscriptionStatus() {
    const statusElement = document.getElementById('subscription-status');
    if (statusElement) {
        statusElement.textContent = '';
        statusElement.className = 'form-status';
    }
}

// Star Wars Component JavaScript
StarWars = (function() {
  
  /* 
   * Constructor
   */
  function StarWars(args) {
    // Context wrapper
    this.el = $(args.el);
    
    // Audio to play the opening crawl
    this.audio = this.el.find('audio').get(0);
    
    // Start the animation
    this.start = this.el.find('.start');
    
    // The animation wrapper
    this.animation = this.el.find('.animation');
    
    // Remove animation and shows the start screen
    this.reset();

    // Start the animation on click
    this.start.bind('click', $.proxy(function() {
      this.start.hide();
      this.audio.play();
      this.el.append(this.animation);
    }, this));
    
    // Reset the animation and shows the start screen
    $(this.audio).bind('ended', $.proxy(function() {
      this.audio.currentTime = 0;
      this.reset();
    }, this));
  }
  
  /*
   * Resets the animation and shows the start screen.
   */
  StarWars.prototype.reset = function() {
    this.start.show();
    this.cloned = this.animation.clone(true);
    this.animation.remove();
    this.animation = this.cloned;
  };

  return StarWars;
})();

// Initialize Star Wars component when DOM is ready
$(document).ready(function() {
    const intro = new StarWars({
        el : '.starwars'
    });
});

// Export functions for potential external use

window.PortfolioWebsite = {
    showNotification,
    initScrollAnimations,
    initSubscriptionForm
};

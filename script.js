// Portfolio Website JavaScript
// Modern, interactive functionality with smooth animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initPortfolioViewToggle();
    initSkillBars();
    initContactForm();
    initSmoothScrolling();
    initParallaxEffects();
    initTypingEffect();
    initSpaceTimeAnomaly();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

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

// Portfolio view toggle functionality
function initPortfolioViewToggle() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const portfolioTable = document.getElementById('portfolio-table');

    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active button
            viewToggles.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Toggle views with smooth transition
            if (view === 'grid') {
                portfolioTable.style.display = 'none';
                portfolioGrid.style.display = 'grid';
                portfolioGrid.style.opacity = '0';
                setTimeout(() => {
                    portfolioGrid.style.opacity = '1';
                }, 100);
            } else {
                portfolioGrid.style.display = 'none';
                portfolioTable.style.display = 'block';
                portfolioTable.style.opacity = '0';
                setTimeout(() => {
                    portfolioTable.style.opacity = '1';
                }, 100);
            }
        });
    });
}

// Animated skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 200);
                
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
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
        .then(response => response.json())
        .then(data => {
            if (data.csrf_token) {
                document.getElementById('csrf_token').value = data.csrf_token;
            }
        })
        .catch(error => {
            console.error('CSRF token fetch error:', error);
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

// Parallax effects for hero section
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

// Portfolio item hover effects
function initPortfolioHoverEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize portfolio hover effects
initPortfolioHoverEffects();

// Button ripple effect
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Initialize ripple effect
initRippleEffect();

// Add ripple CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

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

// Accessibility improvements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

// Initialize accessibility features
initAccessibility();

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


// Export functions for potential external use
window.PortfolioWebsite = {
    showNotification,
    initScrollAnimations,
    initPortfolioViewToggle,
    initSpaceTimeAnomaly
};

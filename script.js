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
    initParticleMorph();
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

// Particle Morph Animation - Exact Replication
function initParticleMorph() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    // Import Three.js modules dynamically
    import('three').then(THREE => {
        import('three/addons/controls/OrbitControls.js').then(OrbitControlsModule => {
            import('three/addons/postprocessing/EffectComposer.js').then(EffectComposerModule => {
                import('three/addons/postprocessing/RenderPass.js').then(RenderPassModule => {
                    import('three/addons/postprocessing/UnrealBloomPass.js').then(UnrealBloomPassModule => {
                        import('animejs').then(anime => {
                            import('simplex-noise').then(simplexNoiseModule => {
                                startParticleAnimation(THREE, OrbitControlsModule, EffectComposerModule, RenderPassModule, UnrealBloomPassModule, anime.default, simplexNoiseModule);
                            });
                        });
                    });
                });
            });
        });
    });
}

function startParticleAnimation(THREE, OrbitControlsModule, EffectComposerModule, RenderPassModule, UnrealBloomPassModule, anime, simplexNoiseModule) {
    const OrbitControls = OrbitControlsModule.OrbitControls;
    const EffectComposer = EffectComposerModule.EffectComposer;
    const RenderPass = RenderPassModule.RenderPass;
    const UnrealBloomPass = UnrealBloomPassModule.UnrealBloomPass;
    const createNoise3D = simplexNoiseModule.createNoise3D;
    const createNoise4D = simplexNoiseModule.createNoise4D;

    let scene, camera, renderer, controls, clock;
    let composer, bloomPass;
    let particlesGeometry, particlesMaterial, particleSystem;
    let currentPositions, sourcePositions, targetPositions, swarmPositions;
    let particleSizes, particleOpacities, particleEffectStrengths;
    let noise3D, noise4D;
    let morphTimeline = null;
    let isInitialized = false;
    let isMorphing = false;

    const CONFIG = {
        particleCount: 15000,
        shapeSize: 14,
        swarmDistanceFactor: 1.5,
        swirlFactor: 4.0,
        noiseFrequency: 0.1,
        noiseTimeScale: 0.04,
        noiseMaxStrength: 2.8,
        colorScheme: 'fire',
        morphDuration: 4000,
        particleSizeRange: [0.08, 0.25],
        starCount: 18000,
        bloomStrength: 1.3,
        bloomRadius: 0.5,
        bloomThreshold: 0.05,
        idleFlowStrength: 0.25,
        idleFlowSpeed: 0.08,
        idleRotationSpeed: 0.02,
        morphSizeFactor: 0.5,
        morphBrightnessFactor: 0.6
    };

    const SHAPES = [
        { name: 'Sphere', generator: generateSphere },
        { name: 'Cube', generator: generateCube },
        { name: 'Pyramid', generator: generatePyramid },
        { name: 'Torus', generator: generateTorus },
        { name: 'Galaxy', generator: generateGalaxy },
        { name: 'Wave', generator: generateWave }
    ];
    let currentShapeIndex = 0;

    const morphState = { progress: 0.0 };

    const COLOR_SCHEMES = {
        fire: { startHue: 0, endHue: 45, saturation: 0.95, lightness: 0.6 },
        neon: { startHue: 300, endHue: 180, saturation: 1.0, lightness: 0.65 },
        nature: { startHue: 90, endHue: 160, saturation: 0.85, lightness: 0.55 },
        rainbow: { startHue: 0, endHue: 360, saturation: 0.9, lightness: 0.6 }
    };

    const tempVec = new THREE.Vector3();
    const sourceVec = new THREE.Vector3();
    const targetVec = new THREE.Vector3();
    const swarmVec = new THREE.Vector3();
    const noiseOffset = new THREE.Vector3();
    const flowVec = new THREE.Vector3();
    const bezPos = new THREE.Vector3();
    const swirlAxis = new THREE.Vector3();
    const currentVec = new THREE.Vector3();

    function generateSphere(count, size) {
        const points = new Float32Array(count * 3);
        const phi = Math.PI * (Math.sqrt(5) - 1);
        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            points[i * 3] = x * size;
            points[i * 3 + 1] = y * size;
            points[i * 3 + 2] = z * size;
        }
        return points;
    }

    function generateCube(count, size) {
        const points = new Float32Array(count * 3);
        const halfSize = size / 2;
        for (let i = 0; i < count; i++) {
            const face = Math.floor(Math.random() * 6);
            const u = Math.random() * size - halfSize;
            const v = Math.random() * size - halfSize;
            switch (face) {
                case 0: points.set([halfSize, u, v], i * 3); break;
                case 1: points.set([-halfSize, u, v], i * 3); break;
                case 2: points.set([u, halfSize, v], i * 3); break;
                case 3: points.set([u, -halfSize, v], i * 3); break;
                case 4: points.set([u, v, halfSize], i * 3); break;
                case 5: points.set([u, v, -halfSize], i * 3); break;
            }
        }
        return points;
    }

    function generatePyramid(count, size) {
        const points = new Float32Array(count * 3);
        const halfBase = size / 2;
        const height = size * 1.2;
        const apex = new THREE.Vector3(0, height / 2, 0);
        const baseVertices = [
            new THREE.Vector3(-halfBase, -height / 2, -halfBase), new THREE.Vector3(halfBase, -height / 2, -halfBase),
            new THREE.Vector3(halfBase, -height / 2, halfBase), new THREE.Vector3(-halfBase, -height / 2, halfBase)
        ];
        const baseArea = size * size;
        const sideFaceHeight = Math.sqrt(Math.pow(height, 2) + Math.pow(halfBase, 2));
        const sideFaceArea = 0.5 * size * sideFaceHeight;
        const totalArea = baseArea + 4 * sideFaceArea;
        const baseWeight = baseArea / totalArea;
        const sideWeight = sideFaceArea / totalArea;
        for (let i = 0; i < count; i++) {
            const r = Math.random();
            let p = new THREE.Vector3(); let u, v;
            if (r < baseWeight) {
                u = Math.random(); v = Math.random();
                p.lerpVectors(baseVertices[0], baseVertices[1], u);
                const p2 = new THREE.Vector3().lerpVectors(baseVertices[3], baseVertices[2], u);
                p.lerp(p2, v);
            } else {
                const faceIndex = Math.floor((r - baseWeight) / sideWeight);
                const v1 = baseVertices[faceIndex]; const v2 = baseVertices[(faceIndex + 1) % 4];
                u = Math.random(); v = Math.random();
                if (u + v > 1) { u = 1 - u; v = 1 - v; }
                p.addVectors(v1, tempVec.subVectors(v2, v1).multiplyScalar(u));
                p.add(tempVec.subVectors(apex, v1).multiplyScalar(v));
            }
            points.set([p.x, p.y, p.z], i * 3);
        }
        return points;
    }

    function generateTorus(count, size) {
        const points = new Float32Array(count * 3);
        const R = size * 0.7; const r = size * 0.3;
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2; const phi = Math.random() * Math.PI * 2;
            const x = (R + r * Math.cos(phi)) * Math.cos(theta);
            const y = r * Math.sin(phi);
            const z = (R + r * Math.cos(phi)) * Math.sin(theta);
            points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
        }
        return points;
    }

    function generateGalaxy(count, size) {
        const points = new Float32Array(count * 3);
        const arms = 4; const armWidth = 0.6; const bulgeFactor = 0.3;
        for (let i = 0; i < count; i++) {
            const t = Math.pow(Math.random(), 1.5); const radius = t * size;
            const armIndex = Math.floor(Math.random() * arms);
            const armOffset = (armIndex / arms) * Math.PI * 2;
            const rotationAmount = radius / size * 6; const angle = armOffset + rotationAmount;
            const spread = (Math.random() - 0.5) * armWidth * (1 - radius / size);
            const theta = angle + spread;
            const x = radius * Math.cos(theta); const z = radius * Math.sin(theta);
            const y = (Math.random() - 0.5) * size * 0.1 * (1 - radius / size * bulgeFactor);
            points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
        }
        return points;
    }

    function generateWave(count, size) {
        const points = new Float32Array(count * 3);
        const waveScale = size * 0.4; const frequency = 3;
        for (let i = 0; i < count; i++) {
            const u = Math.random() * 2 - 1; const v = Math.random() * 2 - 1;
            const x = u * size; const z = v * size;
            const dist = Math.sqrt(u * u + v * v); const angle = Math.atan2(v, u);
            const y = Math.sin(dist * Math.PI * frequency) * Math.cos(angle * 2) * waveScale * (1 - dist);
            points[i * 3] = x; points[i * 3 + 1] = y; points[i * 3 + 2] = z;
        }
        return points;
    }

    function init() {
        let progress = 0;
        const progressBar = document.getElementById('particle-progress');
        const loadingScreen = document.getElementById('particle-loading');
        
        function updateProgress(increment) {
            progress += increment;
            progressBar.style.width = `${Math.min(100, progress)}%`;
            if (progress >= 100) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => { loadingScreen.style.display = 'none'; }, 600);
                }, 200);
            }
        }

        clock = new THREE.Clock();
        noise3D = createNoise3D(() => Math.random());
        noise4D = createNoise4D(() => Math.random());
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000308, 0.03);
        updateProgress(5);

        camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 8, 28);
        camera.lookAt(scene.position);
        updateProgress(5);

        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        updateProgress(10);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.05;
        controls.minDistance = 5; controls.maxDistance = 80;
        controls.autoRotate = true; controls.autoRotateSpeed = 0.3;
        updateProgress(5);

        scene.add(new THREE.AmbientLight(0x404060));
        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight1.position.set(15, 20, 10); scene.add(dirLight1);
        const dirLight2 = new THREE.DirectionalLight(0x88aaff, 0.9);
        dirLight2.position.set(-15, -10, -15); scene.add(dirLight2);
        updateProgress(10);

        setupPostProcessing(); updateProgress(10);
        createStarfield(); updateProgress(15);
        setupParticleSystem(); updateProgress(25);

        window.addEventListener('resize', onWindowResize);
        canvas.addEventListener('click', onCanvasClick);
        document.getElementById('particle-shape-btn').addEventListener('click', triggerMorph);
        document.querySelectorAll('.particle-color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.particle-color-option').forEach(o => o.classList.remove('active'));
                e.target.classList.add('active');
                CONFIG.colorScheme = e.target.dataset.scheme;
                updateColors();
            });
        });
        document.querySelector(`.particle-color-option[data-scheme="${CONFIG.colorScheme}"]`).classList.add('active');
        updateProgress(15);

        isInitialized = true;
        animate();
        console.log("Particle animation initialization complete.");
    }

    function setupPostProcessing() {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.clientWidth, canvas.clientHeight), CONFIG.bloomStrength, CONFIG.bloomRadius, CONFIG.bloomThreshold);
        composer.addPass(bloomPass);
    }

    function createStarfield() {
        const starVertices = []; const starSizes = []; const starColors = [];
        const starGeometry = new THREE.BufferGeometry();
        for (let i = 0; i < CONFIG.starCount; i++) {
            tempVec.set(THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(400));
            if (tempVec.length() < 100) tempVec.setLength(100 + Math.random() * 300);
            starVertices.push(tempVec.x, tempVec.y, tempVec.z);
            starSizes.push(Math.random() * 0.15 + 0.05);
            const color = new THREE.Color();
            if (Math.random() < 0.1) { color.setHSL(Math.random(), 0.7, 0.65); } else { color.setHSL(0.6, Math.random() * 0.1, 0.8 + Math.random() * 0.2); }
            starColors.push(color.r, color.g, color.b);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: { pointTexture: { value: createStarTexture() } },
            vertexShader: `
                attribute float size; varying vec3 vColor; varying float vSize;
                void main() {
                    vColor = color; vSize = size; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (400.0 / -mvPosition.z); gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform sampler2D pointTexture; varying vec3 vColor; varying float vSize;
                void main() {
                    float alpha = texture2D(pointTexture, gl_PointCoord).a; if (alpha < 0.1) discard;
                    gl_FragColor = vec4(vColor, alpha * 0.9);
                }`,
            blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, vertexColors: true
        });
        scene.add(new THREE.Points(starGeometry, starMaterial));
    }

    function createStarTexture() {
        const size = 64; const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size; const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)'); gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)'); gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient; context.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(canvas);
    }

    function setupParticleSystem() {
        targetPositions = SHAPES.map(shape => shape.generator(CONFIG.particleCount, CONFIG.shapeSize));
        particlesGeometry = new THREE.BufferGeometry();

        currentPositions = new Float32Array(targetPositions[0]);
        sourcePositions = new Float32Array(targetPositions[0]);
        swarmPositions = new Float32Array(CONFIG.particleCount * 3);
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

        particleSizes = new Float32Array(CONFIG.particleCount);
        particleOpacities = new Float32Array(CONFIG.particleCount);
        particleEffectStrengths = new Float32Array(CONFIG.particleCount);
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particleSizes[i] = THREE.MathUtils.randFloat(CONFIG.particleSizeRange[0], CONFIG.particleSizeRange[1]);
            particleOpacities[i] = 1.0;
            particleEffectStrengths[i] = 0.0;
        }
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(particleOpacities, 1));
        particlesGeometry.setAttribute('aEffectStrength', new THREE.BufferAttribute(particleEffectStrengths, 1));

        const colors = new Float32Array(CONFIG.particleCount * 3);
        updateColorArray(colors, currentPositions);
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        particlesMaterial = new THREE.ShaderMaterial({
            uniforms: { pointTexture: { value: createStarTexture() } },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                attribute float aEffectStrength;
                varying vec3 vColor;
                varying float vOpacity;
                varying float vEffectStrength;

                void main() {
                    vColor = color;
                    vOpacity = opacity;
                    vEffectStrength = aEffectStrength;

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                    float sizeScale = 1.0 - vEffectStrength * ${CONFIG.morphSizeFactor.toFixed(2)};
                    gl_PointSize = size * sizeScale * (400.0 / -mvPosition.z);

                    gl_Position = projectionMatrix * mvPosition;
                }`,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                varying float vOpacity;
                varying float vEffectStrength;

                void main() {
                    float alpha = texture2D(pointTexture, gl_PointCoord).a;
                    if (alpha < 0.05) discard;

                    vec3 finalColor = vColor * (1.0 + vEffectStrength * ${CONFIG.morphBrightnessFactor.toFixed(2)});

                    gl_FragColor = vec4(finalColor, alpha * vOpacity);
                }`,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });

        particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);
    }

    function updateColorArray(colors, positionsArray) {
        const colorScheme = COLOR_SCHEMES[CONFIG.colorScheme];
        const center = new THREE.Vector3(0, 0, 0);
        const maxRadius = CONFIG.shapeSize * 1.1;
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            tempVec.fromArray(positionsArray, i3);
            const dist = tempVec.distanceTo(center);
            let hue;
            if (CONFIG.colorScheme === 'rainbow') {
                const normX = (tempVec.x / maxRadius + 1) / 2; const normY = (tempVec.y / maxRadius + 1) / 2; const normZ = (tempVec.z / maxRadius + 1) / 2;
                hue = (normX * 120 + normY * 120 + normZ * 120) % 360;
            } else {
                hue = THREE.MathUtils.mapLinear(dist, 0, maxRadius, colorScheme.startHue, colorScheme.endHue);
            }
            const noiseValue = (noise3D(tempVec.x * 0.2, tempVec.y * 0.2, tempVec.z * 0.2) + 1) * 0.5;
            const saturation = THREE.MathUtils.clamp(colorScheme.saturation * (0.9 + noiseValue * 0.2), 0, 1);
            const lightness = THREE.MathUtils.clamp(colorScheme.lightness * (0.85 + noiseValue * 0.3), 0.1, 0.9);
            const color = new THREE.Color().setHSL(hue / 360, saturation, lightness);
            color.toArray(colors, i3);
        }
    }

    function updateColors() {
        const colors = particlesGeometry.attributes.color.array;
        updateColorArray(colors, particlesGeometry.attributes.position.array);
        particlesGeometry.attributes.color.needsUpdate = true;
    }

    function triggerMorph() {
        if (isMorphing) return;
        isMorphing = true; controls.autoRotate = false; console.log("Morphing triggered...");
        document.getElementById('particle-info').innerText = `Morphing...`;
        document.getElementById('particle-info').style.textShadow = '0 0 8px rgba(255, 150, 50, 0.9)';
        sourcePositions.set(currentPositions);
        const nextShapeIndex = (currentShapeIndex + 1) % SHAPES.length;
        const nextTargetPositions = targetPositions[nextShapeIndex];
        const centerOffsetAmount = CONFIG.shapeSize * CONFIG.swarmDistanceFactor;
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            sourceVec.fromArray(sourcePositions, i3); targetVec.fromArray(nextTargetPositions, i3);
            swarmVec.lerpVectors(sourceVec, targetVec, 0.5);
            const offsetDir = tempVec.set(noise3D(i * 0.05, 10, 10), noise3D(20, i * 0.05, 20), noise3D(30, 30, i * 0.05)).normalize();
            const distFactor = sourceVec.distanceTo(targetVec) * 0.1 + centerOffsetAmount;
            swarmVec.addScaledVector(offsetDir, distFactor * (0.5 + Math.random() * 0.8));
            swarmPositions[i3] = swarmVec.x; swarmPositions[i3 + 1] = swarmVec.y; swarmPositions[i3 + 2] = swarmVec.z;
        }
        currentShapeIndex = nextShapeIndex;
        morphState.progress = 0;
        if (morphTimeline) morphTimeline.pause();
        morphTimeline = anime({
            targets: morphState, progress: 1, duration: CONFIG.morphDuration, easing: 'cubicBezier(0.4, 0.0, 0.2, 1.0)',
            complete: () => {
                console.log("Morphing complete.");
                document.getElementById('particle-info').innerText = `Shape: ${SHAPES[currentShapeIndex].name} (Click to morph)`;
                document.getElementById('particle-info').style.textShadow = '0 0 5px rgba(0, 128, 255, 0.8)';
                currentPositions.set(targetPositions[currentShapeIndex]);
                particlesGeometry.attributes.position.needsUpdate = true;
                particleEffectStrengths.fill(0.0);
                particlesGeometry.attributes.aEffectStrength.needsUpdate = true;
                sourcePositions.set(targetPositions[currentShapeIndex]);
                updateColors();
                isMorphing = false; controls.autoRotate = true;
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!isInitialized) return;
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = clock.getDelta();
        controls.update();
        const positions = particlesGeometry.attributes.position.array;
        const effectStrengths = particlesGeometry.attributes.aEffectStrength.array;

        if (isMorphing) {
            updateMorphAnimation(positions, effectStrengths, elapsedTime, deltaTime);
        } else {
            updateIdleAnimation(positions, effectStrengths, elapsedTime, deltaTime);
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        if (isMorphing || particlesGeometry.attributes.aEffectStrength.needsUpdate) {
            particlesGeometry.attributes.aEffectStrength.needsUpdate = true;
        }
        composer.render(deltaTime);
    }

    function updateMorphAnimation(positions, effectStrengths, elapsedTime, deltaTime) {
        const t = morphState.progress;
        const targets = targetPositions[currentShapeIndex];
        const effectStrength = Math.sin(t * Math.PI);
        const currentSwirl = effectStrength * CONFIG.swirlFactor * deltaTime * 50;
        const currentNoise = effectStrength * CONFIG.noiseMaxStrength;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            sourceVec.fromArray(sourcePositions, i3);
            swarmVec.fromArray(swarmPositions, i3);
            targetVec.fromArray(targets, i3);

            const t_inv = 1.0 - t; const t_inv_sq = t_inv * t_inv; const t_sq = t * t;
            bezPos.copy(sourceVec).multiplyScalar(t_inv_sq);
            bezPos.addScaledVector(swarmVec, 2.0 * t_inv * t);
            bezPos.addScaledVector(targetVec, t_sq);

            if (currentSwirl > 0.01) {
                tempVec.subVectors(bezPos, sourceVec);
                swirlAxis.set(noise3D(i * 0.02, elapsedTime * 0.1, 0), noise3D(0, i * 0.02, elapsedTime * 0.1 + 5), noise3D(elapsedTime * 0.1 + 10, 0, i * 0.02)).normalize();
                tempVec.applyAxisAngle(swirlAxis, currentSwirl * (0.5 + Math.random() * 0.5));
                bezPos.copy(sourceVec).add(tempVec);
            }

            if (currentNoise > 0.01) {
                const noiseTime = elapsedTime * CONFIG.noiseTimeScale;
                noiseOffset.set(noise4D(bezPos.x * CONFIG.noiseFrequency, bezPos.y * CONFIG.noiseFrequency, bezPos.z * CONFIG.noiseFrequency, noiseTime), noise4D(bezPos.x * CONFIG.noiseFrequency + 100, bezPos.y * CONFIG.noiseFrequency + 100, bezPos.z * CONFIG.noiseFrequency + 100, noiseTime), noise4D(bezPos.x * CONFIG.noiseFrequency + 200, bezPos.y * CONFIG.noiseFrequency + 200, bezPos.z * CONFIG.noiseFrequency + 200, noiseTime));
                bezPos.addScaledVector(noiseOffset, currentNoise);
            }

            positions[i3] = bezPos.x;
            positions[i3 + 1] = bezPos.y;
            positions[i3 + 2] = bezPos.z;

            effectStrengths[i] = effectStrength;
        }
        particlesGeometry.attributes.aEffectStrength.needsUpdate = true;
    }

    function updateIdleAnimation(positions, effectStrengths, elapsedTime, deltaTime) {
        const breathScale = 1.0 + Math.sin(elapsedTime * 0.5) * 0.015;
        const timeScaled = elapsedTime * CONFIG.idleFlowSpeed;
        const freq = 0.1;

        let needsEffectStrengthReset = false;

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const i3 = i * 3;
            sourceVec.fromArray(sourcePositions, i3);
            tempVec.copy(sourceVec).multiplyScalar(breathScale);
            flowVec.set(noise4D(tempVec.x * freq, tempVec.y * freq, tempVec.z * freq, timeScaled), noise4D(tempVec.x * freq + 10, tempVec.y * freq + 10, tempVec.z * freq + 10, timeScaled), noise4D(tempVec.x * freq + 20, tempVec.y * freq + 20, tempVec.z * freq + 20, timeScaled));
            tempVec.addScaledVector(flowVec, CONFIG.idleFlowStrength);
            currentVec.fromArray(positions, i3);
            currentVec.lerp(tempVec, 0.05);
            positions[i3] = currentVec.x;
            positions[i3 + 1] = currentVec.y;
            positions[i3 + 2] = currentVec.z;

            if (effectStrengths[i] !== 0.0) {
                effectStrengths[i] = 0.0;
                needsEffectStrengthReset = true;
            }
        }
        if (needsEffectStrengthReset) {
            particlesGeometry.attributes.aEffectStrength.needsUpdate = true;
        }
    }

    function onCanvasClick(event) {
        if (event.target.closest('#particle-controls')) { return; }
        triggerMorph();
    }

    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        composer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    // Initialize the animation
    init();
}

// Export functions for potential external use
window.PortfolioWebsite = {
    showNotification,
    initScrollAnimations,
    initPortfolioViewToggle,
    initSpaceTimeAnomaly,
    initParticleMorph
};

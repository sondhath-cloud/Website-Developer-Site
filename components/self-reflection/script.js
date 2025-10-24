/*********
 * made by Matthias Hurrle (@atzedent)
 */
let editMode = false; // set to false to hide the code editor on load
let resolution = 0.5; // set 1 for full resolution or to .5 to start with half resolution on load
let renderDelay = 1000; // delay in ms before rendering the shader after a change
let dpr = Math.max(1, resolution * window.devicePixelRatio);
let frm, source, editor, store, renderer, pointers;
const shaderId = "yyYKLee";

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

function resize() {
	const { innerWidth: width, innerHeight: height } = window;

	canvas.width = width * dpr;
	canvas.height = height * dpr;

	if (renderer) {
		renderer.updateScale(dpr);
	}
}
function toggleView() {
	editor.hidden = btnToggleView.checked;
	canvas.style.setProperty("--canvas-z-index", btnToggleView.checked ? 0 : -1);
}
function reset() {
	let shader = source;
	editor.text = shader ? shader.textContent : renderer.defaultSource;
	store.putShaderSource(shaderId, editor.text);
	renderThis();
}
function toggleResolution() {
	resolution = btnToggleResolution.checked ? 0.5 : 1;
	dpr = Math.max(1, resolution * window.devicePixelRatio);
	pointers.updateScale(dpr);
	resize();
}
function loop(now) {
	renderer.updateMouse(pointers.first);
	renderer.updatePointerCount(pointers.count);
	renderer.updatePointerCoords(pointers.coords);
	renderer.updateMove(pointers.move);
	renderer.render(now);
	frm = requestAnimationFrame(loop);
}
function renderThis() {
	editor.clearError();
	store.putShaderSource(shaderId, editor.text);

	const result = renderer.test(editor.text);
	if (result.success) {
		renderer.updateSource(editor.text);
	} else {
		editor.showError(result.error);
	}
}
function render() {
	clearTimeout(renderDelay);
	renderDelay = setTimeout(renderThis, 100);
}

function init() {
	canvas = document.getElementById("reflection-canvas");
	source = document.querySelector("script[type='x-shader/x-fragment']");
	
	console.log('Self-reflection init - Canvas:', canvas);
	console.log('Self-reflection init - Source:', source);
	
	if (!canvas) {
		console.error('Reflection canvas not found!');
		return;
	}
	
	// Ensure canvas is visible and properly sized
	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.style.zIndex = '-1';
	canvas.style.display = 'block';
	
	try {
		editor = new CodeEditor();
		store = new ShaderStore();
		renderer = new WebGLRenderer();
		pointers = new PointerTracker();

		// Hide editor and error elements for background-only mode
		if (editor.element) editor.element.style.display = 'none';
		const errorElement = document.getElementById("error");
		if (errorElement) errorElement.style.display = 'none';

		resize();
		window.addEventListener("resize", resize);

		editor.text = store.getShaderSource(shaderId) || renderer.defaultSource;
		renderThis();
		loop();
		
		console.log('Self-reflection component initialized successfully');
		console.log('Using shader source:', editor.text.substring(0, 100) + '...');
	} catch (error) {
		console.error('Failed to initialize self-reflection component:', error);
	}
}

class CodeEditor {
	constructor() {
		this.element = document.getElementById("codeEditor");
		this.errorElement = document.getElementById("error");
		
		// Only add event listeners if elements exist
		if (this.element) {
			this.element.addEventListener("input", render);
		}
	}
	get text() {
		return this.element ? this.element.value : '';
	}
	set text(value) {
		if (this.element) {
			this.element.value = value;
		}
	}
	showError(error) {
		if (this.errorElement) {
			this.errorElement.textContent = error;
			this.errorElement.style.display = "block";
		}
	}
	clearError() {
		if (this.errorElement) {
			this.errorElement.style.display = "none";
		}
	}
}

class ShaderStore {
	constructor() {
		this.storageKey = "shaderStore";
	}
	getShaderSource(id) {
		try {
			const store = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
			return store[id];
		} catch (e) {
			return null;
		}
	}
	putShaderSource(id, source) {
		try {
			const store = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
			store[id] = source;
			localStorage.setItem(this.storageKey, JSON.stringify(store));
		} catch (e) {
			console.warn("Could not save shader source:", e);
		}
	}
}

class PointerTracker {
	constructor() {
		this.coords = new Float32Array(2);
		this.first = new Float32Array(2);
		this.move = new Float32Array(2);
		this.count = 0;
		this.scale = 1;
		this.updateScale(dpr);
		this.bindEvents();
	}
	updateScale(scale) {
		this.scale = scale;
	}
	bindEvents() {
		const updatePointer = (e) => {
			const rect = canvas.getBoundingClientRect();
			const x = (e.clientX - rect.left) * this.scale;
			const y = (e.clientY - rect.top) * this.scale;
			this.coords[0] = x;
			this.coords[1] = y;
			if (this.count === 0) {
				this.first[0] = x;
				this.first[1] = y;
			}
			this.count = e.pointerType === "mouse" ? 1 : e.pointerType === "touch" ? e.touches.length : 1;
		};
		const updateMove = (e) => {
			const rect = canvas.getBoundingClientRect();
			const x = (e.clientX - rect.left) * this.scale;
			const y = (e.clientY - rect.top) * this.scale;
			this.move[0] = x - this.first[0];
			this.move[1] = y - this.first[1];
		};
		canvas.addEventListener("pointerdown", updatePointer);
		canvas.addEventListener("pointermove", (e) => {
			updatePointer(e);
			updateMove(e);
		});
		canvas.addEventListener("pointerup", (e) => {
			this.count = 0;
		});
		canvas.addEventListener("touchstart", (e) => {
			e.preventDefault();
		});
		canvas.addEventListener("touchmove", (e) => {
			e.preventDefault();
		});
	}
}

class WebGLRenderer {
	constructor() {
		this.gl = canvas.getContext("webgl2");
		if (!this.gl) {
			console.error("WebGL 2 not supported, falling back to WebGL 1");
			this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		}
		
		if (!this.gl) {
			throw new Error("WebGL not supported");
		}
		
		console.log("WebGL context created successfully");
		this.program = null;
		this.uniforms = {};
		this.textures = {};
		this.defaultSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec2 touch;
uniform int pointerCount;
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 color = vec3(0.2, 0.3, 0.8) + 0.3 * sin(time + uv.x * 10.0) * sin(time + uv.y * 10.0);
    O = vec4(color, 1.0);
}`;
		this.init();
	}
	init() {
		const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}`);
		const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.defaultSource);
		this.program = this.createProgram(vertexShader, fragmentShader);
		this.setupGeometry();
		this.setupTextures();
	}
	createShader(type, source) {
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			const error = this.gl.getShaderInfoLog(shader);
			console.error(`Shader compilation error:`, error);
			this.gl.deleteShader(shader);
			return null;
		}
		console.log(`Shader compiled successfully (type: ${type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment'})`);
		return shader;
	}
	createProgram(vertexShader, fragmentShader) {
		const program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw new Error(this.gl.getProgramInfoLog(program));
		}
		return program;
	}
	setupGeometry() {
		const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
		const buffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
		const position = this.gl.getAttribLocation(this.program, "position");
		this.gl.enableVertexAttribArray(position);
		this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
	}
	setupTextures() {
		// Create wood texture
		const woodTexture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, woodTexture);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([139, 69, 19, 255]));
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.textures.wood = woodTexture;

		// Create cube map texture
		const cubeTexture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, cubeTexture);
		const faceSize = 1;
		const faceData = new Uint8Array(faceSize * faceSize * 4);
		for (let i = 0; i < 6; i++) {
			this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, faceSize, faceSize, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, faceData);
		}
		this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.textures.cubeMap = cubeTexture;
	}
	updateScale(scale) {
		this.scale = scale;
	}
	updateMouse(mouse) {
		this.uniforms.touch = mouse;
	}
	updatePointerCount(count) {
		this.uniforms.pointerCount = count;
	}
	updatePointerCoords(coords) {
		this.uniforms.touch = coords;
	}
	updateMove(move) {
		// Move is handled in the shader
	}
	updateSource(source) {
		try {
			const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, source);
			const newProgram = this.createProgram(this.program, fragmentShader);
			this.gl.deleteProgram(this.program);
			this.program = newProgram;
			this.setupGeometry();
		} catch (e) {
			throw e;
		}
	}
	test(source) {
		try {
			const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, source);
			this.gl.deleteShader(fragmentShader);
			return { success: true };
		} catch (e) {
			return { success: false, error: e.message };
		}
	}
	render(now) {
		this.gl.viewport(0, 0, canvas.width, canvas.height);
		this.gl.useProgram(this.program);
		
		// Set uniforms
		this.gl.uniform1f(this.gl.getUniformLocation(this.program, "time"), now * 0.001);
		this.gl.uniform2f(this.gl.getUniformLocation(this.program, "resolution"), canvas.width, canvas.height);
		this.gl.uniform2f(this.gl.getUniformLocation(this.program, "touch"), this.uniforms.touch[0], this.uniforms.touch[1]);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "pointerCount"), this.uniforms.pointerCount);
		
		// Bind textures
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.wood);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "wood"), 0);
		
		this.gl.activeTexture(this.gl.TEXTURE1);
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.textures.cubeMap);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "cubeMap"), 1);
		
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
		
		// Debug: log every 60 frames
		if (Math.floor(now / 1000) % 1 === 0) {
			console.log('WebGL render called, canvas size:', canvas.width, 'x', canvas.height, 'program:', this.program);
		}
	}
}

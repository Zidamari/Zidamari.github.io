// --- PART 0: PROJECT DATA ---
// TODO: Replace this with your actual project details
const projectData = [
    {
        id: 1,
        title: "Project Title Here",
        image: "", // Optional: path to a detailed image e.g., "images/project-1-hero.jpg"
        subtitle: "A brief, impactful summary of the project's purpose.",
        tags: ["JavaScript", "Python", "ROS"],
        liveDemoUrl: "#",
        githubUrl: "#",
        challenge: "Describe the problem you set out to solve. What was the core issue? This project aimed to create an intuitive system for real-time robotic arm control using web technologies.",
        solution: "Explain your step-by-step process and how your final project addresses the initial challenge. The solution involved a Node.js server for backend communication and a front-end interface built with vanilla JavaScript.",
        learnings: "Conclude by reflecting on the project and the key takeaways. This project was a deep dive into WebSocket communication and the challenges of low-latency user interfaces."
    },
    {
        id: 2,
        title: "Another Cool Project",
        image: "",
        subtitle: "Solving a different kind of problem using design and development skills.",
        tags: ["C++", "Fusion 360", "OpenCV"],
        liveDemoUrl: "#",
        githubUrl: "#",
        challenge: "This project had a different set of challenges, focusing on computer vision to identify objects in a cluttered environment.",
        solution: "The solution involved writing a C++ application that utilized the OpenCV library for image processing. I also designed and 3D printed a custom mount for the camera using Fusion 360.",
        learnings: "I learned a great deal about image filtering techniques and the practicalities of hardware integration."
    }
];


document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: VIDEO HALFTONE EFFECT (with mobile performance check) ---
    const CROP_OFFSET_Y = 10;
    const v = document.querySelector('#video-background');
    const canvas = document.querySelector('#halftone-canvas');
    let animationFrameId;
    
    // --- UPDATED: Only run the heavy animation on screens wider than 768px ---
    if (canvas && window.innerWidth > 768) {
        const ctx = canvas.getContext('2d');
        let width, height, fakeSize, pRatio, points = [];
        const fakeCanvas = document.createElement('canvas');
        const fakeCtx = fakeCanvas.getContext('2d');
        function setupSizing() { width = canvas.offsetWidth; height = canvas.offsetHeight; canvas.width = width; canvas.height = height; fakeSize = Math.ceil(width / 10); pRatio = width / fakeSize; fakeCanvas.width = fakeSize; fakeCanvas.height = fakeSize; createPoints(); }
        function createPoints() { points = []; for (let x = 0; x < fakeSize; x++) { for (let y = 0; y < fakeSize; y++) { const point = { x: x * pRatio + pRatio / 2, y: y * pRatio + pRatio / 2, r: 0 }; points.push(point); } } }
        function getPoints() { fakeCtx.save(); fakeCtx.translate(fakeSize / 2, fakeSize / 2); fakeCtx.rotate(Math.PI / 2); fakeCtx.scale(1, -1); const sourceSize = v.videoHeight; const sourceX = (v.videoWidth - sourceSize) / 2; const sourceY = 0 + CROP_OFFSET_Y; fakeCtx.drawImage(v, sourceX, sourceY, sourceSize, sourceSize, -fakeSize / 2, -fakeSize / 2, fakeSize, fakeSize); fakeCtx.restore(); const canvasData = fakeCtx.getImageData(0, 0, fakeSize, fakeSize).data; for (let i = 0; i < points.length; i++) { const p = points[i]; const red = canvasData[i * 4 + 0]; const green = canvasData[i * 4 + 1]; const blue = canvasData[i * 4 + 2]; const brightness = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255; const targetRadius = (1 - brightness) * (pRatio / 2); p.r += (targetRadius - p.r) * 0.1; } }
        function render() { getPoints(); ctx.clearRect(0, 0, width, height); ctx.fillStyle = 'white'; for (let i = 0; i < points.length; i++) { const p = points[i]; if (p.r > 0) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); } } animationFrameId = requestAnimationFrame(render); }
        
        if (v) {
            function startAnimation() {
                setupSizing();
                render();
            }
            if (v.readyState >= 3) {
                startAnimation();
            } else {
                v.addEventListener('canplay', startAnimation, { once: true });
            }
            window.addEventListener('resize', setupSizing);
        }
    } else if (canvas) {
        // If on mobile, just hide the canvas so the fallback image is visible
        canvas.style.display = 'none';
    }

    // --- PART 2: PAGE TRANSITION SCRIPT ---
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        if (link.hostname === window.location.hostname && !link.href.includes('#') && !link.hasAttribute('data-modal-trigger')) {
            link.addEventListener('click', e => {
                e.preventDefault(); const destination = link.href;
                if (typeof animationFrameId !== 'undefined') { cancelAnimationFrame(animationFrameId); }
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = destination; }, 500);
            });
        }
    });

    // --- PART 3: GITHUB API FETCH is commented out, no changes needed here ---

    // --- PART 4: DYNAMIC PROJECT MODAL ---
    const modalOverlay = document.getElementById('project-modal-overlay');
    const modalContent = document.getElementById('project-modal-content');
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');

    function openModal(projectId) {
        const project = projectData.find(p => p.id == projectId);
        if (!project) return;

        modalContent.innerHTML = `
            <button class="modal-close-button" id="modal-close-button">&times;</button>
            <div class="project-hero" style="padding: 40px 0;">
                <div class="wrapper">
                    <h1>${project.title}</h1>
                    <p class="project-subtitle">${project.subtitle}</p>
                    <div class="project-links">
                        <a href="${project.liveDemoUrl}" class="project-button">Live Demo</a>
                        <a href="${project.githubUrl}" class="project-button-secondary">View on GitHub</a>
                    </div>
                </div>
            </div>
            <div class="wrapper" style="padding-top: 40px;">
                <h2>The Challenge</h2>
                <p>${project.challenge}</p>
                <h2>My Process & Solution</h2>
                <p>${project.solution}</p>
                <h2>What I Learned</h2>
                <p>${project.learnings}</p>
            </div>
        `;
        
        modalOverlay.classList.add('active');
        document.getElementById('modal-close-button').addEventListener('click', closeModal);
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    modalTriggers.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.getAttribute('data-modal-trigger');
            openModal(projectId);
        });
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
});

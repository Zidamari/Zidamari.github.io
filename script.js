// Need to find a better way to do this inputs. See if GitHub API can solve this.
const projectData = [
    {
        id: 1,
        title: "Edible Ink Printer for Early Childhood Education",
        image: "images/printer.jpg",
        subtitle: "Feast for the eyes, brain and mouth!",
        tags: ["JavaScript", "Python", "ROS"],
        liveDemoUrl: "videos/printer_demo.mp4",
        githubUrl: "https://github.com/Nabeelkii/Automated-Food-Printer",
        challenge: "Given an existing technology, how can I make it apply to another problem statement in another domain.",
        solution: "Focused on Multi-sensory learning for children by linking the sense of taste and sight, and to gamify mealtimes, encouraging proactive learning",
        learnings: "Learnt how to create a rudimentary system that integrates mobile and PC based development."
    },
    {
        id: 2,
        title: "Pick and Place System with Dynamic Vision Functionality",
        image: "",
        subtitle: "Capstone Project (Currently in the works)",
        tags: ["ROS", "Solidworks", "OpenCV", "Python", "C++"],
        liveDemoUrl: "#",
        githubUrl: "#",
        challenge: "This project had a different set of challenges, focusing on computer vision to identify objects in a cluttered environment.",
        solution: "The solution involved writing a C++ application that utilized the OpenCV library for image processing. I also designed and 3D printed a custom mount for the camera using Fusion 360.",
        learnings: "I learned a great deal about image filtering techniques and the practicalities of hardware integration."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    let animationFrameId;

    const cardContainer = document.querySelector('.flip-card-container');
    const card = document.querySelector('.flip-card');
    const cardFront = document.querySelector('.flip-card-front');

    if (cardContainer && card && cardFront) {
        let isFlipped = false;
        let currentRotateX = 0;
        let currentRotateY = 0;
        
        // Check if device supports touch (mobile)
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        function updateTransform() {
            const flipRotation = isFlipped ? 180 : 0;
            card.style.transform = `rotateX(${currentRotateX}deg) rotateY(${flipRotation + currentRotateY}deg)`;
        }

        cardContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            isFlipped = !isFlipped;
            updateTransform();
        });

        // Only add hover effects on non-touch devices
        if (!isTouchDevice) {
            cardContainer.addEventListener('mousemove', (e) => {
                const rect = cardContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                currentRotateX = (y - centerY) / 10;
                currentRotateY = (centerX - x) / 10;
                
                updateTransform();
                
                const bgPosX = (x / rect.width) * 100;
                const bgPosY = (y / rect.height) * 100;
                
                cardFront.style.setProperty('--mouse-x', `${bgPosX}%`);
                cardFront.style.setProperty('--mouse-y', `${bgPosY}%`);
            });

            cardContainer.addEventListener('mouseleave', () => {
                currentRotateX = 0;
                currentRotateY = 0;
                updateTransform();
                
                cardFront.style.setProperty('--mouse-x', '50%');
                cardFront.style.setProperty('--mouse-y', '50%');
            });
        }
    }


    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        if (link.hostname === window.location.hostname && !link.href.includes('#') && !link.hasAttribute('data-modal-trigger')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                const destination = link.href;
                if (typeof animationFrameId !== 'undefined') {
                    cancelAnimationFrame(animationFrameId);
                }
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = destination; }, 500);
            });
        }
    });

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

    if (modalTriggers.length > 0) {
        modalTriggers.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = button.getAttribute('data-modal-trigger');
                openModal(projectId);
            });
        });

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }
    }

    // GitHub repos fetcher
    const githubReposContainer = document.getElementById('github-repos-container');
    if (githubReposContainer) {
        fetchGitHubRepos('Zidamari');
    }

    async function fetchGitHubRepos(username) {
        try {
            const cacheKey = `github_repos_${username}`;
            const cacheTimeKey = `github_repos_time_${username}`;
            const cachedData = localStorage.getItem(cacheKey);
            const cacheTime = localStorage.getItem(cacheTimeKey);
            
            if (cachedData && cacheTime) {
                const age = Date.now() - parseInt(cacheTime);
                if (age < 10 * 60 * 1000) {
                    const repos = JSON.parse(cachedData);
                    displayGitHubRepos(repos);
                    return;
                }
            }
            
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            
            if (response.status === 403) {
                const resetTime = response.headers.get('X-RateLimit-Reset');
                const resetDate = resetTime ? new Date(resetTime * 1000) : null;
                const message = resetDate 
                    ? `Rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}.` 
                    : 'Rate limit exceeded. Please try again later.';
                githubReposContainer.innerHTML = `<p style="text-align: center; color: #666;">${message}</p>`;
                return;
            }
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const repos = await response.json();
            const topRepos = repos.slice(0, 6);
            
            localStorage.setItem(cacheKey, JSON.stringify(topRepos));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
            
            displayGitHubRepos(topRepos);
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            githubReposContainer.innerHTML = `<p style="text-align: center; color: #666;">Unable to load repositories. Error: ${error.message}</p>`;
        }
    }

    function displayGitHubRepos(repos) {
        if (repos.length === 0) {
            githubReposContainer.innerHTML = '<p style="text-align: center;">No repositories found.</p>';
            return;
        }

        const reposHTML = repos.map(repo => `
            <div class="github-repo-card">
                <div class="repo-header">
                    <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                    ${repo.fork ? '<span class="repo-badge contributed">Fork</span>' : ''}
                </div>
                <p>${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                    <span class="repo-stars">⭐ ${repo.stargazers_count}</span>
                    <span class="repo-forks">🔀 ${repo.forks_count}</span>
                </div>
            </div>
        `).join('');

        githubReposContainer.innerHTML = reposHTML;
        
        const repoTitles = document.querySelectorAll('.github-repo-card h3');
        repoTitles.forEach(title => {
            let fontSize = 1.3;
            const minFontSize = 0.85;
            title.style.fontSize = `${fontSize}rem`;
            
            while (title.scrollWidth > title.clientWidth && fontSize > minFontSize) {
                fontSize -= 0.05;
                title.style.fontSize = `${fontSize}rem`;
            }
        });
    }
});
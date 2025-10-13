document.addEventListener('DOMContentLoaded', function() {
    // --- Enhanced Parallax & Scroll Effects ---
    const parallaxBg = document.getElementById('parallax-bg');
    const heroContent = document.getElementById('hero-content');
    let ticking = false;
    
    function handleScroll() {
        const scrolled = window.pageYOffset;
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        
        if(parallaxBg) {
            parallaxBg.style.transform = `translateY(${yPos}px) translateZ(0)`;
        }

        // Hero content fade and scale on scroll
        if(heroContent && scrolled < window.innerHeight) {
            const opacity = 1 - (scrolled / (window.innerHeight / 2));
            const scale = 1 - (scrolled / (window.innerHeight * 2));
            heroContent.style.opacity = Math.max(0, opacity).toFixed(2);
            heroContent.style.transform = `scale(${Math.max(0.9, scale)})`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);

    // --- Reveal on Scroll ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Countdown Timer Logic ---
    const countdownDate = new Date("2025-10-18T15:13:00").getTime();
    const timerInterval = setInterval(() => {
        const distance = countdownDate - new Date().getTime();
        const daysEl = document.getElementById("days");
        if (distance < 0) {
            clearInterval(timerInterval);
            const countdownTimerEl = document.getElementById("countdown-timer");
            if (countdownTimerEl) {
                countdownTimerEl.innerHTML = "<div class='font-display text-4xl text-cream'>The Sprint has Begun!</div>";
            }
            return;
        }
        if (daysEl) {
            daysEl.innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    }, 1000);
});

const weeklyThemes = [
    { week: 1, title: "Narratives,<br>Myths, & Lives.", description: "Exploring the stories we tell to survive, sell, and sanctify." },
    { week: 2, title: "The Body<br>The Archive", description: "On memory, physicality, and the records we keep." },
    { week: 3, title: "Ritual<br>Repetition", description: "Finding meaning in the patterns of daily practice." },
    { week: 4, title: "Public<br>Private", description: "Navigating the boundaries between personal and shared experience." },
    { week: 5, title: "Silence<br>The Unseen", description: "What is not said, not shown, and what it reveals." },
    { week: 6, "title": "Influence<br>Intertext", "description": "A dialogue with the ideas and images that shape us." },
    { week: 7, "title": "Place<br>Displacement", "description": "How geography and environment inform our inner worlds." },
    { week: 8, "title": "The 'Real'<br>The Hyperreal", "description": "Questioning authenticity in a world of copies." },
    { week: 9, "title": "Abundance<br>Scarcity", "description": "Creative constraints and the generation of ideas." },
    { week: 10, "title": "The End<br>The After", "description": "On conclusions, aftermaths, and what lingers." },
    { week: 11, "title": "Synthesis<br>Reflection", "description": "Looking back, connecting the threads of the journey." },
    { week: 12, "title": "Future<br>Forward", "description": "Integrating the practice into what comes next." },
    { week: 13, title: "Beginnings<br>Intentions", description: "Setting the foundation for 90 days of creative practice." }
];

const sprintStartDate = new Date('2025-10-18T00:00:00');
if (new Date() < sprintStartDate) { 
    updateTheme(weeklyThemes[0]); 
} else { 
    const now = new Date();
    const diffTime = Math.abs(now - sprintStartDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let currentWeek = Math.floor((diffDays -1) / 7) + 1;
    if (currentWeek > weeklyThemes.length) {
        currentWeek = weeklyThemes.length;
    }
    const activeTheme = weeklyThemes.find(theme => theme.week === currentWeek);
    if (activeTheme) {
        updateTheme(activeTheme);
    }
}

function updateTheme(theme) {
    const label = document.getElementById('weekly-theme-label');
    const title = document.getElementById('weekly-theme-title');
    const description = document.getElementById('weekly-theme-description');
    if (label) label.textContent = `This Week's Theme`;
    if (title) title.innerHTML = theme.title;
    if (description) description.textContent = theme.description;
}

// --- Modal functionality ---
const modalOverlay = document.getElementById('modalOverlay');
let lastActiveElement;

function openModal(triggerElement) {
    if (modalOverlay) {
        lastActiveElement = triggerElement;
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
    }
}

function closeModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
        if (lastActiveElement) { 
            lastActiveElement.focus(); 
        }
    }
}

if(modalOverlay){
    modalOverlay.addEventListener('click', function(event) { 
        if (event.target === modalOverlay) { 
            closeModal(); 
        } 
    });
    
    window.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) { 
            closeModal(); 
        } 
    });
}


// --- Marginalia Toggle ---
function toggleMarginalia(button) {
    const content = button.nextElementSibling;
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        button.innerHTML = '‡ Hide Marginalia';
    } else {
        content.classList.add('hidden');
        button.innerHTML = '‡ Show Marginalia';
    }
}

// --- Filter Functionality ---
function filterEntries(filter) {
    const entries = document.querySelectorAll('#entries-grid .entry-card');
    const buttons = document.querySelectorAll('#filter-bar .filter-btn');

    buttons.forEach(button => {
        if (button.innerText.toLowerCase().includes(filter) || (filter === 'all' && button.innerText.toLowerCase() === 'all')) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    entries.forEach(entry => {
        if (filter === 'all' || entry.dataset.type === filter) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
}

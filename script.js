// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link (for mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1 
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Smooth Scroll for Safari/Edge
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* --- LeetCode Stats & Heatmap Fetcher --- */
async function fetchLeetCodeStats() {
    const username = "sharmaadevansh"; // Your LeetCode username
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "success") {
            // 1. Update Basic Stats
            document.getElementById('total-solved').innerText = data.totalSolved;
            document.getElementById('easy-solved').innerText = data.easySolved;
            document.getElementById('medium-solved').innerText = data.mediumSolved;
            document.getElementById('hard-solved').innerText = data.hardSolved;

            // Animate Circle
            const totalCircle = document.getElementById('total-circle');
            const percentage = (data.totalSolved / 500) * 220; 
            const offset = 220 - Math.min(percentage, 220); 
            totalCircle.style.strokeDashoffset = offset;

            // 2. Render Heatmap (Calendar)
            renderHeatmap(data.submissionCalendar);
        } else {
            console.error("User not found or API error");
        }
    } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
    }
}

function renderHeatmap(calendarData) {
    const heatmapContainer = document.getElementById('leetcode-heatmap');
    heatmapContainer.innerHTML = ''; 
    
    const today = new Date();
    // Loop back 365 days
    for (let i = 365; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        
        const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
        let count = 0;

        // Sum up submissions for that day
        for (const [timestamp, subCount] of Object.entries(calendarData)) {
            const submissionDate = new Date(parseInt(timestamp) * 1000);
            if (submissionDate.toISOString().split('T')[0] === dateKey) {
                count += subCount;
            }
        }

        // Create the square
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('heatmap-day');
        
        // Add Tooltip
        dayDiv.title = `${dateKey}: ${count} submissions`;

        // Determine Color Level
        if (count === 0) dayDiv.classList.add('level-0');
        else if (count <= 2) dayDiv.classList.add('level-1');
        else if (count <= 5) dayDiv.classList.add('level-2');
        else if (count <= 10) dayDiv.classList.add('level-3');
        else dayDiv.classList.add('level-4');

        heatmapContainer.appendChild(dayDiv);
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', fetchLeetCodeStats);

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

// Scroll Animations (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of element is visible
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Smooth Scroll for Safari/Edge fallback
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* --- LeetCode Stats Fetcher --- */
async function fetchLeetCodeStats() {
    const username = "sharmaadevansh"; // Your username
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "success") {
            // Update numbers
            document.getElementById('total-solved').innerText = data.totalSolved;
            document.getElementById('easy-solved').innerText = data.easySolved;
            document.getElementById('medium-solved').innerText = data.mediumSolved;
            document.getElementById('hard-solved').innerText = data.hardSolved;

            // Animate Circle
            // Assuming 500 problems is the "goal" for the full circle
            const totalCircle = document.getElementById('total-circle');
            const percentage = (data.totalSolved / 500) * 220; 
            const offset = 220 - Math.min(percentage, 220); 
            
            totalCircle.style.strokeDashoffset = offset;
        } else {
            console.error("User not found or API error");
        }
    } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
    }
}

// Run the function when page loads
document.addEventListener('DOMContentLoaded', fetchLeetCodeStats);

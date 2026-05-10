document.addEventListener('keydown', (e) => {
    // CMD + S or CTRL + S
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const btn = document.querySelector('.btn-cta-primary');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'translateY(-2px)';
                alert('Get started triggered!');
            }, 100);
        }
    }

    // CMD + D or CTRL + D
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        const btn = document.querySelector('.btn-cta-secondary');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'translateY(-2px)';
                alert('Demo booking triggered!');
            }, 100);
        }
    }
});

// Subtle scroll reveal
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.hero-title, .hero-subtitle, .hero-badges, .hero-cta, .hero-preview').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});

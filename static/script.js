document.addEventListener('DOMContentLoaded', () => {
    const waitlistForm = document.getElementById('waitlist-form');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(waitlistForm);
            const email = formData.get('email');
            
            const submitBtn = waitlistForm.querySelector('button');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Joining...';

            try {
                const response = await fetch('/join', {
                    method: 'POST',
                    body: new URLSearchParams({ email })
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    submitBtn.innerHTML = 'Success! ✨';
                    submitBtn.style.background = '#059669';
                    waitlistForm.reset();
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 3000);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                submitBtn.innerHTML = 'Error ❌';
                submitBtn.style.background = '#dc2626';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }
});

document.addEventListener('keydown', (e) => {
    // CMD + S or CTRL + S
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('waitlist-form');
        if (form) {
            form.querySelector('input').focus();
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

/**
 * PRAJA GUIDE AI - Frontend Controller
 * Architecture: Modular Class-based Vanilla JS
 * Version: 2.4 (Dark Luxury Update with 7-Step Logic)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules based on page context
    const isWizardPage = document.getElementById('wizardForm');
    const isDashboardPage = document.getElementById('total-annual-benefit');

    if (isWizardPage) new WizardController();
    if (isDashboardPage) new DashboardController();
    
    // Global Modules (Always active)
    new AssistantController();
    new UIController();
    
    // Initialize Animations
    initCounters();
    initScrollAnimations();
    
    console.log('🚀 Praja Guide AI: System Operational');
});

/* =========================================
   MODULE 1: WIZARD CONTROLLER (Form Logic)
   ========================================= */
class WizardController {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7; // UPDATED to 7 Steps
        this.form = document.getElementById('wizardForm');
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.progressBar = document.getElementById('progress-bar');
        
        // Step Title Elements (for dynamic updates)
        this.stepTitle = document.getElementById('step-title');
        this.stepDesc = document.getElementById('step-desc');
        this.stepCounter = document.getElementById('step-counter');

        this.titles = [
            "Basic Identity", 
            "Family Profile", 
            "Education & Skills", 
            "Employment Details", 
            "Agriculture Profile", 
            "Social & Living", 
            "Financial Inclusion"
        ];
        
        this.descriptions = [
            "Let's start with who you are", 
            "Tell us about your household composition", 
            "Your qualifications help find scholarships", 
            "Work details help find loans & support", 
            "Specific schemes for farmers & laborers", 
            "Social welfare & housing criteria", 
            "Final checks for bank & subsidy transfers"
        ];
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Next & Prev Buttons (using IDs instead of inline HTML onclick)
        if(this.nextBtn) this.nextBtn.addEventListener('click', () => this.changeStep(1));
        if(this.prevBtn) this.prevBtn.addEventListener('click', () => this.changeStep(-1));

        // Occupation Toggle logic (for specific questions)
        const occupationSelect = document.getElementById('occupationInput');
        if(occupationSelect) {
            occupationSelect.addEventListener('change', (e) => this.handleOccupationChange(e.target.value));
        }

        // 'Enter' key navigation prevention (except textarea)
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
    }

    changeStep(direction) {
        // Validate before moving forward
        if (direction === 1 && !this.validateStep(this.currentStep)) {
            return;
        }

        let nextStep = this.currentStep + direction;

        // LOGIC: Skip Step 5 (Agriculture) if not a Farmer
        if (nextStep === 5) {
            const occ = document.getElementById('occupationInput')?.value;
            // Only show step 5 if occupation is Agriculture
            if (occ !== 'Agriculture') {
                nextStep = (direction === 1) ? 6 : 4; // Skip forward to 6 or back to 4
            }
        }

        // Bounds check
        if (nextStep < 1 || nextStep > this.totalSteps) return;

        // Visual Transitions
        const currentEl = document.getElementById(`step-${this.currentStep}`);
        const nextEl = document.getElementById(`step-${nextStep}`);

        if (!currentEl || !nextEl) return;

        // Hide current
        currentEl.classList.add('hidden');
        currentEl.classList.remove('animate-enter'); 
        
        // Show next
        nextEl.classList.remove('hidden');
        void nextEl.offsetWidth; // Re-trigger animation
        nextEl.classList.add('animate-enter');

        // Update UI Elements
        this.currentStep = nextStep;
        this.updateUI();

        // Smooth Scroll to Top of Form area
        const formTop = this.form.closest('.glass-panel').getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: formTop, behavior: 'smooth' });
    }

    updateUI() {
        // 1. Progress Bar
        if(this.progressBar) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            this.progressBar.style.width = `${percentage}%`;
        }

        // 2. Text Updates (Titles & Counter)
        if(this.stepTitle) this.stepTitle.innerText = this.titles[this.currentStep - 1];
        if(this.stepDesc) this.stepDesc.innerText = this.descriptions[this.currentStep - 1];
        if(this.stepCounter) this.stepCounter.innerText = `${this.currentStep}/${this.totalSteps}`;

        // 3. Button Visibility
        // Previous Button
        if(this.prevBtn) {
            this.currentStep === 1 ? this.prevBtn.classList.add('hidden') : this.prevBtn.classList.remove('hidden');
        }

        // Next Button vs Submit Button
        // Note: The submit button is likely INSIDE step 7's HTML as a distinct button.
        // We hide the generic "Next" button on the final step.
        if(this.nextBtn) {
            if(this.currentStep === this.totalSteps) {
                this.nextBtn.classList.add('hidden'); 
            } else {
                this.nextBtn.classList.remove('hidden');
            }
        }
    }

    validateStep(step) {
        const container = document.getElementById(`step-${step}`);
        const requiredInputs = container.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                // Add error styling
                input.classList.add('border-red-500', 'ring-1', 'ring-red-500');
                
                // Remove error styling on input
                input.addEventListener('input', () => {
                    input.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
                }, {once: true});
            }
        });
        return isValid;
    }

    handleOccupationChange(occupation) {
        // This logic is now mostly handled by skipping Step 5 in changeStep(),
        // but we can use this for any immediate UI feedback if needed.
        // For example, highlighting the Agriculture step indicator if visible.
    }
}

/* =========================================
   MODULE 2: DASHBOARD CONTROLLER (Results)
   ========================================= */
class DashboardController {
    constructor() {
        this.totalBenefitEl = document.getElementById('total-annual-benefit');
        this.monthlyBenefitEl = document.getElementById('monthly-benefit');
        this.avgBenefitEl = document.getElementById('avg-benefit');
        this.schemeCards = document.querySelectorAll('.scheme-card');
        
        this.init();
    }

    init() {
        this.calculateFinancialImpact();
        this.initSimulator();
    }

    calculateFinancialImpact() {
        let totalAmount = 0;

        this.schemeCards.forEach(card => {
            // Logic to pull data attribute or parse text
            // Prefer data attribute if available for cleaner code
            const amountAttr = card.getAttribute('data-benefit');
            if (amountAttr) {
                totalAmount += parseInt(amountAttr);
            } else {
                // Fallback Regex Parsing
                const desc = card.querySelector('.scheme-desc')?.innerText.toLowerCase() || "";
                const lakhMatch = desc.match(/(\d+(\.\d+)?)\s*lakh/);
                const kMatch = desc.match(/(?:rs\.?|₹|inr)\.?\s*(\d+(?:,\d+)*)/);

                if (lakhMatch) {
                    totalAmount += parseFloat(lakhMatch[1]) * 100000;
                } else if (kMatch) {
                    totalAmount += parseInt(kMatch[1].replace(/,/g, ''));
                }
            }
        });

        // Fallback for visual impact if parsing fails but schemes exist
        if (totalAmount === 0 && this.schemeCards.length > 0) totalAmount = 45000;

        if(this.totalBenefitEl) this.animateValue(this.totalBenefitEl, 0, totalAmount, 1500);
        if(this.monthlyBenefitEl) this.animateValue(this.monthlyBenefitEl, 0, Math.round(totalAmount / 12), 1500);
        if(this.avgBenefitEl && this.schemeCards.length > 0) {
            this.animateValue(this.avgBenefitEl, 0, Math.round(totalAmount / this.schemeCards.length), 1500);
        }
    }

    animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
            
            const value = Math.floor(easeProgress * (end - start) + start);
            
            obj.innerHTML = new Intl.NumberFormat('en-IN', { 
                style: 'currency', 
                currency: 'INR', 
                maximumSignificantDigits: 10 
            }).format(value).replace('.00', '');

            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    initSimulator() {
        const rangeInput = document.querySelector('input[type="range"]');
        if(!rangeInput) return;

        rangeInput.addEventListener('input', (e) => {
            // Optional: Logic to update "What-If" numbers
            // console.log("Simulator input:", e.target.value);
        });
    }
}

/* =========================================
   MODULE 3: ASSISTANT CONTROLLER (Real AI)
   ========================================= */
class AssistantController {
    constructor() {
        this.container = document.getElementById('ai-assistant-container');
        this.window = document.getElementById('ai-chat-window');
        this.messagesDiv = document.getElementById('chat-messages');
        this.input = document.getElementById('ai-input');
        this.sendBtn = document.getElementById('ai-send-btn');
        this.toggleBtn = document.getElementById('ai-toggle-btn');
        this.closeBtn = document.getElementById('ai-close-btn');

        this.isProcessing = false; // Prevent multiple requests
        this.init();
    }

    init() {
        if (!this.container) return;

        // Toggle Visibility
        if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggleWindow());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.toggleWindow());

        // Send Message Listeners
        if (this.sendBtn && this.input) {
            this.sendBtn.addEventListener('click', () => this.handleUserMessage());
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !this.isProcessing) this.handleUserMessage();
            });
        }
    }

    toggleWindow() {
        const win = this.window;
        win.classList.toggle('hidden');
        
        if (!win.classList.contains('hidden')) {
            // Open Animation
            setTimeout(() => {
                win.classList.remove('scale-95', 'opacity-0');
                win.classList.add('scale-100', 'opacity-100');
                this.input.focus();
            }, 10);
        } else {
            // Close Animation
            win.classList.add('scale-95', 'opacity-0');
            win.classList.remove('scale-100', 'opacity-100');
        }
    }

    async handleUserMessage() {
        const text = this.input.value.trim();
        if (!text || this.isProcessing) return;

        // 1. UI Setup: Clear input & Lock
        this.input.value = '';
        this.setLoadingState(true);

        // 2. Add User Message to Chat
        this.addMessage(text, 'user');

        // 3. Show Typing Indicator
        const typingId = this.addTypingIndicator();

        try {
            // 4. Fetch Real AI Response
            const reply = await this.fetchAIResponse(text);
            
            // 5. Remove Typing Indicator & Show AI Reply
            this.removeMessage(typingId);
            this.addMessage(reply, 'ai');

        } catch (error) {
            console.error("AI Error:", error);
            this.removeMessage(typingId);
            this.addMessage("Sorry, the assistant is temporarily unavailable. Please check your connection.", 'ai');
        } finally {
            // 6. Unlock UI
            this.setLoadingState(false);
            // Re-focus input for smoother UX
            if (!this.window.classList.contains('hidden')) {
                this.input.focus();
            }
        }
    }

    async fetchAIResponse(userText) {
        // Assuming the chatbot app runs on the same host or is proxied to /chat
        // Error handling included for network failures
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            return data.reply || "I couldn't generate a response.";
        } catch (e) {
            throw e; 
        }
    }

    setLoadingState(isLoading) {
        this.isProcessing = isLoading;
        if (this.sendBtn) {
            this.sendBtn.disabled = isLoading;
            this.sendBtn.style.opacity = isLoading ? '0.5' : '1';
        }
        if (this.input) {
            this.input.disabled = isLoading;
            if(!isLoading) this.input.focus();
        }
    }

    addMessage(text, sender) {
        const div = document.createElement('div');
        const isUser = sender === 'user';
        
        // Updated styling to match the Dark Luxury theme
        div.className = isUser 
            ? 'bg-primary/20 p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl max-w-[85%] border border-primary/30 text-white ml-auto text-right animate-enter shadow-sm'
            : 'bg-surfaceHighlight p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl max-w-[85%] border border-white/10 text-textMuted animate-enter shadow-sm';
        
        div.innerText = text; 
        
        this.messagesDiv.appendChild(div);
        this.scrollToBottom();
        return div;
    }

    addTypingIndicator() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'bg-surfaceHighlight p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl w-16 border border-white/10 flex gap-1 items-center animate-enter';
        div.innerHTML = `
            <div class="w-2 h-2 bg-textMuted/50 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-textMuted/50 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-textMuted/50 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        `;
        this.messagesDiv.appendChild(div);
        this.scrollToBottom();
        return id;
    }

    removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    scrollToBottom() {
        this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }
}

/* =========================================
   MODULE 4: UI CONTROLLER (Global)
   ========================================= */
class UIController {
    constructor() {
        this.initSmoothScroll();
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if(target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

/* =========================================
   MODULE 5: ANIMATIONS UTILS
   ========================================= */

function initCounters() {
    // Only run if counters exist
    const counters = document.querySelectorAll('.counter');
    if(counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                // Calculate increment to fit duration (assuming ~60fps)
                const increment = target / (duration / 16); 
                
                let current = 0;
                const update = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(update);
                    } else {
                        entry.target.innerText = target.toLocaleString() + '+';
                    }
                };
                update();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function initScrollAnimations() {
    // Add this class to elements you want to animate on scroll
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    if(elements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        elements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }
}
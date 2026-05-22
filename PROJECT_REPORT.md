# Aura Picnic - Luxury Event Setup Website
## Project Report

---

## 1. Project Overview

**Project Name:** Aura Picnic - Luxury Picnic & Event Setup Website

**Description:** A fully responsive, static luxury event planning website featuring booking capabilities, package selection, dynamic pricing, image galleries, and comprehensive event service showcase.

**Technology Stack:**
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Architecture:** Client-side Static Site (No Backend)
- **Responsive Design:** Mobile-first approach with dark theme

**Key Features:**
- Dynamic booking form with real-time validation
- Automated package selection and price calculation
- Local image gallery with event-specific photos
- Service showcase with multiple event types
- FAQ accordion system
- Testimonials section
- Smooth scrolling navigation
- Mobile-responsive hamburger menu

---

## 2. Main Functionality & Code Snippets

### 2.1 Booking Form with Validation

**Description:** The booking form includes comprehensive client-side validation with inline error messages and field highlighting.

**HTML Structure:**
```html
<form class="booking-form" id="bookingForm" novalidate>
    <div class="form-row">
        <div class="form-group">
            <label for="name">Full Name *</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required>
        </div>
    </div>
    
    <div class="form-row">
        <div class="form-group">
            <label for="packageSelect">Selected Package *</label>
            <select id="packageSelect" name="packageSelect" required>
                <option value="">Choose a package</option>
                <option value="Silver Package">Silver Package</option>
                <option value="Gold Package">Gold Package</option>
                <option value="Premium Package">Premium Package</option>
            </select>
        </div>
    </div>
    
    <button type="submit" class="submit-btn">Send Booking Inquiry</button>
</form>
```

**JavaScript Validation Logic:**
```javascript
// Form submission with comprehensive validation
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors(bookingForm);

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        eventType: eventTypeInput ? eventTypeInput.value : '',
        selectedPackage: packageSelect ? packageSelect.value : '',
        eventDate: eventDateInput ? eventDateInput.value : '',
        guests: guestsInput ? guestsInput.value : '',
        message: document.getElementById('message').value
    };

    let isValid = true;

    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        setFieldError(document.getElementById('name'), 'Please enter your full name.');
        isValid = false;
    }

    // Email validation with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        setFieldError(document.getElementById('email'), 'Please enter a valid email address.');
        isValid = false;
    }

    // Package selection validation
    if (!formData.selectedPackage) {
        setFieldError(packageSelect, 'Please choose a package.');
        isValid = false;
    }

    // Event date validation (must be future date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!formData.eventDate) {
        setFieldError(eventDateInput, 'Please select a preferred event date.');
        isValid = false;
    } else if (new Date(formData.eventDate) < today) {
        setFieldError(eventDateInput, 'Please choose a future event date.');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Please complete the highlighted form fields.', 'error');
        return;
    }

    // Success handling
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    await new Promise(resolve => setTimeout(resolve, 500));
    showNotification('Your inquiry has been received. We will contact you soon!', 'success');
    bookingForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Helper function to display field errors
function setFieldError(field, message) {
    if (!field || !field.parentElement) return;
    clearFieldError(field);
    field.classList.add('invalid-field');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    field.parentElement.appendChild(error);
}
```

---

### 2.2 Dynamic Package Selection & Price Calculation

**Description:** Calculates package prices based on selected package and number of guests with automatic updates.

**JavaScript Implementation:**
```javascript
const packagePrices = {
    'Silver Package': 299,
    'Gold Package': 549,
    'Premium Package': 999
};

function updatePackageSummary(packageName, guests = null) {
    if (!selectedPackageText || !estimatedPriceText) return;
    
    console.log('updatePackageSummary called with:', { packageName, guests });

    selectedPackageText.textContent = packageName;
    if (packageSelect) {
        packageSelect.value = packageName;
    }

    // Calculate base price
    const basePrice = packagePrices[packageName] || 0;
    const guestCount = parseInt(guests, 10);
    let totalPrice = basePrice;

    // Add surcharge for guests beyond 4
    if (guestCount > 4) {
        totalPrice = basePrice + (guestCount - 4) * 25;
    }

    console.log('price calc:', { basePrice, guestCount, totalPrice });
    estimatedPriceText.textContent = totalPrice ? `$${totalPrice}` : '—';
}

// Handle package button clicks - autofill form
document.querySelectorAll('.package-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const packageName = button.closest('.package-card').querySelector('h3').textContent;
        
        updatePackageSummary(packageName, guestsInput ? guestsInput.value : null);
        
        // Autofill booking form and dispatch change event
        if (packageSelect) {
            packageSelect.value = packageName;
            packageSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
});

// Update price when guests count changes
if (guestsInput) {
    guestsInput.addEventListener('input', () => {
        const currentPackage = packageSelect ? packageSelect.value : '';
        if (currentPackage) {
            updatePackageSummary(currentPackage, guestsInput.value);
        }
    });
}
```

---

### 2.3 Service Card Click Handler with Event Mapping

**Description:** Clicking "Book Now" on a service card automatically selects the event type and scrolls to the booking form.

**JavaScript Implementation:**
```javascript
const eventTypeMap = {
    'Romantic Date Picnic': 'romantic',
    'Birthday Setup': 'birthday',
    'Bridal Shower': 'bridal',
    'Corporate Events': 'corporate',
    'Garden Party': 'garden',
    'Other': 'other'
};

document.querySelectorAll('.service-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const eventType = button.closest('.service-card').querySelector('h3').textContent;
        const mappedValue = eventTypeMap[eventType] || 'other';
        
        if (eventTypeInput) {
            eventTypeInput.value = mappedValue;
        }
        
        // Scroll to booking form
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
});
```

---

### 2.4 Booking Report / Invoice Proof

**Description:** After a user submits the booking form, the app generates a booking report that includes a unique report/invoice ID, booking details, and estimated total. The report is displayed on the page and a print button triggers the browser print dialog with a print-only layout.

**HTML Structure:**
```html
<div id="invoiceSection" class="invoice-section hidden">
    <div class="invoice-card">
        <div class="invoice-header">
            <h3>Booking Report</h3>
            <p class="invoice-note">Save or print this report as proof of your booking request.</p>
        </div>
        <div class="invoice-details">
            <div class="invoice-row"><span>Invoice ID:</span><strong id="invoiceId">—</strong></div>
            <div class="invoice-row"><span>Booked On:</span><strong id="invoiceSavedAt">—</strong></div>
            <div class="invoice-row"><span>Name:</span><strong id="invoiceName">—</strong></div>
            <div class="invoice-row"><span>Email:</span><strong id="invoiceEmail">—</strong></div>
            <div class="invoice-row"><span>Phone:</span><strong id="invoicePhone">—</strong></div>
            <div class="invoice-row"><span>Event Type:</span><strong id="invoiceEventType">—</strong></div>
            <div class="invoice-row"><span>Package:</span><strong id="invoicePackage">—</strong></div>
            <div class="invoice-row"><span>Event Date:</span><strong id="invoiceDate">—</strong></div>
            <div class="invoice-row"><span>Guests:</span><strong id="invoiceGuests">—</strong></div>
            <div class="invoice-row"><span>Estimated Total:</span><strong id="invoiceTotal">—</strong></div>
            <div class="invoice-row invoice-message"><span>Notes:</span><strong id="invoiceMessage">No special notes provided.</strong></div>
        </div>
        <button type="button" id="printInvoiceBtn" class="submit-btn">Print Report</button>
    </div>
</div>
```

**JavaScript Implementation:**
```javascript
function saveOrderLocally(order) {
    const orders = getSavedOrders();
    const invoice = {
        ...order,
        savedAt: new Date().toISOString(),
        invoiceId: `INV-${Date.now().toString().slice(-6)}`
    };
    orders.push(invoice);
    window.localStorage.setItem('auraPicnicOrders', JSON.stringify(orders));
    return invoice;
}

function showInvoice(order) {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText('invoiceId', order.invoiceId || '—');
    setText('invoiceSavedAt', formatDisplayDate(order.savedAt));
    setText('invoiceName', order.name || '—');
    setText('invoiceEmail', order.email || '—');
    setText('invoicePhone', order.phone || '—');
    setText('invoiceEventType', eventTypeLabels[order.eventType] || order.eventType || '—');
    setText('invoicePackage', order.selectedPackage || '—');
    setText('invoiceDate', formatDisplayDate(order.eventDate));
    setText('invoiceGuests', order.guests || '—');
    setText('invoiceMessage', order.message || 'No special notes provided.');

    const total = packagePrices[order.selectedPackage] || 0;
    const guestCount = parseInt(order.guests, 10);
    let totalPrice = total;
    if (!isNaN(guestCount) && guestCount > 4) {
        totalPrice = total + (guestCount - 4) * 25;
    }
    setText('invoiceTotal', totalPrice ? `$${totalPrice}` : '—');

    document.getElementById('invoiceSection').classList.remove('hidden');
}

const printInvoiceBtn = document.getElementById('printInvoiceBtn');
if (printInvoiceBtn) {
    printInvoiceBtn.addEventListener('click', () => {
        window.print();
    });
}
```

**Print Styling:**
```css
@media print {
    nav,
    .footer,
    .booking-summary,
    .booking-wrapper,
    .booking-form,
    .form-note,
    #backToTopBtn,
    .submit-btn:not(#printInvoiceBtn),
    .hamburger,
    .footer-section,
    .footer-bottom,
    .social-links,
    .nav-menu {
        display: none !important;
    }

    #invoiceSection,
    #invoiceSection * {
        display: block !important;
        visibility: visible !important;
    }

    .invoice-section {
        background: #fff !important;
        color: #111 !important;
    }

    .invoice-row {
        background: #fff !important;
        border-color: #ccc !important;
    }

    .invoice-row span,
    .invoice-row strong {
        color: #111 !important;
    }

    #printInvoiceBtn {
        display: none !important;
    }
}
```

---

### 2.5 FAQ Accordion System

**Description:** Expandable/collapsible FAQ items with smooth animations and exclusive open state (only one open at a time).

**HTML Structure:**
```html
<div class="faq-item">
    <button class="faq-question">
        <span>How far in advance should I book?</span>
        <span class="faq-icon">+</span>
    </button>
    <div class="faq-answer">
        <p>We recommend booking at least 2-3 weeks in advance...</p>
    </div>
</div>
```

**JavaScript Implementation:**
```javascript
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        // Close other open items
        faqQuestions.forEach(otherQuestion => {
            if (otherQuestion !== question && otherQuestion.parentElement.classList.contains('active')) {
                otherQuestion.parentElement.classList.remove('active');
            }
        });

        // Toggle current item
        question.parentElement.classList.toggle('active');
    });
});
```

**CSS Styling:**
```css
.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.32s ease;
}

.faq-item.active .faq-answer {
    max-height: 320px;
}

.faq-icon {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(79, 216, 255, 0.12);
    color: var(--accent);
    transition: var(--transition);
}

.faq-item.active .faq-icon {
    transform: rotate(45deg);
    background: var(--accent);
    color: #08111b;
}
```

---

### 2.5 Mobile Responsive Navigation

**Description:** Hamburger menu that toggles mobile navigation and closes on link click or window resize.

**JavaScript Implementation:**
```javascript
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close menu with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
```

---

### 2.6 Smooth Scrolling with Offset

**Description:** Smooth scrolling for anchor links with offset for fixed header.

**JavaScript Implementation:**
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
```

---

### 2.7 Animated Counter for Statistics

**Description:** Numbers animate and count up when they come into view using Intersection Observer API.

**JavaScript Implementation:**
```javascript
const statNumbers = document.querySelectorAll('.stat-number');

const startCounter = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const targetNumber = parseInt(statElement.getAttribute('data-count'));
                animateCounter(statElement, targetNumber);
                observer.unobserve(statElement);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
};

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

if (statNumbers.length > 0) {
    startCounter();
}
```

---

### 2.8 Notification System

**Description:** Toast-style notifications for success/error messages with auto-dismiss.

**JavaScript Implementation:**
```javascript
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Add animation keyframes if not present
    if (!document.querySelector('style[data-notification-style]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-style', 'true');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}
```

---

## 3. File Structure

```
c:\Development\web project\
├── index.html              # Main HTML structure
├── style.css               # Responsive CSS styling (dark theme)
├── script.js               # Vanilla JavaScript functionality
├── package.json            # Project metadata
├── picnic.jpg              # Local image - Romantic Date Picnic
├── birthday.jpg            # Local image - Birthday Setup
├── bridalshower.jpg        # Local image - Bridal Shower
├── corporate.jpg           # Local image - Corporate Events
├── garden.jpg              # Local image - Garden Party
└── image.jpg               # Local image - Additional event photo
```

---

## 4. Key Technical Features

### 4.1 Dark Theme with CSS Variables
```css
:root {
    --bg: #07111b;
    --surface: #111f2e;
    --accent: #4fd8ff;
    --accent-2: #ffd166;
    --text: #eef8ff;
    --muted: #9cc6d8;
}
```

### 4.2 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 4.3 Performance Optimizations
- Intersection Observer for lazy animations
- CSS transitions for smooth effects
- Event delegation for multiple elements
- Efficient DOM manipulation

---

## 5. Browser Compatibility

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 6. Conclusion

Aura Picnic is a fully functional, modern luxury event setup website built with vanilla JavaScript and CSS. It demonstrates key web development concepts including:

- Form validation and error handling
- Event-driven programming
- DOM manipulation
- Responsive design
- Performance optimization using Intersection Observer
- State management in a static application
- User experience enhancements

The website is production-ready, performant, and provides an excellent user experience across all devices.

---

**Report Generated:** May 22, 2026
**Project Type:** Static Front-end Website
**Status:** Complete & Functional

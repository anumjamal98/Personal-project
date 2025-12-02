// contact.js - Contact Form Validation

document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Initialize form validation
    initContactForm();
});

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
    });
}

// Initialize contact form with validation
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Form elements
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Error elements
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    // Success message
    const successMessage = document.getElementById('successMessage');
    
    // Real-time validation
    firstName.addEventListener('input', () => validateField(firstName, firstNameError, validateName));
    lastName.addEventListener('input', () => validateField(lastName, lastNameError, validateName));
    email.addEventListener('input', () => validateField(email, emailError, validateEmail));
    phone.addEventListener('input', () => validateField(phone, phoneError, validatePhone));
    subject.addEventListener('change', () => validateField(subject, subjectError, validateRequired));
    message.addEventListener('input', () => validateField(message, messageError, validateMessage));
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFirstNameValid = validateField(firstName, firstNameError, validateName);
        const isLastNameValid = validateField(lastName, lastNameError, validateName);
        const isEmailValid = validateField(email, emailError, validateEmail);
        const isPhoneValid = phone.value.trim() ? validateField(phone, phoneError, validatePhone) : true; // Optional
        const isSubjectValid = validateField(subject, subjectError, validateRequired);
        const isMessageValid = validateField(message, messageError, validateMessage);
        
        // If all required fields are valid
        if (isFirstNameValid && isLastNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Show success message
            successMessage.classList.remove('d-none');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('d-none');
            }, 5000);
            
            // In real application, you would send data to server here
            console.log('Form submitted with data:', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                subject: subject.value,
                message: message.value
            });
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error-message:not([style*="display: none"])');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// Validate a single field
function validateField(field, errorElement, validationFunction, required = true) {
    const value = field.value.trim();
    
    // If field is empty and not required
    if (!required && !value) {
        hideError(field, errorElement);
        return true;
    }
    
    // If field is empty and required
    if (required && !value) {
        showError(field, errorElement, 'This field is required');
        return false;
    }
    
    // Run specific validation
    const validationResult = validationFunction(value, field);
    if (validationResult.isValid) {
        hideError(field, errorElement);
        return true;
    } else {
        showError(field, errorElement, validationResult.message);
        return false;
    }
}

// Show error
function showError(field, errorElement, message) {
    field.classList.remove('success');
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Hide error
function hideError(field, errorElement) {
    field.classList.remove('error');
    field.classList.add('success');
    errorElement.style.display = 'none';
}

// Validation functions
function validateName(value) {
    if (value.length < 2) {
        return { isValid: false, message: 'Must be at least 2 characters' };
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
        return { isValid: false, message: 'Only letters and spaces allowed' };
    }
    return { isValid: true, message: '' };
}

function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }
    return { isValid: true, message: '' };
}

function validatePhone(value) {
    // Pakistani phone number validation
    const phoneRegex = /^(\+92|0)[0-9]{10}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return { isValid: false, message: 'Please enter a valid Pakistani phone number (e.g., +92XXXXXXXXXX or 0XXXXXXXXXX)' };
    }
    return { isValid: true, message: '' };
}

function validateRequired(value) {
    if (!value) {
        return { isValid: false, message: 'This field is required' };
    }
    return { isValid: true, message: '' };
}

function validateMessage(value) {
    if (value.length < 10) {
        return { isValid: false, message: 'Message must be at least 10 characters' };
    }
    if (value.length > 1000) {
        return { isValid: false, message: 'Message must be less than 1000 characters' };
    }
    return { isValid: true, message: '' };
}
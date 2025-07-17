// Variables globales
let currentSlideIndex = 0;
let slides = [];
let indicators = [];
let autoSlideInterval;

// Funciones globales para el carousel
function changeSlide(direction) {
    if (slides.length === 0) return;

    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');

    currentSlideIndex += direction;

    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }

    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}


// Función para ir a un slide específico (compatibilidad con HTML onclick)
function goToSlideByIndicator(slideIndex) {
    goToSlide(slideIndex - 1);
}


// Función para ir a un slide específico
function goToSlide(slideIndex) {
    if (slides.length === 0 || slideIndex < 0 || slideIndex >= slides.length) return;

    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');

    currentSlideIndex = slideIndex;

    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos DOM
    slides = document.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.indicator');
    
    // Verificar que existan los elementos
    if (slides.length === 0 || indicators.length === 0) {
        console.log('Elementos del carousel no encontrados');
        return;
    }
    
    // Inicializar carousel
    initializeCarousel();
    
    // Inicializar menú móvil
    initializeMobileMenu();
    
    // Inicializar formulario de contacto
    initializeContactForm();
    
    // Inicializar scroll suave
    initializeSmoothScroll();
    
    // Inicializar navegación activa
    initializeActiveNavigation();
    
    // Inicializar animaciones
    setTimeout(animateOnScroll, 100);
});

// Función para inicializar el carousel
function initializeCarousel() {
    // Asegurar que el primer slide esté activo
    if (slides.length > 0) {
        slides[0].classList.add('active');
        indicators[0].classList.add('active');
    }
    
    // Auto-play carousel
    startAutoSlide();
    
    // Agregar event listeners a los controles
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoSlide();
            changeSlide(-1);
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoSlide();
            changeSlide(1);
            startAutoSlide();
        });
    }
    
    // Agregar event listeners a los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
    });
    
    // Pausar auto-slide al hacer hover sobre el carousel
    const carouselSection = document.querySelector('.carousel-section');
    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', stopAutoSlide);
        carouselSection.addEventListener('mouseleave', startAutoSlide);
    }
}

// Función para iniciar el auto-slide
function startAutoSlide() {
    stopAutoSlide(); // Limpiar cualquier intervalo existente
    autoSlideInterval = setInterval(function() {
        changeSlide(1);
    }, 5000);
}

// Función para detener el auto-slide
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Función para inicializar el menú móvil
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Cambiar icono del menú
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Función para inicializar el formulario de contacto
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(contactForm);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validar campos requeridos
            if (!data.nombre || !data.email || !data.mensaje || !data.asunto) {
                showAlert('Por favor, complete todos los campos obligatorios.', 'error');
                return;
            }
            
            // Validar email
            if (!isValidEmail(data.email)) {
                showAlert('Por favor, ingrese un correo electrónico válido.', 'error');
                return;
            }
            
            // Simular envío del formulario
            const submitButton = contactForm.querySelector('.btn-submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simular delay de envío
            setTimeout(function() {
                showAlert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar alertas
function showAlert(message, type) {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos para la alerta
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    if (type === 'success') {
        alert.style.backgroundColor = '#27ae60';
    } else if (type === 'error') {
        alert.style.backgroundColor = '#e74c3c';
    }
    
    // Agregar estilos para el botón de cerrar
    const closeButton = alert.querySelector('.alert-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Agregar al body
    document.body.appendChild(alert);
    
    // Auto-remover después de 5 segundos
    setTimeout(function() {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Función para inicializar scroll suave
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajustar por header fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para inicializar navegación activa
function initializeActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Si estamos en la parte superior, marcar "inicio" como activo
        if (window.scrollY < 200) {
            current = 'inicio';
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Función para animar elementos cuando entran en viewport
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.service-card, .about-text, .contact-form');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Agregar estilos CSS para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert {
        animation: slideInRight 0.3s ease-out;
    }
    
    .nav-menu.active {
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
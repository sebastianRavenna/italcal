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

// Función para ir a un slide específico
function goToSlide(slideIndex) {
    if (slides.length === 0 || slideIndex < 0 || slideIndex >= slides.length) return;

    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');

    currentSlideIndex = slideIndex;

    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

// Función para ir a un slide específico (compatibilidad con HTML onclick)
function goToSlideByIndicator(slideIndex) {
    goToSlide(slideIndex - 1);
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado");
    
    // Inicializar elementos DOM del carousel solo si existen
    slides = document.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.indicator');
    
    // Solo inicializar carousel si los elementos existen
    if (slides.length > 0 && indicators.length > 0) {
        console.log('Elementos del carousel encontrados, inicializando...');
        initializeCarousel();
    } else {
        console.log('Elementos del carousel no encontrados - Saltando inicialización del carousel');
    }
    
    // Estas funciones pueden ejecutarse en cualquier página
    // Inicializar menú móvil
    initializeMobileMenu();

    // Inicializar formulario de contacto
    initializeContactForm();

    // Inicializar scroll suave
    initializeSmoothScroll();

    // Inicializar navegación activa
    initializeActiveNavigation();
    
    // Inicializar navegación fija
    initializeFixedNavigation();
    
    // Inicializar botón flotante de WhatsApp
    initializeWhatsAppButton();
    
    // Inicializar animaciones con delay
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
        
        // Soporte para navegación por teclado
        indicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide();
            }
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
            
            // Obtener valores del formulario usando IDs específicos
            const nombre = document.getElementById('nombre')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const telefono = document.getElementById('telefono')?.value || '';
            const empresa = document.getElementById('empresa')?.value || '';
            const asunto = document.getElementById('asunto')?.value || '';
            const mensaje = document.getElementById('mensaje')?.value || '';
            
            // Validar campos requeridos
            if (!nombre || !email || !telefono || !mensaje || !asunto) {
                showAlert('Por favor, complete todos los campos obligatorios.', 'error');
                return;
            }
            
            // Validar email
            if (!isValidEmail(email)) {
                showAlert('Por favor, ingrese un correo electrónico válido.', 'error');
                return;
            }
            
           // Envío real del formulario
            const formData = new FormData(contactForm);

            fetch('process_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert(data.message, 'success');
                    contactForm.reset();
                } else {
                    showAlert(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error de conexión. Por favor, inténtelo nuevamente.', 'error');
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            });
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
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offsetTop = targetElement.offsetTop - navbarHeight - 20;
                
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
    
    // Función de debounce para mejorar performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    const handleScroll = debounce(function() {
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
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
}

// Función para inicializar navegación fija
function initializeFixedNavigation() {
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('.header');
    
    if (!navbar || !header) return;
    
    function handleFixedNav() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isMobile = window.innerWidth <= 1024; // Considerar tablets también
        
        // En dispositivos móviles, el header es más pequeño
        const headerHeight = isMobile ? header.offsetHeight * 0.8 : header.offsetHeight;
        
        const headerScrolled = Math.min(scrollTop, headerHeight);
        
        if (scrollTop >= headerHeight) {
            navbar.classList.add('fixed-nav');
            document.body.classList.add('nav-fixed');
        } else {
            navbar.classList.remove('fixed-nav');
            document.body.classList.remove('nav-fixed');
            navbar.style.transform = `translateY(-${headerScrolled}px)`;
        }
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    const debouncedHandleFixedNav = debounce(handleFixedNav, 10);
    
    window.addEventListener('scroll', debouncedHandleFixedNav);
    window.addEventListener('resize', debouncedHandleFixedNav);
    
    // Llamar una vez al cargar para establecer el estado inicial
    handleFixedNav();
}

// Función para inicializar el botón flotante de WhatsApp
function initializeWhatsAppButton() {
    // Función para ajustar la posición del botón de WhatsApp
    function adjustWhatsAppButton() {
        const whatsappButton = document.querySelector('.whatsapp-float');
        const footer = document.querySelector('.footer');
        
        if (!whatsappButton || !footer) return;
        
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const buttonHeight = 60; // Altura del botón
        const minMargin = 20; // Margen mínimo
        
        // Si el footer está visible en la pantalla
        if (footerRect.top < windowHeight) {
            const newBottom = windowHeight - footerRect.top + minMargin;
            whatsappButton.style.bottom = newBottom + 'px';
        } else {
            whatsappButton.style.bottom = '20px';
        }
    }
    
    // Ejecutar al cargar la página y al hacer scroll
    window.addEventListener('load', adjustWhatsAppButton);
    window.addEventListener('scroll', adjustWhatsAppButton);
    window.addEventListener('resize', adjustWhatsAppButton);
    
    // Ejecutar inmediatamente si ya está cargado
    adjustWhatsAppButton();
}

// Función para ajustar el carousel según el tamaño de pantalla


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
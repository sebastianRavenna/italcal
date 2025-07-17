// JavaScript específico para la página de calibraciones

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones de las tarjetas
    initializeCardAnimations();
    
    // Inicializar eventos de los botones de MercadoLibre
    initializeMercadoLibreButtons();
    
    // Inicializar efectos de scroll
    initializeScrollEffects();
    
    // Inicializar tooltips
    initializeTooltips();
    
    // Inicializar contador de precios
    initializePriceCounter();
});

// Función para inicializar animaciones de las tarjetas
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.calibracion-card');
    
    // Observador para animar tarjetas cuando entran en viewport
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar elementos internos con delay
                const features = entry.target.querySelectorAll('.calibracion-features li');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.opacity = '1';
                        feature.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Configurar animaciones iniciales
    cards.forEach(card => {
        observer.observe(card);
        
        // Configurar elementos internos
        const features = card.querySelectorAll('.calibracion-features li');
        features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateX(-20px)';
            feature.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    });
}

// Función para inicializar eventos de los botones de MercadoLibre
function initializeMercadoLibreButtons() {
    const buttons = document.querySelectorAll('.btn-mercadolibre');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener información del servicio
            const card = this.closest('.calibracion-card');
            const serviceName = card.querySelector('h3').textContent;
            const price = card.querySelector('.calibracion-price').textContent;
            
            // Mostrar estado de carga
            showLoadingState(this);
            
            // Simular redirección a MercadoLibre
            setTimeout(() => {
                hideLoadingState(this);
                showMercadoLibreModal(serviceName, price);
            }, 1500);
        });
        
        // Agregar efecto hover
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });
}

// Función para mostrar estado de carga en botones
function showLoadingState(button) {
    const originalContent = button.innerHTML;
    button.dataset.originalContent = originalContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
    button.disabled = true;
    button.classList.add('loading');
}

// Función para ocultar estado de carga en botones
function hideLoadingState(button) {
    button.innerHTML = button.dataset.originalContent;
    button.disabled = false;
    button.classList.remove('loading');
}

// Función para mostrar modal de MercadoLibre
function showMercadoLibreModal(serviceName, price) {
    const modal = document.createElement('div');
    modal.className = 'mercadolibre-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Solicitud de Calibración</h3>
                    <button class="modal-close" onclick="closeMercadoLibreModal(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="service-info">
                        <h4>${serviceName}</h4>
                        <p class="service-price">${price}</p>
                    </div>
                    <p>Para solicitar este servicio, puede:</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="redirectToWhatsApp('${serviceName}', '${price}')">
                            <i class="fab fa-whatsapp"></i>
                            Contactar por WhatsApp
                        </button>
                        <button class="btn-secondary" onclick="scrollToContact()">
                            <i class="fas fa-envelope"></i>
                            Completar Formulario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Estilos para el modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(modal);
    
    // Agregar estilos CSS al head si no existen
    addModalStyles();
}

// Función para cerrar modal de MercadoLibre
function closeMercadoLibreModal(button) {
    const modal = button.closest('.mercadolibre-modal');
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Función para redirigir a WhatsApp
function redirectToWhatsApp(serviceName, price) {
    const phone = '541145678900';
    const message = `Hola, me interesa el servicio de ${serviceName} (${price}). ¿Podrían brindarme más información?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Cerrar modal
    const modal = document.querySelector('.mercadolibre-modal');
    if (modal) {
        closeMercadoLibreModal(modal.querySelector('.modal-close'));
    }
}

// Función para scroll al contacto
function scrollToContact() {
    // Cerrar modal primero
    const modal = document.querySelector('.mercadolibre-modal');
    if (modal) {
        closeMercadoLibreModal(modal.querySelector('.modal-close'));
    }
    
    // Scroll suave a la sección de contacto
    setTimeout(() => {
        window.location.href = 'index.html#contacto';
    }, 300);
}

// Función para agregar estilos del modal
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            background: rgba(0, 0, 0, 0.8);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease-out;
        }
        
        .modal-header {
            padding: 30px 30px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
            font-size: 24px;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 5px;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #f8f9fa;
            color: #333;
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .service-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .service-info h4 {
            margin: 0 0 10px;
            color: #2c3e50;
            font-size: 20px;
        }
        
        .service-price {
            color: #27ae60;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
        
        .modal-actions button {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .modal-actions .btn-primary {
            background: #25D366;
            color: white;
        }
        
        .modal-actions .btn-primary:hover {
            background: #128C7E;
        }
        
        .modal-actions .btn-secondary {
            background: #3498db;
            color: white;
        }
        
        .modal-actions .btn-secondary:hover {
            background: #2980b9;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                margin: 20px;
                max-width: none;
            }
            
            .modal-header,
            .modal-body {
                padding: 20px;
            }
            
            .modal-actions {
                flex-direction: column;
            }
            
            .modal-actions button {
                width: 100%;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Función para inicializar efectos de scroll
 function initializeScrollEffects() {
    // Efecto parallax para las imágenes de las tarjetas
   /* const cardImages = document.querySelectorAll('.calibracion-image img');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        cardImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                img.style.transform = `translateY(${rate}px)`;
            }
        });
    });*/
    
    // Efecto de aparición progresiva para los pasos del proceso
    const processSteps = document.querySelectorAll('.proceso-step');
    
    const processObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.3
    });
    
    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        processObserver.observe(step);
    });
} 

// Función para inicializar tooltips
function initializeTooltips() {
    const priceElements = document.querySelectorAll('.calibracion-price');
    
    priceElements.forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.setAttribute('data-tooltip', 'visible');
        });
        
        price.addEventListener('mouseleave', function() {
            this.removeAttribute('data-tooltip');
        });
    });
}

// Función para inicializar contador de precios
function initializePriceCounter() {
    const priceElements = document.querySelectorAll('.calibracion-price');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animatePrice(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    priceElements.forEach(price => {
        observer.observe(price);
    });
}

// Función para animar precios
function animatePrice(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (number) {
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = text.replace(number.toString(), Math.floor(current).toLocaleString());
        }, 30);
    }
}

// Función para filtrar calibraciones por categoría
function filterCalibrations(category) {
    const cards = document.querySelectorAll('.calibracion-card');
    
    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función para buscar calibraciones
function searchCalibrations(query) {
    const cards = document.querySelectorAll('.calibracion-card');
    const searchTerm = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.calibracion-features li'))
            .map(li => li.textContent.toLowerCase())
            .join(' ');
        
        const content = `${title} ${description} ${features}`;
        
        if (content.includes(searchTerm)) {
            card.style.display = 'block';
            highlightSearchTerm(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
}

// Función para resaltar término de búsqueda
function highlightSearchTerm(card, term) {
    const textElements = card.querySelectorAll('h3, p, .calibracion-features li');
    
    textElements.forEach(element => {
        const text = element.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        
        if (highlightedText !== text) {
            element.innerHTML = highlightedText;
        }
    });
}

// Función para comparar calibraciones
function compareCalibrations(cardIds) {
    const comparisonModal = document.createElement('div');
    comparisonModal.className = 'comparison-modal';
    
    const cards = cardIds.map(id => document.getElementById(id));
    const comparisonData = cards.map(card => ({
        title: card.querySelector('h3').textContent,
        price: card.querySelector('.calibracion-price').textContent,
        features: Array.from(card.querySelectorAll('.calibracion-features li'))
            .map(li => li.textContent)
    }));
    
    // Crear tabla de comparación
    let tableHTML = '<table class="comparison-table"><thead><tr><th>Característica</th>';
    comparisonData.forEach(data => {
        tableHTML += `<th>${data.title}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    // Agregar filas de comparación
    tableHTML += '<tr><td><strong>Precio</strong></td>';
    comparisonData.forEach(data => {
        tableHTML += `<td>${data.price}</td>`;
    });
    tableHTML += '</tr>';
    
    // Mostrar modal de comparación
    comparisonModal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content comparison-content">
                <div class="modal-header">
                    <h3>Comparación de Servicios</h3>
                    <button class="modal-close" onclick="this.closest('.comparison-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${tableHTML}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(comparisonModal);
}

// Función para exportar información de calibraciones
function exportCalibrationInfo(format) {
    const cards = document.querySelectorAll('.calibracion-card');
    const data = Array.from(cards).map(card => ({
        titulo: card.querySelector('h3').textContent,
        descripcion: card.querySelector('p').textContent,
        precio: card.querySelector('.calibracion-price').textContent,
        caracteristicas: Array.from(card.querySelectorAll('.calibracion-features li'))
            .map(li => li.textContent.replace(/^.*\s/, ''))
    }));
    
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadFile(blob, 'calibraciones.json');
    } else if (format === 'csv') {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadFile(blob, 'calibraciones.csv');
    }
}

// Función auxiliar para convertir a CSV
function convertToCSV(data) {
    const headers = ['Título', 'Descripción', 'Precio', 'Características'];
    const rows = data.map(item => [
        item.titulo,
        item.descripcion,
        item.precio,
        item.caracteristicas.join('; ')
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    return csvContent;
}

// Función auxiliar para descargar archivos
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para compartir calibración en redes sociales
function shareCalibration(cardElement, platform) {
    const title = cardElement.querySelector('h3').textContent;
    const description = cardElement.querySelector('p').textContent;
    const url = window.location.href;
    
    const shareData = {
        title: `${title} - Italcal`,
        text: description,
        url: url
    };
    
    if (platform === 'native' && navigator.share) {
        navigator.share(shareData);
    } else if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title}\n${shareData.text}\n${shareData.url}`)}`;
        window.open(whatsappUrl, '_blank');
    } else if (platform === 'linkedin') {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
        window.open(linkedinUrl, '_blank');
    }
}

// Agregar eventos globales
window.addEventListener('resize', function() {
    // Recalcular animaciones en resize
    const cards = document.querySelectorAll('.calibracion-card');
    cards.forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = null;
    });
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en calibraciones.js:', e.error);
    
    // Mostrar mensaje de error amigable al usuario
    if (e.error.message.includes('calibracion')) {
        showAlert('Ha ocurrido un error al cargar los servicios de calibración. Por favor, recargue la página.', 'error');
    }
});

// Función para mostrar alertas (reutilizada de index.js)
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
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
    
    document.body.appendChild(alert);
    
    setTimeout(function() {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}
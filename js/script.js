// script.js - Fichier JavaScript global
document.addEventListener('DOMContentLoaded', function() {
    // Création des particules
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Position aléatoire
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Taille aléatoire
            const size = Math.random() * 5 + 2;
            
            // Animation delay
            const delay = Math.random() * 15;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDelay = `${delay}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Animation du header au scroll
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Animation des éléments au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section-header, .news-card, .recruitment-card, .vehicle-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('in-view');
            }
        });
    };
    
    // Initialisation des animations
    window.addEventListener('load', function() {
        createParticles();
        animateOnScroll();
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Système de filtrage pour le catalogue
    const catalogueTabs = document.querySelectorAll('.catalogue-tab');
    const vehicleCards = document.querySelectorAll('.vehicles-grid .vehicle-card');
    const searchInput = document.getElementById('vehicle-search');
    
    if (catalogueTabs.length > 0) {
        catalogueTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Retirer la classe active de tous les onglets
                catalogueTabs.forEach(t => t.classList.remove('active'));
                // Ajouter la classe active à l'onglet cliqué
                tab.classList.add('active');
                
                const category = tab.dataset.category;
                
                // Filtrer les véhicules
                vehicleCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Recherche de véhicules
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            vehicleCards.forEach(card => {
                const vehicleName = card.querySelector('h3').textContent.toLowerCase();
                if (vehicleName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Système d'accordéon pour le recrutement
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    if (accordionBtns.length > 0) {
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const content = btn.nextElementSibling;
                content.classList.toggle('active');
            });
        });
    }
});
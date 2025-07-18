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
    const searchInput = document.getElementById('vehicle-search');
    
    if (catalogueTabs.length > 0) {
        catalogueTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Retirer la classe active de tous les onglets
                catalogueTabs.forEach(t => t.classList.remove('active'));
                // Ajouter la classe active à l'onglet cliqué
                tab.classList.add('active');
                
                const category = tab.dataset.category;
                sortVehicles(); // Actualiser l'affichage
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
    
    // Système de tri pour le catalogue
    const sortSelect = document.getElementById('sort-by');
    const brandFilter = document.getElementById('brand-filter');
    const vehiclesContainer = document.getElementById('vehicles-container');
    let allVehicles = [];
    
    // Charger les véhicules
    function loadVehicles() {
        // Liste complète des véhicules
        const vehiclesData = [
            // Alfa Romeo
            { marque: "Alfa Romeo", modele: "AQV", prix: 28000 * 2, vitesse: 220, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Sportive italienne au design élégant" },
            { marque: "Alfa Romeo", modele: "Giulia", prix: 45000 * 2, vitesse: 240, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Berline sportive italienne" },
            
            // Alpine
            { marque: "Alpine", modele: "A110S", prix: 65000 * 2, vitesse: 280, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Sportive légendaire française" },
            { marque: "Alpine", modele: "A110", prix: 60000 * 2, vitesse: 260, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Icône française de la performance" },
            
            // Audi
            { marque: "Audi", modele: "A6 V-Mod", prix: 70000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle spécial Audi" },
            { marque: "Audi", modele: "A4 Quattro ABT 2017", prix: 50000 * 2, vitesse: 260, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Version sportive de l'A4" },
            { marque: "Audi", modele: "A6", prix: 45000 * 2, vitesse: 240, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Berline de luxe allemande" },
            { marque: "Audi", modele: "A8 Long 2022", prix: 130000 * 2, vitesse: 250, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Haut de gamme Audi avec allongement" },
            { marque: "Audi", modele: "Buffalo", prix: 40000 * 2, vitesse: 230, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle sportif Audi" },
            { marque: "Audi", modele: "E-Tron GT", prix: 140000 * 2, vitesse: 245, category: "luxe", carburant: "Électrique", transmission: "Automatique", description: "Sportive électrique haut de gamme" },
            { marque: "Audi", modele: "Exemplar", prix: 60000 * 2, vitesse: 240, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Modèle exemplaire Audi" },
            { marque: "Audi", modele: "F103", prix: 12000 * 2, vitesse: 180, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Modèle classique Audi" },
            { marque: "Audi", modele: "Q7", prix: 70000 * 2, vitesse: 220, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV premium allemand" },
            { marque: "Audi", modele: "Q8 2020", prix: 95000 * 2, vitesse: 230, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV coupé de luxe" },
            { marque: "Audi", modele: "Q8 2023", prix: 110000 * 2, vitesse: 235, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Dernière génération du Q8" },
            { marque: "Audi", modele: "Q8 Prior Design", prix: 100000 * 2, vitesse: 240, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Édition spéciale Prior Design" },
            { marque: "Audi", modele: "R8 2020", prix: 185000 * 2, vitesse: 330, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Supercar allemande exceptionnelle" },
            { marque: "Audi", modele: "R8 Plus", prix: 180000 * 2, vitesse: 330, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Version améliorée du R8" },
            { marque: "Audi", modele: "R8 V10", prix: 190000 * 2, vitesse: 330, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Avec moteur V10" },
            { marque: "Audi", modele: "R8 VIO", prix: 190000 * 2, vitesse: 330, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Édition spéciale VIO" },
            { marque: "Audi", modele: "RS4 Avant", prix: 75000 * 2, vitesse: 280, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Break sportif" },
            { marque: "Audi", modele: "RS4 Avant DRE", prix: 75000 * 2, vitesse: 280, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Édition DRE" },
            { marque: "Audi", modele: "RS5", prix: 80000 * 2, vitesse: 280, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Coupé sportif" },
            { marque: "Audi", modele: "RS5 2018", prix: 65000 * 2, vitesse: 275, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle 2018" },
            { marque: "Audi", modele: "RS5 2022", prix: 75000 * 2, vitesse: 285, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle 2022" },
            { marque: "Audi", modele: "RS6", prix: 100000 * 2, vitesse: 305, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Break ultra-sportif" },
            { marque: "Audi", modele: "RS6 Mansory", prix: 140000 * 2, vitesse: 320, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Édition Mansory" },
            { marque: "Audi", modele: "RS6 V2", prix: 95000 * 2, vitesse: 300, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Version 2 du RS6" },
            { marque: "Audi", modele: "RS7", prix: 105000 * 2, vitesse: 305, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Berline sportive" },
            { marque: "Audi", modele: "RS7 2013", prix: 70000 * 2, vitesse: 295, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle 2013" },
            { marque: "Audi", modele: "RS7 2021", prix: 110000 * 2, vitesse: 310, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle 2021" },
            { marque: "Audi", modele: "RS7 Mansory", prix: 145000 * 2, vitesse: 320, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Édition Mansory" },
            { marque: "Audi", modele: "RS7 SC820", prix: 135000 * 2, vitesse: 315, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Édition SC820" },
            { marque: "Audi", modele: "RSQ8 Mansory", prix: 150000 * 2, vitesse: 300, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV sportif Mansory" },
            { marque: "Audi", modele: "S8 2022", prix: 120000 * 2, vitesse: 250, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Berline de luxe performante" },
            { marque: "Audi", modele: "SQ7 2016", prix: 85000 * 2, vitesse: 250, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV sportif 2016" },
            { marque: "Audi", modele: "TTS", prix: 60000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Coupé compact sportif" },
            
            // BMW - Nouveaux véhicules ajoutés
            { marque: "BMW", modele: "M235I xDrive", prix: 60000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Coupé sportif compact" },
            { marque: "BMW", modele: "M323", prix: 48000 * 2, vitesse: 240, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Berline sportive" },
            { marque: "BMW", modele: "M140i", prix: 55000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Compacte haute performance" },
            { marque: "BMW", modele: "M3 Touring CSL", prix: 95000 * 2, vitesse: 290, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Break sportif haut de gamme" },
            { marque: "BMW", modele: "G20", prix: 43000 * 2, vitesse: 230, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Série 3 récente" },
            { marque: "BMW", modele: "M330i 2021", prix: 58000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Version sportive 2021" },
            { marque: "BMW", modele: "M3 2022", prix: 88000 * 2, vitesse: 290, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Nouvelle génération 2022" },
            { marque: "BMW", modele: "M4 GTS", prix: 110000 * 2, vitesse: 305, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Édition spéciale performante" },
            { marque: "BMW", modele: "M6 F13", prix: 105000 * 2, vitesse: 305, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Grand tourisme sportif" },
            { marque: "BMW", modele: "M760Li", prix: 160000 * 2, vitesse: 250, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Limousine de luxe V12" },
            { marque: "BMW", modele: "E65", prix: 20000 * 2, vitesse: 230, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Série 7 ancienne génération" },
            { marque: "BMW", modele: "E34", prix: 15000 * 2, vitesse: 220, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Modèle iconique des années 90" },
            
            // Citroën
            { marque: "Citroën", modele: "2CV", prix: 9000 * 2, vitesse: 110, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Icône française intemporelle" },
            { marque: "Citroën", modele: "C4", prix: 20000 * 2, vitesse: 190, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Compacte polyvalente" },
            { marque: "Citroën", modele: "DS3", prix: 19000 * 2, vitesse: 195, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Citadine au design unique" },
            { marque: "Citroën", modele: "DS4", prix: 23000 * 2, vitesse: 200, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Compacte premium" },
            { marque: "Citroën", modele: "DS7", prix: 33000 * 2, vitesse: 210, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "SUV premium français" },
            { marque: "Citroën", modele: "E-Mehari", prix: 17000 * 2, vitesse: 110, category: "classique", carburant: "Électrique", transmission: "Automatique", description: "Version électrique du Méhari" },
            { marque: "Citroën", modele: "Xantia", prix: 11000 * 2, vitesse: 190, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Berline confortable" },
            
            // Dacia
            { marque: "Dacia", modele: "Sandero", prix: 14000 * 2, vitesse: 170, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Citadine économique" },
            { marque: "Dacia", modele: "Stepway 2021", prix: 16000 * 2, vitesse: 175, category: "suv", carburant: "Essence", transmission: "Manuelle", description: "Version crossover" },
            
            // Ferrari
            { marque: "Ferrari", modele: "California T 2015", prix: 210000 * 2, vitesse: 320, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Cabriolet sportif italien" },
            { marque: "Ferrari", modele: "458 Italia", prix: 240000 * 2, vitesse: 330, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Supercar italienne" },
            { marque: "Ferrari", modele: "FCT", prix: 220000 * 2, vitesse: 325, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle spécial Ferrari" },
            { marque: "Ferrari", modele: "F8 Tributo 2020", prix: 270000 * 2, vitesse: 340, category: "sport", carburant: "Essence", transmission: "Automatique", description: "F8 Tributo 2020" },
            { marque: "Ferrari", modele: "TDF", prix: 290000 * 2, vitesse: 335, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Ferrari de collection" },
            
            // Ford
            { marque: "Ford", modele: "F150 Raptor", prix: 60000 * 2, vitesse: 180, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Pick-up performant" },
            { marque: "Ford", modele: "Mustang Fastback 1966", prix: 45000 * 2, vitesse: 200, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Légende américaine" },
            { marque: "Ford", modele: "Mustang GT", prix: 50000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Version sportive" },
            { marque: "Ford", modele: "Raptor 2017", prix: 65000 * 2, vitesse: 185, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Modèle 2017" },
            
            // Hyundai
            { marque: "Hyundai", modele: "Elantra CN7 N Line", prix: 23000 * 2, vitesse: 230, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Berline sportive" },
            { marque: "Hyundai", modele: "i20 N", prix: 25000 * 2, vitesse: 230, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Citadine sportive" },
            
            // Jeep
            { marque: "Jeep", modele: "Cherokee Trackhawk", prix: 75000 * 2, vitesse: 290, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV ultra-performant" },
            { marque: "Jeep", modele: "2012", prix: 45000 * 2, vitesse: 190, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Modèle 2012" },
            
            // Kia
            { marque: "Kia", modele: "Sportage", prix: 27000 * 2, vitesse: 200, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV polyvalent" },
            
            // Lexus
            { marque: "Lexus", modele: "LFA", prix: 375000 * 2, vitesse: 325, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Supercar japonaise exclusive" },
            { marque: "Lexus", modele: "LX600", prix: 120000 * 2, vitesse: 210, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV de luxe" },
            
            // McLaren
            { marque: "McLaren", modele: "720S", prix: 280000 * 2, vitesse: 340, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Supercar britannique" },
            { marque: "McLaren", modele: "720S Alt", prix: 275000 * 2, vitesse: 340, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Autre version du 720S" },
            
            // Mercedes
            { marque: "Mercedes", modele: "S500", prix: 120000 * 2, vitesse: 250, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Berline haut de gamme" },
            { marque: "Mercedes", modele: "A45 AMG", prix: 60000 * 2, vitesse: 270, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Compacte sportive" },
            { marque: "Mercedes", modele: "C63 W205", prix: 90000 * 2, vitesse: 290, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Coupé sportif" },
            { marque: "Mercedes", modele: "CLS63S", prix: 110000 * 2, vitesse: 300, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Coupé 4 portes sportif" },
            { marque: "Mercedes", modele: "E63S F", prix: 105000 * 2, vitesse: 300, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Berline sportive" },
            { marque: "Mercedes", modele: "E63 W213", prix: 110000 * 2, vitesse: 300, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle W213" },
            { marque: "Mercedes", modele: "E63 2014", prix: 95000 * 2, vitesse: 295, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Modèle 2014" },
            { marque: "Mercedes", modele: "GLC63 AMG", prix: 100000 * 2, vitesse: 280, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV sportif" },
            { marque: "Mercedes", modele: "GLE", prix: 85000 * 2, vitesse: 230, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV familial" },
            { marque: "Mercedes", modele: "GLE 450", prix: 90000 * 2, vitesse: 240, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Version 450" },
            { marque: "Mercedes", modele: "GLA45", prix: 62000 * 2, vitesse: 250, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV compact sportif" },
            { marque: "Mercedes", modele: "S63 AMG 2018", prix: 135000 * 2, vitesse: 300, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Berline de luxe sportive" },
            
            // Opel
            { marque: "Opel", modele: "Insignia Tourer", prix: 32000 * 2, vitesse: 220, category: "classique", carburant: "Diesel", transmission: "Automatique", description: "Break familial" },
            
            // Peugeot
            { marque: "Peugeot", modele: "106", prix: 10000 * 2, vitesse: 160, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Citadine économique" },
            { marque: "Peugeot", modele: "108", prix: 14000 * 2, vitesse: 165, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Citadine urbaine" },
            { marque: "Peugeot", modele: "108 (Alt)", prix: 14500 * 2, vitesse: 165, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Version alternative" },
            { marque: "Peugeot", modele: "205", prix: 9000 * 2, vitesse: 170, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Légende des années 80" },
            { marque: "Peugeot", modele: "205 GTI", prix: 16000 * 2, vitesse: 200, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Version sportive mythique" },
            { marque: "Peugeot", modele: "206", prix: 12000 * 2, vitesse: 180, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Citadine populaire" },
            { marque: "Peugeot", modele: "206 CC", prix: 15000 * 2, vitesse: 185, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Coupé cabriolet" },
            { marque: "Peugeot", modele: "206 GTI", prix: 18000 * 2, vitesse: 210, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Version sportive" },
            { marque: "Peugeot", modele: "207", prix: 16000 * 2, vitesse: 185, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Successeur de la 206" },
            { marque: "Peugeot", modele: "207 Sport", prix: 18000 * 2, vitesse: 210, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Version sportive" },
            { marque: "Peugeot", modele: "208", prix: 21000 * 2, vitesse: 190, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Citadine moderne" },
            { marque: "Peugeot", modele: "307 CC", prix: 19000 * 2, vitesse: 195, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Coupé cabriolet" },
            { marque: "Peugeot", modele: "308", prix: 24000 * 2, vitesse: 200, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Compacte française" },
            { marque: "Peugeot", modele: "308 (2022)", prix: 26000 * 2, vitesse: 210, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Modèle 2022" },
            { marque: "Peugeot", modele: "308 GTI", prix: 28000 * 2, vitesse: 240, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Version sportive" },
            { marque: "Peugeot", modele: "405 GLX", prix: 10000 * 2, vitesse: 190, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Berline des années 90" },
            { marque: "Peugeot", modele: "406", prix: 12000 * 2, vitesse: 200, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Berline familiale" },
            { marque: "Peugeot", modele: "504", prix: 9000 * 2, vitesse: 170, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Classique des années 70" },
            { marque: "Peugeot", modele: "508 GT Line", prix: 33000 * 2, vitesse: 230, category: "luxe", carburant: "Hybride", transmission: "Automatique", description: "Berline premium" },
            { marque: "Peugeot", modele: "Bipper", prix: 13000 * 2, vitesse: 155, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire compact" },
            { marque: "Peugeot", modele: "Boxer", prix: 25000 * 2, vitesse: 160, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire lourd" },
            { marque: "Peugeot", modele: "Expert", prix: 28000 * 2, vitesse: 170, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire polyvalent" },
            { marque: "Peugeot", modele: "F44", prix: 23000 * 2, vitesse: 200, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Modèle spécial" },
            { marque: "Peugeot", modele: "RCZ", prix: 27000 * 2, vitesse: 230, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Coupé sportif" },
            { marque: "Peugeot", modele: "Rifter 2019", prix: 21000 * 2, vitesse: 180, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "Monospace spacieux" },
            
            // Renault
            { marque: "Renault", modele: "Captur 2020", prix: 23000 * 2, vitesse: 180, category: "suv", carburant: "Diesel", transmission: "Automatique", description: "SUV compact moderne" },
            { marque: "Renault", modele: "Clio I.7", prix: 18000 * 2, vitesse: 170, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Version économique" },
            { marque: "Renault", modele: "Clio I.I", prix: 16000 * 2, vitesse: 160, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Entrée de gamme" },
            { marque: "Renault", modele: "Clio RS", prix: 22000 * 2, vitesse: 230, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Version sportive" },
            { marque: "Renault", modele: "Clio RS 2000", prix: 25000 * 2, vitesse: 235, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Avec moteur 2.0L" },
            { marque: "Renault", modele: "Clio SW", prix: 21000 * 2, vitesse: 185, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Version break" },
            { marque: "Renault", modele: "Clio V", prix: 21000 * 2, vitesse: 190, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Dernière génération" },
            { marque: "Renault", modele: "DC2", prix: 24000 * 2, vitesse: 180, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Modèle classique" },
            { marque: "Renault", modele: "Espace III", prix: 17000 * 2, vitesse: 190, category: "suv", carburant: "Diesel", transmission: "Automatique", description: "Monospace familial" },
            { marque: "Renault", modele: "Kangoo", prix: 19000 * 2, vitesse: 170, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire compact" },
            { marque: "Renault", modele: "Koleos", prix: 30000 * 2, vitesse: 200, category: "suv", carburant: "Diesel", transmission: "Automatique", description: "SUV familial" },
            { marque: "Renault", modele: "Laguna", prix: 22000 * 2, vitesse: 220, category: "classique", carburant: "Diesel", transmission: "Automatique", description: "Berline haut de gamme" },
            { marque: "Renault", modele: "Mégane 2 Phase 1", prix: 19000 * 2, vitesse: 190, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Deuxième génération" },
            { marque: "Renault", modele: "Mégane Break", prix: 23000 * 2, vitesse: 200, category: "classique", carburant: "Diesel", transmission: "Automatique", description: "Version break" },
            { marque: "Renault", modele: "Mégane CC", prix: 24000 * 2, vitesse: 210, category: "luxe", carburant: "Essence", transmission: "Automatique", description: "Coupé cabriolet" },
            { marque: "Renault", modele: "Mégane Sport", prix: 27000 * 2, vitesse: 250, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Compacte sportive" },
            { marque: "Renault", modele: "PACEV", prix: 25000 * 2, vitesse: 190, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV compact moderne" },
            { marque: "Renault", modele: "RS Clio", prix: 26000 * 2, vitesse: 240, category: "sport", carburant: "Essence", transmission: "Manuelle", description: "Version la plus sportive" },
            { marque: "Renault", modele: "T1", prix: 15000 * 2, vitesse: 160, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire robuste" },
            { marque: "Renault", modele: "Traffic 2019", prix: 28000 * 2, vitesse: 170, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire récent" },
            { marque: "Renault", modele: "Traffic 66", prix: 27000 * 2, vitesse: 160, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Version ancienne" },
            { marque: "Renault", modele: "Traffic 99", prix: 23000 * 2, vitesse: 165, category: "classique", carburant: "Diesel", transmission: "Manuelle", description: "Version des années 90" },
            { marque: "Renault", modele: "Twingo", prix: 13000 * 2, vitesse: 155, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Citadine pratique" },
            { marque: "Renault", modele: "Twizy", prix: 10000 * 2, vitesse: 80, category: "classique", carburant: "Électrique", transmission: "Automatique", description: "Véhicule électrique urbain" },
            { marque: "Renault", modele: "Zoe", prix: 22000 * 2, vitesse: 135, category: "classique", carburant: "Électrique", transmission: "Automatique", description: "Citadine électrique" },
            
            // SEAT
            { marque: "SEAT", modele: "Tarraco", prix: 30000 * 2, vitesse: 210, category: "suv", carburant: "Essence", transmission: "Automatique", description: "SUV familial espagnol" },
            
            // Skoda
            { marque: "Skoda", modele: "Kodiaq", prix: 33000 * 2, vitesse: 215, category: "suv", carburant: "Diesel", transmission: "Automatique", description: "SUV spacieux" },
            { marque: "Skoda", modele: "Octavia 2017", prix: 22000 * 2, vitesse: 200, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Berline compacte 2017" },
            { marque: "Skoda", modele: "Octavia 2020", prix: 27000 * 2, vitesse: 220, category: "classique", carburant: "Essence", transmission: "Automatique", description: "Modèle 2020" },
            
            // Toyota
            { marque: "Toyota", modele: "AL18", prix: 20000 * 2, vitesse: 180, category: "classique", carburant: "Essence", transmission: "Manuelle", description: "Modèle économique" },
            { marque: "Toyota", modele: "Tacoma Fox", prix: 35000 * 2, vitesse: 190, category: "suv", carburant: "Essence", transmission: "Automatique", description: "Pick-up robuste" },
            { marque: "Toyota", modele: "Supra Fox", prix: 55000 * 2, vitesse: 280, category: "sport", carburant: "Essence", transmission: "Automatique", description: "Sportive légendaire" },
            { marque: "Toyota", modele: "Land Cruiser J79", prix: 60000 * 2, vitesse: 200, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "SUV tout-terrain" },
            
            // Volkswagen
            { marque: "Volkswagen", modele: "Caddy 2020", prix: 25000 * 2, vitesse: 190, category: "suv", carburant: "Diesel", transmission: "Manuelle", description: "Utilitaire compact" },
            
            // Moto
            { marque: "Plaggio", modele: "Zip", prix: 2500.00 * 2, vitesse: 110, category: "moto", carburant: "Essence", transmission: "Automatique", description: "Scooter urbain économique" },
            { marque: "Frakas", modele: "", prix: 3500.00 * 2, vitesse: 130, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto polyvalente" },
            { marque: "Dirt Bike", modele: "", prix: 4000.00 * 2, vitesse: 90, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto tout-terrain" },
            { marque: "Honda", modele: "CR85", prix: 5000.00 * 2, vitesse: 100, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto de compétition légère" },
            { marque: "Suzuki", modele: "RMZI25", prix: 6000.00 * 2, vitesse: 120, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto enduro" },
            { marque: "Yamaha", modele: "XMax 2017", prix: 6000.00 * 2, vitesse: 135, category: "moto", carburant: "Essence", transmission: "Automatique", description: "Scooter maxi" },
            { marque: "Suzuki", modele: "RMZ250 2015", prix: 6500.00 * 2, vitesse: 130, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto de motocross" },
            { marque: "Yamaha", modele: "YZ450", prix: 6900.00 * 2, vitesse: 140, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto de cross performante" },
            { marque: "Honda", modele: "CRF450 2015", prix: 7000.00 * 2, vitesse: 140, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Enduro compétition" },
            { marque: "Suzuki", modele: "RMZ250 V3", prix: 7000.00 * 2, vitesse: 130, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto de motocross" },
            { marque: "KTM", modele: "SXF450", prix: 7200.00 * 2, vitesse: 145, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto de cross haute performance" },
            { marque: "Yamaha", modele: "TMax DX", prix: 8500.00 * 2, vitesse: 170, category: "moto", carburant: "Essence", transmission: "Automatique", description: "Scooter sportif" },
            { marque: "Honda", modele: "CBR650R", prix: 9000.00 * 2, vitesse: 200, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Sportive roadster" },
            { marque: "Twin Cam", modele: "Custom", prix: 11000.00 * 2, vitesse: 180, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto custom" },
            { marque: "Yamaha", modele: "YZF", prix: 12000.00 * 2, vitesse: 220, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Sportive légendaire" },
            { marque: "Yamaha", modele: "YZF SM2", prix: 13000.00 * 2, vitesse: 230, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "SuperMotard" },
            { marque: "Kawasaki", modele: "ZX10R", prix: 15000.00 * 2, vitesse: 250, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Sportive de compétition" },
            { marque: "Yamaha", modele: "RI Gwop", prix: 16000.00 * 2, vitesse: 240, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Moto sportive exclusive" },
            { marque: "BMW", modele: "S1000RR", prix: 18000.00 * 2, vitesse: 250, category: "moto", carburant: "Essence", transmission: "Manuelle", description: "Superbike allemande" }
        ];
        
        // Générer le HTML pour chaque véhicule
        vehiclesData.forEach(vehicle => {
            const vehicleCard = document.createElement('div');
            vehicleCard.className = `vehicle-card in-view`;
            vehicleCard.dataset.category = vehicle.category;
            vehicleCard.dataset.brand = vehicle.marque;
            vehicleCard.dataset.price = vehicle.prix;
            vehicleCard.dataset.speed = vehicle.vitesse;
            
            vehicleCard.innerHTML = `
                <div class="vehicle-image" style="background-image: url('https://via.placeholder.com/300x200?text=${vehicle.marque}+${vehicle.modele}');"></div>
                <div class="vehicle-price">${vehicle.prix.toLocaleString('fr-FR')}€</div>
                <div class="vehicle-info">
                    <h3>${vehicle.marque} ${vehicle.modele}</h3>
                    <div class="vehicle-specs">
                        <div class="spec"><i class="fas fa-tachometer-alt"></i> ${vehicle.vitesse} km/h</div>
                        <div class="spec"><i class="fas fa-gas-pump"></i> ${vehicle.carburant}</div>
                        <div class="spec"><i class="fas fa-cogs"></i> ${vehicle.transmission}</div>
                    </div>
                    <p>${vehicle.description}</p>
                    <a href="#" class="vehicle-details">Voir détails <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            vehiclesContainer.appendChild(vehicleCard);
        });

        allVehicles = [...document.querySelectorAll('.vehicle-card')];
        populateBrandFilter();
        animateOnScroll();
    }

    // Peupler le filtre des marques
    function populateBrandFilter() {
        const brands = [...new Set(allVehicles.map(v => v.dataset.brand))].sort();
        // Ajouter les marques de motos manquantes
        const motoBrands = ["Plaggio", "Frakas", "Dirt Bike", "Twin Cam"];
        const allBrands = [...new Set([...brands, ...motoBrands])].sort();
        
        allBrands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter.appendChild(option);
        });
    }

    // Fonctions de tri
    function sortVehicles() {
        const sortValue = sortSelect.value;
        const brandValue = brandFilter.value;
        const activeCategory = document.querySelector('.catalogue-tab.active').dataset.category;
        
        let sortedVehicles = [...allVehicles];
        
        // Appliquer le filtre de marque
        if (brandValue !== 'all') {
            sortedVehicles = sortedVehicles.filter(v => v.dataset.brand === brandValue);
        }
        
        // Appliquer le filtre de catégorie
        if (activeCategory !== 'all') {
            sortedVehicles = sortedVehicles.filter(v => v.dataset.category === activeCategory);
        }
        
        // Appliquer le tri
        switch(sortValue) {
            case 'price-asc':
                sortedVehicles.sort((a, b) => a.dataset.price - b.dataset.price);
                break;
            case 'price-desc':
                sortedVehicles.sort((a, b) => b.dataset.price - a.dataset.price);
                break;
            case 'name-asc':
                sortedVehicles.sort((a, b) => 
                    a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
                break;
            case 'name-desc':
                sortedVehicles.sort((a, b) => 
                    b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent));
                break;
            case 'speed-asc':
                sortedVehicles.sort((a, b) => a.dataset.speed - b.dataset.speed);
                break;
            case 'speed-desc':
                sortedVehicles.sort((a, b) => b.dataset.speed - a.dataset.speed);
                break;
        }
        
        // Mettre à jour l'affichage
        vehiclesContainer.innerHTML = '';
        sortedVehicles.forEach(v => vehiclesContainer.appendChild(v));
    }
    
    // Recherche de véhicules
    function searchVehicles() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.catalogue-tab.active').dataset.category;
        const brandValue = brandFilter.value;
        
        let filteredVehicles = [...allVehicles];
        
        // Appliquer le filtre de catégorie
        if (activeCategory !== 'all') {
            filteredVehicles = filteredVehicles.filter(v => v.dataset.category === activeCategory);
        }
        
        // Appliquer le filtre de marque
        if (brandValue !== 'all') {
            filteredVehicles = filteredVehicles.filter(v => v.dataset.brand === brandValue);
        }
        
        // Appliquer la recherche
        if (searchTerm) {
            filteredVehicles = filteredVehicles.filter(v => {
                const vehicleName = v.querySelector('h3').textContent.toLowerCase();
                return vehicleName.includes(searchTerm);
            });
        }
        
        // Mettre à jour l'affichage
        vehiclesContainer.innerHTML = '';
        filteredVehicles.forEach(v => vehiclesContainer.appendChild(v));
    }

    // Écouteurs d'événements
    if (sortSelect && brandFilter && searchInput) {
        sortSelect.addEventListener('change', sortVehicles);
        brandFilter.addEventListener('change', sortVehicles);
        searchInput.addEventListener('input', searchVehicles);
        
        // Charger les véhicules au démarrage
        loadVehicles();
    }
});
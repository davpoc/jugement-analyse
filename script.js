document.addEventListener('DOMContentLoaded', () => {
    console.log("SCRIPT: DOM entièrement chargé et analysé.");

    const originalCategoriesData = [ 
        { name: "Communication / Prise de parole", examples: [ { judgment: "Il ne sait pas s’exprimer.", analysis: "Son discours manque de structure et les idées clés ne sont pas claires." }, { judgment: "Elle est trop agressive quand elle parle.", analysis: "Elle hausse le ton, interrompt souvent et utilise des formulations très directives." }, { judgment: "C’était nul comme présentation.", analysis: "Il a lu ses slides sans regarder le public et n’a pas donné d’exemple concret." }, { judgment: "Il parle pour rien dire.", analysis: "Ses interventions sont longues, et souvent hors sujet par rapport à la discussion." } ] },
        { name: "Leadership / Management", examples: [ { judgment: "Il est un mauvais manager.", analysis: "Il ne donne pas d’objectifs clairs et ne suit pas les résultats de son équipe." }, { judgment: "Elle n’a pas de leadership.", analysis: "Elle ne prend pas de décision en réunion et n’intervient pas quand l’équipe dévie." }, { judgment: "C’est un tyran.", analysis: "Il impose des décisions sans consultation et coupe la parole à ses collaborateurs." }, { judgment: "Il est trop laxiste.", analysis: "Il ne recadre pas les retards ni les erreurs répétées de ses collaborateurs." } ] },
        { name: "Vente / Relation client", examples: [ { judgment: "Il ne sait pas vendre.", analysis: "Il présente directement le produit sans poser de questions sur les besoins." }, { judgment: "Elle est trop pushy.", analysis: "Elle insiste pour conclure la vente sans valider les objections du client." }, { judgment: "C’est un commercial froid.", analysis: "Il n’établit pas de contact personnel ni de reformulation empathique avec le client." }, { judgment: "Il ne comprend rien au besoin client.", analysis: "Il reformule rarement et pose des questions fermées uniquement." } ] },
        { name: "Attitude en réunion / posture professionnelle", examples: [ { judgment: "Il ne fout rien en réunion.", analysis: "Il ne prend pas la parole et ne propose pas de solution." }, { judgment: "Elle est passive.", analysis: "Elle écoute sans poser de questions ni prendre d’engagement à l’issue." }, { judgment: "Il est toujours négatif.", analysis: "Il commence souvent ses phrases par des critiques sans proposer d’alternative." }, { judgment: "C’est un râleur.", analysis: "Il met en avant les risques et les obstacles sans chercher de solution." } ] },
        { name: "Compétences / Performance", examples: [ { judgment: "Elle est incompétente.", analysis: "Elle a du mal à appliquer la procédure sans support ou accompagnement." }, { judgment: "Il est trop lent.", analysis: "Il dépasse régulièrement les délais sur des tâches simples, même après plusieurs réalisations." }, { judgment: "Ce collaborateur est inutile.", analysis: "Ses livrables sont rarement utilisés car ils ne sont pas alignés avec les besoins des autres équipes." }, { judgment: "Elle n’est pas autonome.", analysis: "Elle demande souvent une validation pour des tâches qu’elle maîtrise pourtant bien." } ] },
        { name: "Attitude / Motivation", examples: [ { judgment: "Il s’en fout.", analysis: "Il ne pose pas de questions et ne réagit pas aux demandes du manager." }, { judgment: "Elle n’a aucune motivation.", analysis: "Elle ne participe pas aux réunions d’équipe et n’a pas exprimé ses objectifs personnels." }, { judgment: "Il ne veut pas progresser.", analysis: "Il n’applique pas les retours faits après plusieurs séances de feedback." }, { judgment: "C’est un fainéant.", analysis: "Il cherche toujours à déléguer ou réduire ses responsabilités sans justification." } ] },
        { name: "Coopération / Relation aux autres", examples: [ { judgment: "Il est individualiste.", analysis: "Il ne partage pas l’information et ne participe pas aux projets d’équipe." }, { judgment: "Elle est toxique.", analysis: "Elle critique souvent ses collègues sans faits, en leur absence." }, { judgment: "Il crée des tensions.", analysis: "Il réagit souvent sur un ton sec ou ironique, ce qui génère de l’agacement chez les autres." }, { judgment: "Elle est dans le conflit permanent.", analysis: "Elle contredit régulièrement ses collègues en réunion, sans chercher à comprendre leur point de vue." }, { judgment: "C’est une drama queen.", analysis: "Elle exprime fortement ses émotions au moindre désaccord, ce qui déséquilibre l’échange." }, { judgment: "Il ne supporte pas la contradiction.", analysis: "Il coupe la parole dès qu’on exprime un désaccord avec ses idées." } ] }
    ];

    const slideContainer = document.querySelector('.slide-container');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const slideIndicator = document.getElementById('slide-indicator');
    const progressBarFill = document.getElementById('progress-bar');
    const categoryCheckboxesContainer = document.getElementById('category-checkboxes');
    const showSelectedCardsBtn = document.getElementById('show-selected-cards-btn');

    if (!slideContainer) console.error("SCRIPT ERREUR: .slide-container non trouvé !");
    if (!prevButton) console.error("SCRIPT ERREUR: #prev-slide non trouvé !");
    if (!nextButton) console.error("SCRIPT ERREUR: #next-slide non trouvé !");

    let currentSlideIndex = 0;
    let slides = []; 
    let dynamicSlidesStartIndex = 5; 

    const judgmentIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="icon-svg judgment-icon"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    const analysisIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="icon-svg analysis-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

    // Fonction pour créer l'élément de branding (réintroduite)
    function createBrandingElement() {
        const brandingDiv = document.createElement('div');
        brandingDiv.classList.add('slide-branding');
        brandingDiv.innerHTML = `
            <img src="dpaucot blanc.png" alt="Logo Personnel Coach" class="branding-logo">
            <div class="branding-info">
                <p><strong>David Paucot</strong> - Formateur & Coach</p>
                <p class="small-text">Diplômé en P.N.L et Hypnose Ericksonienne.</p>
                <p class="small-text">contact@personnelcoach.com / Copyright © 2025 personnelcoach</p>
            </div>
        `;
        return brandingDiv;
    }

    function createCardElement(exampleData) {
        const card = document.createElement('div'); card.classList.add('card');
        const cardFront = document.createElement('div'); cardFront.classList.add('card-face', 'card-front');
        cardFront.innerHTML = `${judgmentIconSVG}<p class="text">${exampleData.judgment}</p>`;
        const cardBack = document.createElement('div'); cardBack.classList.add('card-face', 'card-back');
        cardBack.innerHTML = `${analysisIconSVG}<p class="text">${exampleData.analysis}</p>`;
        card.appendChild(cardFront); card.appendChild(cardBack);
        card.addEventListener('click', () => card.classList.toggle('is-flipped'));
        return card;
    }

    function populateCategoryCheckboxes() {
        if (!categoryCheckboxesContainer) { console.warn("SCRIPT INFO: populateCategoryCheckboxes - conteneur non trouvé."); return; }
        categoryCheckboxesContainer.innerHTML = '';
        originalCategoriesData.forEach((category, index) => {
            const item = document.createElement('div'); item.classList.add('category-checkbox-item');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.id = `category-check-${index}`;
            checkbox.value = category.name; checkbox.checked = true; 
            const label = document.createElement('label');
            label.htmlFor = `category-check-${index}`; label.textContent = category.name.split(' / ')[0];
            item.appendChild(checkbox); item.appendChild(label);
            categoryCheckboxesContainer.appendChild(item);
        });
        console.log("SCRIPT: Checkboxes des catégories peuplées.");
    }
    
    function createDynamicCategorySlides() {
        console.log("SCRIPT: Appel de createDynamicCategorySlides");
        const dynamicSlidesOld = slideContainer.querySelectorAll('.category-slide');
        dynamicSlidesOld.forEach(s => s.remove());
        
        const selectedCategories = [];
        if (categoryCheckboxesContainer) {
            categoryCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                selectedCategories.push(checkbox.value);
            });
        }
        const categoriesToDisplay = originalCategoriesData.filter(cat => selectedCategories.includes(cat.name));

        categoriesToDisplay.forEach((category, index) => {
            const categorySlide = document.createElement('section');
            categorySlide.classList.add('slide', 'category-slide'); 
            categorySlide.id = `slide-category-dynamic-${index}`;
            const slideContent = document.createElement('div'); 
            slideContent.classList.add('slide-content', 'centered-content'); 
            const categoryTitle = document.createElement('h2'); 
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = category.name; 
            slideContent.appendChild(categoryTitle);
            const gridContainer = document.createElement('div'); 
            gridContainer.classList.add('examples-grid-container');
            const examplesGrid = document.createElement('div'); 
            examplesGrid.classList.add('examples-grid');
            category.examples.forEach(example => { examplesGrid.appendChild(createCardElement(example)); });
            gridContainer.appendChild(examplesGrid); 
            slideContent.appendChild(gridContainer); 
            categorySlide.appendChild(slideContent);
            
            // Ajout du branding aux slides dynamiques
            categorySlide.appendChild(createBrandingElement()); 

            slideContainer.appendChild(categorySlide); 
        });
        updateSlidesArrayAndDisplay(); 
    }
    
    function updateSlidesArrayAndDisplay() {
        console.log("SCRIPT: Appel de updateSlidesArrayAndDisplay");
        if (!slideContainer) { console.error("ERREUR: slideContainer null"); return; }
        slides = Array.from(slideContainer.querySelectorAll('.slide-container > .slide')); 
        console.log("SCRIPT: Nombre de slides trouvées:", slides.length, slides);

        if (slides.length > 0) { slideContainer.style.width = `${slides.length * 100}vw`; } 
        else { slideContainer.style.width = `100vw`; }
        
        const selectionSlideElem = document.getElementById('slide-category-selection');
        if (selectionSlideElem && slides.length > 0) { 
            const selectionIndex = slides.indexOf(selectionSlideElem);
            dynamicSlidesStartIndex = selectionIndex !== -1 ? selectionIndex + 1 : 5; 
        } else { dynamicSlidesStartIndex = 5; }
        
        goToSlide(currentSlideIndex, false); 
    }

    function goToSlide(index, animate = true) {
        console.log(`SCRIPT: goToSlide - Index: ${index}, Animate: ${animate}`);
        if (!slideContainer) { console.error("ERREUR: slideContainer null"); return; }
        if (!slides || slides.length === 0) { console.warn("WARNING: goToSlide - pas de slides"); updateNavigation(); return; }

        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        currentSlideIndex = index;

        if (!animate) slideContainer.style.transition = 'none';
        else slideContainer.style.transition = 'transform 0.5s ease-in-out';
        
        slideContainer.style.transform = `translateX(-${currentSlideIndex * 100}vw)`;
        
        if (!animate) {
            void slideContainer.offsetWidth; 
            if (slideContainer.style.transition === 'none') slideContainer.style.transition = 'transform 0.5s ease-in-out';
        }
        updateNavigation();
    }

    function updateNavigation() {
        console.log("SCRIPT: updateNavigation. currentSlideIndex:", currentSlideIndex, "Total slides:", slides.length);
        if (!prevButton || !nextButton || !slideIndicator || !progressBarFill) { return; }

        if (slides.length === 0) {
            prevButton.classList.add('hidden'); nextButton.classList.add('hidden');
            progressBarFill.style.width = '0%'; slideIndicator.textContent = `1 / 1`; return;
        }
        prevButton.classList.toggle('hidden', currentSlideIndex === 0);
        nextButton.classList.toggle('hidden', currentSlideIndex === slides.length - 1);
        const progressPercentage = slides.length > 1 ? (currentSlideIndex / (slides.length - 1)) * 100 : (slides.length === 1 ? 100 : 0);
        progressBarFill.style.width = `${progressPercentage}%`;
        slideIndicator.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
    }

    if (showSelectedCardsBtn) {
        showSelectedCardsBtn.addEventListener('click', () => {
            createDynamicCategorySlides(); 
            if (slides.length >= dynamicSlidesStartIndex && categoriesToDisplayCount() > 0) { goToSlide(dynamicSlidesStartIndex); } 
            else {
                const selectionSlideElem = document.getElementById('slide-category-selection');
                if (selectionSlideElem) { const selectionIndex = slides.indexOf(selectionSlideElem); goToSlide(selectionIndex !== -1 ? selectionIndex : currentSlideIndex); } 
                else { goToSlide(currentSlideIndex); }
            }
        });
    }

    function categoriesToDisplayCount() {
        let count = 0;
        if (categoryCheckboxesContainer) { categoryCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(() => count++); }
        return count;
    }

    if (prevButton) prevButton.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    if (nextButton) nextButton.addEventListener('click', () => goToSlide(currentSlideIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevButton && !prevButton.classList.contains('hidden')) goToSlide(currentSlideIndex - 1); 
        else if (e.key === 'ArrowRight' && nextButton && !nextButton.classList.contains('hidden')) goToSlide(currentSlideIndex + 1);
    });

    console.log("SCRIPT: Initialisation...");
    if (document.getElementById('slide-category-selection')) populateCategoryCheckboxes();
    updateSlidesArrayAndDisplay(); 
    console.log("SCRIPT: Initialisation terminée.");
});
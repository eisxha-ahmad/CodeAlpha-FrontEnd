document.addEventListener('DOMContentLoaded', function() {
    const images = [
        { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&fit=crop', title: 'Mountain Sunrise', category: 'nature' },
        { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&fit=crop', title: 'City Lights', category: 'city' },
        { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&fit=crop', title: 'Coffee Cup', category: 'coffee' },
        { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&fit=crop', title: 'Northern Sky', category: 'nature' },
        { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&fit=crop', title: 'Urban View', category: 'city' },
        { src: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=800&fit=crop', title: 'Coffee Beans', category: 'coffee' },
        { src: 'https://plus.unsplash.com/premium_photo-1674518553254-a3bd74266510?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Wild Cat', category: 'nature' },
        { src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&fit=crop', title: 'Golden Lion', category: 'nature' },
        { src: 'https://images.unsplash.com/photo-1519068737630-e5db30e12e42?w=800&fit=crop', title: 'Home Cat', category: 'nature' },
        { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop', title: 'Alpine Lake', category: 'nature' },
        { src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&fit=crop', title: 'Tokyo Night', category: 'city' },
        { src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&fit=crop', title: 'NYC Skyline', category: 'city' },
        { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&fit=crop', title: 'Coffee Shop', category: 'coffee' },
        { src: 'https://images.unsplash.com/photo-1605122294630-e38d3a70561b?q=80&w=762&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Old Camera', category: 'vintage' },
        { src: 'https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Vintage Car', category: 'vintage' },
        { src: 'https://images.unsplash.com/photo-1588415158669-c8b2154fa9bf?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Record Player', category: 'vintage' }
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    const filterButtons = document.querySelectorAll('.btn-filter');
    const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const prevImageBtn = document.getElementById('prevImageBtn');
    const nextImageBtn = document.getElementById('nextImageBtn');
    const loadMoreBtn = document.getElementById('loadMore');

    let currentFilter = 'all';
    let currentImageIndex = 0;
    let filteredImages = [];
    let visibleCount = 8;

    function initGallery() {
        renderGallery();
        setupEventListeners();
    }

function renderGallery() {
    galleryGrid.innerHTML = '';
    
    filteredImages = currentFilter === 'all' ? images : images.filter(img => img.category === currentFilter);
    
    const displayImages = filteredImages.slice(0, visibleCount);
    
    displayImages.forEach((img, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6';
        
        col.innerHTML = `
            <div class="card gallery-card h-100">
                <img src="${img.src}&w=600" class="card-img-top" alt="${img.title}" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title h6 mb-2">${img.title}</h5>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="badge" style="background: var(--accent); color: var(--coffee-dark); padding: 6px 12px; border-radius: 20px;">
                            <i class="fas fa-tag me-1"></i>${img.category}
                        </span>
                        <button class="btn btn-sm view-btn" data-index="${index}" style="background: var(--coffee-medium); color: var(--cream); border: 1px solid var(--accent); padding: 6px 15px; border-radius: 20px;">
                            <i class="fas fa-expand me-1"></i>View
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        galleryGrid.appendChild(col);
    });
    
    attachViewButtonListeners();
    updateLoadMoreButton();
}

    function attachViewButtonListeners() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                openLightbox(index);
            });
        });
        
        document.querySelectorAll('.gallery-card').forEach((card, index) => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.view-btn')) {
                    const btn = this.querySelector('.view-btn');
                    if (btn) openLightbox(parseInt(btn.dataset.index));
                }
            });
        });
    }

    function setupEventListeners() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'rgba(212, 165, 116, 0.2)';
                    b.style.color = 'var(--cream)';
                });
                
                this.classList.add('active');
                this.style.background = 'var(--accent)';
                this.style.color = 'var(--coffee-dark)';
                
                currentFilter = filter;
                visibleCount = 8;
                renderGallery();
            });
        });
        
        prevImageBtn.addEventListener('click', showPrevImage);
        nextImageBtn.addEventListener('click', showNextImage);
        
        loadMoreBtn.addEventListener('click', function() {
            visibleCount += 4;
            renderGallery();
        });
        
        document.addEventListener('keydown', function(e) {
            const modal = document.getElementById('lightboxModal');
            if (modal.classList.contains('show')) {
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'Escape') lightboxModal.hide();
            }
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        const img = filteredImages[currentImageIndex];
        
        lightboxImage.src = img.src.replace('w=800', 'w=1200');
        lightboxImage.alt = img.title;
        lightboxTitle.textContent = img.title;
        
        lightboxModal.show();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        const img = filteredImages[currentImageIndex];
        
        lightboxImage.src = img.src.replace('w=800', 'w=1200');
        lightboxImage.alt = img.title;
        lightboxTitle.textContent = img.title;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        const img = filteredImages[currentImageIndex];
        
        lightboxImage.src = img.src.replace('w=800', 'w=1200');
        lightboxImage.alt = img.title;
        lightboxTitle.textContent = img.title;
    }

    function updateLoadMoreButton() {
        loadMoreBtn.style.display = visibleCount < filteredImages.length ? 'block' : 'none';
    }

    initGallery();
});
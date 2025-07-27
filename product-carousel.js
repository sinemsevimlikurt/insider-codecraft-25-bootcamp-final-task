(() => {

    const CONFIG = {
        apiUrl: 'https://gist.githubusercontent.com/sinemsevimlikurt/8efb01188c3ad29c433354e7d4e10380/raw/80c0c2b81408a02ba561cd40f946fa58c66582fb/products.json',
        storageKey: 'lcwCarouselData',
        storageFavsKey: 'lcwFavoriteProducts',
        carouselTitle: 'You Might Also Like',
        visibleItems: {
            desktop: 4,
            tablet: 3,
            mobile: 2
        },
        breakpoints: {
            tablet: 992,
            mobile: 576
        }
    };


    const init = () => {
        if (!isProductPage()) return;
        
        if (document.querySelector('.product-carousel')) return;
        // Load data and initialize carousel
        loadData().then(products => {
            if (!products || !products.length) return;
            
            buildHTML(products);
            buildCSS();
            setEvents();
            updateCarouselState();
            window.addEventListener('resize', throttle(updateCarouselState, 250));
        });
    };


    const isProductPage = () => {
        return document.querySelector('.product-detail') !== null;
    };
    

    const CAROUSEL_CLASS = 'custom-lcw-carousel';


    const loadData = async () => {
        try {

            const cachedData = localStorage.getItem(CONFIG.storageKey);
            const cachedTimestamp = localStorage.getItem(`${CONFIG.storageKey}_timestamp`);
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

            if (cachedData && cachedTimestamp && cachedTimestamp > oneDayAgo) {
                return JSON.parse(cachedData);
            }


            const response = await fetch(CONFIG.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const data = await response.json();
            

            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
            localStorage.setItem(`${CONFIG.storageKey}_timestamp`, Date.now());
            
            return data;
        } catch (error) {
            console.error('Error loading product data:', error);
            return [];
        }
    };


    const buildHTML = (products) => {
        const favorites = JSON.parse(localStorage.getItem(CONFIG.storageFavsKey) || '{}');
        
        const carouselHTML = `
            <div class="${CAROUSEL_CLASS}">
                <h2 class="carousel-title">${CONFIG.carouselTitle}</h2>
                <div class="carousel-container">
                    <button class="carousel-arrow prev-arrow" aria-label="Previous products">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242">
                            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                        </svg>
                    </button>
                    <div class="carousel-track">
                        ${products.map(product => `
                            <div class="carousel-slide" data-product-id="${product.id}">
                                <a href="${product.url}" target="_blank" class="product-link">
                                    <div class="product-image">
                                        <img src="${product.img}" alt="${product.name}">
                                        <button class="favorite-btn ${favorites[product.id] ? 'active' : ''}" 
                                                data-product-id="${product.id}" 
                                                aria-label="${favorites[product.id] ? 'Remove from favorites' : 'Add to favorites'}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" class="heart-icon">
                                                <path fill="#fff" fill-rule="evenodd" stroke="#B6B7B9" stroke-width="1" d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z" clip-rule="evenodd"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="product-info">
                                        <div class="product-name">${product.name}</div>
                                         <div class="product-price">${product.price.toFixed(2)} TL</div>
                                    </div>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-arrow next-arrow" aria-label="Next products">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242" style="transform: rotate(180deg);">
                            <path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.product-detail').insertAdjacentHTML('afterend', carouselHTML);
        

        const style = document.createElement('style');
        style.textContent = `
            .${CAROUSEL_CLASS} {
                background-color: #f4f5f7;
                padding: 0;
                margin: 0 auto;
                max-width: 100%;
                font-family: 'Open Sans', sans-serif !important;
                font-size: 15px;
                color: #191919;
                line-height: 1.4;
                box-sizing: border-box;
                position: relative;
                padding: 0 60px;
                width: 100%;
            }
            
            .${CAROUSEL_CLASS} .carousel-title {
                font-size: 32px;
                margin: 0 auto 20px;
                padding: 15px 0;
                max-width: 1240px;
                width: 100%;
                box-sizing: border-box;
                text-align: left;
                font-weight: lighter;
                color: #29323b;
            }
            
            .${CAROUSEL_CLASS} .carousel-container {
                position: relative;
                overflow: hidden;
                padding: 0;
                box-sizing: border-box;
                width: 100%;
                max-width: 1240px;
                margin: 0 auto;
            }
            
            .${CAROUSEL_CLASS} .carousel-track {
                display: flex;
                padding: 0 10px;
                margin: 0;
                transition: transform 0.3s ease;
                list-style: none;
                width: 100%;
                overflow-x: auto;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
                scroll-snap-type: x mandatory;
            }
            
            .${CAROUSEL_CLASS} .carousel-track::-webkit-scrollbar {
                display: none;
            }
            
            .${CAROUSEL_CLASS} .carousel-slide {
                flex: 0 0 calc(16.666% - 10px);
                margin: 0 5px;
                box-sizing: border-box;
                position: relative;
                scroll-snap-align: start;
            }
            
            .${CAROUSEL_CLASS} .product-link {
                display: block;
                text-decoration: none;
                color: inherit;
            }
            
            .${CAROUSEL_CLASS} .product-image {
                position: relative;
                aspect-ratio: 3 / 4;
                background: #f7f7f7;
                margin-bottom: 10px;
                overflow: hidden;
            }
            
            .${CAROUSEL_CLASS} .product-image img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .${CAROUSEL_CLASS} .product-image:hover img {
                transform: scale(1.05);
            }
            
            .${CAROUSEL_CLASS} .favorite-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: transparent;
                border: none;
                width: 21px;
                height: 20px;
                cursor: pointer;
                padding: 0;
                margin: 0;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .${CAROUSEL_CLASS} .favorite-btn .heart-icon {
                width: 21px;
                height: 20px;
            }
            
            .${CAROUSEL_CLASS} .favorite-btn.active .heart-icon path {
                fill: #193db0;
                stroke: #193db0;
            }
            
            .${CAROUSEL_CLASS} .favorite-btn:not(.active) .heart-icon path {
                fill: #fff;
                stroke: #B6B7B9;
            }
            
            .${CAROUSEL_CLASS} .product-info {
               padding: 0 10px;
                text-align: left;
                background-color: #fff;
            }
            
            .${CAROUSEL_CLASS} .product-name {
                font-size: 14px;
                margin: 0 0 5px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                height: 40px;
                color: #191919;
                font-weight: 400;
                line-height: 1.4;
            }
            
            .${CAROUSEL_CLASS} .product-price {
                font-weight: bold;
                color: #193db0;
                font-size: 18px;
                line-height: 1.2;
            }
            
            .${CAROUSEL_CLASS} .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: #f4f5f7;
                border: none;
                width: 40px;
                height: 80px;
                cursor: pointer;
                display: flex !important;
                align-items: center;
                justify-content: center;
                padding: 0;
                margin: 0;
                z-index: 100;
                color: #333;
                pointer-events: auto;
                transition: all 0.2s ease;
                opacity: 1;
                box-shadow: none;
                outline: none;
                visibility: visible !important;
            }
            
            .${CAROUSEL_CLASS} .carousel-arrow:hover {
                cursor: pointer;
            }
            
            .${CAROUSEL_CLASS} .carousel-arrow svg {
                width: 14px;
                height: 24px;
            }
            
            .${CAROUSEL_CLASS} .carousel-arrow svg {
                width: 24px;
                height: 24px;
                display: block;
            }
            
            .${CAROUSEL_CLASS} .carousel-arrow:hover {
                opacity: 0.8;
            }
            
            .${CAROUSEL_CLASS} .prev-arrow {
                left: 0;
            }
            
            .${CAROUSEL_CLASS} .next-arrow {
                right: 0;
            }
            
            @media (max-width: 1440px) {
                .${CAROUSEL_CLASS} .carousel-slide {
                    flex: 0 0 calc(16.666% - 10px);
                }
            }
            
            @media (max-width: 1200px) {
                .${CAROUSEL_CLASS} .carousel-slide {
                    flex: 0 0 calc(20% - 10px);
                }
                
                .${CAROUSEL_CLASS} .carousel-arrow {
                    width: 32px;
                    height: 60px;
                }
                
                .${CAROUSEL_CLASS} .prev-arrow {
                    left: 0;
                }
                
                .${CAROUSEL_CLASS} .next-arrow {
                    right: 0;
                }
                
                .${CAROUSEL_CLASS} .carousel-arrow svg {
                    width: 14px;
                    height: 14px;
                }
            }
            
            @media (max-width: 992px) {
                .${CAROUSEL_CLASS} .carousel-slide {
                    flex: 0 0 calc(25% - 10px);
                }
                
                .${CAROUSEL_CLASS} .product-name {
                    font-size: 14px;
                    height: 36px;
                }
                
                .${CAROUSEL_CLASS} .product-price {
                    font-size: 16px;
                }
                
                .${CAROUSEL_CLASS} {
                    padding: 0 24px;
                }
            }
            
            @media (max-width: 768px) {
                .${CAROUSEL_CLASS} .carousel-slide {
                    flex: 0 0 calc(33.333% - 10px);
                }
                
                .${CAROUSEL_CLASS} .carousel-title {
                    font-size: 16px;
                    padding: 0;
                    margin-bottom: 15px;
                }
                
                .${CAROUSEL_CLASS} {
                    padding: 0 16px;
                }
                
                .${CAROUSEL_CLASS} .carousel-slide {
                    flex: 0 0 calc(50% - 10px);
                }
                
                .${CAROUSEL_CLASS} .carousel-arrow {
                    display: none;
                }
                
                .${CAROUSEL_CLASS} .product-name {
                    font-size: 12px;
                    height: 32px;
                }
            }
        `;
        
        document.head.appendChild(style);
        updateFavoriteIcons();
    };

    
    const buildCSS = () => {
        // Styles are now scoped and added in buildHTML
    };

    
    const setEvents = () => {
        const carousel = document.querySelector(`.${CAROUSEL_CLASS}`);
        if (!carousel) return;
        
        // Favorite button click
        document.addEventListener('click', (e) => {
            const favBtn = e.target.closest('.favorite-btn');
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(favBtn.dataset.productId);
            }
        });

        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.prev-arrow');
        const nextBtn = carousel.querySelector('.next-arrow');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const track = document.querySelector('.carousel-track');
                const slideWidth = getSlideWidth();
                track.scrollBy({
                    left: -slideWidth,
                    behavior: 'smooth'
                });
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const track = document.querySelector('.carousel-track');
                const slideWidth = getSlideWidth();
                track.scrollBy({
                    left: slideWidth,
                    behavior: 'smooth'
                });
            });
        }
    };

    
    const toggleFavorite = (productId) => {
        const favorites = JSON.parse(localStorage.getItem(CONFIG.storageFavsKey) || '{}');
        favorites[productId] = !favorites[productId];
        localStorage.setItem(CONFIG.storageFavsKey, JSON.stringify(favorites));
        updateFavoriteIcons();
    };

    
    const updateFavoriteIcons = () => {
        const favorites = JSON.parse(localStorage.getItem(CONFIG.storageFavsKey) || '{}');
        const carousel = document.querySelector(`.${CAROUSEL_CLASS}`);
        if (!carousel) return;
        
        carousel.querySelectorAll('.favorite-btn').forEach(btn => {
            const productId = btn.dataset.productId;
            btn.classList.toggle('active', favorites[productId]);
            btn.setAttribute('aria-label', favorites[productId] ? 'Remove from favorites' : 'Add to favorites');
        });
    };

    
    const getSlideWidth = () => {
        const carousel = document.querySelector(`.${CAROUSEL_CLASS}`);
        if (!carousel) return 0;
        
        const slide = carousel.querySelector('.carousel-slide');
        return slide ? slide.offsetWidth : 0;
    };

    
    // Pencere boyutu değiştiğinde carousel'in durumunu günceller
    const updateCarouselState = () => {
        const carousel = document.querySelector(`.${CAROUSEL_CLASS}`);
        if (!carousel) return;
        
        const container = carousel.querySelector('.carousel-container');
        if (!container) return;

        const width = window.innerWidth;
        let visibleCount;

        if (width >= CONFIG.breakpoints.tablet) {
            visibleCount = CONFIG.visibleItems.desktop;
        } else if (width >= CONFIG.breakpoints.mobile) {
            visibleCount = CONFIG.visibleItems.tablet;
        } else {
            visibleCount = CONFIG.visibleItems.mobile;
        }

        const slides = document.querySelectorAll('.carousel-slide');
        const slideWidth = 100 / visibleCount;
        
        slides.forEach(slide => {
            slide.style.minWidth = `calc(${slideWidth}% - 15px)`;
        });
    };

    // Performans için fonksiyon çağrılarını sınırlandırıyoruz (örneğin scroll/rezize eventleri için)
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
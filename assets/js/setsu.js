document.addEventListener("DOMContentLoaded", function() {
    
    
    // Api
    const setsuProdBox = document.getElementById('setsuProdBox');
    const setsuProductCountSelect = document.getElementById('setsuProductCount');

    let initialPageSize = 8;
    let loading = false;
    let endOfResults = false;
    let itmCount = 0;
    let maxProdLimit = parseInt(setsuProductCountSelect.value);

    function fetchInitialProducts(pageSize) {
        if (loading || endOfResults) return;
        loading = true;

        fetch(`https://brandstestowy.smallhost.pl/api/random?pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                const initialProducts = data.data.slice(0, initialPageSize);
                appendProducts(initialProducts);

                itmCount++;
                loading = false;

                window.addEventListener('scroll', loadMoreIfNeeded);
            })
            .catch(error => {
                console.error('Error fetching initial products:', error);
                loading = false;
            });
    }

    function fetchMoreProducts(pageSize) {
        if (loading || endOfResults) return;
        loading = true;
    
        fetch(`https://brandstestowy.smallhost.pl/api/random?pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                const productsToAdd = data.data.filter((product, index) => index >= initialPageSize); 
    
                if (productsToAdd.length === 0) {
                    endOfResults = true;
                    loading = false;
                    return;
                }
    
                appendProducts(productsToAdd);
    
                if (setsuProdBox.children.length >= maxProdLimit) {
                    endOfResults = true;
                }
    
                loading = false;
            })
            .catch(error => {
                console.error('Error fetching more products:', error);
                loading = false;
            });
    }
    

    function appendProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('setsuProduct');
            productElement.textContent = `ID: ${product.id}`;
            setsuProdBox.appendChild(productElement);
        });
    }

    function loadMoreIfNeeded() {
        if (endOfResults) return;
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            fetchMoreProducts(maxProdLimit);
        }
    }

    setsuProductCountSelect.addEventListener('change', function() {
        setsuProdBox.innerHTML = '';
        loading = false;
        endOfResults = false;
        maxProdLimit = parseInt(setsuProductCountSelect.value)
        fetchInitialProducts(maxProdLimit);
    });

    fetchInitialProducts(initialPageSize);



    // Prod Click
    function fetchProductDetails(productId) {
        document.getElementById('setsuPUId').querySelector('span').textContent = '';
        document.getElementById('setsuPUName').querySelector('span').textContent = '';
        document.getElementById('setsuPUValue').querySelector('span').textContent = '';
    
        const product = getProductById(productId);
        if (product) {
            document.getElementById('setsuPUId').querySelector('span').textContent = product.id;
            document.getElementById('setsuPUName').querySelector('span').textContent = product.name;
            document.getElementById('setsuPUValue').querySelector('span').textContent = product.value;
        } else {
            console.error('Product not found in current data.');
        }
    }
    
    function getProductById(productId) {
        const products = Array.from(setsuProdBox.children);
        const product = products.find(element => {
            const textContent = element.textContent || element.innerText;
            return textContent.includes(`ID: ${productId}`);
        });
    
        if (product) {
            const id = parseInt(product.textContent.replace('ID: ', ''));
            const name = `Obiekt ${id}`; 
            const value = Math.floor(Math.random() * 1000);
            return { id, name, value };
        } else {
            return null;
        }
    }
    
    let popup = document.getElementById('setsuPU');
    setsuProdBox.addEventListener('click', function(event) {
        const clickedProduct = event.target.closest('.setsuProduct');
        if (clickedProduct) {
            const productId = clickedProduct.textContent.replace('ID: ', '');
    
            fetchProductDetails(productId);

            popup.classList.add('active');
        }
    });

    const closepp = document.getElementById('setsuPUClose');
    closepp.addEventListener('click', function(event) {
        popup.classList.remove('active');
    });
    


    // header links
    const links = document.querySelectorAll('.setsuHeaderNav a');

    const header = document.querySelector('header'); 
    const headerHeight = header.offsetHeight;

    const startSection = document.getElementById('start');
    const skladSection = document.getElementById('sklad');
    const prodSection = document.getElementById('prod');

    function updateActiveLink() {
        const scrollPosition = window.scrollY;

        const scrollPositionWithOffset = scrollPosition + headerHeight;

        if (scrollPositionWithOffset < skladSection.offsetTop) {
            setActiveLink(links[0]);
        }
        else if (scrollPositionWithOffset >= skladSection.offsetTop && scrollPositionWithOffset < prodSection.offsetTop) {
            setActiveLink(links[1]);
        }
        else {
            setActiveLink(links[2]);
        }
    }

    function setActiveLink(activeLink) {
        links.forEach(link => {
            link.classList.remove('headerActive');
        });

        activeLink.classList.add('headerActive');
    }

    updateActiveLink();

    window.addEventListener('scroll', updateActiveLink);
});


// Menu
$(document).ready(function() {
    $('.setsuMenuMob .setsuMenuToggle').click(function() {
        $(this).toggleClass('menuOpen');
        $('.setsuMenuMob nav').toggleClass('menuOpen');
        
        if ($('.setsuMenuMob nav').hasClass('menuOpen')) {
            $('.setsuMenuMob nav').slideDown(300);
        } else {
            $('.setsuMenuMob nav').slideUp(300);
        }
    });
});


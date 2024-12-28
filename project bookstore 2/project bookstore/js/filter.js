const btns1 = document.querySelectorAll(".arrow1");
for (let btn of btns1) {
    btn.addEventListener("click", () => {
        const hide = document.querySelector(".hide_input");
        hide.style.display = (hide.style.display === 'flex') ? 'none' : 'flex';
        if (hide.style.display === 'flex') {
            btn.style.transform = 'rotate(180deg)';
        } else {
            btn.style.transform = 'rotate(0deg)';
        }
    });
}


async function loadProducts() {
    try {
        const response = await fetch('/data/books.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        return [];
    }
}


async function displayProducts(pageNumber) {
    const itemsPerPage = 6;
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const products = await loadProducts();

    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    for (let i = startIndex; i < endIndex && i < products.length; i++) {
        const product = products[i];
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        const title = document.createElement('div');
        title.textContent = product.title;
        title.className = 'product__title';
        const author = document.createElement('div');
        author.className = 'product__author';
        author.textContent = product.author;
        const price = document.createElement('div');
        price.className = 'product__price';
        price.textContent = product.price;
        const cartButton = document.createElement('button');
        cartButton.className = 'btn__cart';
        cartButton.textContent = 'ADD TO CART';

        productElement.appendChild(image);
        productElement.appendChild(title);
        productElement.appendChild(author);
        productElement.appendChild(price);
        productElement.appendChild(cartButton);

        productsList.appendChild(productElement);
    }

    displayPagination(pageNumber, Math.ceil(products.length / itemsPerPage));
}
displayProducts(1);

function displayPagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.setAttribute('id', 'pages');
        pageLink.addEventListener('click', (event) => {
            event.preventDefault();
            const pageNumber = parseInt(event.target.textContent);
            displayProducts(pageNumber);
        });

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        pagination.appendChild(pageLink);
    }
}

function filterProductsByPrice(products, minPrice, maxPrice) {
    return products.filter(product => {
        const price = parseFloat(product.price); 
        return price >= minPrice && price <= maxPrice; 
    });
}


function displayFilteredProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        const title = document.createElement('div');
        title.textContent = product.title;
        title.className = 'product__title';
        const author = document.createElement('div');
        author.className = 'product__author';
        author.textContent = product.author;
        const price = document.createElement('div');
        price.className = 'product__price';
        price.textContent = product.price;
        const cartButton = document.createElement('button');
        cartButton.className = 'btn__cart';
        cartButton.textContent = 'ADD TO CART';

        productElement.appendChild(image);
        productElement.appendChild(title);
        productElement.appendChild(author);
        productElement.appendChild(price);
        productElement.appendChild(cartButton);

        productsList.appendChild(productElement);
    });
}


document.querySelector('.filter__btn').addEventListener('click', async () => {
    const minPriceInput = document.getElementById('min');
    const maxPriceInput = document.getElementById('max');

    if (minPriceInput.value.trim() === '' && maxPriceInput.value.trim() === '') {
        
        displayProducts(1);
        return; 
    }

    
    const minPrice = parseFloat(minPriceInput.value);
    const maxPrice = parseFloat(maxPriceInput.value);

    
    const products = await loadProducts();
    const filteredProducts = filterProductsByPrice(products, minPrice, maxPrice);
    const pagination = document.getElementById('pagination');
    pagination.style.display = 'none';

    
    displayFilteredProducts(filteredProducts);
});


document.querySelector('.clear__filter').addEventListener('click', () => {
    
    const pagination = document.getElementById('pagination');
    pagination.style.display = 'flex';
    
    document.getElementById('min').value = '';
    document.getElementById('max').value = '';
    
    displayProducts(1);
});


document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn__cart')) {
        const productElement = event.target.closest('.product'); // Находим элемент продукта
        const productTitle = productElement.querySelector('.product__title').textContent; // Получаем название продукта
        const productPrice = productElement.querySelector('.product__price').textContent; // Получаем цену продукта
        
        
        let cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        cart.items.push({ title: productTitle, price: productPrice }); // Добавляем продукт в корзину
        
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        
        updateCartInfo(cart.items.length);
    }
});


function updateCartInfo(itemCount) {
    
    const cartItemCount = document.getElementById('cart-item-count');
    
    cartItemCount.textContent = `${itemCount}`;
}


document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
    updateCartInfo(cart.items.length);
});




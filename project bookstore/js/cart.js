document.addEventListener('DOMContentLoaded', () => {
    const cartContent = document.getElementById('cart-content');
    const totalAmountDisplay = document.getElementById('total-amount');
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
    displayCartItems(cart.items);

    
    function displayCartItems(items) {
        
        cartContent.innerHTML = '';
            if (items.length === 0) {
            const emptyCartMessage = document.createElement('p');
            emptyCartMessage.textContent = 'CART IS EMPTY ';
            emptyCartMessage.classList.add('empty-cart-message');
            cartContent.appendChild(emptyCartMessage);
            
            totalAmountDisplay.textContent = '';
            return;
        }

        
        items.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            const title = document.createElement('p');
            title.textContent = item.title;
            title.classList.add('item-title');
            cartItem.appendChild(title);
            const price = document.createElement('p');
            price.textContent = item.price;
            price.classList.add('item-price');
            cartItem.appendChild(price);
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Удалить';
            removeButton.classList.add('remove-button');
            
            removeButton.addEventListener('click', () => {
                
                cart.items.splice(index, 1);
                
                localStorage.setItem('cart', JSON.stringify(cart));
                
                displayCartItems(cart.items);
                
                updateTotalAmount(cart.items);
            });

            cartItem.appendChild(removeButton);

            cartContent.appendChild(cartItem);
        });
        updateTotalAmount(items);
    }


    function updateTotalAmount(items) {
    const totalAmount = items.reduce((total, item) => total + parseFloat(item.price), 0);
        totalAmountDisplay.textContent = `TOTAL : ${totalAmount.toFixed(2)} $.`;
    }
});

function addQuantityHandlers(item) {
    let itemQuantity = item.querySelector('.count');
    let plus = item.querySelector('.add');
    let minus = item.querySelector('.supply');
    let price = item.querySelector('.price');
    let basePrice = Number(price.textContent.split(' ')[0]);

    plus.addEventListener('click', function () {
        let newQuantity = Number(itemQuantity.textContent) + 1;
        itemQuantity.textContent = newQuantity;
        price.textContent = (basePrice * newQuantity) + ' грн';
        minus.classList.remove('disabled');
        updateTotal();
    });

    minus.addEventListener('click', function () {
        let currentQuantity = Number(itemQuantity.textContent);
        if (currentQuantity > 1) {
            let newQuantity = currentQuantity - 1;
            itemQuantity.textContent = newQuantity;
            price.textContent = (basePrice * newQuantity) + ' грн';
            updateTotal();
        }
        if (currentQuantity === 1) {
            let listItem = this.closest('li');
            listItem.remove();
            updateTotal();
        }
    });
}

function updateTotal() {
    let items = document.querySelectorAll('#boughtItems li');
    let total = 0;

    items.forEach(item => {
        let price = item.querySelector('.price').textContent;
        total += Number(price.split(' ')[0]);
    });

    document.querySelector('.total span:last-child').textContent = total + ' грн.';
    updateBadge(items.length);
}

function updateBadge(itemCount) {
    let badge = document.querySelector('.order-summary .badge');
    badge.textContent = itemCount;
}


function addDeleteHandler(item) {
    let cancelButton = item.querySelector('.cancel');
    cancelButton.addEventListener('click', function () {
        let listItem = this.closest('li');
        listItem.remove();
        updateTotal();
    });
}


function addClearAllHandler() {
    let clearButton = document.querySelector('.delete');
    clearButton.addEventListener('click', function () {
        let items = document.querySelectorAll('#boughtItems li');
        items.forEach(item => item.remove());
        updateTotal();
    });
}

function addToCartHandler() {
    document.querySelectorAll('.pizza .price-item button').forEach(button => {
        button.addEventListener('click', function () {
            let pizzaDetails = this.closest('.pizza');
            let sizeSection = this.closest('.thirtyCm, .fortyCm');
            let pizzaName = pizzaDetails.querySelector('h2').textContent;
            let size = sizeSection.querySelector('.size span').textContent;
            let weight = sizeSection.querySelector('.weight span').textContent;
            let price = sizeSection.querySelector('.price-item .money').textContent;

            let cartItems = document.querySelectorAll('#boughtItems li');
            let itemFound = false;

            cartItems.forEach(item => {
                let itemName = item.querySelector('.name').textContent;
                if (itemName === `${pizzaName} (${size} см)`) {
                    let itemQuantity = item.querySelector('.count');
                    let newQuantity = Number(itemQuantity.textContent) + 1;
                    itemQuantity.textContent = newQuantity;

                    let itemPrice = item.querySelector('.price');
                    let basePrice = Number(price);
                    itemPrice.textContent = (basePrice * newQuantity) + ' грн';

                    itemFound = true;
                }
            });

            if (!itemFound) {
                let cartItem = document.createElement('li');
                cartItem.innerHTML = `
                    <span class="name">${pizzaName} (${size} см)</span>
                    <div class="weightSize">
                        <div class="size">
                            <img src="images/size-icon.png" alt="sizeOfPizza">
                            <span>${size}</span>
                        </div>
                        <div class="weight">
                            <img src="images/weight.png" alt="weightOfPizza">
                            <span>${weight}</span>
                        </div>
                    </div>
                    <div class="correctionSection">
                        <span class="price">${price} грн</span>
                        <button class="supply">-</button>
                        <span class="count">1</span>
                        <button class="add">+</button>
                        <button class="cancel">x</button>
                    </div>
                `;

                document.querySelector('#boughtItems').appendChild(cartItem);

                addQuantityHandlers(cartItem);
                addDeleteHandler(cartItem);
            }
            updateTotal();
        });
    });
}
function generatePizzaCards(pizzas) {
    const pizzaContainer = document.getElementById('pizza-container');
    pizzaContainer.innerHTML = '';

    pizzas.forEach(pizza => {
        const pizzaCard = document.createElement('div');
        pizzaCard.className = 'pizza';
        let labels = '';
        if (pizza.is_new) labels += '<div class="labelNew">Нова</div>';
        if (pizza.is_popular) labels += '<div class="labelPopular">Популярна</div>';

        let smallSizeSection = '';
        if (pizza.small_size) {
            smallSizeSection = `
                <div class="thirtyCm">
                    <div class="size">
                        <img src="images/size-icon.png" alt="sizeOfPizza">
                        <span>${pizza.small_size.size}</span>
                    </div>
                    <div class="weight">
                        <img src="images/weight.png" alt="weightOfPizza">
                        <span>${pizza.small_size.weight}</span>
                    </div>
                    <div class="price-item">
                        <span class="money">${pizza.small_size.price}</span>
                        <span class="currency">грн</span>
                        <button>Купити</button>
                    </div>
                </div>`;
        }

        let bigSizeSection = '';
        if (pizza.big_size) {
            bigSizeSection = `
                <div class="fortyCm">
                    <div class="size">
                        <img src="images/size-icon.png" alt="sizeOfPizza">
                        <span>${pizza.big_size.size}</span>
                    </div>
                    <div class="weight">
                        <img src="images/weight.png" alt="weightOfPizza">
                        <span>${pizza.big_size.weight}</span>
                    </div>
                    <div class="price-item">
                        <span class="money">${pizza.big_size.price}</span>
                        <span class="currency">грн</span>
                        <button>Купити</button>
                    </div>
                </div>`;
        }

        pizzaCard.innerHTML = `
            ${labels}
            <img src="${pizza.icon}" alt="${pizza.title}">
            <div class="details">
                <h2>${pizza.title}</h2>
                <span class="type">${pizza.type}</span>
                <p>${pizza.content.ocean ? pizza.content.ocean.join(', ') : ''}${pizza.content.meat ? pizza.content.meat.join(', ') : ''}${pizza.content.chicken ? ', ' + pizza.content.chicken.join(', ') : ''}${pizza.content.mushroom  ? ', ' + pizza.content.mushroom.join(', ') : ''}${pizza.content.cheese ? ', ' + pizza.content.cheese.join(', ') : ''}${pizza.content.tomato  ? ', ' + pizza.content.tomato.join(', ') : ''}${pizza.content.pineapple ? ', ' + pizza.content.pineapple.join(', ') : ''}${pizza.content.additional ? ', ' + pizza.content.additional.join(', ') : ''}</p>
                <div class="weightSize">
                    ${smallSizeSection}
                    ${bigSizeSection}
                </div>
            </div>`;
        pizzaContainer.appendChild(pizzaCard);
    });

    addToCartHandler(); 
}

function filterPizzas(category) {
    let filteredPizzas;
    switch(category) {
        case 'all':
            filteredPizzas = pizza_info;
            break;
        case 'meat':
            filteredPizzas = pizza_info.filter(pizza => pizza.type.includes('М’ясна'));
            break;
        case 'pineapple':
            filteredPizzas = pizza_info.filter(pizza => pizza.content.pineapple);
            break;
        case 'mushroom':
            filteredPizzas = pizza_info.filter(pizza => pizza.content.mushroom);
            break;
        case 'ocean':
            filteredPizzas = pizza_info.filter(pizza => pizza.type.includes('Морська'));
            break;
        case 'vega':
            filteredPizzas = pizza_info.filter(pizza => pizza.type.includes('Вега'));
            break;
    }
    generatePizzaCards(filteredPizzas);
    document.getElementById('pizza-count').textContent = filteredPizzas.length;
}

document.addEventListener('DOMContentLoaded', function() {
    generatePizzaCards(pizza_info);
    addClearAllHandler();
    updateBadge(document.querySelectorAll('#boughtItems li').length);

    document.querySelector('.all').addEventListener('click', () => filterPizzas('all'));
    document.querySelector('.meat').addEventListener('click', () => filterPizzas('meat'));
    document.querySelector('.pineapple').addEventListener('click', () => filterPizzas('pineapple'));
    document.querySelector('.mushroom').addEventListener('click', () => filterPizzas('mushroom'));
    document.querySelector('.ocean').addEventListener('click', () => filterPizzas('ocean'));
    document.querySelector('.vega').addEventListener('click', () => filterPizzas('vega'));
    const filters = document.querySelectorAll('#pizza-filter');

    filters.forEach(filter => {
        filter.addEventListener('click', (event) => {
            event.preventDefault();

            filters.forEach(f => f.classList.remove('all'));

            event.target.classList.add('all');
        });
    });

});

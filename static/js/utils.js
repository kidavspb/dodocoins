/**
 * Утилиты для работы с данными и отображением
 */

// Найти лучший и худший курс обмена
const rates = products.map(p => parseFloat((p.rubles / p.coins).toFixed(3)));
const bestRate = Math.max(...rates);
const worstRate = Math.min(...rates);

/**
 * Расчет выгодности обмена в процентах (0-100%)
 * Чем выше значение, тем выгоднее обмен
 * @param {number} rate - Курс обмена руб/додокоин
 * @return {string} Выгодность в процентах
 */
function calculateValue(rate) {
    const normalizedRate = (parseFloat(rate) - worstRate) / (bestRate - worstRate);
    return (normalizedRate * 100).toFixed(0);
}

/**
 * Получить название категории на русском языке
 * @param {string} category - Ключ категории 
 * @return {string} Название категории на русском
 */
function getCategoryName(category) {
    return categories[category] || category;
}

/**
 * Отображение карточек товаров
 * @param {Array} products - Массив товаров для отображения
 */
function renderCards(products) {
    const gridContainer = document.getElementById('grid-view');
    gridContainer.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Определение класса для выгодности
        let valueClass = '';
        const valueNum = parseInt(product.value);
        if (valueNum > 75) valueClass = 'bargain';
        else if (valueNum < 25) valueClass = 'expensive';
        
        // Формирование отображаемого названия с размером
        let displayName = product.name;
        if (product.size) {
            displayName += ` ${product.size} см`;
        }
        
        card.innerHTML = `
            <div class="card-header">${displayName}</div>
            <div class="card-body">
                <div class="card-info">
                    <div>Категория:</div>
                    <span>${getCategoryName(product.category)}</span>
                </div>
                <div class="card-info">
                    <div>Характеристики:</div>
                    <span>${product.specs}</span>
                </div>
                <div class="card-info">
                    <div>Цена в рублях:</div>
                    <span>${product.rubles} ₽</span>
                </div>
                <div class="card-info">
                    <div>Цена в додокоинах:</div>
                    <span>${product.coins}</span>
                </div>
                <div class="card-value ${valueClass}">
                    <span class="label">Курс обмена:</span>
                    <span>${product.rate} ₽/додокоин</span>
                </div>
                <div class="card-value ${valueClass}">
                    <span class="label">Выгодность:</span>
                    <span>${product.value}%</span>
                </div>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
}

/**
 * Отображение товаров в виде таблицы
 * @param {Array} products - Массив товаров для отображения
 */
function renderTable(products) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Определение класса для выгодности
        let valueClass = '';
        const valueNum = parseInt(product.value);
        if (valueNum > 75) valueClass = 'bargain';
        else if (valueNum < 25) valueClass = 'expensive';
        
        // Формирование отображаемого названия с размером
        let displayName = product.name;
        if (product.size) {
            displayName += ` ${product.size} см`;
        }
        
        row.innerHTML = `
            <td>${displayName}</td>
            <td>${product.specs}</td>
            <td>${product.rubles} ₽</td>
            <td>${product.coins}</td>
            <td>${product.rate}</td>
            <td class="${valueClass}">${product.value}%</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Фильтрация и сортировка товаров
 * @return {Array} Отфильтрованный и отсортированный массив товаров
 */
function filterAndSortProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const sortBy = document.getElementById('sort-by').value;
    const sortDir = document.getElementById('sort-dir').textContent.includes('↓') ? -1 : 1;
    
    let filteredProducts = [...products];
    
    // Фильтрация по категории
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
    
    // Фильтрация по размеру
    if (sizeFilter !== 'all') {
        const size = parseInt(sizeFilter);
        filteredProducts = filteredProducts.filter(p => p.size === size);
    }
    
    // Фильтрация по поиску
    if (searchText) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchText)
        );
    }
    
    // Сортировка
    filteredProducts.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
            case 'name':
                aValue = a.name;
                bValue = b.name;
                break;
            case 'rubles':
                aValue = a.rubles;
                bValue = b.rubles;
                break;
            case 'coins':
                aValue = a.coins;
                bValue = b.coins;
                break;
            case 'rate':
                aValue = parseFloat(a.rate);
                bValue = parseFloat(b.rate);
                break;
            case 'value':
                aValue = parseInt(a.value);
                bValue = parseInt(b.value);
                break;
            default:
                aValue = a.name;
                bValue = b.name;
        }
        
        if (aValue < bValue) return -1 * sortDir;
        if (aValue > bValue) return 1 * sortDir;
        return 0;
    });
    
    return filteredProducts;
}
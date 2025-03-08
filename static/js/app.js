/**
 * Основной файл приложения
 * Загружает данные и инициализирует интерфейс
 */

// Глобальные переменные для хранения данных
let products = [];
let categories = {};
let rates = [];
let bestRate = 0;
let worstRate = 0;

// Загрузка данных из JSON файла
async function loadData() {
    try {
        const response = await fetch('static/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Инициализация данных
        products = data.products;
        categories = data.categories;
        
        // Расчет курса обмена и выгодности для каждого товара
        calculateRates();
        
        // Загрузка категорий в фильтр
        populateCategoryFilter();
        
        // Инициализация интерфейса
        initializeUI();
        
        // Обновление представления
        updateView();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('grid-view').innerHTML = `
            <div class="error-message">
                <h3>Ошибка загрузки данных</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

/**
 * Расчет курса обмена и выгодности для всех товаров
 */
function calculateRates() {
    // Расчет курса обмена для каждого товара
    products.forEach(product => {
        product.rate = (product.rubles / product.coins).toFixed(3);
    });
    
    // Расчет глобальных параметров для выгодности
    rates = products.map(p => parseFloat(p.rate));
    bestRate = Math.max(...rates);
    worstRate = Math.min(...rates);
    
    // Расчет выгодности для каждого товара
    products.forEach(product => {
        product.value = calculateValue(product.rate);
    });
}

/**
 * Расчет выгодности обмена в процентах (0-100%)
 * @param {number} rate - Курс обмена руб/додокоин
 * @return {string} Выгодность в процентах
 */
function calculateValue(rate) {
    const normalizedRate = (parseFloat(rate) - worstRate) / (bestRate - worstRate);
    return (normalizedRate * 100).toFixed(0);
}

/**
 * Заполнение выпадающего списка категорий
 */
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '<option value="all">Все категории</option>';
    
    // Сортировка категорий по имени
    const sortedCategories = Object.entries(categories).sort((a, b) => {
        return a[1].name.localeCompare(b[1].name);
    });
    
    // Добавление категорий в выпадающий список
    sortedCategories.forEach(([key, category]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

/**
 * Инициализация пользовательского интерфейса
 */
function initializeUI() {
    // Расчет среднего курса
    const avgRate = (rates.reduce((sum, rate) => sum + rate, 0) / rates.length).toFixed(3);
    
    // Обновление статистики на странице
    document.getElementById('avg-rate').textContent = avgRate;
    document.getElementById('total-items').textContent = products.length;
    
    // Определение лучшего и худшего продукта по курсу обмена
    const bestProduct = products.find(p => parseFloat(p.rate) === bestRate);
    const worstProduct = products.find(p => parseFloat(p.rate) === worstRate);
    
    const bestProductName = bestProduct.size ? 
        `${bestProduct.name} ${bestProduct.size} см` : 
        bestProduct.name;
    
    const worstProductName = worstProduct.size ? 
        `${worstProduct.name} ${worstProduct.size} см` : 
        worstProduct.name;
    
    document.getElementById('best-item').textContent = `${bestProductName} (${bestRate})`;
    document.getElementById('worst-item').textContent = `${worstProductName} (${worstRate})`;
    
    // Обработчики событий для элементов управления
    document.getElementById('category-filter').addEventListener('change', function() {
        // Показываем фильтр размера только для категории пицц
        const sizeFilter = document.getElementById('size-filter');
        if (this.value === 'pizza') {
            sizeFilter.classList.remove('hidden');
        } else {
            sizeFilter.classList.add('hidden');
            sizeFilter.value = 'all'; // Сбросить фильтр размера при смене категории
        }
        updateView();
    });
    
    document.getElementById('size-filter').addEventListener('change', updateView);
    document.getElementById('search-input').addEventListener('input', updateView);
    document.getElementById('sort-by').addEventListener('change', updateView);
    
    // Переключение сортировки по возрастанию/убыванию
    document.getElementById('sort-dir').addEventListener('click', () => {
        const button = document.getElementById('sort-dir');
        if (button.textContent.includes('↓')) {
            button.textContent = '↑ По возрастанию';
        } else {
            button.textContent = '↓ По убыванию';
        }
        updateView();
    });
    
    // Переключение между видами (карточки/таблица)
    document.getElementById('grid-view-btn').addEventListener('click', () => {
        document.getElementById('grid-view').classList.remove('hidden');
        document.getElementById('table-view').classList.add('hidden');
        document.getElementById('grid-view-btn').classList.add('active');
        document.getElementById('table-view-btn').classList.remove('active');
    });
    
    document.getElementById('table-view-btn').addEventListener('click', () => {
        document.getElementById('grid-view').classList.add('hidden');
        document.getElementById('table-view').classList.remove('hidden');
        document.getElementById('grid-view-btn').classList.remove('active');
        document.getElementById('table-view-btn').classList.add('active');
    });
    
    // Обработчик клика на заголовки таблицы для сортировки
    document.querySelectorAll('.table-view th').forEach(th => {
        th.addEventListener('click', () => {
            const sortBy = th.getAttribute('data-sort');
            const currentSortBy = document.getElementById('sort-by').value;
            
            if (currentSortBy === sortBy) {
                // Меняем направление сортировки
                const sortDirBtn = document.getElementById('sort-dir');
                if (sortDirBtn.textContent.includes('↓')) {
                    sortDirBtn.textContent = '↑ По возрастанию';
                } else {
                    sortDirBtn.textContent = '↓ По убыванию';
                }
            } else {
                // Меняем поле сортировки
                document.getElementById('sort-by').value = sortBy;
            }
            
            updateView();
        });
    });
}

/**
 * Получить название категории на русском языке
 * @param {string} categoryKey - Ключ категории 
 * @return {string} Название категории на русском
 */
function getCategoryName(categoryKey) {
    return categories[categoryKey]?.name || categoryKey;
}

/**
 * Отображение карточек товаров
 * @param {Array} productsToShow - Массив товаров для отображения
 */
function renderCards(productsToShow) {
    const gridContainer = document.getElementById('grid-view');
    gridContainer.innerHTML = '';
    
    // Если нет товаров для отображения
    if (productsToShow.length === 0) {
        gridContainer.innerHTML = '<div class="loading">Нет товаров, соответствующих фильтрам</div>';
        return;
    }

    // Создаем карточки для всех товаров
    productsToShow.forEach(product => {
        createProductCard(product, gridContainer);
    });
}

/**
 * Создание карточки товара
 * @param {Object} product - Товар для отображения
 * @param {Element} container - Контейнер для добавления карточки
 */
function createProductCard(product, container) {
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
    
    // Проверка на лучший/худший курс
    const isBestRate = parseFloat(product.rate) === bestRate;
    const isWorstRate = parseFloat(product.rate) === worstRate;
    
    // Формирование бейджа для лучшего/худшего курса
    let badgeHTML = '';
    if (isBestRate) {
        badgeHTML = '<span class="best-value">Лучший курс</span>';
    } else if (isWorstRate) {
        badgeHTML = '<span class="best-value" style="background-color: #f44336;">Худший курс</span>';
    }

    // Получаем информацию о подкатегории
    const coinValue = product.coins.toString();
    const categoryInfo = categories[product.category];
    const subcategoryName = categoryInfo?.subCategories[coinValue] || `${coinValue} додокоинов`;
    
    card.innerHTML = `
        <div class="card-header">
            <div class="title-container">
                <span>${displayName}</span>
                <span class="category-badge">${getCategoryName(product.category)} · ${subcategoryName}</span>
                ${badgeHTML}
            </div>
            <span class="coin-badge">
                <span class="coin-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd" d="M11 1a1 1 0 0 1 1 1v2a8 8 0 1 1 0 16v2a1 1 0 1 1-2 0v-2H6.6c-.56 0-.84 0-1.05-.1a1 1 0 0 1-.44-.45C5 19.24 5 18.96 5 18.4V5.6c0-.56 0-.84.1-1.05a1 1 0 0 1 .45-.44C5.76 4 6.04 4 6.6 4H10V2a1 1 0 0 1 1-1m1 17a6 6 0 0 0 0-12H7v12z" clip-rule="evenodd"/>
                    </svg>
                </span>
                ${product.coins}
            </span>
        </div>
        <div class="card-body">
            ${product.volume ? `
            <div class="card-info">
                <div>Объем/размер:</div>
                <span>${product.volume}</span>
            </div>
            ` : ''}
            <div class="card-info">
                <div>Цена в рублях:</div>
                <span>${product.rubles} ₽</span>
            </div>
            <div class="card-values">
                <div class="card-value ${valueClass}" onclick="showValueInfo(event, '${product.rate}', '${product.value}')">
                    <span class="label">Курс обмена:</span>
                    <span>${product.rate} ₽/додокоин</span>
                </div>
                <div class="card-value ${valueClass}" onclick="showValueInfo(event, '${product.rate}', '${product.value}')">
                    <span class="label">Выгодность:</span>
                    <span>${product.value}%</span>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(card);
}

/**
 * Отображение товаров в виде таблицы
 * @param {Array} productsToShow - Массив товаров для отображения
 */
function renderTable(productsToShow) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    productsToShow.forEach(product => {
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
        
        // Проверка на лучший/худший курс
        const isBestRate = parseFloat(product.rate) === bestRate;
        const isWorstRate = parseFloat(product.rate) === worstRate;
        
        // Формирование бейджа для лучшего/худшего курса
        let badgeHTML = '';
        if (isBestRate) {
            badgeHTML = '<span class="best-value">Лучший</span>';
        } else if (isWorstRate) {
            badgeHTML = '<span class="best-value" style="background-color: #f44336;">Худший</span>';
        }
        
        // Получаем информацию о подкатегории
        const coinValue = product.coins.toString();
        const categoryInfo = categories[product.category];
        const subcategoryName = categoryInfo?.subCategories[coinValue] || `${coinValue} додокоинов`;
        
        row.innerHTML = `
            <td>${displayName}${badgeHTML}</td>
            <td>${getCategoryName(product.category)} · ${subcategoryName}</td>
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
            case 'category':
                aValue = getCategoryName(a.category);
                bValue = getCategoryName(b.category);
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

/**
 * Обновление представления данных
 */
function updateView() {
    const filteredProducts = filterAndSortProducts();
    renderCards(filteredProducts);
    renderTable(filteredProducts);
}

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('grid-view').innerHTML = '<div class="loading">Загрузка данных...</div>';
    loadData();
});
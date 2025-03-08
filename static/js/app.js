/**
 * Основной файл приложения
 * Инициализирует приложение и добавляет обработчики событий
 */

// Расчет курса обмена и выгодности для каждого товара
products.forEach(product => {
    product.rate = (product.rubles / product.coins).toFixed(3);
    product.value = calculateValue(product.rate);
});

// Расчет среднего курса
const avgRate = (rates.reduce((sum, rate) => sum + rate, 0) / rates.length).toFixed(3);

// Обновление статистики на странице
document.getElementById('avg-rate').textContent = avgRate;
document.getElementById('total-items').textContent = products.length;

// Определение лучшего и худшего продукта по курсу обмена
const bestProduct = products.find(p => parseFloat(p.rate) === bestRate);
const worstProduct = products.find(p => parseFloat(p.rate) === worstRate);

document.getElementById('best-item').textContent = `${bestProduct.name} (${bestRate})`;
document.getElementById('worst-item').textContent = `${worstProduct.name} (${worstRate})`;

// Обработчики событий для элементов управления
document.getElementById('category-filter').addEventListener('change', updateView);
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

/**
 * Обновление представления данных
 */
function updateView() {
    const filteredProducts = filterAndSortProducts();
    renderCards(filteredProducts);
    renderTable(filteredProducts);
}

// Инициализация страницы
updateView();
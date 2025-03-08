/**
 * Данные о товарах Додо Пицца
 * Содержит информацию о ценах в рублях и додокоинах
 */

// Массив с данными о товарах
const products = [
    // Напитки
    { name: "Кофе Американо", category: "drinks", specs: "0,4 л", rubles: 109, coins: 200, size: null },
    { name: "Кофе Капучино", category: "drinks", specs: "0,4 л", rubles: 179, coins: 200, size: null },
    { name: "Кофе Латте", category: "drinks", specs: "0,4 л", rubles: 179, coins: 200, size: null },
    { name: "Добрый Кола", category: "drinks", specs: "0,5 л", rubles: 145, coins: 200, size: null },
    { name: "Добрый Кола без сахара", category: "drinks", specs: "0,5 л", rubles: 145, coins: 200, size: null },
    { name: "Добрый Лимон-Лайм", category: "drinks", specs: "0,5 л", rubles: 135, coins: 200, size: null },
    
    // Закуски
    { name: "Грибной Стартер", category: "snacks", specs: "1 шт", rubles: 219, coins: 280, size: null },
    { name: "Додстер", category: "snacks", specs: "1 шт", rubles: 219, coins: 280, size: null },
    { name: "Острый Додстер", category: "snacks", specs: "1 шт", rubles: 239, coins: 280, size: null },
    { name: "Супермясной Додстер", category: "snacks", specs: "1 шт", rubles: 269, coins: 280, size: null },
    { name: "Сырный Стартер", category: "snacks", specs: "1 шт", rubles: 219, coins: 280, size: null },
    { name: "Додобоны", category: "snacks", specs: "8 шт", rubles: 115, coins: 250, size: null },
    { name: "Дэнвич ветчина и сыр", category: "snacks", specs: "1 шт", rubles: 289, coins: 300, size: null },
    { name: "Дэнвич чоризо барбекю", category: "snacks", specs: "1 шт", rubles: 289, coins: 300, size: null },
    { name: "Картофель из печи", category: "snacks", specs: "Большая", rubles: 269, coins: 300, size: null },
    { name: "Салат Цезарь", category: "snacks", specs: "1 шт", rubles: 289, coins: 300, size: null },
    
    // Соусы
    { name: "Барбекю", category: "sauce", specs: "1 шт", rubles: 49, coins: 60, size: null },
    { name: "Сырный", category: "sauce", specs: "1 шт", rubles: 49, coins: 60, size: null },
    { name: "Чесночный", category: "sauce", specs: "1 шт", rubles: 49, coins: 60, size: null },
    
    // Десерты
    { name: "Маффин Соленая карамель", category: "desserts", specs: "1 шт", rubles: 119, coins: 250, size: null },
    { name: "Маффин Три шоколада", category: "desserts", specs: "1 шт", rubles: 119, coins: 250, size: null },
    { name: "Чизкейк Нью-Йорк", category: "desserts", specs: "1 шт", rubles: 179, coins: 250, size: null },
    
    // Пицца 25 см
    { name: "Аррива!", category: "pizza", specs: "традиционное", rubles: 579, coins: 580, size: 25 },
    { name: "Бефстроганов", category: "pizza", specs: "традиционное", rubles: 499, coins: 580, size: 25 },
    { name: "Карбонара", category: "pizza", specs: "традиционное", rubles: 589, coins: 580, size: 25 },
    { name: "Пепперони", category: "pizza", specs: "традиционное", rubles: 489, coins: 580, size: 25 },
    { name: "Четыре сезона", category: "pizza", specs: "традиционное", rubles: 489, coins: 580, size: 25 },
    { name: "Песто", category: "pizza", specs: "традиционное", rubles: 559, coins: 580, size: 25 },
    { name: "Сырная", category: "pizza", specs: "традиционное", rubles: 329, coins: 580, size: 25 },
    
    // Пицца 30 см
    { name: "Аррива!", category: "pizza", specs: "традиционное", rubles: 859, coins: 850, size: 30 },
    { name: "Бефстроганов", category: "pizza", specs: "традиционное", rubles: 769, coins: 850, size: 30 },
    { name: "Пепперони", category: "pizza", specs: "традиционное", rubles: 749, coins: 850, size: 30 },
    { name: "Песто", category: "pizza", specs: "традиционное", rubles: 879, coins: 850, size: 30 },
    { name: "Сырный цыпленок", category: "pizza", specs: "традиционное", rubles: 869, coins: 850, size: 30 },
    { name: "Цыпленок барбекю", category: "pizza", specs: "традиционное", rubles: 959, coins: 850, size: 30 },
    
    // Пицца 35 см
    { name: "Бефстроганов", category: "pizza", specs: "традиционное", rubles: 899, coins: 900, size: 35 },
    { name: "Карбонара", category: "pizza", specs: "традиционное", rubles: 1059, coins: 900, size: 35 },
    { name: "Маргарита", category: "pizza", specs: "традиционное", rubles: 889, coins: 900, size: 35 },
    { name: "Четыре сезона", category: "pizza", specs: "традиционное", rubles: 919, coins: 900, size: 35 },
    { name: "Песто", category: "pizza", specs: "традиционное", rubles: 1029, coins: 900, size: 35 },
    { name: "Сырный цыпленок", category: "pizza", specs: "традиционное", rubles: 999, coins: 900, size: 35 }
];

// Категории товаров с переводом на русский язык
const categories = {
    'pizza': 'Пицца',
    'drinks': 'Напитки',
    'snacks': 'Закуски',
    'desserts': 'Десерты',
    'sauce': 'Соусы'
};
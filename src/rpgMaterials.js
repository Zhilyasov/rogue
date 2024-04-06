// Список врагов
var monsters = {
	list: [
		// name, hitDiceAmount, hitDiceSides, hitBonus, hp, ac, damageDiceAmount, damageDiceSides, damageBonus, imagePath
		['Ящерица', 1, 8, 2, 6, 15, 4, 1, 2, -1, 'images/enemies/Ящерица.png'],
		['Воин', 1, 8, 2, 6, 16, 3, 1, 10, 1, 'images/enemies/Воин-32.png'],
		['Жук', 1, 8, 0, 4, 14, 4, 1, 4, -2, 'images/enemies/Жук.png'],
		['Скелетон', 1, 12, 0, 9, 20, 1, 1, 6, 1, 'images/enemies/Скелетон.png'],
	],
}

// Список снаряжений
var equipments = {
	twoHandedWeapons: [
		// Weapon, Cost, Damage, Range
		['Алебарда', 10, 1, 10, 0, 'images/items/Алебарда.png'],
		['Длинное копьё', 5, 1, 8, 0, 'images/items/Длинное копьё.png'],
		['Посох', 0, 1, 6, 0, 'images/items/Посох.png'],
	],

	lightWeapons: [
		// Weapon, Cost, Damage, Range
		['Меч', 2, 1, 4, 10, 'images/items/Меч.png'],
		['Кинжал', 2, 1, 4, 10, 'images/items/Кинжал.png'],
		['Молоток', 1, 1, 6, 20, 'images/items/Молоток.png'],
		['Серп', 6, 1, 6, 0, 'images/items/Серп.png'],
		['Фальшион', 10, 1, 6, 0, 'images/items/Фальшион.png'],
	],

	oneHandedWeapons: [
		// Weapon, Cost, Damage, Range
		['Длинный меч', 15, 1, 6, 20, 'images/items/Длинный меч.png'],
		['Булава', 12, 1, 4, 0, 'images/items/Булава.png'],
		['Моргенштерн', 8, 1, 6, 0, 'images/items/Моргенштерн.png'],
	],

	armours: [
		// Armour, Cost, Bonus
		['Кожаная накидка', 10, 2, 'images/items/Кожаная накидка.png'],
		['Нагрудник с шипами', 25, 3, 'images/items/Нагрудник с шипами.png'],
		['Кольчуга', 100, 4, 'images/items/Кольчуга.png'],
	],

	shields: [
		// Armour, Cost, Bonus
		['Деревянный щит', 10, 1, 'images/items/Деревянный щит.png'],
		['Стальной щит', 25, 1, 'images/items/Стальной щит.png'],
		['Мощный щит', 30, 4, 'images/items/Мощный щит.png'],
	],
}

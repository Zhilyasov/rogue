// Список врагов
var monsters = {
    list: [ // name, hitDiceAmount, hitDiceSides, hitBonus, hp, ac, damageDiceAmount, damageDiceSides, damageBonus, imagePath
        ["Ящерица", 1, 8, 2, 6, 15, 4, 1, 2, -1, "img/collection/dc-mon/animals/giant_newt.png"],
        ["Воин", 1, 8, 2, 6, 16, 3, 1, 10, 1, "images/enemys/Воин-32.png"],
        ["Жук", 1, 8, 0, 4, 14, 4, 1, 4, -2, "img/collection/dc-mon/animals/giant_beetle.png"],
        ["Скелетон", 1, 12, 0, 9, 20, 1, 1, 6, 1, "img/collection/dc-mon/undead/skeletons/skeleton_humanoid_large.png"]
    ]
};

// Список снаряжений
var equipments = {
    twoHandedWeapons: [ // Weapon, Cost, Damage, Range
        ["Алебарда", 10, 1, 10, 0, "img/collection/player/hand1/halberd.png"],
        ["Длинное копьё", 5, 1, 8, 0, "img/collection/UNUSED/weapons/spear.png"],
        ["Посох", 0, 1, 6, 0, "img/collection/player/hand1/quarterstaff1.png"]
    ],

    lightWeapons: [ // Weapon, Cost, Damage, Range
        ["Меч", 2, 1, 4, 10, "images/items/Меч.png"],
        ["Кинжал", 2, 1, 4, 10, "img/collection/item/weapon/dagger.png"],
        ["Молоток", 1, 1, 6, 20, "img/collection/UNUSED/weapons/war_hammer.png"],
        ["Серп", 6, 1, 6, 0, "img/collection/player/hand1/sickle.png"],
        ["Фальшион", 10, 1, 6, 0, "images/weapon/falchion.png"]
    ],

    oneHandedWeapons: [ // Weapon, Cost, Damage, Range
        ["Длинный меч", 15, 1, 6, 20, "img/collection/item/weapon/orcish_great_sword.png"],
        ["Булава", 12, 1, 4, 0, "img/collection/UNUSED/weapons/mace3.png"],
        ["Моргенштерн", 8, 1, 6, 0, "img/collection/item/weapon/morningstar2.png"]
    ],

    armours: [ // Armour, Cost, Bonus
        ["Кожаная накидка", 10, 2, "img/collection/item/armour/leather_armour1.png"],
        ["нагрудник с шипами", 25, 3, "img/collection/UNUSED/armour/studded_leather_armor.png"],
        ["Кольчуга", 100, 4, "img/collection/item/armour/chain_mail3.png"]
    ],

    shields: [ // Armour, Cost, Bonus
        ["Деревянный щит", 10, 1, "img/collection/item/armour/shields/buckler1.png"],
        ["Стальной щит", 25, 1, "img/collection/UNUSED/armour/shield2.png"],
        ["Мощный щит", 30, 4, "img/collection/item/armour/shields/large_shield3.png"]
    ]
};

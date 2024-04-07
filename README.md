# Тестовое задание

# Пошаговая Игра “РОГАЛИК” на JavaScript (Желательно использовать JS5)

## Условия

- Должно запускаться открытием файла index.html в браузере (без сервера) ✅
- Не должно быть недостижимых зон ✅
- Отсутствие повторяющихся кусков, переиспользование кода там, где это возможно ✅
- Хранение состояния внутри Javascript, а не в DOM ✅
- Можно сделать еще что-то на ваш выбор. (Я сделал очень много всего дополнительного)

## Инструкции по запуску:

1.Чтобы запустить проект, откройте index.html в браузере.
2.Наслаждайтесь.
Если возникли вопросы или какие-то неполадки меня можно найти в тг - https://t.me/Zhilyasov

## Инструкции по игре:

Управление всегда написано в левой нижней части экрана. В разных меню управление разное

Ваша цель - выжить и найти проход на следующий уровень
Каждый уровень карта генерируется случайно, чем больше уровень карты, тем сложнее она генерируется
С каждым уровнем противники всё опаснее и опаснее

## ЛУТ

На карте рандомно генерируется 1-2 меча, 6-12 исцеляющих зелий, 1-5 сундуков с рандомным лутом. Лут генерируется только в комнатах
Лут из сундуков зависит от уровня карты, удачи и уровня игрока

### Весь доступный лут:

#### Легкое оружие

![Alt text](/images/items/Меч.png?raw=true) Меч \
![Alt text](/images/items/Кинжал.png?raw=true) Кинжал \
![Alt text](/images/items/Молоток.png?raw=true) Молоток \
![Alt text](/images/items/Серп.png?raw=true) Серп \
![Alt text](/images/items/Фальшион.png?raw=true) Фальшион

#### Одноручное

![Alt text](/images/items/Длинный%20меч.png?raw=true) Длинный меч \
![Alt text](/images/items/Булава.png?raw=true) Булава \
![Alt text](/images/items/Моргенштерн.png?raw=true) Моргенштерн

#### Двуручное

![Alt text](/images/items/Алебарда.png?raw=true) Алебарда \
![Alt text](/images/items/Длинное%20копьё.png?raw=true) Длинное копьё \
![Alt text](/images/items/Посох.png?raw=true) Посох

#### Броня

![Alt text](/images/items/Кожаная%20накидка.png?raw=true) Кожаная накидка \
![Alt text](/images/items/Нагрудник%20с%20шипами.png?raw=true) Нагрудник с шипами \
![Alt text](/images/items/Кольчуга.png?raw=true) Кольчуга

#### Щиты

![Alt text](/images/items/Деревянный%20щит.png?raw=true) Деревянный щит \
![Alt text](/images/items/Стальной%20щит.png?raw=true) Стальной щит \
![Alt text](/images/items/Мощный%20щит.png?raw=true) Мощный щит

#### Хилки

![Alt text](/images/items/Маленькое%20исцеляющее%20зелье.png?raw=true) Маленькое исцеляющее зелье \
![Alt text](/images/items/Исцеляющее%20зелье.png?raw=true) Исцеляющее зелье \
![Alt text](/images/items/Большое%20исцеляющее%20зелье.png?raw=true) Большое исцеляющее зелье

#### Прочее

![Alt text](/images/items/Бомба.png?raw=true) Бомба \
![Alt text](/images/items/Свиток%20с%20телепортом.png?raw=true) Свиток с телепортом \
![Alt text](/images/items/Сундук.png?raw=true) Сундук

## Враги

С каждым убитым противником у игрока накапливается опыт и ,по достижению определенного количества, его уровень увеличивается

При увеличении уровня игрока, повышаются его характеристики (здоровье, сила, ловкость, защита, интеллект). Также становятся сильнее и враги

### Все враги

![Alt text](/images/items/Воин-32.png?raw=true) Воин \
![Alt text](/images/items/Жук.png?raw=true) Жук \
![Alt text](/images/items/Ящерица.png?raw=true) Ящерица \
![Alt text](/images/items/Скелетон.png?raw=true) Скелетон

## ПВП СИСТЕМА

Противники бродят в случайных направлениях, пока не увидят вас.
И Вы и противник можете промахиваться, бить по защищенным местам или попадать куда нужно и наносить урон, зависит от рандома.

## ИНВЕНТАРЬ

В меню инвентаря (клавиша I) можно экипировать, использовать или выбрасывать предметы. Выброшенные предметы можно поднимать обратно.

## Музыка

Музыка работает на HTMLAudioElement теге, файл sounds.js

```javascript
// определение
var exampleSound = new Audio('path/to/sounds/some_sound.mp3')

// использование в проекте
exampleSound.play()
```

У этого подхода есть много минусов (самый большой на мой взгляд - звуки не накладываются друг на друга, а встают в очередь)

Если запустить проект через Live Server и добавить библиотеку SoundJS, то звуки в проекте будут работать идеально и без ошибок (я проверял).
Но раз в ТЗ написано, что без сервера, то я использовал HTMLAudioElement


## Код

Полностью написан на чистом JS5. Переиспользуемый и оптимизированный код везде, где это возможно.
По комментариям можно легко определить какой кусок кода за что отвечает.

Среди сторонних библиотек EaselJS, который используется для работы с 2D графикой

##### src

##### sounds.js - Инициализация аудио дорожек для дальнейшего использования

##### utils.js - Определения классов для работы с 2D объектами

##### map.js - Функциональный компонент Map в котором вся информация про карту

##### entity.js - конструктор сущностей, которые используются в игре (игрок, враг, сундук, предмет, снаряжение, инвентарь)

##### rpgMaterials.js - список предметов с их названиями, характеристиками, изображением. Чтобы добавить новый меч, броню или врага, достаточно написать одну строку в этом файле

##### randomGenerator.js - кастомная рандомная генерация всего рандомного в игре

##### game.js - Главный файл, связывающий и инициализирующий все механики

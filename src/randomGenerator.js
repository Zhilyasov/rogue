// singleton Random
// Random generator, used to generate random numbers and objects for the game
var random = {
	integer: function (size) {
		return Math.floor(Math.random() * size)
	},

	integerRange: function (minSize, maxSize) {
		return minSize + Math.floor(Math.random() * (maxSize - minSize))
	},

	integerVector: function (size) {
		return new Vector(this.integer(size), this.integer(size))
	},

	integerVectorRange: function (minSize, maxSize) {
		return new Vector(
			this.integerRange(minSize, maxSize),
			this.integerRange(minSize, maxSize)
		)
	},

	// Roll die. (amount)d(faces)
	die: function (amount, faces) {
		total = 0

		for (var i = 0; i < amount; ++i) {
			total += this.integerRange(1, faces + 1)
		}

		return total
	},

	map: function (level) {
		var width = random.integerRange(64, 128)
		var height = random.integerRange(64, 128)
		var iterations = 256
		var center = new Vector(Math.floor(width / 2), Math.floor(height / 2))

		var map = new Map(width, height)
		map.setLevel(level)

		var rooms = []
		var corridors = []
		var randomSize = this.integerVectorRange(2, 8)

		// Центральная комната
		var centerRoom = new Rect(
			center.subtract(randomSize),
			center.add(randomSize)
		)
		map.digRegion(centerRoom)
		rooms.push(centerRoom)

		// Проверка есть ли тут комната для построек внутри неё
		for (var i = 0; i < iterations; ++i) {
			// Выбрать стену
			var wallLoc = this.wall(map)

			// Определение что это за территория
			switch (this.integer(3)) {
				case 0: // Коридор
					var corridor = this.corridor(1, 16)

					if (map.regionUnwalkable(corridor.expanded(1).translated(wallLoc))) {
						map.dig(wallLoc)
						map.digRegion(corridor.translated(wallLoc))
					}
					break
				case 1: // Комната
				case 2:
					var smallRoom = this.room(2, 8)
					var smallRoomBounds = smallRoom.expanded(1)
					var smallRoomEdge = this.edge(smallRoomBounds, 1)
					var translation = smallRoomEdge.negated().add(wallLoc)

					if (map.regionUnwalkable(smallRoomBounds.translated(translation))) {
						map.dig(wallLoc)
						map.digRegion(smallRoom.translated(translation))
					}
					break
				default:
					break
			}
		}

		// Добавить игрока
		if (game.map) game.map.remove(game.player)
		game.player.setPosition(center)
		map.add(game.player)

		// Добавить врагов от 10 до 16
		var numEnemies = this.integerRange(10, 16)

		for (var i = 0; i < numEnemies; ++i) {
			var floorPos = null

			for (var j = 0; j < 32 && floorPos === null; ++j) {
				floorPos = this.floor(map)

				while (map.cellAt(floorPos).getEntity() !== null) {
					floorPos = this.floor(map)
				}

				if (
					game.player.getPosition().subtract(floorPos).magnitude() < 16 &&
					j < 32 - 1
				) {
					floorPos = null
				}
			}

			
			var monsterLevel = 0

			if (random.integer(100) < 66) {
				monsterLevel = Math.floor(game.player.getStats().level / 2) + 1
			} else if (random.integer(100) < 66) {
				monsterLevel = Math.floor(game.player.getStats().level / 2) + 2
			} else {
				monsterLevel = Math.floor(game.player.getStats().level / 2) + 3
			}

			var monster = random.monster(monsterLevel)
			monster.setPosition(floorPos)
			map.add(monster)
		}

		// Добавить рандомное количество сундуков, мечей, хилок
		var numChests = this.integerRange(1, 5)
		var numSwords = this.integerRange(2, 3)
		var numPoisons = this.integerRange(6, 12)

		// Сундуки
		for (var i = 0; i < numChests; ++i) {
			var floorPos = this.floor(map)

			if (map.cellAt(floorPos).getItem() !== null) continue

			var chest = new Chest('Сундук')
			chest.setImage(new createjs.Bitmap('images/items/Сундук.png'))
			chest.setPosition(floorPos)
			map.add(chest)
		}

		// Мечи
		for (var i = 0; i < numSwords; ++i) {
			var floorPos = this.floor(map)

			if (map.cellAt(floorPos).getItem() !== null) continue

			var sword = new Sword('Меч')
			sword.setImage(new createjs.Bitmap('images/items/Меч.png'))
			sword.setPosition(floorPos)
			map.add(sword)
		}

		// Хилки
		for (var i = 0; i < numPoisons; ++i) {
			var floorPos = this.floor(map)

			if (map.cellAt(floorPos).getItem() !== null) continue

			var poison = new Poison('Исцеляющее зелье')
			poison.setImage(new createjs.Bitmap('images/items/Исцеляющее зелье.png'))
			poison.setPosition(floorPos)
			map.add(poison)
		}

		// Добавить лестницы
		var stairsPos = null

		for (var i = 0; i < 32 && stairsPos === null; ++i) {
			stairsPos = this.floor(map)

			while (map.cellAt(stairsPos).getItem() !== null) {
				stairsPos = this.floor(map)
			}

			if (
				game.player.getPosition().subtract(stairsPos).magnitude() < 16 &&
				i < 32 - 1
			) {
				stairsPos = null
			}
		}

		var stairs = new Item('Stairs')
		stairs.setImage(new createjs.Bitmap('images/items/Лестница.png'))
		stairs.setPosition(stairsPos)
		stairs.setType('stairs')
		map.add(stairs)

		map.update()

		return map
	},

	monster: function (cost) {
		var data = null

		for (var i = 0; i < 32 && data === null; ++i) {
			data = monsters.list[this.integer(monsters.list.length)]

			// Hit Dice
			if (data[1] > cost && i < 32 - 1) {
				data = null
			}
		}

		var monster = new Monster(data[0])
		monster.parseData(data)
		return monster
	},

	corridor: function (min, max) {
		var direction = this.integer(4)

		// Check if there is room to build feature
		switch (direction) {
			case 0: // N
				return new Rect(
					new Vector(0, -1),
					new Vector(0, -this.integerRange(min, max))
				)
				break
			case 1: // S
				return new Rect(
					new Vector(0, 1),
					new Vector(0, this.integerRange(min, max))
				)
				break
			case 2: // E
				return new Rect(
					new Vector(1, 0),
					new Vector(this.integerRange(min, max), 0)
				)
				break
			case 3: // W
				return new Rect(
					new Vector(-1, 0),
					new Vector(-this.integerRange(min, max), 0)
				)
				break
			default:
				break
		}

		return null
	},

	room: function (min, max) {
		return new Rect(new Vector(0, 0), this.integerVectorRange(min, max))
	},

	floor: function (map) {
		var floors = map.getFloors()

		if (floors.length > 0) {
			return floors[this.integer(floors.length)]
		}

		return null
	},

	wall: function (map) {
		var walls = map.getWalls()

		if (walls.length > 0) {
			return walls[this.integer(walls.length)]
		}

		return null
	},

	edge: function (rect, margin) {
		var edge = Math.floor(Math.random() * 4)
		var x = 0
		var y = 0
		var m = margin || 0

		switch (edge) {
			case 0: // N
				y = rect.min.y
				x = this.integerRange(rect.min.x + m, rect.max.x - m)
				break
			case 1: // S
				y = rect.max.y
				x = this.integerRange(rect.min.x + m, rect.max.x - m)
				break
			case 2: // E
				x = rect.max.x
				y = this.integerRange(rect.min.y + m, rect.max.y - m)
				break
			case 3: // W
				x = rect.min.x
				y = this.integerRange(rect.min.y + m, rect.max.y - m)
				break
			default:
				break
		}

		return new Vector(x, y)
	},

	door: function (level) {
		var key

		switch (random.integer(5)) {
			case 0:
				key = 'red'
				break
			case 1:
				key = 'green'
				break
			case 2:
				key = 'blue'
				break
			case 3:
				key = 'black'
				break
			case 4:
				key = 'white'
				break
			default:
				break
		}

		return new Door(key)
	},

	item: function (cost) {
		if (random.integer(100) < 66) {
			return this.consumable(cost)
		} else {
			return this.equipment(cost * 10)
		}
	},

	equipment: function (cost) {
		switch (random.integer(3)) {
			case 0: // weapon
				return this.weapon(cost)
				break
			case 1: // shield
				return this.shield(cost)
				break
			case 2: // armour
				return this.armour(cost)
				break
			default:
				break
		}
	},

	armour: function (cost) {
		var data = null

		for (var i = 0; i < 32 && data === null; ++i) {
			data = equipments.armours[this.integer(equipments.armours.length)]

			if (data[1] > cost && i < 32 - 1) {
				data = null
			}
		}

		item = new Equipment(data[0])
		item.setType('armour')
		item.setPart('armour')
		item.setPickable(true)

		var bonus = data[2]

		item.setOnEquip(function (user) {
			user.stats.armourBonus += bonus
		})

		item.setOnUnequip(function (user) {
			user.stats.armourBonus -= bonus
		})

		return item
	},

	weapon: function (cost) {
		var data = null

		switch (random.integer(3)) {
			case 0: // light weapons
				for (var i = 0; i < 32 && data === null; ++i) {
					data =
						equipments.lightWeapons[
							this.integerRange(1, equipments.lightWeapons.length)
						]

					if (data[1] > cost && i < 32 - 1) {
						data = null
					}
				}

				item = new Equipment(data[0])
				break
			case 1: // one-handed
				for (var i = 0; i < 32 && data === null; ++i) {
					data =
						equipments.oneHandedWeapons[
							this.integer(equipments.oneHandedWeapons.length)
						]

					if (data[1] > cost && i < 32 - 1) {
						data = null
					}
				}

				item = new Equipment(data[0])
				break
			case 2: // two-handed
				for (var i = 0; i < 32 && data === null; ++i) {
					data =
						equipments.twoHandedWeapons[
							this.integer(equipments.twoHandedWeapons.length)
						]

					if (data[1] > cost && i < 32 - 1) {
						data = null
					}
				}

				item = new Equipment(data[0])
				item.setTwoHanded(true)
				break
			default:
				break
		}

		var diceAmount = data[2]
		var diceSides = data[3]
		//var range = data[4];

		item.setOnEquip(function (user) {
			user.stats.damageDiceSides = diceSides
			user.stats.damageDiceAmount = diceAmount
		})

		item.setOnUnequip(function (user) {
			user.stats.damageDiceSides = 3
			user.stats.damageDiceAmount = 1
		})

		item.setType('weapon')
		item.setPart('right hand')
		item.setPickable(true)

		return item
	},

	sword: function () {
		var data = equipments.lightWeapons[0]

		item = new Sword(data[0])
		var diceAmount = data[2]
		var diceSides = data[3]
		//var range = data[4];

		item.setType('weapon')
		item.setPickable(true)
		item.setPart('right hand')

		return item
	},

	shield: function (cost) {
		var data = null

		for (var i = 0; i < 32 && data === null; ++i) {
			data = equipments.shields[this.integer(equipments.shields.length)]

			if (data[1] > cost && i < 32 - 1) {
				data = null
			}
		}

		item = new Equipment(data[0])
		item.setType('shield')
		item.setPart('left hand')
		item.setPickable(true)

		var bonus = data[2]

		item.setOnEquip(function (user) {
			user.stats.armourBonus += bonus
		})

		item.setOnUnequip(function (user) {
			user.stats.armourBonus -= bonus
		})

		return item
	},

	consumable: function (cost) {
		var item = null
		var type = ''
		var func = null

		switch (random.integer(5)) {
			case 0:
			case 1:
			case 2:
				switch (random.integer(4)) {
					case 0:
						type = 'Маленькое исцеляющее зелье'

						func = function (user) {
							user.addHp(10)
							game.message('Вы восстановили здоровье на ' + 10 + ' единиц.')
						}
						break

					case 1:
						type = 'Исцеляющее зелье'

						func = function (user) {
							user.addHp(15)
							game.message('Вы восстановили здоровье на ' + 15 + ' единиц.')
						}
						break
					case 2:
						type = 'Большое исцеляющее зелье'

						func = function (user) {
							user.addHp(25)
							game.message('Вы восстановили здоровье на ' + 25 + ' единиц.')
						}
						break
					case 3:
					default:
						break
				}
				break
			case 3:
				type = 'Свиток с телепортом'

				func = function (user) {
					if (random.integer(100) < 66) {
						user.setPosition(random.floor(user.getMap()))
						game.message('Вы переместились в случайную локацию.')
					} else {
						game.makeNextLevel()
						game.message('Вы переместились на следующий уровень.')
					}
				}
				break
			case 4:
				type = 'Бомба'

				func = function (user) {
					var enemies = game.map.getEnemies()
					var damage = random.die(3, 6)

					game.message(
						'Вы взорвали местность вокруг себя, нанеся ' +
							damage +
							' урона врагам и себе.'
					)

					enemies.forEach(function (each) {
						if (
							user.getPosition().subtract(each.getPosition()).magnitude() < 4
						) {
							each.applyDamage(damage)
							if (!each.isAlive())
								user.getStats().addEncounterLevel(each.getEncounterLevel())
						}
					})

					user.applyDamage(damage)
				}
				break
			default:
				return null
				break
		}

		item = new Consumable(type)
		item.setOnUse(func)
		item.setPickable(true)

		return item
	},

	poison: function (name) {
		var item = null
		item = new Poison(name)
		item.setPickable(true)
		return item
	},
}

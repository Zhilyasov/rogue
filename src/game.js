// singleton Game
// The main game logic
var game = {
	map: null,
	player: null,
	state: 'init',
	devMode: false,

	// Этап рендеринга
	stage: null,

	// Stage containers
	background: new createjs.Container(),
	items: new createjs.Container(),
	foreground: new createjs.Container(),
	inventory: new createjs.Container(),
	characterSheet: new createjs.Container(),
	messages: new createjs.Container(),

	// Lower panel с сообщениями в чате
	messagePanel: new createjs.Shape(
		new createjs.Graphics()
			.beginFill('rgba(0, 32, 255, 255)')
			.drawRect(0, 0, 640, 55)
	),
	// HP panel
	// messageHP: new createjs.Shape(
	// 	new createjs.Graphics()
	// 		.beginFill('rgba(0, 255, 0, 1)')
	// 		.drawRect(0, -5, 32, 3)
	// ),

	// messageHPfn: function () {
	// 	var array = game.player.container.children

	// 	for (var i = 0; i < array.length; ++i) {
	// 		if (array[i].image.outerHTML === '<img src="images/Player.png">') {
	// 			var shape = new createjs.Shape(
	// 				new createjs.Graphics()
	// 					.beginFill('rgba(0, 255, 0, 1)')
	// 					.drawRect(0, -5, 32, 3)
	// 			)
	// 			shape.name = array[i].id

	// 			// console.log('shape.name')
	// 			console.log(shape.name)

	// 			this.messages.addChild(shape)
	// 		} else {
	// 			var shape = new createjs.Shape(
	// 				new createjs.Graphics()
	// 					.beginFill('rgba(255, 0, 0, 1)')
	// 					.drawRect(0, -5, 32, 3)
	// 			)
	// 			shape.name = array[i].id
	// 			console.log(shape.name)
	// 			this.messages.addChild(shape)
	// 		}
	// 	}
	// },

	messageText: new createjs.Text(),
	lastFiveMessages: [],
	informationPanel: new createjs.Shape(
		new createjs.Graphics()
			.beginFill('rgba(0, 32, 255, 255)')
			.drawRect(0, 0, 640, 55)
	),
	informationText: new createjs.Text(),
	helpString: '',

	init: function () {
		if (this.stage) this.reset()

		this.loadSounds()
		// this.playSound(soundLevelComplete)
		this.stage = this.stage || new createjs.Stage('mainScreen')
		this.player = new Player('Игрок')
		this.player.setCode('@')
		this.player.setImage(new createjs.Bitmap('images/Player.png'))

		this.map = random.map(1)
		this.stage.addChild(this.background)
		this.stage.addChild(this.items)
		this.stage.addChild(this.foreground)

		this.stage.addChild(this.messages)
		this.messageText.text = ' '

		this.messages.addChild(this.messagePanel)
		// this.messages.addChild(this.messageHP)

		this.messageText.font = '10px Arial'
		this.messageText.color = '#ffffff'
		this.messageText.text = ''
		this.messages.addChild(this.messageText)

		this.messages.addChild(this.informationPanel)
		this.informationText.font = '10px Arial'
		this.informationText.color = '#ffffff'
		this.informationText.text = ''
		this.messages.addChild(this.informationText)

		this.update()

		this.state = 'game'

		// Window event callback
		window.onkeydown = this.onKeyPressed
		window.setInterval(this.tick, 1000)
	},

	// Звуки
	loadSounds: function () {
		// var soundInventoryScreen = new Audio('sounds/panel.mp3')
		// var soundOpenChest = new Audio('sounds/openChest.mp3')
		// var soundGame_over = new Audio('sounds/game_over.mp3')
		// var soundLevelComplete = new Audio('sounds/levelComplete.mp3')
		// var soundHit = new Audio('sounds/hit.mp3')
		// var soundHurt = new Audio('sounds/hurt.mp3')
		// var soundStep_1 = new Audio('sounds/step_1.mp3')
	},

	reset: function () {
		this.background.removeAllChildren()
		this.items.removeAllChildren()
		this.foreground.removeAllChildren()
		this.inventory.removeAllChildren()
		this.characterSheet.removeAllChildren()
		this.messages.removeAllChildren()
	},

	tick: function () {
		game.stage.update()
	},

	update: function () {
		this.stage.regX = this.player.getPosition().x * 32 - Math.floor(1280 / 2)
		this.stage.regY = this.player.getPosition().y * 32 - Math.floor(700 / 2)

		if (this.state == 'game') {
			this.map.getEnemies().forEach(function (each) {
				each.updateAi()
			})

			// При смерти игрока
			if (!this.player.isAlive()) {
				soundGame_over.play()
				this.state = 'game_over'
				game.message('Вы погибли. Нажмите R чтобы перезапуститься.')
			}
		}

		game.updateMessagePanel()
		game.updateInformationPanel()

		game.showCustomHPBar()
		this.stage.update()
	},

	// playSound: function (sound) {
	// 	sound.play()
	// },

	updateMessagePanel: function () {
		// Позиция правого синего бэкграунда на экране по x и y
		game.messagePanel.x = this.player.getPosition().x * 32
		game.messagePanel.y = this.player.getPosition().y * 32 + 295

		game.messageText.text = ''

		for (var i = 0; i < game.lastFiveMessages.length; ++i) {
			game.messageText.text += game.lastFiveMessages[i]
			game.messageText.text += '\n'
		}

		// Позиция текста левого синего бэкграунда на экране по x и y
		game.messageText.x = this.player.getPosition().x * 32 + 5
		game.messageText.y = this.player.getPosition().y * 32 + 298
	},

	updateInformationPanel: function () {
		game.updateHelpText()
		// Позиция левого синего бэкграунда на экране по x и y
		game.informationPanel.x = this.player.getPosition().x * 32 - 640
		game.informationPanel.y = this.player.getPosition().y * 32 + 295

		game.informationText.text =
			'Уровень: ' +
			this.player.getStats().level +
			'\nХП: ' +
			this.player.getHp() +
			' / ' +
			this.player.getStats().maxHp +
			'\n\n'
		game.informationText.text += this.helpString

		// Позиция текста статов левого синего бэкграунда на экране по x и y
		game.informationText.x = this.player.getPosition().x * 32 - 635
		game.informationText.y = this.player.getPosition().y * 32 + 298
	},

	// Добавление новых сообщений в синюю консоль событий
	message: function (msg) {
		game.lastFiveMessages.push(msg)

		if (game.lastFiveMessages.length > 5) {
			this.lastFiveMessages.splice(0, 1)
		}
	},

	makeNextLevel: function () {
		this.background.removeAllChildren()
		this.items.removeAllChildren()
		this.foreground.removeAllChildren()
		this.map = random.map(this.map.getLevel() + 1)
		this.player.onMapChange()
		this.update()
	},

	// Инвентарь
	showInventory: function (show) {
		var container = game.inventory

		this.playSound(soundInventoryScreen)

		if (show) {
			this.stage.addChild(container)

			var panel = new createjs.Shape(
				new createjs.Graphics()
					.beginFill('rgba(0, 32, 255, 255)')
					.drawRect(0, 0, 640, 480)
			)
			var panelPos = new Vector(640, 480)

			var inventoryList = new createjs.Text()
			inventoryList.font = '20px Arial'
			inventoryList.color = '#ffffff'
			inventoryList.text = 'Inventory'

			var playerItems = new createjs.Text()
			playerItems.font = '16px Arial'
			playerItems.color = '#ffffff'
			playerItems.text = '[Items]\n'

			// inventory list
			for (var i = 0; i < this.player.getInventory().items.length; i++) {
				var key = i + 1
				if (key == 10) key = 0
				playerItems.text +=
					'(' +
					key.toString() +
					') ' +
					this.player.getInventory().items[i].toString()
				if (i < this.player.getInventory().items.length - 1)
					playerItems.text += '\n'
			}

			var inventory = this.player.getInventory()

			// Надетые предметы игрока
			playerItems.text += '\n\n[Equipped]\nArmour: '

			if (inventory.armour) {
				playerItems.text += inventory.armour.toString()
			}

			playerItems.text += '\nLeft Hand: '

			if (inventory.leftHand != null) {
				playerItems.text += inventory.leftHand.toString()
			}

			playerItems.text += '\nRight Hand: '

			if (inventory.rightHand != null) {
				playerItems.text += inventory.rightHand.toString()
			}

			// Наложение экрана инвентаря

			// add panel
			panel.x = this.map.getPlayer().getPosition().x * 32 - panelPos.x / 2
			panel.y = this.map.getPlayer().getPosition().y * 32 - panelPos.y / 2
			container.addChild(panel)

			// add texts
			var textBounds = inventoryList.getBounds()

			inventoryList.x = panel.x + textBounds.width / 2
			inventoryList.y = panel.y + textBounds.height / 2
			container.addChild(inventoryList)

			playerItems.x = panel.x + textBounds.width / 2
			playerItems.y = panel.y + textBounds.height / 2 + 32
			container.addChild(playerItems)

			this.stage.update()
		} else {
			// remove the inventory list screen
			this.inventory.removeAllChildren()
			this.stage.update()
		}
	},

	customInventory: function () {
		var nowInventory = this.player.inventory.items

		document.querySelector('.inventory').innerHTML = nowInventory
			.map(function (el) {
				return (
					'<li style="display: flex; flex-direction: column; align-items: center; margin: 0 10px 5px 0; width: 160px">' +
					'<img style="width: 30px; height: 30px" src="images/items/' +
					el +
					'.png"></img>' +
					'<p style="margin: 5px 0 0; font-size: 14px; max-width: 160px; text-align: center;">' +
					el +
					'</p>' +
					'</li>'
				)
			})
			.join('')
	},

	showCustomHPBar: function () {
		//количество хп игрока сейчас
		// this.messageHPfn()

		// Позиция ХПБара по x и y
		// var msgs = game.messages.children
		// for (var i = 0; i < msgs.length; ++i) {
		// 	if (msgs[i].graphics) {
		// 		if (msgs[i].graphics._fill.style === 'rgba(0, 255, 0, 1)') {
		// 			game.messages.children[i].x = game.player.getPosition().x * 32
		// 			game.messages.children[i].y = game.player.getPosition().y * 32
		// 	// var hpBarWidth = game.messageHP.graphics.command.w // default 32
		// }
		// else if (msgs[i].graphics._fill.style === 'rgba(255, 0, 0, 1)') {
		// 	var enemies = game.player.map.enemies
		// 	console.log('enemies')
		// 	console.log(enemies)
		// 	for (let monster = 0; monster < enemies.length; monster++) {
		// 		console.log(enemies[i])
		// 		// game.messages.children[i].x = (enemies[i].getPosition().x + i) * 32
		// 		// game.messages.children[i].y = (game.player.getPosition().y + i) * 32
		// 	}
		// }
		// 	}
		// }

		// console.log(this)

		// var point = game.player.map.player.getPosition()
		// var playerPoint = null

		// var cell = game.player.map.cellAt(point.add(new Vector(0, -1)))
		// console.log(cell)

		// if (cell && cell.getEntity() && cell.getEntity().getType() == 'enemy') {
		// 	playerPoint = cell.getEntity().getPosition()
		// }

		// console.log(playerPoint)

		// if (playerPoint) {
		// 	return playerPoint.subtract(point)
		// }

		// return null

		// var upPos = this.player.getPosition().add(new Vector(0, -1))
		// var up = game.map.cellAt(upPos)
		// console.log(up)

		var playerHP = this.player.stats.hp

		if (playerHP > 0 && (game.state === 'init' || game.state === 'game')) {
			console.log(game.state)
			// Player HP bar
			// нужный коэффициент
			var playerHPcoefficient = (100 / this.player.stats.maxHp).toFixed(2)

			// Monsters HP bar
			// список врагов на карте
			// var monstersOnMap = this.player.map.enemies

			document.querySelector('.entities').innerHTML =
				'<div class="playerHealth" style="width: ' +
				Math.floor(playerHP * playerHPcoefficient) +
				'%;"></div>'

			// + monstersOnMap
			// 	.map(function (el) {
			// 		var monsterHP = el.hp //количество хп врага сейчас
			// 		var monsterHPcoefficient = (100 / el.maxHp).toFixed(2) //нужный коэффициент

			// 		// return (
			// 		// 	'<div class="health" style="width: ' +
			// 		// 	Math.floor(monsterHP * monsterHPcoefficient) +
			// 		// 	'%;">' +
			// 		// 	'</div>'
			// 		// )
			// 	})
			// 	.join('')
		} else {
			// Убираем Player HP bar
			document.querySelector('.entities').innerHTML =
				'<div class="playerHealth" style="width: 0%;"></div>'
		}
	},

	// Меню характеристик игрока
	showCharacterSheet: function (show) {
		var container = game.characterSheet

		if (show) {
			this.stage.addChild(container)

			var panel = new createjs.Shape(
				new createjs.Graphics()
					.beginFill('rgba(0, 32, 255, 255)')
					.drawRect(0, 0, 640, 480)
			)
			var panelPos = new Vector(640, 480)

			var t = new createjs.Text()
			t.font = '20px Arial'
			t.color = '#ffffff'
			t.text = '[Character]\n\n'
			t.text += this.player.getStats().toString()

			// add panel
			panel.x = this.map.getPlayer().getPosition().x * 32 - panelPos.x / 2
			panel.y = this.map.getPlayer().getPosition().y * 32 - panelPos.y / 2
			container.addChild(panel)

			// add text
			var textBounds = t.getBounds()

			t.x = panel.x + textBounds.width / 2
			t.y = panel.y + textBounds.height / 2
			container.addChild(t)

			this.stage.update()
		} else {
			// remove the character screen
			this.characterSheet.removeAllChildren()
			this.stage.update()
		}
	},

	// Взаимодействие с клавиатурой
	onKeyPressed: function (e) {
		var code = e.keyCode

		if (game.state == 'game') {
			if (code == 65) {
				// a: left
				game.player.move(new Vector(-1, 0))
			} else if (code == 87) {
				// w: up
				game.player.move(new Vector(0, -1))
			} else if (code == 68) {
				// d: right
				game.player.move(new Vector(1, 0))
			} else if (code == 83) {
				// s: down
				game.player.move(new Vector(0, 1))
			} else if (code == 69) {
				// e: interact
				game.player.interact()
			} else if (code == 32) {
				// space: attack
				var enemy = game.player.getMonsterAdjacentDirection()
				if (enemy) {
					game.player.move(enemy)
				}
			} else if (code == 73) {
				// i: inventory
				game.showInventory(true)
				game.showCustomHPBar()
				game.state = 'inventory'
			} else if (code == 67) {
				// c: character sheet
				game.state = 'character_sheet'
				game.showCharacterSheet(true)
			} else if (code == 90) {
				// z: dev mode - unlimited hp
				game.devMode = !game.devMode
				return
			} else {
				return
			}
		} else if (game.state == 'inventory') {
			if (code >= 49 && code <= 57) {
				// 1 to 9
				game.player.getInventory().use(code - 49)
			} else if (code == 48) {
				// 0
				game.player.getInventory().use(9)
			} else if (code == 76) {
				// l: left hand
				game.player.getInventory().unequip('left hand')
			} else if (code == 65) {
				// a: armour
				game.player.getInventory().unequip('armour')
			} else if (code == 82) {
				// r: right hand
				game.player.getInventory().unequip('right hand')
			} else if (code == 68) {
				// d: drop
				game.state = 'inventory_drop'
			} else if (code == 67) {
				// c: character sheet
				game.state = 'character_sheet'
				game.showCharacterSheet(true)
				game.showInventory(false)
			} else if (code == 73) {
				// i: inventory
				game.showInventory(false)
				game.state = 'game'
				game.showCustomHPBar()
				return
			} else {
				return
			}

			if (game.state == 'inventory') {
				game.showInventory(false)
				if (game.player.isAlive()) game.showInventory(true)
				else game.state = 'game_over'
			}
		} else if (game.state == 'inventory_drop') {
			if (code >= 49 && code <= 57) {
				// 1 to 9
				game.player.getInventory().dropItem(code - 49)
				game.state = 'inventory'
			} else if (code == 48) {
				// 0
				game.player.getInventory().dropItem(9)
				game.state = 'inventory'
			} else if (code == 68) {
				// d: drop
				game.state = 'inventory'
			} else if (code == 67) {
				// c: character sheet
				game.state = 'character_sheet'
				game.showInventory(false)
				game.showCharacterSheet(true)
			} else if (code == 73) {
				// i: inventory
				game.showInventory(false)
				game.state = 'game'
				game.showCustomHPBar()
				return
			} else {
				return
			}

			if (game.state == 'inventory') {
				game.showInventory(false)
				game.showInventory(true)
			}
		} else if (game.state == 'character_sheet') {
			if (code == 67) {
				//c: character sheet
				game.showCharacterSheet(false)
				game.state = 'game'
				game.showCustomHPBar()
				return
			} else if (code == 73) {
				// i: inventory
				game.showCharacterSheet(false)
				game.showInventory(true)
				game.state = 'inventory'
			}
		} else if (game.state == 'game_over') {
			if (code == 82) {
				//r: reset
				game.stage.removeAllChildren()
				game.init()
			}
		}

		game.customInventory()
		game.update()
	},

	updateHelpText: function () {
		if (game.state == 'game' || game.state == 'init') {
			this.helpString =
				'Команды: W, A, S, D чтобы перемещаться. E -  взаимодействовать. SPACE - атаковать.\nI - открыть инвентарь. C - меню персонажа.'
		} else if (game.state == 'inventory') {
			this.helpString =
				'Команды: Выбрать предмет чтобы использовать или экипировать (клавиши 1 ~ 0).\n Клавиши R, L, A или D чтобы убрать предметы из правой руки, левой руки, слота брони или выбросить.'
		} else if (game.state == 'inventory_drop') {
			this.helpString =
				'Команды: Выбрать предмет чтобы выбросить (клавиши 1 ~ 0).'
		} else if (game.state == 'character_sheet') {
			this.helpString = 'Команды: Клавиша I чтобы открыть инвентарь.'
		} else if (game.state == 'game_over') {
			this.helpString = 'Команды: Клавиша R чтобы перезапустить.'
		}
	},
}

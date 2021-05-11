require('dotenv').config()
const {Telegraf} = require('telegraf')
const axios = require('axios')
const fs = require('fs')
const API_URL = process.env.API_URL
const bot = new Telegraf(process.env.BOT_TOKEN)
let USERS = []

bot.start((ctx) => ctx.replyWithMarkdown(`Welcome to *${ctx.botInfo.first_name}*
Введите пару валют что бы получить текущий курс или напишите /go что бы увидеть некоторые пары.
_Регистр написания не имеет значения.
Например:_ *WEC USD*, *ra usd*, *doge usd*

Ваши предложения по улучшению и замечания отправляйте *@Cocaine_GG*`))

bot.command('go', ctx => {
	ctx.telegram.sendMessage(ctx.chat.id, 'Выберете пару', {
		reply_markup: {
			resize_keyboard: true,
			// one_time_keyboard: true,
			keyboard: [
				[
					{ text: 'WEC USD', callback_data: 'wec usd' },
					{ text: 'RA USD', callback_data: 'ra usd' },
					{ text: 'WEC RA', callback_data: 'wec ra' }
				],
			]
		}
	})
})

bot.hears(/\w/, actionHandler)
bot.action('wec usd', actionHandler)
bot.action('wec ra', actionHandler)
bot.action('ra usd', actionHandler)
bot.launch()

async function actionHandler(ctx){
	console.log(ctx.from)
	let firstValue, secondValue
	if (ctx.update.callback_query !== undefined) {
		[firstValue, secondValue] = ctx.update.callback_query.data.split(' ')
	}
	if (ctx.message !== undefined) {
		[firstValue, secondValue] = ctx.message.text.split(' ')
	}

	const findUser = USERS.find(el=>el.id===ctx.from.id)
	if(!findUser){
		USERS.push(ctx.from)
		savedUsers(USERS)
	}

	const url = API_URL + firstValue + '_' + secondValue
	if (firstValue && secondValue) {
		try {
			const {data} = await axios.get(url)
			const [bidsPrice, bidsCount] = data.bids[0]
			const [asksPrice, asksCount] = data.asks[0]

			return ctx.replyWithMarkdown(`Вы можете купить ${firstValue.toUpperCase()}
Цена за 1 ${firstValue.toUpperCase()} = *${bidsPrice} ${secondValue.toUpperCase()}*
По текущей цене доступно *${bidsCount} ${firstValue.toUpperCase()}*

Вы можете продать ${firstValue.toUpperCase()}
За 1 ${firstValue.toUpperCase()} вы получите *${asksPrice} ${secondValue.toUpperCase()}*
По текущей цене можно продать *${asksCount} ${firstValue.toUpperCase()}*
`)
		} catch (err) {
			return ctx.replyWithMarkdown(`Данной валютной *${firstValue} ${secondValue}*  не существует
Попробуйте изменить порядок
Например *${secondValue} ${firstValue}*`)
		}
	}
	return ctx.replyWithMarkdown(`Введите коректно пару валют
Например *WEC USD*`)
}

function savedUsers(users) {
	fs.writeFile('users.txt', JSON.stringify(users), function (err) {
		if (err) throw err
		console.log('Saved!')
	})
}

//Read file users.txt

// fs.readFile('users.txt', async (err,data)=>{
// 	JSON.parse(data.toString())
// })

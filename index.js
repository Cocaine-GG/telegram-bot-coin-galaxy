require('dotenv').config()
const express = require('express')
const {Telegraf} = require('telegraf')
const {actionHandler} = require('./functions')
const bot = new Telegraf(process.env.BOT_TOKEN)

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.end(`
		<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 95vh;">
			<h1>Welcome <a href="https://t.me/coinGalaxy_bot">CoinGalaxyBot</a></h1>
			<h2>Support or wishes <a href="https://t.me/cocaine_gg">Daniel Kondratiuk</a></h2>
			<h2>Source code <a href="https://github.com/Cocaine-GG/telegram-bot-coin-galaxy">here</a></h2>
		</div>
	`)
})

app.listen(PORT, () => {
	console.log(`Server has been started on port ${PORT}...`)
})

bot.start((ctx) => ctx.replyWithMarkdown(`Welcome to *${ctx.botInfo.first_name}*
Введите пару валют что бы получить текущий курс или напишите /go что бы увидеть некоторые пары.
_Регистр написания не имеет значения.
Например:_ *WEC USD*, *ra usd*, *doge usd*

Ваши предложения по улучшению и замечания отправляйте *@Cocaine_GG*`))

bot.command('go', ctx => {
	ctx.telegram.sendMessage(ctx.chat.id, 'Выберете пару', {
		reply_markup: {
			resize_keyboard: true, // one_time_keyboard: true,
			keyboard: [
				[
					{text: 'WEC USD', callback_data: 'wec usd'},
					{text: 'WEC USDT', callback_data: 'wec usdt'}
				],
				[
					{text: 'RA USD', callback_data: 'ra usd'},
					{text: 'WEC RA', callback_data: 'wec ra'}
				]
			]
		}
	})
})

bot.hears(/\w/, actionHandler)
bot.action('wec usd', actionHandler)
bot.action('wec usdt', actionHandler)
bot.action('wec ra', actionHandler)
bot.action('ra usd', actionHandler)
bot.launch()

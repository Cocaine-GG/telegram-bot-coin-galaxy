const axios = require('axios')
const fs = require('fs')
const API_URL = process.env.API_URL
let USERS = []

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

module.exports = {actionHandler}

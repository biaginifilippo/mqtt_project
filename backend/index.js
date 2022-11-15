import app from './server.js'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import deviceDAO from './dao/deviceDAO.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mqtt = require('mqtt')

dotenv.config()
const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000
//const ins=new (deviceDAO)
MongoClient.connect(
	process.env.DB_URI,
	{
		maxPoolSize: 50,
		wtimeoutMS: 250,
		useNewUrlParser: true
	}
).catch(e => {
	console.log(e.stack)
	process.exit(1)
})
	.then(async client => {
		await deviceDAO.injectDB(client)
		app.listen(port, () => {
			console.log(`listening on port ${port}`)
		})
	})
try {
	const client = mqtt.connect('mqtt://3.251.2.49')

	client.on('connect', function () {
		client.subscribe('IW/4417936C9DB4-53163597/tx', function (err) {
			if (!err) {
				client.on('message', function (topic, message) {
					// message is Buffer
					deviceDAO.updateDB(message.toString())
				})
			}
		})

	})


} catch (e) {
	console.log(`error in index js: ${e}`)
}
function updateConf(data) {
	let risposta
	//esempio comando per ESP\n     
	//intestazione base                 famiglia=lista comandi
	//altirmenti non viene             sotto forma di chiave:valore
	//interpretato il messaggio
	//#TIME:0;POOL:857428990;ID:1234;CFGPUMP=STANDBY:1
	console.log("sono entrato nell'update conf")
	let msg = `#TIME:0;POOL:${data.id};ID:1234;CFGPUMP=${data.field}:${data.value};`
	console.log(msg)
	try {
		const client = mqtt.connect('mqtt://3.251.2.49')
		console.log("connesso")
		client.on('connect', function () {
			client.publish('IW/CC50E3BEB620-68380210/rx', msg, function (err) {
				if (!err) {
					console.log("callback di messaggio spedito")
					client.subscribe('IW/CC50E3BEB620-68380210/tx', function (err) {
						if (!err) {
							client.on('message', function (topic, message) {
								console.log(message.toString())
								// message is Buffer
								risposta = message.toString()
								console.log("ritorno risposta 1")
									return risposta
							})
							console.log("ritorno risposta 2")
								return risposta
						}
						console.log("ritorno risposta 3")
						return risposta
					})
					console.log("ritorno risposta 4")
					return risposta
				}
				console.log("ritorno risposta 5")
				return risposta
			})
			console.log("ritorno risposta 6")
			return risposta
		})
		console.log("ritorno risposta 7")
		return msg
	}




	catch (e) {
		console.log(`error in index js: ${e}`)
	}
	return risposta

} export default updateConf

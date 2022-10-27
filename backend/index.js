import app from './server.js'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import deviceDAO from './dao/deviceDAO.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mqtt=require('mqtt')
var amqp = require('amqplib/callback_api');
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
).catch( e=>{
	console.log(e.stack)
	process.exit(1)
})
.then( async client =>{ 
	await deviceDAO.injectDB(client)
	app.listen(port, () => {
		console.log(`listening on port ${port}`)
	})
})
try {
	const client  = mqtt.connect('mqtt://3.251.2.49')

client.on('connect', function () {
  client.subscribe('IW/1C9DC265F51C-57428990/tx', function (err) {
    if (!err) {
		client.on('message', function (topic, message) {
			// message is Buffer
			deviceDAO.updateDB(message.toString())

		  })
    }
  })

})


	/*const client =mqtt.connect(`mqtt://3.251.2.49`)
	console.log("creato client")
	console.log(client)
	client.on('connection', function(){
		console.log("client connesso")
		client.subscribe('test', function(){
			client.publish('test',"dal pc")
			console.log("spedito il messaggio al topic")
		})
		console.log("client ha fatto subscribe")
	})
	client.on('message',function (topic,message){
		console.log("client ha ricevuto un messaggio")
		console.log(message.toString())
	})
	*/
	/* 
	amqp.connect(`amqp://3.251.2.49:5672`, function (error0, connection) {
		if (error0) {
			console.log(`error con amqp connect : ${error0}`)
			throw error0;
		}
		connection.createChannel(function (error1, channel) {
			if (error1) {
				throw error1;
			}
			channel.assertQueue('test', {
				exclusive: false
			}, function (error2, q) {
				if (error2) {
					throw error2;
				}
				channel.consume('IW/1C9DC265F51C-57428990/tx',function(msg){
					/*CHIAMATA ALLA API CHE AGGIORNA I DATI NEL DB *//*
					deviceDAO.updateDB(msg.content.toString())
					channel.ack(msg)
				},{
					noAck: false
				})
				console.log("scrivo sul topic test")
				channel.sendToQueue('test',Buffer.from("scrivo"))
			});
		})

	})*/
} catch (e) {
	console.log(`error in index js: ${e}`)
}

import app from './server.js'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import deviceDAO from './dao/deviceDAO.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
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
	amqp.connect('amqp://localhost', function (error0, connection) {
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
				channel.consume('test',function(msg){
					/*CHIAMATA ALLA API CHE AGGIORNA I DATI NEL DB */
					deviceDAO.updateDB(msg.content.toString())
					channel.ack(msg)
				},{
					noAck: false
				})
			});
		})

	})
} catch (e) {
	console.log(`error in index js: ${e}`)
}

import app from './server.js'
import dotenv from 'dotenv'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var amqp = require('amqplib/callback_api');
dotenv.config()
const port = process.env.PORT || 8000

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
					console.log(msg.content.toString())
				})
			});
		})

	})
} catch (e) {
	console.log(`error in index js: ${e}`)
}
app.listen(port, () => {
	console.log(`listening on port ${port}`)
})
import { createRequire } from "module";
import { useState } from "react";
const require = createRequire(import.meta.url);
var amqp = require('amqplib/callback_api');
//c'è un errore, msg arriva undefined, per ovviare al problema e verificare
//che il giro browser-->api-->broker__
//                 console.log<--api__|
//funzionasse, il backend consuma la coda leggendo una risposta 
//e non chiude la connessione dopo averla letta, 
// resta sempre in ascolto  
                              
class ctrl {
    
    static async apiSendMsg(req, res, next) {
        let vediamo
        
        let msg = req.body.testo
        console.log(req.body)
        console.log(`req = ${req}`)
        console.log(`msg = ${msg}, req.body.testo=${req.body.testo}`)
        var correlationId = generateUuid();
        //msg = "ciao"
        console.log(' sending ', msg);
        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                console.log(`error con amqp connect : ${error0}`)
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                channel.assertQueue('', {
                    exclusive: true
                }, function (error2, q) {
                    if (error2) {
                        throw error2;
                    }
                    channel.sendToQueue('rpc_queue',
                        Buffer.from(msg), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
                    channel.consume(q.queue, function (msge) {
                        if (msge.properties.correlationId === correlationId) {
                            console.log(' [.] Got %s', msge.content.toString());
                            /*setTimeout(function () {
                                connection.close();
                                process.exit(0);
                            }, 500);*/
                            vediamo = msge.content.toString()

                            res.status(200).json({"status" : `ok`, "title": `${vediamo}`})
                        }
                    }, {
                        noAck: true
                    });

                });

            })

        })

        /*
        */

        function generateUuid() {
            return Math.random().toString() +
                Math.random().toString() +
                Math.random().toString();
        }

    }
    /*static async apiGetMsg (req,res,next){
        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                console.log(`error con amqp connect : ${error0}`)
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                channel.consume('test', function(msg){
                    console.log(msg.content.toString())
                    res.status(200).json({data: msg.content.toString()})
                })
            })
        })
    }*/
    
}
export default ctrl 
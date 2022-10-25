import { response } from "express";
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
import deviceDAO from "../dao/deviceDAO.js";
class ctrl {

    static async apiSendMsg(req, res, next) {
        /*let vediamo

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
                            }, 500); \*
                            vediamo = msge.content.toString()

                            res.status(200).json({ "status": `ok`, "title": `${vediamo}` })
                        }
                    }, {
                        noAck: true
                    });

                });

            })

        })

        /*
        */
        console.log("non faccio nulla")
        res.status(200).json({ title: "non faccio niente" })
        function generateUuid() {
            return Math.random().toString() +
                Math.random().toString() +
                Math.random().toString();
        }

    }
    static async apiUpdateConfiguration(req, res, next) {

        let config = {
            id: req.body.id,
            cloro: req.body.cloro,
            tempMin: req.body.tempMin,
            tempMax: req.body.tempMax
        }
        console.log(config)
        try {
            let esito = await deviceDAO.updateConfiguration(config)
            res.status(200).json({title:"success"})
        } catch (e) {
            res.status(400).json({title:`${e}`})
        }
    }
    static async apiGetMsg(req, res, next) {
        /*try {
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
                        //console.log(msg.content.toString())
                        channel.ack(msg)
                        res.status(200).json({"data": `${msg.content.toString()}`})
                        connection.close();

                    },{
                        noAck: false
                    })
                });
            })
    
        })
    }
    catch (e) {
        console.log(`error in index js: ${e}`)
    }*/

        const dosatore = await deviceDAO.getValues()

        try {

            let response = {
                dosatorelist: dosatore.dos,
                configlist:dosatore.con
            }

            res.status(200).json(response)
        } catch (e) {
            console.log("errore : " + e)
            res.status(200).json({ id: "10", level: "40", ph: "10", time: "time" })
        }
    }



}
export default ctrl 
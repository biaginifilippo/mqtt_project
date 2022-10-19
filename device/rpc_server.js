#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            var n = msg.content.toString();

            console.log(" [.] got (%s)", n);

            var r = fibonacci(n);

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            channel.ack(msg);
        });
        channel.assertQueue('test', {
            durable: true
        });
        setInterval(function(){
            r=generateUuid()
            console.log("sending report to server : "+ r)
            channel.sendToQueue('test',Buffer.from(r.toString()))
          }, 400);
    });
});
 function generateUuid() {
            return Math.random().toString() +
                Math.random().toString() +
                Math.random().toString();
        }
function fibonacci(n) {
/*
    if (n === 0 || n === 1)
        return n;
    else
        return fibonacci(n - 1) + fibonacci(n - 2);

let num = parseInt(n)
if (num==0 || num==1  ) return num ;
if( num==2)return 1;
if (num == 3) return 2
    var i, tot=2, prev_tot=1, temp=0 ; 
    for (i=4;i<=num;i++)
    {
        temp =tot
        tot= tot + prev_tot
        prev_tot=temp 
    }*/
    return "ho fatto"
}

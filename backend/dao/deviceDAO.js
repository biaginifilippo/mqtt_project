let dosatori
let configurazioni
let stat1
let stat2
export default class deviceDAO {
    static async injectDB(conn) {
        if (dosatori) return
        try {
            dosatori = await conn.db(process.env.DB_NAME).collection("Dosatori");
        } catch (e) {
            console.error(`unable to set collection handle with  db: ${e}`)
        }
        if (configurazioni) return
        try {
            configurazioni = await conn.db(process.env.DB_NAME).collection("Configurazione");
        } catch (e) {
            console.error(`unable to set collection handle with  db: ${e}`)
        }
        if (stat1) return
        try {
            stat1 = await conn.db(process.env.DB_NAME).collection("STAT1");
        } catch (e) {
            console.error(`unable to set collection handle with  db: ${e}`)
        }
        if (stat2) return
        try {
            stat2 = await conn.db(process.env.DB_NAME).collection("STAT2");
        } catch (e) {
            console.error(`unable to set collection handle with  db: ${e}`)
        }
    }
    static async updateDB(msg) {
        console.log(msg)
        if (msg[0] == "#") {
            let division = msg.split("=")
            let params = division[0].split(";")
            let params2 = division[1].split(";")
            let temp = params[0].substring(6, 16)
            let temp2 = parseInt(temp)
            temp2 = temp2 + 95358826 - 1640995201 //sottraggo il numero di secondi trascorsi dal 1/01/1970 al 1/01/2022 
            //perché il computer approssima male le operazioni di floor e %
            //le pompe mandano il tempo sottoforma di secondi passati al 1/01/1970
            //ma sbagliano il conteggio, questa è la correzione per far risultare corretta l'ora
            temp = calcolaData(temp2)
            if ((division[0][Buffer.byteLength(division[0]) - 1]) == '1') {
                try {
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { time: temp } },
                    )
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { serialNum: params[2].substring(3, Buffer.byteLength(params[2])) } },
                    )
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { temp: params2[0].substring(5, Buffer.byteLength(params2[0])) } },
                    )
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { rotazState: params2[1].substring(11, Buffer.byteLength(params2[1])) } },
                    )
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { poolState: params2[2].substring(10, Buffer.byteLength(params2[2])) } },
                    )
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { fluxOn: params2[3].substring(7, Buffer.byteLength(params2[3])) } },
                    )
                    stat1.updateOne(
                        { id: params[1] },
                        { $set: { tStamp: params2[4].substring(7, Buffer.byteLength(params2[4])) } },
                    )
                }
                catch (e) {
                    console.log(`unable to modify the product: ${e}`)
                }
            }
            if ((division[0][Buffer.byteLength(division[0]) - 1]) == '2') {
                try {
                    stat2.updateOne(
                        { id: params[1] },
                        { $set: { time: temp } },
                    )
                    stat2.updateOne(
                        { id: params[1] },
                        { $set: { serialNum: params[2].substring(3, Buffer.byteLength(params[2])) } },
                    )
                    stat2.updateOne(
                        { id: params[1] },
                        { $set: { fw: params2[0].substring(3, Buffer.byteLength(params2[0])) } }
                    )
                    stat2.updateOne(
                        { id: params[1] },
                        { $set: { modeP: params2[1].substring(6, Buffer.byteLength(params2[1])) } }
                    )
                    stat2.updateOne(
                        { id: params[1] },
                        { $set: { alarm: params2[2].substring(6, Buffer.byteLength(params2[2])) } }
                    )
                    stat2.updateOne(
                        { id: params[1] },
                        { $set: { tStamp: params2[3].substring(7, Buffer.byteLength(params2[3])) } }
                    )
                }
                catch (e) {
                    console.log(`unable to modify the product: ${e}`)
                }
            }
        }

    }
    static async updateConfiguration(config) {
        //esempio comando per ESP\n     famiglia=lista comandi
        //intestazione base             sotto forma di chiave:valore
        //altirmenti non viene 
        //interpretato il messaggio
        //#TIME:0;POOL:857428990;ID:1234;CFGPUMP=STANDBY:1
        try {
            configurazioni.updateOne(
                { id: config.id },
                { $set: { cloro_H: config.cloro } }
            )
            configurazioni.updateOne(
                { id: config.id },
                { $set: { tempMin: config.tempMin } }
            )
            configurazioni.updateOne(
                { id: config.id },
                { $set: { tempMax: config.tempMax } }
            )
        }
        catch (e) {
            console.log(`unable to update configuration: ${e}`)
            return e
        }
        if ((division[0][Buffer.byteLength(division[0]) - 1]) == '2') {
            console.log("kek")
        }
    }
    /*unable to retrieve values from the server ReferenceError: find is not defined
    errore : TypeError: Cannot read properties of undefined (reading 'stats1')
    unable to retrieve values from the server ReferenceError: find is not defined
    errore : TypeError: Cannot read properties of undefined (reading 'stats1')*/
    static async getValues() {
        let configurazione
        let stats1
        let stats2
        try {
            configurazione = await configurazioni
                .find(undefined)
            stats1 = await stat1
                .find(undefined)
            stats2 = await stat2
                .find(undefined)
        } catch (e) {
            console.log(`unable to retrieve values from the server ${e}`)
            return
        }
        const configurazionee = await configurazione.toArray()
        const statss1 = await stats1.toArray()
        const statss2 = await stats2.toArray()
        return ({
            stats1: statss1,
            stats2: statss2,
            con: configurazionee
        })
    }
}
function calcolaData(temp2) {
    let meseAct = 0, anni, giorni, giorniAct, ora, oraAct, min, minAct, sec
    sec = temp2 % 60
    min = Math.floor(temp2 / 60)
    minAct = min % 60
    ora = Math.floor(min / 60)
    oraAct = ora % 24
    giorni = Math.floor(ora / 24)
    giorniAct = giorni % 365
    anni = 2022 + Math.floor(giorni / 365)
    let isBis
    if (((anni - 2020) % 4) == 0) isBis = true
    if ((giorniAct) < 31) {
        meseAct = "01";
    }
    else if ((giorniAct < 59)) {
        giorniAct -= 31
        meseAct = "02"
    }
    else if ((giorniAct < 90)) {
        giorniAct -= 59
        meseAct = "03"
    }
    else if ((giorniAct < 120)) {
        giorniAct -= 90
        meseAct = "04"
    }
    else if ((giorniAct < 151)) {
        giorniAct -= 120
        meseAct = "05"
    }
    else if ((giorniAct < 181)) {
        giorniAct -= 151
        meseAct = "06"
    }
    else if ((giorniAct < 212)) {
        giorniAct -= 181
        meseAct = "07"
    }
    else if ((giorniAct < 243)) {
        giorniAct -= 212
        meseAct = "08"
    }
    else if ((giorniAct < 273)) {
        giorniAct -= 243
        meseAct = "09"
    }
    else if ((giorniAct < 304)) {
        giorniAct -= 273
        meseAct = "10"
    }
    else if ((giorniAct < 334)) {
        giorniAct -= 304
        meseAct = "11"
    }
    else {
        giorniAct -= 334
        meseAct = "12"
    }
    if (isBis == true) {
        if (meseAct == 3 && giorniAct == 1) {
            meseAct = 2
            giorniAct = 29
        }
        else if (meseAct > 2) {
            if (giorniAct != 1) {
                giorniAct--
            }
            else {
                meseAct--
                if (meseAct == 5 || meseAct == 7 || meseAct == 8 || meseAct == 10 || meseAct == 12) giorniAct = 31
                else giorniAct = 30
            }
        }
    }
    let oo, mm, ss
    if (Math.floor(oraAct / 10) == 0) oo = "0"
    else oo = ""
    if (Math.floor(minAct / 10) == 0) mm = "0"
    else mm = ""
    if (Math.floor(sec / 10) == 0) ss = "0"
    else ss = ""
    let temp = oo + oraAct.toString() + ":" + mm + minAct.toString() + ":" + ss + sec.toString() + " "
        + giorniAct.toString() + "/" + meseAct.toString() + "/" + anni.toString()
    return temp
}

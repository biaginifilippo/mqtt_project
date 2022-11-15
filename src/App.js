import sendMsg from './http-common'
import http from './http-get';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer';


function App() {
  /*E' NECESSARIO PASSARE ANCHE  LA FAMIGLIA PER FAR SI CHE IL COMANDO VENGA 
  ESEGUITO */
  const [parameter,setParameter]=useState([])
  const [ID, setID] = useState([])
  const [cloro, setCloro] = useState([])
  const [tempMin, setTempMin] = useState([])
  const [tempMax, setTempMax] = useState([])
  const [response = {
    title: "",
    status: ""
  }, setResponse] = useState([])
  const configurazione = {
    id: ID,
    cloro: cloro,
    tempMin: tempMin,
    tempMax: tempMax
  }
  const [actualConfig = [{}], setActualConfig] = useState([])
  const [stat1 = [{}], setStat1] = useState([])
  const [stat2 = [{}], setStat2] = useState([])

  const handleChangeParameter = (event) =>{

    setParameter(event.target.value)
    console.log(parameter)
  }
  const handleChangeID = (event) => {
    console.log("sono dentro ")
    setID(event.target.value)
  }
  const handleChangeCloro = (event) => {
    setCloro(event.target.value)
  }
  const handleChangeTempMin = (event) => {
    setTempMin(event.target.value)
  }
  const handleChangeTempMax = (event) => {
    setTempMax(event.target.value)
    console.log(response)
  }
  useEffect(() => {
    getLevels();

  });
  const getLevels = () => {
    getMsg()
      .then(response => {
        setActualConfig(response.data.configlist)
        setStat1(response.data.stat1)
        setStat2(response.data.stat2)
      })
  }
  async function getMsg() {
    let ris
    try {
      ris = await http.get("")
      return ris
    }
    catch (e) {
      console.log(`erorre nella get : ${e}`)
    }
  }
  async function handleSubmit(data) {
    console.log(data)
    setResponse(await sendMsg(data))
  }
  function syntaxHighlight(json) {
    let id,variable
    function handleAllow(item) {
      id = item.split(":")
      let elem = document.getElementById(id[0])
      elem.removeAttribute("disabled")
    }
    function handleDisable(item) {
      id = item.split(":")
      let elem = document.getElementById(id[0])
      elem.setAttribute("disabled","true")
    }
    let jjson = json 
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
      json = json.replace(/{/g, "\t")
      json = json.replace(/},/g, " ")
      json = json.replace(/}/g, " ")
      //il tasto submit permette di modificare la configurazione sul database
      //deve mandare al server una post che si occupera 
      //di scrivere la richiesta in formato mqtt corretto per 
      //essere letto dalla pompa
      let bson
      bson = json.split('\n')
      return (bson.map((jj) => {
        variable = jj.split(":")
        
        if (variable[0] == "\t") return (<div></div>)
        if (variable[1] == null) return (<div><br /></div>)
        if (variable[1] == " \t") {
          //set famiglia
          return (<div><h4><b>{variable[0].substring(2, 19)}</b></h4></div>) //si tratta di una famiglia
        }
        
        return (<div>{variable[0]}: 
          
           <input type="text" className="form-control-sm" disabled={true} defaultValue={variable[1]} id={variable[0]} onChange={handleChangeParameter} />
 {/*           <textarea className="form-control form-control-sm" onChange={handleChangeParameter()} id={variable[0]} rows="1"
             defaultValue={variable[1]} disabled={true}></textarea>
      */}         
          <button onClick={() => {
            console.log(jj)
            handleAllow(jj)
          }} type="button" className="leafygreen-ui-9mkbin" aria-disabled="false" title="Edit parameter" aria-label="Edit parameter"
            data-testid="edit-document-button">
            <div className="leafygreen-ui-1ktj4tm">
            </div>
            <div className="leafygreen-ui-16rvson">
              <span className="leafygreen-ui-18n6mp2">
                <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16" className="leafygreen-ui-ywrcxb" role="presentation"
                  aria-hidden="true" alt="">
                  <g clipPath="url(#Edit_svg__clip0)">
                    <path fillRule="evenodd" clipRule="evenodd"
                      d="M11.922 1.681a.963.963 0 011.362 0l1.363 1.363a.963.963 0 010 1.362L13.284 5.77 10.56 3.044 9.538 4.066l2.725 2.725-7.154 7.153-3.746 1.022 1.021-3.747 9.538-9.538z"
                      fill="currentColor">
                    </path>
                  </g>
                  <defs>
                    <clipPath id="Edit_svg__clip0">
                      <path fill="currentColor" d="M0 0h16v16H0z">
                      </path>
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
          </button>
          <button onClick={() => handleDisable(jj)}><b>X</b></button>
          <button className='btn btn-primary' onClick={() => {
            let field = jj.split(":")
            field[0] = field[0].replace(/\t/g, "")
            field[0] = field[0].replace(/\"/g, "")
            field[0] = field[0].replace(/ /g, "")
            field[0] = field[0].toUpperCase()
            setParameter(parameter.replace(/ /g,""))
            setParameter(parameter.replace(/",/g,""))
            setParameter(parameter.replace(/"/g,""))
            console.log(parameter)
            let data =  {
              id : jjson.id,
              field : field[0],
              value : parameter
            }
            console.log(data)
            handleSubmit(data)//devo passargli anche il campo che e jj[0],
            // posso anche concatenare le due stringhe, jj[0] e parameter 
            alert ("ERROR: Device is Offline")

            //aprire un modale che chiede se si è sicuri di modificare
            //l'elemento in questione (possibilita di modificarne piu di uno alla volta?)
            //--> modale di conferma effettiva (mostare risposta del server)
            //-->uscita dal modale che ricarica in automatico la pagina 
            //per visualizzare subito la modifica
        }}
          >Submit
          </button>
          <br /><br />
        </div>)
      }))
    }
    return json
  }
  
function clearStat(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
    json = json.replace("1\":", " ")
    json = json.replace("2\":", " ")
    json = json.replace(/{/g, ``)
    json = json.replace(/,/g, ",")
    json = json.replace(/},/g, "")
    json = json.replace(/}/g, " ")
    return json
  }
  return json
}
  return (
    <>
      <h1 align='center'> DEVICE MANAGER </h1>
      <br/><br/><br/>
      {actualConfig.map((singola) => {
        return (<div className='row'>
          <b><p align="center">ID: {singola.id} </p></b>
          <div className='col'>
            <div className='row'>
              <div className='col'>
                <div className='col' align="left"></div>
                <div className='col' align="center">
                  <b><p>VALORI COMUNICATI DALLA POMPA </p> </b>
                  {stat1.map((statt1) => {
                    let len = Buffer.byteLength(statt1.id)
                    let idnum = parseInt(statt1.id.substring(5, len))
                    if (idnum == singola.id) {
                      return (<div>
                        <p><b>STAT1</b>: </p>
                        <pre><code>{clearStat(statt1)}</code></pre>
                      </div>)
                    }
                    else return (<div></div>)
                  })}
                  {stat2.map((statt2) => {
                    let len = Buffer.byteLength(statt2.id)
                    let idnum = parseInt(statt2.id.substring(5, len))
                    if (idnum == singola.id) {
                      return (<div>
                        <p><b>STAT2</b>: </p> <br/>
                        <pre><code>{clearStat(statt2)}</code></pre> 
                      </div>)
                    }
                    else return (<div></div>)
                  })}
                </div>
              </div>
              <div className='col'>
                <div className='col' align="left"></div>
                <div className='col' align="left">
                  <b><p align="center">IMPOSTAZIONI DELLA POMPA</p> </b><br/>
                  <pre><code>{syntaxHighlight(singola)}</code></pre>
                </div>
              </div>
              <br />
            </div>
          </div>
          <p align="center">------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
        </div>)
      })}
      <br /><br />
      <div className='row'>
        <div className='col'></div>
        <div className='col'></div>
      </div>
    </>
  )
}
export default App

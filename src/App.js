import sendMsg from './http-common'
import http from './http-get';
//import http from './http-common.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
//import { resolvePath } from 'react-router-dom';
//import axios from 'axios';
function App() {


  const [ID, setID] = useState([])
  const [cloro, setCloro] = useState([])
  const [tempMin, setTempMin] = useState([])
  const [tempMax, setTempMax] = useState([])
  const [response = {
    title: "",
    status: ""
  }, setResponse] = useState([])
  const [livelli = {
    id: "",
    level: "",
    ph: "",
    temperature: "",
    time: ""
  }, setLivelli] = useState([])
  const configurazione = {
    id: ID,
    cloro: cloro,
    tempMin: tempMin,
    tempMax: tempMax
  }
  const [actualConfig = {
    id: "",
    cloro: "",
    tempMin: "",
    tempMax: ""
  }, setActualConfig] = useState([])
  const handleChangeID = (event) => {
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
  }

  /*let sendMsg = async (data) => {
    let risposta
    try {
      console.log(`msg: ${data.testo}`)
      console.log(data)
      risposta = await http.post("/dosatore", data)
    } catch (e) {
      console.log("error : " + e)
    }
    console.log(`risposta.data.title= ${risposta.data.title} ,
    risposta.data.status = ${risposta.data.status}`)
    setResponse(risposta)
    return
  }*/



  useEffect(() => {
    getLevels();
  });
  const getLevels = () => {
    getMsg()
      .then(response => {
        setLivelli(response.data.dosatorelist[0])
        setActualConfig(response.data.configlist[0])
      })
  }/*
  async function handleGet() {
    console.log("eseguo la funzione nell'intervallo")
    getLevels()
  }
*/
  /*async function componentWillMount() {
    const response = await axios.get(`http://localhost:5000/api/v1/dosatore`)
    .then((res)=>{
      console.log(res)
    })
    const json = await response.data;
    setLivelli(json);
  }
  */

  async function getMsg() {
    let ris
    //console.log("sono dentro a get msg")
    try {
      //console.log("sono nel try ")
      ris = await http.get("")
      //console.log("hop appena hciamato la get")
      //console.log(ris)
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
  return (
    <>
     <h1 align = 'center'> DEVICE MANAGER </h1>
      <div className='row'>
        <div className='col'></div>
        <div className='col' align = 'center'>
          <div className='row '>
            <div className="mb-3">
              <label htmlFor="productID" className="form-label"></label>
              <br /><input type="text" className="form-control-sm" id="productID" placeholder="Device ID" onChange={handleChangeID} />
              <br /><br /><input type="text" className="form-control-sm" id="productID" placeholder="Cloro" onChange={handleChangeCloro} />
              <br /><br /><input type="text" className="form-control-sm" id="productID" placeholder="Minimum Temperature" onChange={handleChangeTempMin} />
              <br /><br /><input type="text" className="form-control-sm" id="productID" placeholder="Maximum Temperature" onChange={handleChangeTempMax} />




            </div>
          </div>
          <br /><button className='btn btn-primary' onClick={() => handleSubmit(configurazione)}
          > Change Configuration
          </button>

          <br/>
          <br/><br/>
          <br />
         
        </div>
        <div className='col'></div>

      </div>
      <div className='row'>
        <div className='col'></div>
      <div className='col' align = 'center'>
      <b>ID Device: {actualConfig.id}</b><br /> <br />
          <b>Cloro</b>: {actualConfig.cloro_H}<br />
          <b>Minimum Temperature</b>: {actualConfig.tempMin}<br />
          <b>Maximum Temperature</b>: {actualConfig.tempMax}<br />
        </div>
        <div className='col' align = 'center'>
        <b>ID Device: {livelli.id} </b><br /><br />
          <b>Level</b>: {livelli.level} <br />
          <b>PH</b>: {livelli.ph} <br />
          <b>Temperature</b>: {livelli.temperature}°C<br />
          <b>Time</b>: {livelli.time}
        
        </div>
        <div className='col'></div>
      </div>
      <br /><br />
      <div className='row'>
        <div className='col'></div>

        <div className='col'></div>
      </div>
    </>
  )
}
export default App
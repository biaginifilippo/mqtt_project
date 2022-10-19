import sendMsg from './http-common'
//import http from './http-common.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'
function App() {
  const [msg, setMsg] = useState([])
  const [response = {
    title: "",
    status: ""
  }, setResponse] = useState([])
  const handleChange = (event) => {
    setMsg(event.target.value)
  }
  let messaggio = {
    testo: msg
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
  async function handleSubmit  (data)  {
    console.log(data)
    setResponse(await sendMsg(data))

  }
  return (
    <div className='row'>
      <div className='col'>
        <div className='row '> 
        <div className="mb-3">
          <label htmlFor="productID" className="form-label"></label>
          <input type="text" className="form-control-sm" id="productID" placeholder="es. 102" onChange={handleChange} />

        {response.title}

        </div>
        </div>
        <button className='btn btn-primary' onClick={() => handleSubmit(messaggio)}
        > Submit
        </button>
        <button className='btn btn-primary' onClick={()=> {
          console.log(response)
          console.log(`response : ${response.title}, response status ${response.status}`)
        }}
        > Show response
        </button>
      </div>
    </div>
  )
}
export default App
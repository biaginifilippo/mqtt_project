/*import axios from 'axios'

export default axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "content-type": "application/json"
    }
});
var responsee ={
    status:"",
    title:""
}*/
var axios = require("axios").default;
async function sendMsg (data){
    var options = {
  method: 'POST',
  url: 'http://localhost:5000/api/v1/dosatore',
  headers: {'Content-Type': 'application/json'},
  data: data  //{testo: data.testo}
};
return (await (axios.request(options))).data/*.then(function (response) {
  console.log(response.data);
  responsee=response.data
}).catch(function (error) {
  console.error(error);
});

return await responsee*/
}
export default sendMsg
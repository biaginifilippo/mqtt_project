import express from 'express'
import cors from 'cors'
import msg from './api/msg.route.js'
const app = express ()

app.use(cors())
app.use(express.json())
app.use("/api/v1",msg)
app.use("*",(req,res)=> res.status(404).json({error:'Not Found'}))


export default app;
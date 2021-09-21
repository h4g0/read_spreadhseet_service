import express from 'express'
import { get_tracking } from '../../functions/tracking/parse_document'

const dotenv = require('dotenv')
const fileupload = require("express-fileupload")

dotenv.config()

const store:string = ( process.env.STORE as string ) 

console.log( "store " + store)

// Create a new instance of express
const app = express.Router()
app.use(express.static("files"))

app.use(fileupload())

// Route that receives a POST request to /ordercreation
app.post('/', async (req, res) => {
  

  try {
    //@ts-ignore
    const file = req.files.file.name
    const fileloc = `./temp/${file}`
    //@ts-ignore
    console.log(req.files)
    //@ts-ignore
    await req.files.file.mv(fileloc)
    console.log(fileloc)
    const trackings = get_tracking(fileloc)

    res.status(200).send("Success")
  }
  catch(e: any)
  {
    console.log(e)
    res.status(403).send(e.message)
  }
})

export default app

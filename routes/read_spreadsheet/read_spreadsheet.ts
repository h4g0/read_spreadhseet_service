import express from 'express'
import { read_spreadsheet } from '../../functions/read_spreadsheet/read_spreadsheet'
const fileupload = require("express-fileupload")

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
    const spreadsheet = read_spreadsheet(fileloc)

    res.status(200).json(spreadsheet)
  }
  catch(e: any)
  {
    console.log(e)
    res.status(403).send(e.message)
  }
})

export default app

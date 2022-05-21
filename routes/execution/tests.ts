import express from 'express'
const fileupload = require("express-fileupload")

// Create a new instance of express
const app = express.Router()
app.use(express.json())

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

    res.status(200).json("Success")
  }
  catch(e: any)
  {
    console.log(e)
    res.status(403).send(e.message)
  }
})

export default app

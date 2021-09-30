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
    require("clp-wasm/clp-wasm").then((clp: any) => {
        /*const lp = `Maximize
         obj: + 0.6 x1 + 0.5 x2
         Subject To
         cons1: + x1  <= 1
         cons2: + 3 x1 + x2 <= 2
         End`;*/

         const lp = req.body.model
        
         const solution = clp.solve(lp)
         
         res.status(200).json(solution)

      });

  }
  catch(e: any)
  {
    console.log(e)
    res.status(403).send(e.message)
  }
})

export default app

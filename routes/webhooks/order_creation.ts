import { get_body } from '../../functions/webhooks/get_body'
import express from 'express'
import { order_successully_processed } from '../../functions/email/order_success'
import { send_error_order_mail } from '../../functions/email/error_mail'
import { process_order } from '../../functions/webhooks/process_order'

const dotenv = require('dotenv')

dotenv.config()

const pwd:string = ( process.env.SHOPIFY_SIGNATURE as string )
const store:string = ( process.env.STORE as string ) 

console.log( "pwd " + pwd)
console.log( "store " + store)

// Create a new instance of express
const app = express.Router()


// Route that receives a POST request to /ordercreation
app.post('/', async (req, res) => {
  let body = undefined
  try {
    body = await get_body(req,pwd)

    console.log(body)

    console.log(req.headers)

    await process_order(store, body)

    await order_successully_processed(body)
    
    res.status(200).send("Order inserted")
  }
  catch(e: any)
  {
    console.log(e)
    send_error_order_mail(e,body)
    res.status(403).send(e.message)
  }
})

export default app

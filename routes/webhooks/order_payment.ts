import express from 'express'
import { send_error_payment_mail } from '../../functions/email/error_mail'
import { order_successully_processed } from '../../functions/email/order_success'
import { get_body } from "../../functions/webhooks/get_body"
import { process_payment } from '../../functions/webhooks/process_payment'

const dotenv = require('dotenv')

dotenv.config()

const pwd:string = ( process.env.SHOPIFY_SIGNATURE as string)
const store:string = ( process.env.STORE as string ) 

console.log( "MY STORE " + store)
// Create a new instance of express
const app = express.Router()


// Route that receives a POST request to /orderupdate
app.post('/', async (req, res) => {
  let body: any = undefined
  try {
    console.log(req.headers)
    body = await get_body(req,pwd)

    console.log(body)

    await process_payment(store, body)

    await order_successully_processed(body)
    
    res.status(200).send("Payment status updated")
  }
  catch(e: any)
  {
    console.log(e)
    send_error_payment_mail(e,req.headers)
    res.status(403).send(e.message)
  }
})

export default app
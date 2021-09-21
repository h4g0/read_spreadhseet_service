import tracking from "./tracking/tracking"

let express = require("express")

let app = express.Router()

app.use("/readspreadsheet",tracking)

export default app
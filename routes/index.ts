import spreadsheet from "./read_spreadsheet/read_spreadsheet"

let express = require("express")

let app = express.Router()

app.use("/readspreadsheet",spreadsheet)

export default app
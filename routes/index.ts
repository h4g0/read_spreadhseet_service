import spreadsheet from "./read_spreadsheet/read_spreadsheet"
import solver from "./solver/solver"

let express = require("express")

let app = express.Router()

app.use("/readspreadsheet",spreadsheet)
app.use("/solver",solver)

export default app
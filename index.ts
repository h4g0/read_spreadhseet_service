const express = require('express');
import { read_spreadsheet } from "./functions/read_spreadsheet/read_spreadsheet";
import routes from "./routes/index"

const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config()

const port: string = (process.env.PORT as string)

const app = express();

const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.use("",routes)

app.get('/', async (req: any, res: any) => {

    /*require("clp-wasm/clp-wasm").then((clp: any) => {
        const lp = `Maximize
         obj: + 0.6 x1 + 0.5 x2
         Subject To
         cons1: + x1  <= 1
         cons2: + 3 x1 + x2 <= 2
         End`;
        console.log(clp.solve(lp)); // Prints a result object with solution values, objective, etc.
      });*/

    console.log(read_spreadsheet("./temp/Vegetables.xlsx"))
    

    res.send('Well done!');
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})
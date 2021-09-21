const express = require('express');
import routes from "./routes/index"

const bodyParser = require('body-parser')
const dotenv = require('dotenv')

dotenv.config()

const port: string = (process.env.PORT as string)

const app = express();

const cors = require('cors');

const corsOptions ={
    origin: "*", 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))

app.use("",routes)

app.get('/', async (req: any, res: any) => {
    
    res.send('Well done!');
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})
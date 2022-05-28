const express = require('express');
import { fitness } from "./functions/optimization/fitness";
import { hillClimbing } from "./functions/optimization/optimization";
import { generate_population } from "./functions/optimization/population";
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

    //const population = generate_population(100)
    
    //const fitness_e = fitness(population)
    const solution = hillClimbing(100000)
    console.log(solution)
    
    res.send('Well done!');
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})
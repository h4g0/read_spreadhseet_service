const express = require('express');
import { fitness, pretty_print_population } from "./functions/optimization/fitness";
import { hillClimbing, SimulatedAnnealing } from "./functions/optimization/optimization";
import { endpoints, generate_population } from "./functions/optimization/population";
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

    const test_fitness = [
        [endpoints.create_account, "Fake Name", "US", "4711","911222333","1994-10-10"],
        [endpoints.create_account, "Fake Name", "PT", "4711","911222333","1994-10-10"],
        [endpoints.create_account, "Fake Name", "CHZK", "4711","911222333","1994-10-10"],
        [endpoints.create_account, "Fake Name", "US", "4711","911222333","2020-10-10"],
        [endpoints.create_account, "Fake Name", "PT", "4711","911222333","2020-10-10"],
        [endpoints.add_funds, "US_5",10],
        [endpoints.add_funds, "US_0",10],
        [endpoints.add_funds, "EUR_5",10],
        [endpoints.add_funds, "EUR_0",10],
        [endpoints.retrieve_funds,"EUR_0",5],
        [endpoints.retrieve_funds,"US_0",5],
        [endpoints.retrieve_funds,"EUR_1",5],
        [endpoints.retrieve_funds,"US_1",5],
        [endpoints.retrieve_funds,"EUR_0",20],
        [endpoints.retrieve_funds,"US_0",20],
        [endpoints.local_transfer,"US_0","US_0",5],
        [endpoints.local_transfer,"EUR_0","EUR_0",5],
        [endpoints.local_transfer,"EUR_0","US_0",5],
        [endpoints.local_transfer,"US_0","US_1",5],
        [endpoints.local_transfer,"EUR_0","EUR_1",5],
        [endpoints.local_transfer,"US_0","US_0",100],
        [endpoints.local_transfer,"EUR_0","EUR_0",100],
        [endpoints.international_transfer,"EUR_0","US_0",100],
        [endpoints.international_transfer,"EUR_1","US_0",100],
        [endpoints.international_transfer,"EUR_1","US_2",100],
        [endpoints.international_transfer,"US_0","EUR_0",100],
        [endpoints.add_funds, "EUR_0",20],
        [endpoints.add_funds, "US_0",20],
        [endpoints.international_transfer,"EUR_0","US_2",5],
        [endpoints.international_transfer,"EUR_0","US_0",5],
        [endpoints.international_transfer,"US_0","EUR_0",5],
        [endpoints.freeze_account,"US_1"],
        [endpoints.freeze_account,"EUR_2"],
        [endpoints.unfreeze_account,"US_1"],
        [endpoints.unfreeze_account,"EUR_2"],
        [endpoints.freeze_account,"US_0"],
        [endpoints.international_transfer,"EUR_0","US_0",5],
        [endpoints.create_account, "Fake Name", "US", "4711","911222333","1920-10-10"],
        [endpoints.add_funds, "US_1",20],
        [endpoints.local_transfer,"US_0","US_0",5],
        [endpoints.local_transfer,"US_1","US_0",5],
        [endpoints.international_transfer,"US_0","US_0",5],
        [endpoints.freeze_account,"EUR_0"],
        [endpoints.international_transfer,"EUR_0","US_0",5],
        [endpoints.international_transfer,"US_1","EUR_0",5],
        [endpoints.add_funds, "EUR_0",20],
        [endpoints.add_funds, "US_0",20],
        [endpoints.retrieve_funds,"EUR_0",5],
        [endpoints.retrieve_funds,"US_0",5],
        [endpoints.unfreeze_account,"US_0"],
        [endpoints.unfreeze_account,"EUR_0"],
    ]
    //const population = generate_population(100)
    
    //const fitness_e = fitness(test_fitness)
    const solution = hillClimbing(10000)
    //console.log(fitness_e)

    pretty_print_population(solution)
    
    res.send('Well done!');
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})
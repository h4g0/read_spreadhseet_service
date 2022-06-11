const express = require('express');
import { fitness, pretty_print_population } from "./functions/optimization/fitness";
import { GeneticAlgorithm, hillClimbing, SimulatedAnnealing, TabuSearch } from "./functions/optimization/optimization";
import { endpoints, generate_population, permutation, test_crossover, test_generate_population } from "./functions/optimization/population";
import routes from "./routes/index"

const fs = require('fs');

const content = 'Some content!';

function roundToTwo(num: any) {
    //@ts-ignore
    return +(Math.round(num + "e+2")  + "e-2");
}

const write_to_file = (file: string,content: string) => {

 fs.writeFile(file, content, (err: any)=> {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
}


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
    

    /*const population = generate_population(20)
    
    console.log(population)
    /*const population2 = [...population]

    pretty_print_population(population)

    const new_population = permutation(population)

    pretty_print_population(new_population)
    //const fitness_e = fitness(test_fitness)*/



    /*const combinations = (options: any[][]) => {
        if(options.length == 0) return []
        if(options.length == 1){
            return options[0].map((x: any) => [x])
        }

        const combinations_next: any[][] = combinations(options.slice(1))
        let final_combinations: any[][] = []

        for(let option of options[0]){
            for(let combination of combinations_next){
                const new_combination: any[] = []
               
                new_combination.push(option)
                for(let parameter of combination)
                    new_combination.push(parameter)

                final_combinations.push(new_combination)
            }
        }

        return final_combinations
    }


    //const solution = GeneticAlgorithm(10000,10,5,0.02)

    //let parameters = [[1,2,3],[0.01,0.1],[30,40,50]]
    let parameters = [[5,10],[5,2],[0.01,0.02,0.03]]

    const combs = combinations(parameters)


    const tests = 2

    const run_values = [2000,5000,10000]

    for(let comb of combs){
        
        for(let runs of run_values){

       
        let solutions: number[][] = []

        const currentDateTime = new Date();

        for(let i = 0; i < tests; i++){
            const s = (GeneticAlgorithm(runs,comb[0],comb[1],comb[2]))
            const f = fitness(s)
            solutions.push([f[0],f[1].size,s.length])
        }
            //solutions.push(SimulatedAnnealing(runs,comb[0],comb[1],comb[2]))
            //solutions.push(hillClimbing(runs,comb[0],comb[1]))

        const endTime = new Date();
        const timeDiff = endTime.getTime() - currentDateTime.getTime(); //in ms
            // strip the ms
        const time = roundToTwo(timeDiff / 1000 / tests)

        let average = [0,0,0]


        for(let i = 0; i < tests; i++)
        {
            average[0] += solutions[i][0]
            average[1] += solutions[i][1]
            average[2] += solutions[i][2]
        }

        average[0] = roundToTwo(average[0]/tests)
        average[1] = roundToTwo(average[1]/tests)
        average[2] = roundToTwo(average[2]/tests)
   
        const latex_line = `${comb.join(" , ")} , ${runs} & ${average[0]} & ${average[1]} & ${average[2]} & ${time} \\\\`
        console.log(latex_line)
        console.log("\\hline")
    }
    }*/
    /*
    const solution = SimulatedAnnealing(10000,1,40)
    text+= "SA(1,40)"

    console.log(solution)

    const solution2 = SimulatedAnnealing(10000,2,40)
    text+= ";SA(2,40)"

    console.log(solution2)


    const solution3 = SimulatedAnnealing(10000,3,40)
    text+= ";SA(3,40)"
    console.log(solution3)

    const solution4 = SimulatedAnnealing(10000,1,50)
    text+= ";SA(1,50)"
    console.log(solution4)


    const solution5 = SimulatedAnnealing(10000,2,50)
    text+= ";SA(2,50)"
    console.log(solution5)


    const solution6 = SimulatedAnnealing(10000,3,50)
    text+= ";SA(3,50)"
    console.log(solution6)




    const solution7 = SimulatedAnnealing(10000,1,30)
    text+= ";SA(1,30)"
    console.log(solution7)


    const solution8 = SimulatedAnnealing(10000,2,30)
    text+= ";SA(2,30)"
    console.log(solution8)


    const solution9 = SimulatedAnnealing(10000,3,30)
    text+= ";SA(3,30)"
    console.log(solution9)



    const solution10 = hillClimbing(10000,1)
    text+= ";HC(1)"
    console.log(solution10)

    const solution11 = hillClimbing(10000,2)
    text+= ";HC(2)"
    console.log(solution11)


    const solution12 = hillClimbing(10000,3)
    text+= ";HC(3)"
    console.log(solution12)


    
    text += "\n"
    */

    const solution = SimulatedAnnealing(10000, 2 , 0.01 , 30 , )
    const solution2 = hillClimbing(10000, 2 , 0.01)
    const soltuion3 =  GeneticAlgorithm(10000,10,2,0.03)
    //console.log(Array.from(fitness(solution)[1]).sort())
    //console.log(Array.from(fitness(solution2)[1]).sort())*/

    
    let text = "Simulated Annealing;Hill Climbing;Genetic algorithm\n"

    for(let i = 0; i < solution.length; i++){
        text += `${solution[i]};${solution2[i]};${soltuion3[i]}`
       
        text += "\n"
    }
    
    write_to_file("test5.csv", text)
    //console.log(test_generate_population(6))
    //console.log(fitness(solution))
    //console.log(fitness_e)

    //pretty_print_population(solution)
    
    res.send('Well done!');
})

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})
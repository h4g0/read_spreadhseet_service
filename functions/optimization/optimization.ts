import { randomInt } from "crypto"
import { fitness } from "./fitness"
import { generate_population, permutation } from "./population"

export function hillClimbing(iterations: number = 1000){
    let iteration = 0
    let iterationnochange = 0
    let best_solution = generate_population()
    let best_evaluation = fitness(best_solution)[0]

    while(iteration < iterations) {
        iteration += 1
        iterationnochange += 1

        const neighboor = permutation(best_solution)
        const neighboor_evaluation = fitness(neighboor)[0]

        if(neighboor_evaluation > best_evaluation){
            best_solution = neighboor
            best_evaluation = neighboor_evaluation
        }

        if(iteration % 1000 == 0) console.log(`${best_evaluation} ${iteration}`)
    }


    return best_solution
}

export function SimulatedAnnealing(iterations: number = 1000){
    let iteration = 0
    let iterationnochange = 0
    let best_solution = generate_population()
    let best_evaluation = fitness(best_solution)[0]
    let final_solution = best_solution
    let final_evaluation = best_evaluation
    
    const temperature = 40


    while(iteration < iterations) {
        iteration += 1
        iterationnochange += 1

        const neighboor = permutation(best_solution)
        const neighboor_evaluation = fitness(neighboor)[0]

        const temp_curr = temperature * Math.pow(0.99, iteration / 10)
        const diff = neighboor_evaluation - best_evaluation
        const exp = Math.exp((diff)/temp_curr)

        const random_number = Math.random()

        if((diff > 0 || random_number < exp)){

            /*if(exp > random_number && diff < 0){
                console.log(`iteration:${iteration} exp:${exp} temp:${temp_curr}`)
            }*/
            best_solution = neighboor
            best_evaluation = neighboor_evaluation

            if(best_evaluation > final_evaluation){
                final_solution = best_solution
                final_evaluation = best_evaluation
            }
        }

        if(iteration % 100 == 0) console.log(`${best_evaluation} ${final_evaluation} ${exp} ${iteration} ${temp_curr}`)
    }


    return final_solution
}
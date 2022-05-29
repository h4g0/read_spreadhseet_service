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

        console.log(`${best_evaluation} ${iteration}`)
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

    const temperature = iterations


    while(iteration < iterations) {
        iteration += 1
        iterationnochange += 1

        const neighboor = permutation(best_solution)
        const neighboor_evaluation = fitness(neighboor)[0]

        const delta = 1 - iteration / temperature
        const diff = neighboor_evaluation - best_evaluation

        const random_number = randomInt(0,temperature) / temperature

        if(diff > 0 || random_number < delta){
            best_solution = neighboor
            best_evaluation = neighboor_evaluation

            if(best_evaluation > final_evaluation){
                final_solution = best_solution
                final_evaluation = best_evaluation
            }
        }

        console.log(`${best_evaluation} ${final_evaluation} ${random_number} ${delta}`)
    }


    return final_solution
}
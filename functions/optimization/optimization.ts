import { fitness } from "./fitness"
import { generate_population, permutation } from "./population"

export function hillClimbing(iterations: number = 1000,neighboors = 1000){
    let iteration = 0
    let iterationnochange = 0
    let best_solution = generate_population()
    let best_evaluation = fitness(best_solution)

    while(iteration < iterations) {
        iteration += 1
        iterationnochange += 1

        const neighboor = permutation(best_solution)
        const neighboor_evaluation = fitness(neighboor)

        if(neighboor_evaluation < best_evaluation){
            best_solution = neighboor
            best_evaluation = neighboor_evaluation
        }

        console.log(best_solution)
    }


    return best_solution
}
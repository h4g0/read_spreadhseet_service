import { randomInt } from "crypto"
import { fitness } from "./fitness"
import { generate_new_population_ga, generate_population, generate_population_ga, get_best_population_ga, permutation, Population } from "./population"

export function hillClimbing(iterations: number = 1000,changes: number = 5,penalty: number = 0.01){
    let iteration = 0
    let iterationnochange = 0
    let best_solution = generate_population()
    let best_evaluation = fitness(best_solution,penalty)[0]

    let fitness_itaration = []

    while(iteration < iterations) {
        iteration += 1
        iterationnochange += 1

        const neighboor = permutation(best_solution,changes)
        const neighboor_evaluation = fitness(neighboor)[0]

        if(neighboor_evaluation > best_evaluation){
            best_solution = neighboor
            best_evaluation = neighboor_evaluation
        }

        fitness_itaration.push(fitness(best_solution)[1].size)

        //if(iteration % 1000 == 0) console.log(`${best_evaluation} ${iteration}`)
    }


    //return [best_evaluation,fitness(best_solution)[1].size,best_solution.length]

    return  best_solution
}

export function SimulatedAnnealing(iterations: number = 1000,changes: number=5,penalty: number = 0.01,temperature: number = 40){
    let iteration = 0
    let iterationnochange = 0
    let best_solution = generate_population()
    let best_evaluation = fitness(best_solution,penalty)[0]
    let final_solution = best_solution
    let final_evaluation = best_evaluation
    


    let fitness_itaration: number[] = []


    while(iteration < iterations) {
        iteration += 1
        iterationnochange += 1

        const neighboor = permutation(best_solution,changes)
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

        fitness_itaration.push(fitness(best_solution)[1].size)

        //if(iteration % 100 == 0) console.log(`${best_evaluation} ${final_evaluation} ${exp} ${iteration} ${temp_curr}`)
    }


    //return [final_evaluation,fitness(final_solution)[1].size,final_solution.length]

    return final_solution
}

export function TabuSearch(iterations: number = 1000,tabuListSize: number = 20){

    let tabuList: any[][][] = []

    function add_tabu_element(element: any[]): void{
        tabuList.push(element)

        if(tabuList.length > tabuListSize)
            tabuList.shift()
    }


    
    function compare_elements(element1: any[],element2: any[]): boolean{
        
        return JSON.stringify(element1) === JSON.stringify(element2)
    }

    function tabu_element(element: any[]): boolean{
        
        for(let tabuelement of tabuList){
            if(compare_elements(tabuelement, element)) return true
        }

        return false
    }

    let iteration = 0
    let best_solution = generate_population()
    let best_evaluation = fitness(best_solution)[0]
    let final_solution = best_solution
    let final_evaluation = best_evaluation
    

    while(iteration < iterations) {
        iteration += 1

        const neighboor = permutation(best_solution)
        const neighboor_fitness= fitness(neighboor)
        const neighboor_evaluation =  neighboor_fitness[0]

        const diff = neighboor_evaluation - best_evaluation
        const isNotTabu = !tabu_element(neighboor)

        if(diff > 0 && isNotTabu){

            /*if(exp > random_number && diff < 0){
                console.log(`iteration:${iteration} exp:${exp} temp:${temp_curr}`)
            }*/
            best_solution = neighboor
            best_evaluation = neighboor_evaluation

            if(best_evaluation > final_evaluation){
                final_solution = best_solution
                final_evaluation = best_evaluation
            }

            add_tabu_element(Array.from(neighboor_fitness[1]).sort())
        }

        if(iteration % 100 == 0) console.log(`${best_evaluation} ${final_evaluation} ${iteration}`)
    }


    return final_solution
}



export function GeneticAlgorithm(iterations: number = 1000){
    

    let iteration = 0
    let population = generate_population_ga(10)
    let best_solution = get_best_population_ga(population)
    let best_evaluation = fitness(best_solution)[0]
    

    while(iteration < iterations) {
        iteration += 1

        population = generate_new_population_ga(population)
        
        const best_new_solution =  get_best_population_ga(population)

        const best_new_evaluation = fitness(best_new_solution)[0]
    
        const diff = best_new_evaluation - best_evaluation

        if(diff > 0){

          
            best_solution = best_new_solution
            best_evaluation = best_new_evaluation

        }

        if(iteration % 100 == 0) console.log(`${best_evaluation} ${iteration}`)
    }


    return best_solution
}
import * as Faker from "@faker-js/faker"
import { fitness } from "./fitness"

export type Datatype = any[]

type ParametersPopulation = [number, Datatype][]

export type Population = any[][]
const max_accounts = 10

const fitness_dic = new Map<string,number>()

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export enum endpoints {
    create_account =  0,
    international_transfer,
    local_transfer,
    add_funds,
    retrieve_funds,
    freeze_account,
    unfreeze_account,
}

const number_endpoints = 7

function generate_country_code(): string {
    
    const r = getRandomInt(0,5)

    if(r == 0) return "US"

    if(r == 1) return "FR"

    if(r == 2) return "KZ"

    if(r == 3) return "ES"

    if(r == 4) return "CHN"

    return "US"

}

function generate_create_account(): Datatype {
    const name = Faker.default.name.findName()
    const country = generate_country_code()
    const address = Faker.default.address.zipCode()
    const phone = Faker.faker.phone.imei()
    const datebirth = Faker.default.date.past(100)


    return [endpoints.create_account,name,country,address,phone,datebirth]
}

function generate_deposit_funds(): Datatype {

    const account =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`
    const ammount = getRandomInt(0,1000)

    return [endpoints.add_funds,account,ammount]

}

function generate_local_transfer_funds(): Datatype {
    const account1 =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`
    const account2 =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`

    const ammount = getRandomInt(0,1000)

    return [endpoints.local_transfer,account1,account2,ammount]
}

function generate_freeze_account(): Datatype {
    const account =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`

    return [endpoints.freeze_account, account]
}

function generate_unfreeze_account(): Datatype {
    const account =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`

    return [endpoints.unfreeze_account, account]
}

function generate_international_transfer_funds(): Datatype {
    const account1 =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`
    const account2 =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`

    const ammount = getRandomInt(0,1000)

    return [endpoints.international_transfer,account1,account2,ammount]
}

function cashout_funds(): Datatype{
    const account =`${getRandomInt(0,2) == 0 ? "US" : "EUR"}_${getRandomInt(0,10)}`
    const ammount = getRandomInt(0,1000)

    return [endpoints.retrieve_funds,account,ammount]
}

function generate_datatype(endpoint: number): Datatype {
    switch(endpoint){
        case endpoints.add_funds: {
            return generate_deposit_funds();
            break;
        }
        case endpoints.create_account: {
            return generate_create_account();
            break;
        }
        case endpoints.retrieve_funds: {
            return cashout_funds()
            break;
        }
        case endpoints.international_transfer: {
            return generate_international_transfer_funds()
            break;
        }
        case endpoints.local_transfer: {
            return generate_local_transfer_funds()
            break;
        }
        case endpoints.create_account: {
            return generate_create_account()
            break;
        }
        case endpoints.freeze_account: {
            return generate_freeze_account()
            break;
        }
        case endpoints.unfreeze_account: {
            return generate_unfreeze_account()
            break;
        }
        default: {
            return generate_create_account()
            break;
        }
    }
}


function deletion(population: Population): Population {
    
    let new_population: Population = population

    if(new_population.length == 0) return new_population

    const random_pos = getRandomInt(0, new_population.length)
    new_population.splice(random_pos, 1)

    return new_population

}

function addition(population: Population): Population {
    let new_population: Population = population

    const element = get_random_element()
    new_population.push(element)

    const element1 = getRandomInt(0,new_population.length)
    const element2 = new_population.length - 1

    const element1_value = [...new_population[element1]]
    new_population[element1] = [...new_population[element2]]
    new_population[element2] = element1_value

    return new_population
}

function reordering(population: Population): Population {
    let new_population: Population = population

    if(new_population.length == 0) return new_population

    const element1 = getRandomInt(0,new_population.length)
    const element2 = getRandomInt(0,new_population.length)

    const element1_value = [...new_population[element1]]
    new_population[element1] = [...new_population[element2]]
    new_population[element2] = element1_value

    return new_population
}

export function permutation(population: Population,changes: number = 1): Population {
    
    let new_population: Population = [...population]


    for(let i = 0; i < changes; i++){

        const change = getRandomInt(0,3)

        if(change == 0) {

            new_population = deletion(new_population)
        }

        if(change == 1){

            new_population = addition(new_population)
        
        }

        if(change == 2) {

            new_population = reordering(new_population)

        }
    }
    
    return new_population
}

function get_random_element(): Datatype {
    const endpoint = getRandomInt(0,number_endpoints)
    const datatype = generate_datatype(endpoint)
    
    return datatype
}

export function generate_population(size: number = 10): Population {
    let population: Population  = []
    
    for(let i = 0; i < size; i++){
       const element = get_random_element()
       population.push(element)
    }

    return population
}

function crossover(population1: Population,population2: Population): Population {
    const new_population: Population = []

    const crossover_point1 = getRandomInt(0,population1.length) 
    const crossover_point2 = getRandomInt(0,population2.length)

    for(let i = 0; i < crossover_point1; i++)
        new_population.push([...population1[i]])

    for(let i = crossover_point2; i < population2.length; i++)
        new_population.push([...population2[i]])

    return new_population
}

export function test_crossover(){
    let population = generate_population_ga(20)

    const fitness_dic = new Map<string,number>()

    let best = 5

    
    console.log(population.map((x: Population) => x.length))
    
    for(let i = 0; i < 100; i++){
        population = population.sort( (x: any,y: any) => getRandomInt(0,3) - 1).slice(0,5)

        for(let n = 5; n < 10; n++)
            population.push(crossover(population[getRandomInt(0,5)],population[getRandomInt(0,5)]))

        console.log(population.map((x: Population) => x.length))

    }
    
}
function mutate_population_ga(population: Population[],mutations: number = 20): Population[]{
    
    const new_population = population

    for(let i = 0; i < mutations; i++){
        const random_pos = getRandomInt(0,population.length)

        const changed_element = permutation(population[random_pos])

        new_population[random_pos] = changed_element
    }

    return new_population
}

export function generate_new_population_ga(population: Population[],size: number = 10,best: number = 3,discount: number = 0.01): Population[]{

    const ordered_population = population.sort((x: Population,y: Population) => fitness(y,discount)[0] - fitness(x,discount)[0] )

    const new_population = ordered_population.slice(0,best)

    
    for(let i = best; i < size; i++){
        const parent1 = getRandomInt(0,best)
        const parent2 = getRandomInt(0,best)

       
        const new_element =  permutation(crossover(ordered_population[parent1],ordered_population[parent2]),3)

        new_population.push(new_element)
    }

    return  new_population
}  

export function get_best_population_ga(population: Population[]): Population {
    //const ordered_population = (population).sort((x: Population,y: Population) => fitness(y)[0] -  fitness(x)[0])
    const ordered_population = population
    
    return [...ordered_population[0]]
}

export function generate_population_ga(size: number = 10): Population[]{
    const ga_population: Population[] = []

    for(let i = 0 ; i < size; i++){
        ga_population.push(generate_population())
    }

    return ga_population
}

export function test_generate_population(type: number): Population {
    let population: Population  = []
    
    for(let i = 0; i < 20; i++){
        const datatype = generate_datatype(type)
        
        population.push(datatype)
    }

    return population
}
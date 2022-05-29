import * as Faker from "@faker-js/faker"
import { randomInt } from "crypto";

export type Datatype = any[]

type ParametersPopulation = [number, Datatype][]

export type Population = any[][]

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

function generate_create_account(): Datatype {
    const name = Faker.default.name.findName()
    const country = Faker.default.address.countryCode()
    const address = Faker.default.address.zipCode()
    const phone = Faker.faker.phone.imei()
    const datebirth = Faker.default.date.past(100)


    return [endpoints.create_account,name,country,address,phone,datebirth]
}

function generate_deposit_funds(): Datatype {

    const account =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
    const ammount = getRandomInt(0,1000)

    return [endpoints.add_funds,account,ammount]

}

function generate_local_transfer_funds(): Datatype {
    const account1 =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
    const account2 =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`

    const ammount = getRandomInt(0,1000)

    return [endpoints.local_transfer,account1,account2,ammount]
}

function generate_freeze_account(): Datatype {
    const account =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`

    return [endpoints.freeze_account, account]
}

function generate_unfreeze_account(): Datatype {
    const account =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`

    return [endpoints.freeze_account, account]
}

function generate_international_transfer_funds(): Datatype {
    const account1 =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
    const account2 =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`

    const ammount = getRandomInt(0,1000)

    return [endpoints.local_transfer,account1,account2,ammount]
}

function cashout_funds(): Datatype{
    const account =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
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
    
    let new_population: Population = [...population]

    if(new_population.length == 0) return new_population

    const random_pos = randomInt(0, new_population.length)
    new_population.splice(random_pos, 1)

    return new_population

}

function addition(population: Population): Population {
    let new_population: Population = [...population]

    const element = get_random_element()
    new_population.push(element)

    return new_population
}

function reordering(population: Population): Population {
    let new_population: Population = [...population]

    if(new_population.length == 0) return new_population

    const element1 = randomInt(0,new_population.length)
    const element2 = randomInt(0,new_population.length)

    const element1_value = [...new_population[element1]]
    new_population[element1] = [...new_population[element2]]
    new_population[element2] = element1_value

    return new_population
}

export function permutation(population: Population,changes: number = 3): Population {
    
    let new_population: Population = [...population]

    const deletions = randomInt(0,changes)

    for(let i = 0; i < deletions; i++){
        
        new_population = deletion(new_population)
    }

    const additions = randomInt(0,changes)

    for(let i = 0; i < additions; i++){
      new_population = addition(new_population)
    }

    const reorderings = randomInt(0,changes)

    for(let i = 0; i < reorderings; i++){
        new_population = reordering(new_population)
    }

    return new_population
}

function get_random_element(): Datatype {
    const endpoint = randomInt(0,number_endpoints)
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
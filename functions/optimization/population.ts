import * as Faker from "@faker-js/faker"

type Datatype = any[]

type ParametersPopulation = [number, Datatype][]

export type Population = [any][]

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

enum endpoints {
    create_account =  0,
    transfer_funds,
    add_funds,
    retrieve_funds,
}


function generate_create_account(): Datatype {
    const name = Faker.default.name.findName()
    const country = Faker.default.address.countryCode()
    const address = Faker.default.address.zipCode()
    const phone = Faker.faker.phone.imei()
    const datebirth = Faker.default.date.past()


    return [name,country,address,phone,datebirth]
}

function generate_deposit_funds(): Datatype {

    const account =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
    const ammount = getRandomInt(0,1000)

    return [account,ammount]

}

function generate_transfer_funds(): Datatype {
    const account1 =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
    const account2 =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`

    const ammount = getRandomInt(0,1000)

    return [account1,account2,ammount]
}

function cashout_funds(): Datatype{
    const account =`${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,100)}`
    const ammount = `${getRandomInt(0,1) == 0 ? "US" : "EUR"}_${getRandomInt(0,1000)}`

    return [account,ammount]
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
        case endpoints.transfer_funds: {
            return generate_transfer_funds()
            break;
        }
        case endpoints.create_account: {
            return generate_create_account()
            break;
        }
        default: {
            return generate_create_account()
            break;
        }
    }
}

export function generate_population(): Population {
    let population: Population  = []
    
    for(let i = 0; i < 4; i++){
       const datatype = generate_datatype(i)
       console.log(datatype)
    }
    
    return population
}
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
    create_account =  1,
    

}


function generate_create_account(): Datatype {
    const name = Faker.default.name.findName()
    const country = Faker.default.address.countryCode()
    const address = Faker.default.address.zipCode()
    const phone = Faker.faker.phone.imei()
    const datebirth = Faker.default.date.past()


    return [name,country,address,phone,datebirth]
}

function change_country(): Datatype {
    const account = getRandomInt(0,100)
    const country = Faker.default.address.countryCode()

    return [account,country]
}

function change_address(): Datatype {
    const account = getRandomInt(0,100)
    const country = Faker.default.address.countryCode()

    return [account,country]
}

function change_datebirth(): Datatype {
    const account = getRandomInt(0,100)

    const datebirth = Faker.default.date.past()


    return [account,datebirth]
}

function change_phone(): Datatype {
    const account = getRandomInt(0,100)

    const phone = Faker.faker.phone.imei()

    return [account,phone]
}

function generate_deposit_funds(): Datatype {

    const account = getRandomInt(0,100)
    const ammount = getRandomInt(0,100000)

    return [account,ammount]

}

function generate_transfer_funds(): Datatype {
    const account1 = getRandomInt(0,100)
    const account2 = getRandomInt(0,100)

    const ammount = getRandomInt(0,10000)

    return [account1,account2,ammount]
}

function generate_flag_account(): Datatype {
    const account = getRandomInt(0,100)

    return [account]
}

function generate_terminate_account(): Datatype {
    const account = getRandomInt(0,100)

    return [account]
}


function visualize_funds(): Datatype {
    const account = getRandomInt(0,100)

    return [account]
}

function cashout_funds(): Datatype{
    const account = getRandomInt(0,100)
    const ammount = getRandomInt(0,100000)

    return [account,ammount]
}

export function generate_population(parameters: ParametersPopulation): Population {
    let population: Population  = []
    
    return population
}
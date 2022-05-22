import { Population } from "./population"

type account = {
    name: string,
    country: string,
    address: string,
    phone: string,
    datebirth: string,
    ammount: number,
}

type accounts = account[]

function run_operation(operation: any, accounts_us: accounts, accounts_eur: accounts) {
    
}

function run_operation_branch(operation: any, accounts: accounts,prefix: string) {
    const result = operation(accounts)

    return prefix + result 
}

const run_operation_us = (operation: any, accounts: accounts) => run_operation_branch(operation,accounts,"US_")
const run_operation_eur = (operation: any, accounts: accounts) => run_operation_branch(operation,accounts,"EUR_")

export function fitness(population: Population): number {
    let fit = 0

    let accounts_eur = []
    let accounts_us = []


    return fit
}
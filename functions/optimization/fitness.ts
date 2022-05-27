import { Datatype, endpoints, Population } from "./population"

type account = {
    name: string,
    country: string,
    address: string,
    phone: string,
    datebirth: string,
    ammount: number,
    frozen: boolean,
}

type accounts = account[]
const international_transfer_fee = 2

const getAge = (dateOfBirth: string, dateToCalculate = new Date()) => {
    const dob = new Date(dateOfBirth).getTime();
    const dateToCompare = new Date(dateToCalculate).getTime();
    const age = (dateToCompare - dob) / (365 * 24 * 60 * 60 * 1000);
    return Math.floor(age);
};

function create_account_branch(accounts: accounts, name: string, country: string, address: string, phone: string, datebirth: string): [number,string] {

    if(name.length >= 30) {
        return [500,"500|Length of name above 30 characters"]
    }

    if(address.length >= 15) {
        return [500,"500|Length of address above 30 characters"]
    }

    if(phone.length >= 30) {
        return [500,"500|Length of phone above 30 characters"]
    }

    if(isNaN(Date.parse(datebirth))) {
        return [500,"500|Date is not in a valid format"]
    }

    const age = getAge(datebirth)

    if(age < 18) {
        return [500,"500|Age is less than 18"]
    }


    const new_account = {
        name: name,
        country: country,
        address: address,
        phone: phone,
        datebirth: datebirth,
        ammount: 0,
        frozen: false,
    }

    accounts.push(new_account)

    return [200,"200|Success"]

}

function create_account(accounts_eur: accounts, accounts_us: accounts, name: string, country: string, address: string, phone: string, datebirth: string): string {
    
    console.log(`country ${country}`)

    if(!["FR","BE","BG","DK","DE","EE","IE",
    "EL","ES","FR","HR","IT","CY","LV","LT",
    "LU","HU","MT","NL","AT",
    "PL","RO","SI","SK","FI","SE",
    "PT","FR","ES","IT","US"].includes(country)){
        return "create_account|500|Country code not accepted"
    }

    if(country == "US"){
        const resp_branch = create_account_branch(accounts_us,name, country, address , phone, datebirth )

        return `create_account|${resp_branch[0]}|${resp_branch[1].slice(3)} -> create_account_branch|US|${resp_branch[1]}`

    }

    else {
        const resp_branch = create_account_branch(accounts_eur,name, country, address , phone, datebirth )

        return `create_account|${resp_branch[0]}|${resp_branch[1].slice(3)} -> create_account_branch|EUR|${resp_branch[1]}`

    }

}

function check_account_exists(branch: string, accounts: accounts, account: number): string {
   
    if(accounts.length > account) {
        return `check_account_exists_branch|${branch}|200|Success`
    }

    return `check_accoun_exists_branch|${branch}|500|Account non existent`
}

function check_funds(branch: string, accounts: accounts, account: number, ammount: number): string{
    
    if(accounts.length <= account  ) {
        return `check_funds_branch|${branch}|500|Account non existent`

    }

    console.log(accounts)
    console.log(account)
    if(accounts[account].ammount <= ammount){
        return `check_funds_branch|${branch}|500|Not enough funds`
    }


    return `check_funds_branch|${branch}|200|Success`

}

function remove_funds_branch(branch: string, accounts: accounts, account: number, ammount: number): string {
   
    accounts[account].ammount -= ammount

    return `remove_funds_branch|${branch}|Success`

}

function freeze_account_branch(branch: string, accounts: accounts, account: number): string {
   
    accounts[account].frozen = true

    return `freeze_account_branch|${branch}|Success`

}

function unfreeze_account_branch(branch: string, accounts: accounts, account: number): string {
   
    accounts[account].frozen = false

    return `unfreeze_account_branch|${branch}|Success`

}

function add_funds_branch(branch: string, accounts: accounts, account: number, ammount: number): string {
   
    accounts[account].ammount += ammount

    return `add_funds_branch|${branch}|Success`

}


function transfer_funds(accounts_eur: accounts, accounts_us: accounts,account1: string, account2: string,ammount: number,fee: number = 0): string {
    const account1_branch = account1.split("_")[0]
    const account2_branch = account2.split("_")[0]
    const account1_number = parseInt(account1.split("_")[1])
    const account2_number = parseInt(account2.split("_")[1])

    const account_has_funds = check_funds(account1_branch, account1_branch == "US" ? accounts_us : accounts_eur,
    account1_number,ammount + fee)

    let result = parseInt(account_has_funds.split("|")[2]) == 200

    if(!result) 
    {
        return `transfer_funds|500|${account_has_funds.split("|")[3]} -> ${account_has_funds}`
    }

    const account_exists = check_account_exists(account2_branch, account2_branch == "US" ? accounts_us : accounts_eur,
             account2_number)
    
    result = parseInt(account_exists.split("|")[2]) == 200

    if(!result) 
    {
        return `transfer_funds|500|${account_exists[3]} -> ${account_exists}`
    } 


    const rfb = remove_funds_branch(account1_branch, account1_branch == "US" ? accounts_us : accounts_eur,
    account1_number,ammount)

    const afb = add_funds_branch(account2_branch, account2_branch == "US" ? accounts_us : accounts_eur,
    account2_number,ammount)

    return `transfer_funds|200|Success -> ; ${account_has_funds} ; ${account_exists}; (${rfb} | ${afb})`

}

function frozen_account_branch(branch: string, accounts: accounts, account: number): string {
   
    if(accounts[account].frozen)
        return "frozen_account_branch|500|Account frozen"

    return `frozen_account_branch|200|Success`

}

function frozen_account(account: string): string {



}


function local_transfer(accounts_eur: accounts, accounts_us: accounts,account1: string, account2: string,ammount: number): string {
    const account1_branch = account1.split("_")[0]
    const account2_branch = account2.split("_")[0]
    const account1_number = parseInt(account1.split("_")[1])
    const account2_number = parseInt(account2.split("_")[1])

    if((account2_branch != "US" && account1_branch == "US") || (account1_branch == "US" && account1_branch != "US") )
        return "local_transfer|500|different branches"

    const tf = transfer_funds(accounts_eur,accounts_us,account1,account2,ammount)

    const success = parseInt(tf.split("|")[2])

    if(success != 200)
        return `local_transfer|500|${tf.split("|")[3]} -> ${tf}`

   

    return `local_transfer|200|Success -> ${tf}`

}

function international_transfer(accounts_eur: accounts, accounts_us: accounts,account1: string, account2: string,ammount: number): string {
   

    const tf = transfer_funds(accounts_eur,accounts_us,account1,account2,ammount,international_transfer_fee)

    const success = parseInt(tf.split("|")[2])

    if(success != 200)
        return `international_transfer|500|${tf.split("|")[3]} -> ${tf}`

   

    return `international_transfer|200|Success -> ${tf}`

}

function add_funds(accounts_eur: accounts, accounts_us: accounts, account: string, ammount: number): string {
    const account_branch = account.split("_")[0]
    const account_number = parseInt(account.split("_")[1])

    const account_exists = check_account_exists(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
             account_number)
        
    const result = parseInt(account_exists.split("|")[2]) == 200

    if(!result) 
    {
        return `add_funds|500|${account_exists.split("|")[3]} -> ${account_exists}`
    } 

    const afb = add_funds_branch(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
    account_number,ammount)

    return `add_funds|200|Success -> ${afb}`
}

function retrieve_funds(accounts_eur: accounts, accounts_us: accounts, account: string, ammount: number): string {
 const account_branch = account.split("_")[0]
    const account_number = parseInt(account.split("_")[1])

    const account_exists = check_funds(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
             account_number, ammount)
        
    const result = parseInt(account_exists.split("|")[2]) == 200

    if(!result) 
    {
        return `retrieve_funds|500|${account_exists.split("|")[3]} -> ${account_exists}`
    } 

    const afb = remove_funds_branch(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
    account_number,ammount)

    return `retrieve_funds|200|Success -> ${afb}`
}


function freeze_account(accounts_eur: accounts, accounts_us: accounts, account: string): string {
    const account_branch = account.split("_")[0]
       const account_number = parseInt(account.split("_")[1])
   
       const account_exists = check_account_exists(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
                account_number)
           
       const result = parseInt(account_exists.split("|")[2]) == 200
   
       if(!result) 
       {
           return `freeze_account|500|${account_exists.split("|")[3]} -> ${account_exists}`
       } 
   
       const afb = freeze_account_branch(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
       account_number)
   
       return `freeze_account|200|Success -> ${afb}`
}
   
function unfreeze_account(accounts_eur: accounts, accounts_us: accounts, account: string): string {
    const account_branch = account.split("_")[0]
       const account_number = parseInt(account.split("_")[1])
   
       const account_exists = check_account_exists(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
                account_number)
           
       const result = parseInt(account_exists.split("|")[2]) == 200
   
       if(!result) 
       {
           return `unfreeze_account|500|${account_exists.split("|")[3]} -> ${account_exists}`
       } 
   
       const afb = unfreeze_account_branch(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
       account_number)
   
       return `unfreeze_account|200|Success -> ${afb}`
}

function run_test(accounts_eur: accounts, accounts_us: accounts,datatype: Datatype): string {
    const endpoint = datatype[0]

    if(endpoint == endpoints.create_account){
        const result = create_account(accounts_eur,accounts_us,datatype[1],
                datatype[2],datatype[3],datatype[4],datatype[5])

        return result
    }

    if(endpoint == endpoints.add_funds){
        const result = add_funds(accounts_eur,accounts_us,datatype[1],datatype[2])

        return result
    }

    if(endpoint == endpoints.retrieve_funds){
        const result = retrieve_funds(accounts_eur, accounts_us, datatype[1],datatype[2])

        return result
    }

    if(endpoint == endpoints.local_transfer){
        const result = local_transfer(accounts_eur,accounts_us,datatype[1],datatype[2],datatype[3])

        return result
    }

    if(endpoint == endpoints.international_transfer){
        const result = international_transfer(accounts_eur,accounts_us,datatype[1],datatype[2],datatype[3])

        return result
    }


    if(endpoint == endpoints.freeze_account){
        const result = freeze_account(accounts_eur,accounts_us,datatype[1])
        
        return result
    }

    if(endpoint == endpoints.unfreeze_account){
        const result = unfreeze_account(accounts_eur,accounts_us,datatype[1])

        return result
    }

    return "Error"
}

export function fitness(population: Population,coverage: number=0.8, tests: number=0.2): number {
    let fit = 0

    const traces = new Set()

    let accounts_eur: accounts = []
    let accounts_us: accounts = []

    
    for(let element of population){
        const trace = run_test(accounts_eur,accounts_us,element)
        traces.add(trace)
    }


    console.log(traces)

    fit = traces.size * 0.8 / (population.length * tests)

    return fit
}
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

    if(accounts[account].ammount < ammount){
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
        return `transfer_funds|500|${account_exists.split("|")[3]} -> ${account_exists}`
    } 

    const account1_frozen = frozen_account(accounts_eur, accounts_us, account1)
    
    result = parseInt(account1_frozen.split("|")[1]) == 200

    if(!result) 
    {
        return `transfer_funds|500|account1 frozen:${account1_frozen.split("|")[2]} -> ${account1_frozen}`
    } 

    const account2_frozen = frozen_account(accounts_eur, accounts_us,account2)
    
    result = parseInt(account2_frozen.split("|")[1]) == 200

    if(!result) 
    {
        return `transfer_funds|500|account2 frozen:${account2_frozen} -> ${account2_frozen}`
    } 

    const rfb = remove_funds_branch(account1_branch, account1_branch == "US" ? accounts_us : accounts_eur,
    account1_number,ammount)

    const afb = add_funds_branch(account2_branch, account2_branch == "US" ? accounts_us : accounts_eur,
    account2_number,ammount)

    return `transfer_funds|200|Success -> ; ${account_has_funds} ; ${account_exists}; (${rfb} | ${afb})`

}

function frozen_account_branch(branch: string, accounts: accounts, account: number): string {
   
    if(accounts[account].frozen)
        return `frozen_account_branch|${branch}|500|Account frozen`

    return `frozen_account_branch|${branch}|200||Success`

}

function frozen_account(accounts_eur: accounts,accounts_us: accounts,account: string): string {

    const account_branch = account.split("_")[0]
    const account_number = parseInt(account.split("_")[1])

    const fab = frozen_account_branch(account_branch, account_branch == "US" ? accounts_us : accounts_eur, account_number )
    const result = parseInt(fab.split("|")[2]) == 200

    if(!result) {
        return `frozen_account|500|${fab.split("|")[3]} -> ${fab}`
    }

    return `frozen_account|200|Success -> ${fab}`

}


function local_transfer(accounts_eur: accounts, accounts_us: accounts,account1: string, account2: string,ammount: number): string {
    const account1_branch = account1.split("_")[0]
    const account2_branch = account2.split("_")[0]
    const account1_number = parseInt(account1.split("_")[1])
    const account2_number = parseInt(account2.split("_")[1])

    if((account2_branch != "US" && account1_branch == "US") || (account1_branch == "US" && account1_branch != "US") )
        return "local_transfer|500|different branches"

    const tf = transfer_funds(accounts_eur,accounts_us,account1,account2,ammount)

    const success = parseInt(tf.split("|")[1])

    if(success != 200)
        return `local_transfer|500|${tf.split("|")[2]} -> ${tf}`

   

    return `local_transfer|200|Success -> ${tf}`

}

function international_transfer(accounts_eur: accounts, accounts_us: accounts,account1: string, account2: string,ammount: number): string {
   

    const tf = transfer_funds(accounts_eur,accounts_us,account1,account2,ammount,international_transfer_fee)

    const success = parseInt(tf.split("|")[1])

    if(success != 200)
        return `international_transfer|500|${tf.split("|")[2]} -> ${tf}`

   

    return `international_transfer|200|Success -> ${tf}`

}

function add_funds(accounts_eur: accounts, accounts_us: accounts, account: string, ammount: number): string {
    const account_branch = account.split("_")[0]
    const account_number = parseInt(account.split("_")[1])

    const account_exists = check_account_exists(account_branch, account_branch == "US" ? accounts_us : accounts_eur,
             account_number)
        
    let result = parseInt(account_exists.split("|")[2]) == 200

    if(!result) 
    {
        return `add_funds|500|${account_exists.split("|")[3]} -> ${account_exists}`
    } 

    
    const account_frozen = frozen_account(accounts_eur, accounts_us,account)
    
    result = parseInt(account_frozen.split("|")[1]) == 200

    if(!result) 
    {

        return `add_funds|500|${account_frozen.split("|")[2]} -> ${account_frozen}`
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
        
    let result = parseInt(account_exists.split("|")[2]) == 200

    if(!result) 
    {
        return `retrieve_funds|500|${account_exists.split("|")[3]} -> ${account_exists}`
    } 

    const account_frozen = frozen_account(accounts_eur, accounts_us,account)
    
    result = parseInt(account_frozen.split("|")[1]) == 200

    if(!result) 
    {

        return `retrieve_funds|500|${account_frozen.split("|")[2]} -> ${account_frozen}`
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

function get_endpoint(endpoint: number): string {
    
    if(endpoint == endpoints.add_funds) return "add_funds"
    if(endpoint == endpoints.create_account) return "create_account"
    if(endpoint == endpoints.freeze_account) return "freeze_account"
    if(endpoint == endpoints.international_transfer) return "international_transfer"
    if(endpoint == endpoints.local_transfer) return "local_transfer"
    if(endpoint == endpoints.retrieve_funds) return "retrienve_funds"
    if(endpoint == endpoints.unfreeze_account) return "unfreeze_account"

    return "not_found"

}

function pretty_element(element: any[]): string {
    const endpoint = get_endpoint(element[0])

    const args = element.slice(1).join(" ; ")

    const pretty_element = `${endpoint} ${args}`

    return pretty_element
}

export function pretty_print_population(population: Population): void {

    let accounts_eur: accounts = []
    let accounts_us: accounts = []

    for(let element of population) {
        const pe = pretty_element(element)


        console.log("<____________________________________________________________________")
        
        console.log(pe)

        const trace = run_test(accounts_eur,accounts_us,element)

        console.log(trace)

        console.log("____________________________________________________________________>")


    }
}

const fitness_dic = new Map<string, [number,Set<unknown>]>()

export function restart_fitness_cache(){
    fitness_dic.clear()
}

export function fitness(population: Population,penalty: number = 0.01): [number,Set<unknown>] {
    const past_fitness = fitness_dic.get(JSON.stringify(population)) || [0, new Set()]

    if(past_fitness[0] != 0) return past_fitness
    
    let fit = 0

    const traces = new Set()

    let accounts_eur: accounts = []
    let accounts_us: accounts = []

    
    for(let element of population){
        const trace = run_test(accounts_eur,accounts_us,element)
        traces.add(trace)
    }



    fit = traces.size  - penalty * population.length

    fitness_dic.set(JSON.stringify(population), [fit,traces])

    return [fit,traces]
}
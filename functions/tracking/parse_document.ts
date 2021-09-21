const xlsx = require("xlsx")

function read_spreadsheet(doc: any) {
    //console.log(doc)
    const workbook = xlsx.readFile(doc)
    const sheetNames = workbook.SheetNames;
    
    const obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    console.log(obj)
    return obj
}

 
export function get_tracking(file: any):  any[] {
    const spreadsheet = read_spreadsheet(file)
    
    let tracking = []
    const tracking_col: string = 'Nr przesyłki'
    const name_col: string = "Zaimportowany numer"
    
    for( let row of spreadsheet ) 
        tracking.push( { name: row[name_col] ,  tracking: row[tracking_col] } )

    console.log(tracking)
    return tracking
}



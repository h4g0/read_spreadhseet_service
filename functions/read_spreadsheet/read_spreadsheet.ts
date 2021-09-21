
const xlsx = require("xlsx")


export function read_spreadsheet(doc: string) {
    const workbook = xlsx.readFile(doc)
    const sheetNames = workbook.SheetNames;
    
    const obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    
    console.log(obj)

    return obj
}


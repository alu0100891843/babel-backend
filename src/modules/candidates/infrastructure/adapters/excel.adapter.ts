import * as XLSX from 'xlsx';

export class ExcelAdapter {
  static getJSONDataFromExcelFile(file: Buffer): any[] {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }
}
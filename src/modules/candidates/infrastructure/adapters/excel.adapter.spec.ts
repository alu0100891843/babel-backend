import { ExcelAdapter } from './excel.adapter';
import * as XLSX from 'xlsx';

jest.mock('xlsx');

describe('ExcelAdapter', () => {
  let mockWorkbook: XLSX.WorkBook;
  let mockWorksheet: XLSX.WorkSheet;

  beforeEach(() => {
    mockWorksheet = {
      'A1': { v: 'name' },
      'B1': { v: 'surname' },
      'C1': { v: 'seniority' },
      'D1': { v: 'experience' },
      'E1': { v: 'availability' },
      '!ref': 'A1:E2'
    };

    mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        'Sheet1': mockWorksheet
      }
    };

    jest.clearAllMocks();
  });

  describe('getJSONDataFromExcelFile', () => {
    it('should parse Excel file and return JSON data', () => {
      const mockBuffer = Buffer.from('mock excel content');
      const expectedData = [
        { name: 'Cristian', surname: 'Manuel', seniority: 'senior', experience: 6, availability: true }
      ];

      (XLSX.read as jest.Mock).mockReturnValue(mockWorkbook);
      (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(expectedData);

      const result = ExcelAdapter.getJSONDataFromExcelFile(mockBuffer);

      expect(result).toEqual(expectedData);
      expect(XLSX.read).toHaveBeenCalledWith(mockBuffer.buffer, { type: 'buffer' });
      expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith(mockWorksheet);
    });

    it('should handle multiple rows of data', () => {
      const mockBuffer = Buffer.from('mock excel content');
      const expectedData = [
        { name: 'Cristian', surname: 'Manuel', seniority: 'senior', experience: 6, availability: true },
        { name: 'Pepe', surname: 'Pérez', seniority: 'junior', experience: 5, availability: false }
      ];

      (XLSX.read as jest.Mock).mockReturnValue(mockWorkbook);
      (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(expectedData);

      const result = ExcelAdapter.getJSONDataFromExcelFile(mockBuffer);

      expect(result).toEqual(expectedData);
    });

    it('should handle empty Excel file', () => {
      const mockBuffer = Buffer.from('mock excel content');
      const expectedData = [];

      (XLSX.read as jest.Mock).mockReturnValue(mockWorkbook);
      (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(expectedData);

      const result = ExcelAdapter.getJSONDataFromExcelFile(mockBuffer);

      expect(result).toEqual([]);
    });

    it('should use the first sheet when multiple sheets exist', () => {
      const mockBuffer = Buffer.from('mock excel content');
      const multiSheetWorkbook = {
        SheetNames: ['Sheet1', 'Sheet2', 'Sheet6'],
        Sheets: {
          'Sheet1': mockWorksheet,
          'Sheet2': {},
          'Sheet6': {}
        }
      };
      const expectedData = [
        { name: 'Cristian', surname: 'Manuel', seniority: 'senior', experience: 6, availability: true }
      ];

      (XLSX.read as jest.Mock).mockReturnValue(multiSheetWorkbook);
      (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(expectedData);

      const result = ExcelAdapter.getJSONDataFromExcelFile(mockBuffer);

      expect(result).toEqual(expectedData);
      expect(XLSX.utils.sheet_to_json).toHaveBeenCalledWith(mockWorksheet);
    });

    it('should handle XLSX library errors', () => {
      const mockBuffer = Buffer.from('invalid excel content');
      (XLSX.read as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid file format');
      });

      expect(() => {
        ExcelAdapter.getJSONDataFromExcelFile(mockBuffer);
      }).toThrow('Invalid file format');
    });

    it('should handle missing worksheet', () => {
      const mockBuffer = Buffer.from('mock excel content');
      const workbookWithoutSheets = {
        SheetNames: ['Sheet1'],
        Sheets: {}
      };

      (XLSX.read as jest.Mock).mockReturnValue(workbookWithoutSheets);
      (XLSX.utils.sheet_to_json as jest.Mock).mockImplementation(() => {
        throw new Error('Worksheet not found');
      });

      expect(() => {
        ExcelAdapter.getJSONDataFromExcelFile(mockBuffer);
      }).toThrow('Worksheet not found');
    });
  });
});

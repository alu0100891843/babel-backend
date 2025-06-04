import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@Controller('candidates')
export class CandidatesController {
  @Post('createCandidate')
  @UseInterceptors(FileInterceptor('excelFile', {
    fileFilter: (_, file, cb) => {
      if (!file.originalname.match(/\.(xlsx)$/)) {
        return cb(new Error('Only Excel XLSX files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 1 }
  }))

  createCandidate(@UploadedFile() excelFile: Buffer, @Body() body: { name: string, surname: string }) {
    const workbook = XLSX.read(excelFile.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('Parsed data from Excel file:', data);
    console.log('Received file:', excelFile);
    console.log('Received body:', body);
  }
}

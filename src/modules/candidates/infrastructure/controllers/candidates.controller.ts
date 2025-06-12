import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesDTO } from '../../application/models/dtos/candidates.dto';
import { CandidatesService } from '../../application/services/candidates.service';
import { ExcelAdapter } from '../adapters/excel.adapter';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) { }

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

  createCandidate(@UploadedFile() excelFile: Buffer, @Body() body: { name: string, surname: string }): CandidatesDTO {
    if (!excelFile) {
      throw new HttpException('Excel file is required.', HttpStatus.BAD_REQUEST);
    }
    if (!body.name || !body.surname) {
      throw new HttpException('Name and surname are required.', HttpStatus.BAD_REQUEST);
    }

    const excelData = ExcelAdapter.getJSONDataFromExcelFile(excelFile);
    if (excelData.length !== 1) {
      throw new HttpException('The Excel file should have only one row.', HttpStatus.BAD_REQUEST);
    }

    const candidateDTO = CandidatesDTO.createFromJson(excelData[0] as Omit<CandidatesDTO, never>);
    return this.candidatesService.createCandidate(candidateDTO, body.name, body.surname);
  }
}

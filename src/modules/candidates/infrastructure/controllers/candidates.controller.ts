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
        return cb(new Error('¡Solo se permiten archivos Excel XLSX!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 1 }
  }))

  createCandidate(@UploadedFile() excelFile: Buffer, @Body() body: { name: string, surname: string }): CandidatesDTO {
    if (!excelFile) {
      throw new HttpException('El archivo Excel es requerido.', HttpStatus.BAD_REQUEST);
    }

    if (!body.name || !body.surname) {
      throw new HttpException('El nombre y apellido son requeridos.', HttpStatus.BAD_REQUEST);
    }

    const excelData = ExcelAdapter.getJSONDataFromExcelFile(excelFile);
    if (excelData.length !== 1) {
      throw new HttpException('El archivo Excel debe tener solo una fila.', HttpStatus.BAD_REQUEST);
    }

    const candidateDTO = CandidatesDTO.createFromJson(excelData[0] as Omit<CandidatesDTO, never>);
    return this.candidatesService.createCandidate(candidateDTO, body.name, body.surname);
  }
}

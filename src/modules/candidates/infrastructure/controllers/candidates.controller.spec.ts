import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from '../../application/services/candidates.service';
import { CandidatesDTO } from '../../application/models/dtos/candidates.dto';
import { ExcelAdapter } from '../adapters/excel.adapter';

// Mock del ExcelAdapter
jest.mock('../adapters/excel.adapter');

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let mockCandidatesService: jest.Mocked<CandidatesService>;

  const mockCandidateDTO = CandidatesDTO.create('Cristian', 'Manuel', 'junior', 6, true);

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockCandidatesService = {
      createCandidate: jest.fn(),
      getAllCandidates: jest.fn(),
      getCandidateByNameAndSurname: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
        },
      ],
    }).compile();

    controller = module.get(CandidatesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCandidate', () => {
    const mockFile = Buffer.from('mock excel content');
    const validBody = { name: 'Cristian', surname: 'Manuel' };

    beforeEach(() => {
      (ExcelAdapter.getJSONDataFromExcelFile as jest.Mock).mockReturnValue([
        { name: 'Cristian', surname: 'Manuel', seniority: 'senior', experience: 6, availability: true }
      ]);
    });

    it('should create candidate successfully with valid data', async () => {
      mockCandidatesService.createCandidate.mockResolvedValue(mockCandidateDTO);

      const result = await controller.createCandidate(mockFile, validBody);

      expect(result).toEqual(mockCandidateDTO);
      expect(mockCandidatesService.createCandidate).toHaveBeenCalledWith(
        expect.any(CandidatesDTO),
        'Cristian',
        'Manuel'
      );
      expect(ExcelAdapter.getJSONDataFromExcelFile).toHaveBeenCalledWith(mockFile);
    });

    it('should throw BAD_REQUEST when no Excel file provided', async () => {
      await expect(
        controller.createCandidate(undefined as any, validBody)
      ).rejects.toThrow(
        new HttpException('El archivo Excel es requerido.', HttpStatus.BAD_REQUEST)
      );

      expect(mockCandidatesService['createCandidate']).not.toHaveBeenCalled();
    });

    it('should throw BAD_REQUEST when name is missing', async () => {
      const invalidBody = { name: '', surname: 'Manuel' };

      await expect(
        controller.createCandidate(mockFile, invalidBody)
      ).rejects.toThrow(
        new HttpException('El nombre y apellido son requeridos.', HttpStatus.BAD_REQUEST)
      );

      expect(mockCandidatesService['createCandidate']).not.toHaveBeenCalled();
    });

    it('should throw BAD_REQUEST when surname is missing', async () => {
      const invalidBody = { name: 'Cristian', surname: '' };

      await expect(
        controller.createCandidate(mockFile, invalidBody)
      ).rejects.toThrow(
        new HttpException('El nombre y apellido son requeridos.', HttpStatus.BAD_REQUEST)
      );

      expect(mockCandidatesService['createCandidate']).not.toHaveBeenCalled();
    });

    it('should throw BAD_REQUEST when both name and surname are missing', async () => {
      const invalidBody = { name: '', surname: '' };

      await expect(
        controller.createCandidate(mockFile, invalidBody)
      ).rejects.toThrow(
        new HttpException('El nombre y apellido son requeridos.', HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw BAD_REQUEST when Excel has no data', async () => {
      (ExcelAdapter.getJSONDataFromExcelFile as jest.Mock).mockReturnValue([]);

      await expect(
        controller.createCandidate(mockFile, validBody)
      ).rejects.toThrow(
        new HttpException('El archivo Excel debe tener solo una fila.', HttpStatus.BAD_REQUEST)
      );

      expect(mockCandidatesService['createCandidate']).not.toHaveBeenCalled();
    });

    it('should throw BAD_REQUEST when Excel has multiple rows', async () => {
      (ExcelAdapter.getJSONDataFromExcelFile as jest.Mock).mockReturnValue([
        { name: 'Cristian', surname: 'Manuel', seniority: 'senior', experience: 6, availability: true },
        { name: 'Pepe', surname: 'Pérez', seniority: 'junior', experience: 5, availability: false }
      ]);

      await expect(
        controller.createCandidate(mockFile, validBody)
      ).rejects.toThrow(
        new HttpException('El archivo Excel debe tener solo una fila.', HttpStatus.BAD_REQUEST)
      );

      expect(mockCandidatesService['createCandidate']).not.toHaveBeenCalled();
    });

    it('should handle service errors properly', async () => {
      const serviceError = new HttpException('Ya existe un candidato con ese nombre y apellido', HttpStatus.CONFLICT);
      mockCandidatesService.createCandidate.mockRejectedValue(serviceError);

      await expect(
        controller.createCandidate(mockFile, validBody)
      ).rejects.toThrow(serviceError);

      expect(mockCandidatesService['createCandidate']).toHaveBeenCalledWith(
        expect.any(CandidatesDTO),
        'Cristian',
        'Manuel'
      );
    });

    it('should handle ExcelAdapter errors', async () => {
      (ExcelAdapter.getJSONDataFromExcelFile as jest.Mock).mockImplementation(() => {
        throw new Error('Error processing Excel file');
      });

      await expect(
        controller.createCandidate(mockFile, validBody)
      ).rejects.toThrow('Error processing Excel file');

      expect(mockCandidatesService.createCandidate).not.toHaveBeenCalled();
    });
  });
});

import { HttpException, HttpStatus } from '@nestjs/common';
import { NameVO } from './name.vo';

describe('NameVO', () => {
  describe('constructor', () => {
    it('should create a valid NameVO with valid name', () => {
      const name = new NameVO('Cristian');
      
      expect(name.value).toBe('Cristian');
    });

    it('should create NameVO with minimum length name', () => {
      const name = new NameVO('Cr');
      
      expect(name.value).toBe('Cr');
    });

    it('should create NameVO with maximum length name', () => {
      const longName = 'a'.repeat(100);
      const name = new NameVO(longName);
      
      expect(name.value).toBe(longName);
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new NameVO('');
      }).toThrow(HttpException);
    });

    it('should throw error for name too short', () => {
      expect(() => {
        new NameVO('a');
      }).toThrow(HttpException);
    });

    it('should throw error for name too long', () => {
      const longName = 'a'.repeat(101);
      
      expect(() => {
        new NameVO(longName);
      }).toThrow(HttpException);
    });

    it('should throw error for non-string input', () => {
      expect(() => {
        new NameVO(123 as any);
      }).toThrow(HttpException);
    });

    it('should throw error for null input', () => {
      expect(() => {
        new NameVO(null as any);
      }).toThrow(HttpException);
    });

    it('should throw error for undefined input', () => {
      expect(() => {
        new NameVO(undefined as any);
      }).toThrow(HttpException);
    });

    it('should throw HttpException with UNPROCESSABLE_ENTITY status', () => {
      try {
        new NameVO('');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });

    it('should include validation error message in Spanish', () => {
      try {
        new NameVO('');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        const message = (error as HttpException).message;
        expect(message).toContain('requerido');
      }
    });
  });

  describe('value getter', () => {
    it('should return the correct value', () => {
      const testName = 'Cristian';
      const name = new NameVO(testName);
      
      expect(name.value).toBe(testName);
    });

    it('should preserve original string formatting', () => {
      const testName = 'Cristian Manuel';
      const name = new NameVO(testName);
      
      expect(name.value).toBe(testName);
    });
  });
});

import { parseApiError } from '@/shared/lib/errors/parseApiError';
import { API_ERROR_CODES } from '@/shared/constants';

describe('parseApiError', () => {
  describe('FETCH_ERROR (network failure)', () => {
    it('returns NETWORK_ERROR code when status is FETCH_ERROR', () => {
      const error = { status: 'FETCH_ERROR' };
      const result = parseApiError(error);
      expect(result.code).toBe(API_ERROR_CODES.NETWORK_ERROR);
      expect(result.status).toBe(0);
    });
  });

  describe('Server HTTP errors', () => {
    it('maps a known server error code and returns its HTTP status', () => {
      const error = {
        status: 401,
        data: { code: API_ERROR_CODES.INVALID_CREDENTIALS },
      };
      const result = parseApiError(error);
      expect(result.code).toBe(API_ERROR_CODES.INVALID_CREDENTIALS);
      expect(result.status).toBe(401);
    });

    it('falls back to data.message when code has no i18n translation', () => {
      const error = {
        status: 422,
        data: { code: 'TOTALLY_UNKNOWN_CODE', message: 'Custom server message' },
      };
      const result = parseApiError(error);
      expect(result.code).toBe('TOTALLY_UNKNOWN_CODE');
      expect(result.message).toBe('Custom server message');
    });

    it('uses UNKNOWN code when data.code is absent', () => {
      const error = { status: 500, data: {} };
      const result = parseApiError(error);
      expect(result.code).toBe(API_ERROR_CODES.UNKNOWN);
    });
  });

  describe('Field errors flattening', () => {
    it('flattens array field errors to the first message', () => {
      const error = {
        status: 400,
        data: {
          code: API_ERROR_CODES.VALIDATION_FAILED,
          errors: { email: ['Invalid email', 'Email taken'] },
        },
      };
      const result = parseApiError(error);
      expect(result.fieldErrors).toEqual({ email: 'Invalid email' });
    });

    it('handles string field errors directly', () => {
      const error = {
        status: 400,
        data: {
          code: API_ERROR_CODES.VALIDATION_FAILED,
          errors: { username: 'Username taken' },
        },
      };
      const result = parseApiError(error);
      expect(result.fieldErrors).toEqual({ username: 'Username taken' });
    });

    it('returns undefined fieldErrors when errors object is empty', () => {
      const error = { status: 400, data: { code: 'X', errors: {} } };
      const result = parseApiError(error);
      expect(result.fieldErrors).toBeUndefined();
    });
  });

  describe('Fallback for non-object errors', () => {
    it('returns UNKNOWN for string errors', () => {
      expect(parseApiError('some string')).toMatchObject({ code: API_ERROR_CODES.UNKNOWN });
    });

    it('returns UNKNOWN for null', () => {
      expect(parseApiError(null)).toMatchObject({ code: API_ERROR_CODES.UNKNOWN });
    });

    it('returns UNKNOWN for undefined', () => {
      expect(parseApiError(undefined)).toMatchObject({ code: API_ERROR_CODES.UNKNOWN });
    });
  });
});

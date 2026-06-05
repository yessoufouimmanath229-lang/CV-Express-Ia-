import AsyncStorage from '@react-native-async-storage/async-storage';
import { canGenerateMore, setPremiumStatus, saveDocumentToHistory } from '../src/services/storage.service';

// Mocking AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Storage Service - canGenerateMore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if user is premium', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('true'); // premium
    const result = await canGenerateMore();
    expect(result).toBe(true);
  });

  it('should return true if user is not premium and history is empty', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('false') // premium
      .mockResolvedValueOnce(null); // history
    const result = await canGenerateMore();
    expect(result).toBe(true);
  });

  it('should return false if user is not premium and history already contains 1 document', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('false') // premium
      .mockResolvedValueOnce(JSON.stringify([{ id: '1' }])); // history
    const result = await canGenerateMore();
    expect(result).toBe(false);
  });

  it('should allow more generations after setting premium to true', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('false') // premium check
      .mockResolvedValueOnce(JSON.stringify([{ id: '1' }])); // history check
    
    expect(await canGenerateMore()).toBe(false);

    (AsyncStorage.getItem as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce('true'); // premium check now true
    
    expect(await canGenerateMore()).toBe(true);
  });
});

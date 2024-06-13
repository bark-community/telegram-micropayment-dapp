import CryptoJS from 'crypto-js';
import { getScryptKey, encryptMnemonic, decryptMnemonic } from './store';

describe('Encryption functions', () => {
  describe('getScryptKey', () => {
    it('should return a valid key', () => {
      const password = 'yourPassword';
      const salt = CryptoJS.lib.WordArray.random(16);
      const key = getScryptKey(password, salt);
      
      expect(key).toBeDefined();
      expect(key.words.length).toBe(8);
    });

    it('should return different keys for different salts', () => {
      const password = 'password';
      const salt = CryptoJS.lib.WordArray.random(16);
      const salt2 = CryptoJS.lib.WordArray.random(16);
      const key1 = getScryptKey(password, salt);
      const key2 = getScryptKey(password, salt2);
      
      expect(key1.toString()).not.toEqual(key2.toString());
    });
  });

  describe('encryptMnemonic and decryptMnemonic', () => {
    it('should encrypt and decrypt mnemonic correctly', () => {
      const mnemonic = 'yourMnemonic';
      const password = 'yourPassword';
      const encryptedMnemonicWithSalt = encryptMnemonic(mnemonic, password);
      
      expect(encryptedMnemonicWithSalt).toBeDefined();
      
      const decryptedMnemonic = decryptMnemonic(encryptedMnemonicWithSalt, password);
      expect(decryptedMnemonic).toBe(mnemonic);
    });
  });
});

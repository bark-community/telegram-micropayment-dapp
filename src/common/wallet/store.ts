/* eslint-disable @typescript-eslint/no-var-requires */
import CryptoJS, { AES } from 'crypto-js';
import { syncScrypt } from 'scrypt-js';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import secureLocalStorage from 'react-secure-storage';

import { BACKUP_DATE, MNEMONIC_STORE, PUBLIC_KEY_STORE } from '../utils/constants';
import { HexString } from '@common/types';
import { GiftWallet, Wallet } from './types';

const keyring = new Keyring({ type: 'sr25519' });

const SALT_SIZE_BYTES = 16;

/**
 * Retrieves the store name for a given key based on the user ID.
 * @param key The key to generate the store name for.
 * @returns The generated store name.
 */
export const getStoreName = (key: string): string => {
  if (!window) return '';
  const userId = window.Telegram?.WebApp.initDataUnsafe?.user?.id;
  if (!userId) return '';

  return `${userId}_${key}`;
};

/**
 * Converts a hex string to a WordArray.
 * @param string The hex string to convert.
 * @returns The converted WordArray.
 */
function unwrapHexString(string: string): HexString {
  return CryptoJS.enc.Hex.parse(string);
}

/**
 * Generates a scrypt key using the provided password and salt.
 * @param password The password.
 * @param salt The salt.
 * @returns The generated scrypt key.
 */
export function getScryptKey(password: string, salt: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
  const passwordBytes = new TextEncoder().encode(password.normalize('NFKC'));
  const buffer = Buffer.from(salt.words);
  const key = syncScrypt(passwordBytes, buffer, 16384, 8, 1, 32);

  return CryptoJS.lib.WordArray.create(key);
}

/**
 * Encrypts the mnemonic using AES encryption with the provided password.
 * @param mnemonic The mnemonic to encrypt.
 * @param password The password for encryption.
 * @returns The encrypted mnemonic with salt.
 */
export function encryptMnemonic(mnemonic: string, password: string): string {
  const salt = CryptoJS.lib.WordArray.random(SALT_SIZE_BYTES);
  const derivedKey = getScryptKey(password, salt);

  const encryptedMnemonic = AES.encrypt(mnemonic, derivedKey, {
    mode: CryptoJS.mode.CBC,
    iv: salt,
  });

  const saltHex = CryptoJS.enc.Hex.stringify(salt);
  const mnemonicHex = encryptedMnemonic.toString(CryptoJS.format.Hex);

  return saltHex + mnemonicHex;
}

/**
 * Decrypts the encrypted mnemonic using AES decryption with the provided password.
 * @param encryptedMnemonicWithSalt The encrypted mnemonic with salt.
 * @param password The password for decryption.
 * @returns The decrypted mnemonic.
 */
export function decryptMnemonic(encryptedMnemonicWithSalt: string, password: string): string {
  const salt = CryptoJS.enc.Hex.parse(encryptedMnemonicWithSalt.slice(0, SALT_SIZE_BYTES * 2));
  const encryptedHexMnemonic = encryptedMnemonicWithSalt.slice(SALT_SIZE_BYTES * 2);
  const derivedKey = getScryptKey(password, salt);

  return AES.decrypt(encryptedHexMnemonic, derivedKey, {
    format: CryptoJS.format.Hex,
    mode: CryptoJS.mode.CBC,
    iv: salt,
  }).toString(CryptoJS.enc.Utf8);
}

/**
 * Retrieves the wallet information stored locally.
 * @returns The wallet information if available, otherwise null.
 */
export const getWallet = (): Wallet | null => {
  const publicKey = localStorage.getItem(getStoreName(PUBLIC_KEY_STORE));

  return publicKey ? { publicKey: unwrapHexString(publicKey) } : null;
};

/**
 * Generates a new mnemonic.
 * @returns The generated mnemonic.
 */
export const generateWalletMnemonic = (): string => {
  return keyring.generateMnemonic();
};

/**
 * Creates a new wallet with the provided mnemonic.
 * @param mnemonic The mnemonic.
 * @returns The created wallet or null if mnemonic is not provided.
 */
export const createWallet = (mnemonic: string | null): Wallet | null => {
  if (!mnemonic) return null;
  const seed = keyring.addFromMnemonic(mnemonic).seed;
  const publicKey: HexString = keyring.addFromSeed(seed).address;

  localStorage.setItem(getStoreName(PUBLIC_KEY_STORE), publicKey);
  secureLocalStorage.setItem(getStoreName(MNEMONIC_STORE), mnemonic);

  return { publicKey: unwrapHexString(publicKey) };
};

/**
 * Backs up the mnemonic with encryption using the provided password.
 * @param mnemonic The mnemonic to back up.
 * @param password The password for encryption.
 */
export const backupMnemonic = (mnemonic: string, password: string): void => {
  const encryptedMnemonicWithSalt = encryptMnemonic(mnemonic, password);

  window.Telegram.WebApp.CloudStorage.setItem(MNEMONIC_STORE, encryptedMnemonicWithSalt);
  window.Telegram.WebApp.CloudStorage.setItem(BACKUP_DATE, Date.now().toString());
};

/**
 * Retrieves the mnemonic stored securely.
 * @returns The mnemonic if available, otherwise null.
 */
export const getMnemonic = (): string | null => {
  return (secureLocalStorage.getItem(getStoreName(MNEMONIC_STORE)) as string) || null;
};

/**
 * Retrieves the keyring pair for the user's wallet.
 * @returns The keyring pair if available, otherwise undefined.
 */
export const getKeyringPair = (): KeyringPair | undefined => {
  try {
    const mnemonic = getMnemonic();

    if (mnemonic === null) return;

    return keyring.createFromUri(mnemonic);
  } catch (e) {
    console.warn(e);
  }
};

/**
 * Retrieves the keyring pair from the provided seed.
 * @param seed The seed.
 * @returns The keyring pair.
 */
export const getKeyringPairFromSeed = (seed: string): KeyringPair => {
  return keyring.createFromUri(seed);
};

/**
 * Resets the wallet, optionally clearing local storage.
 * @param clearLocal Whether to clear local storage.
 */
export const resetWallet = (clearLocal: boolean = false) => {
  localStorage.clear();
  secureLocalStorage.clear();
  if (!clearLocal) {
    window.Telegram.WebApp.CloudStorage.removeItems([MNEMONIC_STORE, BACKUP_DATE]);
  }
};

/**
 * Initializes the wallet from cloud storage using encryption with the provided password.
 * @param password The password for decryption.
 * @param encryptedMnemonic The encrypted mnemonic.
 * @returns The decrypted mnemonic if successful, otherwise null.
 */
export const initializeWalletFromCloud = (password: string, encryptedMnemonic?: string): string | null => {
  if (!encryptedMnemonic) return null;
  let mnemonic;
  try {
    mnemonic = decryptMnemonic(encryptedMnemonic, password);
  } catch {
    return null;
  }

  return mnemonic || null;
};

/**
 * Generates a secret for a gift wallet.
 * @returns The generated secret.
 */
const generateGiftSecret = (): string => {
  return keyring.encodeAddress(keyring.addFromSeed(randomAsHex()).publicKey);
};

/**
 * Creates a new gift wallet with the provided address prefix.
 * @param addressPrefix The address prefix.
 * @returns The created gift wallet.
 */
export const createGiftWallet = (addressPrefix: number): GiftWallet => {
  const secret = generateGiftSecret();
  const address = keyring.encodeAddress(keyring.addFromSeed(secret).publicKey, addressPrefix);

  return { address, secret };
};

import { SignerOptions } from '@polkadot/api/types';

// Constants with consistent naming convention
export const publicKeyStore = 'publicKey';
export const mnemonicStore = 'mnemonic';
export const backupDateStore = 'backupDate';
export const giftStore = 'gifts';
export const fakeAccountId = '0x' + '1'.repeat(64);
export const zeroBalance = '0';

// Asset location with clear types and comments
export const assetLocation: Record<number, SignerOptions> = {
  1984: {
    parents: 0,
    interior: {
      X2: [{ PalletInstance: 50 }, { GeneralIndex: 1984 }],
    },
  },
  0: {
    parents: 1,
    interior: {
      Here: '',
    },
  },
};

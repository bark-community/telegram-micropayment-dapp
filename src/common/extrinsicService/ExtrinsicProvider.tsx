import { createContext, PropsWithChildren, useContext } from 'react';
import { Balance, Hash } from '@polkadot/types/interfaces';

import { getKeyringPair } from '@common/wallet';
import { FAKE_ACCOUNT_ID } from '@common/utils';
import type { EstimateFee, EstimateFeeParams, SubmitExtrinsic, SubmitExtrinsicParams } from './types';
import { useExtrinsicService } from './ExtrinsicService';

type ExtrinsicProviderContextProps = {
  estimateFee: EstimateFee;
  submitExtrinsic: SubmitExtrinsic;
};

const ExtrinsicProviderContext = createContext<ExtrinsicProviderContextProps>({
  estimateFee: async () => Promise.reject(new Error('ExtrinsicProvider not initialized')),
  submitExtrinsic: async () => Promise.reject(new Error('ExtrinsicProvider not initialized')),
});

export const ExtrinsicProvider = ({ children }: PropsWithChildren<{}>) => {
  const { prepareExtrinsic } = useExtrinsicService();

  async function estimateFee({ chainId, transaction, signOptions, options }: EstimateFeeParams): Promise<Balance> {
    const extrinsic = await prepareExtrinsic<'promise'>(chainId, transaction, options);
    const paymentInfo = await extrinsic.paymentInfo(FAKE_ACCOUNT_ID, signOptions);

    return paymentInfo.partialFee;
  }

  async function submitExtrinsic({
    chainId,
    transaction,
    keyring,
    options,
    signOptions,
  }: SubmitExtrinsicParams): Promise<Hash | undefined> {
    const extrinsic = await prepareExtrinsic<'promise'>(chainId, transaction, options);

    const keyringPair = keyring || getKeyringPair();
    if (!keyringPair) return;

    await extrinsic.signAsync(keyringPair, signOptions);
    keyringPair.lock();

    return await extrinsic.send();
  }

  return (
    <ExtrinsicProviderContext.Provider value={{ estimateFee, submitExtrinsic }}>
      {children}
    </ExtrinsicProviderContext.Provider>
  );
};

export const useExtrinsicProvider = (): ExtrinsicProviderContextProps => {
  const context = useContext(ExtrinsicProviderContext);
  if (!context) {
    throw new Error('useExtrinsicProvider must be used within an ExtrinsicProvider');
  }
  return context;
};

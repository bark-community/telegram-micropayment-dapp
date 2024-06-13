import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api-base/types';
import { ApiTypes } from '@polkadot/api-base/types/base';

import { ChainId } from '@common/types';
import { useExtrinsicBuilderFactory } from './ExtrinsicBuilder';
import { ExtrinsicBuildingOptions, ExtrinsicTransaction, TransactionType } from './types';

interface ExtrinsicService {
  prepareExtrinsic<ApiType extends ApiTypes>(
    chainId: ChainId,
    transaction: ExtrinsicTransaction,
    options?: Partial<ExtrinsicBuildingOptions>,
  ): Promise<SubmittableExtrinsic<ApiType>>;
  prepareApi(chainId: ChainId): Promise<ApiPromise>;
}

export function useExtrinsicService(): ExtrinsicService {
  const extrinsicBuilderFactory = useExtrinsicBuilderFactory();

  // Map transaction types to their respective functions
  const getExtrinsic: Record<
    TransactionType,
    (args: Record<string, any>, api: ApiPromise) => SubmittableExtrinsic<'promise'>
  > = {
    [TransactionType.TRANSFER]: ({ dest, value }, api) =>
      api.tx.balances.transferKeepAlive
        ? api.tx.balances.transferKeepAlive(dest, value)
        : api.tx.balances.transfer(dest, value),
    [TransactionType.TRANSFER_ALL]: ({ dest }, api) => api.tx.balances.transferAll(dest, false),
    [TransactionType.TRANSFER_STATEMINE]: ({ dest, value, asset }, api) => api.tx.assets.transfer(asset, dest, value),
  };

  // Prepare an extrinsic for the specified chain and transaction
  const prepareExtrinsic = async (
    chainId: ChainId,
    transaction: ExtrinsicTransaction,
    options?: Partial<ExtrinsicBuildingOptions>,
  ): Promise<SubmittableExtrinsic<any>> => {
    const extrinsicBuilder = await extrinsicBuilderFactory.forChain(chainId);
    extrinsicBuilder.addCall(getExtrinsic[transaction.type](transaction.args, extrinsicBuilder.api));
    return extrinsicBuilder.build(options);
  };

  // Prepare the API instance for the specified chain
  const prepareApi = async (chainId: ChainId): Promise<ApiPromise> => {
    const extrinsicBuilder = await extrinsicBuilderFactory.forChain(chainId);
    return extrinsicBuilder.api;
  };

  return {
    prepareExtrinsic,
    prepareApi,
  };
}

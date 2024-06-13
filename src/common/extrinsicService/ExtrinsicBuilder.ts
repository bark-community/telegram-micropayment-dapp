import { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api-base/types';
import '@polkadot/api-augment';
import { ApiPromise } from '@polkadot/api';

import { useChainRegistry } from '@common/chainRegistry';
import { ChainId } from '@common/types';
import { BatchMode, ExtrinsicBuilder, ExtrinsicBuilderFactory, ExtrinsicBuildingOptions } from './types';

export function useExtrinsicBuilderFactory(): ExtrinsicBuilderFactory {
  const { getConnection } = useChainRegistry();

  async function forChain(chainId: ChainId): Promise<ExtrinsicBuilder> {
    const connection = await getConnection(chainId);
    return createExtrinsicBuilder(connection.api);
  }

  return {
    forChain,
  };
}

/**
 * Creates an ExtrinsicBuilder instance configured with the provided API.
 * @param api The API instance to use for extrinsic building.
 * @returns An ExtrinsicBuilder instance.
 */
function createExtrinsicBuilder(api: ApiPromise): ExtrinsicBuilder {
  const calls: Array<SubmittableExtrinsic<any>> = [];

  /**
   * Adds a call to the list of calls for the extrinsic.
   * @param call The call to add.
   */
  const addCall = (call: SubmittableExtrinsic<'promise'>) => {
    calls.push(call);
  };

  /**
   * Builds the final SubmittableExtrinsic based on the added calls and batch mode options.
   * @param options Options for building the extrinsic.
   * @returns The built SubmittableExtrinsic.
   * @throws Error if the extrinsic is empty or an unsupported batch mode is specified.
   */
  const build = (options?: Partial<ExtrinsicBuildingOptions>): SubmittableExtrinsic<'promise'> => {
    const optionsWithDefaults = optionsOrDefault(options);

    switch (calls.length) {
      case 0:
        throw new Error('Empty extrinsic');
      case 1:
        return calls[0];
      default: {
        const batchCall = getBatchCall(api, optionsWithDefaults.batchMode);
        return batchCall(calls);
      }
    }
  };

  return {
    api,
    addCall,
    build,
  };
}

/**
 * Returns the appropriate batch call function based on the specified batch mode.
 * @param api The API instance.
 * @param mode The batch mode.
 * @returns The batch call function.
 * @throws Error if an unsupported batch mode is specified.
 */
function getBatchCall(api: ApiPromise, mode: BatchMode): SubmittableExtrinsicFunction<'promise'> {
  switch (mode) {
    case BatchMode.BATCH:
      return api.tx.utility.batch;
    case BatchMode.BATCH_ALL:
      return api.tx.utility.batchAll;
    case BatchMode.FORCE_BATCH:
      return api.tx.utility.forceBatch;
    default:
      throw new Error(`Unsupported batch mode: ${mode}`);
  }
}

/**
 * Merges the provided options with default options for extrinsic building.
 * @param options The provided options.
 * @returns The merged options.
 */
function optionsOrDefault(options?: Partial<ExtrinsicBuildingOptions>): ExtrinsicBuildingOptions {
  return {
    batchMode: options?.batchMode ?? BatchMode.BATCH,
  };
}

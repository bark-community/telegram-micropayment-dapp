import { HexString } from '@common/types';
import { ITelegramMessageFactory } from './types';
import { WebApp } from '@twa-dev/types';

export const getMessageFactory = (webApp: WebApp): ITelegramMessageFactory => {
  function prepareWalletCreationData(publicKey: HexString): string | null {
    // Check if webApp.initData and webApp.initDataUnsafe.user.id are available
    if (webApp.initData && webApp.initDataUnsafe?.user?.id) {
      // Prepare data object with accountId, userId, and auth
      const data = {
        accountId: publicKey,
        userId: webApp.initDataUnsafe.user.id,
        auth: webApp.initData,
      };

      // Return JSON stringified data
      return JSON.stringify(data);
    } else {
      // Return null if required data is missing
      return null;
    }
  }

  return {
    prepareWalletCreationData,
  };
};

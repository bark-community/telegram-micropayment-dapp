import { WebApp } from '@twa-dev/types';
import { HexString } from '../types';
import { getMessageFactory } from './message-factory';
import { ITelegramBotApi } from './types';

const SUBMIT_WALLET_PATH = '/submit/wallet';

export const getTelegramBotApi = (webApp: WebApp): ITelegramBotApi => {
  const messageFactory = getMessageFactory(webApp);

  async function submitWallet(publicKey: HexString): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_BOT_API_URL;

    // Ensure the base URL is provided
    if (!baseUrl) {
      throw new Error('Bot API URL is missing');
    }

    // Prepare the content for submission
    const content = messageFactory.prepareWalletCreationData(publicKey);

    // Log the content being sent to the API
    console.info(`Submitting wallet: ${content}`);

    // Construct the URL for the API endpoint
    const url = new URL(SUBMIT_WALLET_PATH, baseUrl);

    try {
      // Send the POST request to the API
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: content,
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(`Error submitting wallet: ${error.message}`);
      throw error;
    }
  }

  return {
    submitWallet,
  };
};

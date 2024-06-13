import { WebApp } from '@twa-dev/types';
import { HexString } from '@common/types';
import { getTelegramBotApi } from './bot-api';
import { TgLink } from './types';

// Function to complete onboarding process
export const completeOnboarding = async (publicKey: HexString, webApp: WebApp): Promise<void> => {
  try {
    const botApi = getTelegramBotApi(webApp);
    await botApi.submitWallet(publicKey);
  } catch (error) {
    console.error('Error completing onboarding:', error);
  }
};

// Function to create a Telegram link for gifting
export const createTgLink = (secret: string, symbol: string, amount: string): TgLink => {
  const url = `https://t.me/${process.env.NEXT_PUBLIC_BOT_ADDRESS}/${process.env.NEXT_PUBLIC_WEB_APP_ADDRESS}?startapp=${secret}_${symbol}`;
  const text = `\nHey, I have sent you ${+amount} ${symbol} as a Gift in the BARK dApp, tap on the link to claim it!`;

  return { url, text };
};

// Function to navigate to a Telegram link
export const navigateTransferById = (webApp: WebApp, link: TgLink): void => {
  webApp.openTelegramLink(
    `http://t.me/share/url?url=${encodeURIComponent(link.url)}&text=${encodeURIComponent(link.text)}`,
  );
  webApp.close();
};

// Function to open a link in the web app
export const openLink = (link: string, webApp: WebApp) => {
  webApp.openLink(link);
  webApp.close();
};

// Function to check if the app is open in a web platform
export const isOpenInWeb = (platform?: string): boolean => {
  if (!platform) return true;
  const webPlatforms = ['web', 'weba', 'webk'];
  const isWebPlatform = webPlatforms.includes(platform);

  return isWebPlatform;
};

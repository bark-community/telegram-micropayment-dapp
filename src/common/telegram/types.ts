/* eslint-disable @typescript-eslint/ban-types */
import { HexString } from '@common/types';
import { Telegram } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

/**
 * Interface for interacting with the Telegram API.
 */
export interface ITelegram {
  /**
   * Completes onboarding process for the user.
   * @param publicKey The public key of the user's wallet.
   */
  completeOnboarding: (publicKey: HexString) => void;
}

/**
 * Interface for generating Telegram messages.
 */
export interface ITelegramMessageFactory {
  /**
   * Prepares data for creating a wallet.
   * @param publicKey The public key of the user's wallet.
   * @returns A JSON string representing the prepared wallet creation data, or null if data is incomplete.
   */
  prepareWalletCreationData: (publicKey: HexString) => string | null;
}

/**
 * Interface for interacting with the Telegram bot API.
 */
export interface ITelegramBotApi {
  /**
   * Submits a wallet to the Telegram bot API.
   * @param publicKey The public key of the user's wallet to be submitted.
   * @returns A promise that resolves when the wallet submission is completed.
   */
  submitWallet: (publicKey: HexString) => Promise<void>;
}

/**
 * Represents a Telegram link.
 */
export interface TgLink {
  /**
   * The URL of the Telegram link.
   */
  url: string;
  /**
   * The text accompanying the Telegram link.
   */
  text: string;
}

/**
 * Available app events.
 */
export type EventType = 'themeChanged' | 'viewportChanged' | 'mainButtonClicked';

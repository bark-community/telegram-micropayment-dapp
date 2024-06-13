import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, PlayerEvent } from '@lottiefiles/react-lottie-player';

import { useGlobalContext, useTelegram } from '@/common/providers';
import { useMainButton } from '@/common/telegram/useMainButton';
import { completeOnboarding } from '@common/telegram';
import { BodyText, HeadlineText, TitleText } from '@/components/Typography';
import { Paths } from '@/common/routing';

export default function CreateWalletPage() {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const { mainButton, addMainButton, hideMainButton } = useMainButton();
  const { publicKey } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hideMainButton();
    (async () => {
      if (!publicKey) {
        setError("Can't create wallet when public key is missing");
        return;
      }

      if (!webApp) {
        setError("Can't create wallet when web app is missing");
        return;
      }

      try {
        await completeOnboarding(publicKey, webApp);
        setIsLoading(false);
      } catch (error) {
        setError('An error occurred while creating the wallet. Please try again.');
      }
    })();

    return () => {
      hideMainButton();
    };
  }, []);

  const handleOnEvent = (event: PlayerEvent) => {
    if (event === 'complete') {
      addMainButton(() => {
        navigate(Paths.DASHBOARD);
      }, 'Get started');
      mainButton.hideProgress();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[95vh]">
      <Player
        src="/gifs/create-wallet.json"
        keepLastFrame
        autoplay
        className="player w-[256px] h-[256px] mb-4"
        onEvent={(event) => handleOnEvent(event)}
      />
      <div className="h-[150px]">
        {isLoading ? (
          <>
            <HeadlineText className="text-text-hint" align="center">Creating your wallet...</HeadlineText>
            <HeadlineText className="text-text-hint" align="center">Encrypting your wallets keys...</HeadlineText>
            <HeadlineText className="text-text-hint" align="center">Backing up keys in your Telegram cloud...</HeadlineText>
          </>
        ) : error ? (
          <HeadlineText className="text-text-danger" align="center">{error}</HeadlineText>
        ) : (
          <>
            <TitleText>Your wallet has been created!</TitleText>
            <BodyText className="text-text-hint m-3">
              Your BARK wallet is now ready to use! You can now begin exploring Polkadot ecosystem assets with ease!
            </BodyText>
          </>
        )}
      </div>
    </div>
  );
}

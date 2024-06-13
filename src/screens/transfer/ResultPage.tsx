import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTelegram, useGlobalContext } from '@common/providers';
import { useMainButton } from '@/common/telegram/useMainButton';
import { Paths } from '@/common/routing';
import { Icon, MediumTitle, TitleText, BodyText, Button } from '@/components';

export default function ResultPage() {
  const navigate = useNavigate();
  const { BackButton } = useTelegram();
  const { hideMainButton, addMainButton, mainButton } = useMainButton();

  const { selectedAsset, setSelectedAsset } = useGlobalContext();

  useEffect(() => {
    BackButton?.hide();
    mainButton.show();
    const callback = () => {
      navigate(Paths.DASHBOARD, { replace: true });
    };
    addMainButton(callback, 'Done');

    return () => {
      hideMainButton();
      setSelectedAsset(null);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[95vh] gap-6">
      <Icon name="Success" size={250} />
      <TitleText>
        {selectedAsset?.amount} {selectedAsset?.asset?.symbol} Sent
      </TitleText>
      <MediumTitle className="text-text-hint break-all" align="center">
        To: {selectedAsset?.destinationAddress}
      </MediumTitle>
      <BodyText className="text-text-hint" align="center">
        Your transaction has been successfully sent to the network and will be processed shortly.
      </BodyText>
      <Button variant="light" onClick={() => navigate(Paths.DASHBOARD)}>
        Go to Dashboard
      </Button>
    </div>
  );
}

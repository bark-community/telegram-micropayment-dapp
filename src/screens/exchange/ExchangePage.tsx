import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTelegram, useGlobalContext } from '@common/providers';
import { Paths } from '@/common/routing';
import { TitleText, LinkCard } from '@/components';

export default function ExchangePage() {
  const navigate = useNavigate();
  const { BackButton } = useTelegram();
  const { setSelectedAsset } = useGlobalContext();

  useEffect(() => {
    const handleBackButton = () => {
      navigate(Paths.DASHBOARD);
    };
    
    BackButton?.show();
    BackButton?.onClick(handleBackButton);

    return () => {
      BackButton?.hide();
      BackButton?.offClick(handleBackButton);
    };
  }, [navigate, BackButton]);

  return (
    <>
      <TitleText className="mt-6 mb-10">How to Exchange Crypto</TitleText>
      <LinkCard
        href={Paths.EXCHANGE_SELECT}
        text="Buy Crypto"
        textClassName="text-medium-title"
        iconClassName="text-bg-icon-accent-primary"
        helpText="Pay with bank card, Google Pay, SEPA, PIX"
        iconName="Buy"
        wrapperClassName="mb-2 py-1"
        showArrow
        onClick={() => setSelectedAsset({ operationType: 'buy' })}
      />
      <LinkCard
        href={Paths.EXCHANGE_SELECT}
        text="Sell Crypto"
        textClassName="text-medium-title"
        helpText="Receive payment to your bank card"
        iconName="Sell"
        wrapperClassName="py-1"
        showArrow
        onClick={() => setSelectedAsset({ operationType: 'sell' })}
      />
    </>
  );
}

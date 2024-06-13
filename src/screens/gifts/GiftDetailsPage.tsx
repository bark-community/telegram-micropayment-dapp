import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WebApp } from '@twa-dev/types';

import { useTelegram } from '@common/providers/telegramProvider';
import { useMainButton } from '@/common/telegram/useMainButton';
import { Paths } from '@/common/routing';
import { createTgLink } from '@/common/telegram';
import GiftDetails from '@/components/GiftDetails/GiftDetails';
import { TgLink } from '@/common/telegram/types';
import Icon from '@/components/Icon/Icon';

const GiftDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { BackButton, webApp } = useTelegram();
  const { mainButton } = useMainButton();

  const [link, setLink] = useState<TgLink | null>(null);

  useEffect(() => {
    const handleBackButtonClick = async () => {
      navigate(Paths.GIFTS);
    };

    BackButton?.show();
    mainButton.show();
    BackButton?.onClick(handleBackButtonClick);

    const seed = searchParams.get('seed');
    const symbol = searchParams.get('symbol');
    const balance = searchParams.get('balance');

    if (seed && symbol && balance) {
      setLink(createTgLink(seed, symbol, balance));
    }

    return () => {
      BackButton?.hide();
      BackButton?.offClick(handleBackButtonClick);
    };
  }, []);

  return (
    <div className="grid items-center justify-center h-[93vh]">
      <Icon name="Present" size={250} className="justify-self-center mt-auto" />
      <GiftDetails link={link} webApp={webApp as WebApp} />
    </div>
  );
};

export default GiftDetailsPage;

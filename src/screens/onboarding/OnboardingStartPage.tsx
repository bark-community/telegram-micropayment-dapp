import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMainButton } from '@/common/telegram/useMainButton';
import { useTelegram } from '@/common/providers/telegramProvider';
import { Paths } from '@/common/routing';
import { TitleText, BodyText, MediumTitle } from '@/components/Typography';
import Icon from '@/components/Icon/Icon';
import { IconNames } from '@/components/Icon/types';

const welcomeData = [
  {
    title: 'Send Crypto Through Telegram',
    text: 'Easily send Polkadot ecosystem assets to your Telegram contacts or to any on-chain address!',
    icon: 'UserWelcome',
  },
  {
    title: 'Discover Polkadot in Telegram',
    text: 'Explore the Polkadot ecosystem directly from Telegram. It’s the simplest way to get started!',
    icon: 'DotWelcome',
  },
  {
    title: 'Safe & Seamless Access',
    text: 'Access your self-custodial crypto securely from any device using your BARK wallet password. Your crypto is always under your control.',
    icon: 'SuccessWelcome',
  },
];

export const OnboardingStartPage = () => {
  const navigate = useNavigate();
  const { mainButton, addMainButton, reset } = useMainButton();
  const { user, startParam } = useTelegram();

  useEffect(() => {
    mainButton.enable();
    const handleNext = () => {
      navigate(Paths.ONBOARDING_PASSWORD);
      mainButton.showProgress(false);
    };
    addMainButton(handleNext);

    return () => {
      reset();
      mainButton.disable();
    };
  }, []);

  const greeting = startParam
    ? `Hello, ${user?.first_name || 'Friend'}! You've received a gift.`
    : 'Welcome to Telenova!';

  return (
    <>
      <Icon name="Welcome" size={128} className="mx-auto" />
      <TitleText className="mt-4 mb-2">{greeting}</TitleText>
      {startParam && (
        <BodyText className="text-text-hint px-4 mb-2">To claim it, let’s create a wallet. It’s quick and easy.</BodyText>
      )}
      {welcomeData.map(({ title, text, icon }) => (
        <div key={title} className="flex gap-4 px-4 mt-6">
          <span>
            <Icon name={icon as IconNames} size={48} />
          </span>
          <div>
            <MediumTitle>{title}</MediumTitle>
            <BodyText className="text-text-hint mt-1" align="left">
              {text}
            </BodyText>
          </div>
        </div>
      ))}
    </>
  );
};

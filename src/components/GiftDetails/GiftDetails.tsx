import { WebApp } from '@twa-dev/types';

import { useMainButton } from '@/common/telegram/useMainButton';
import { BodyText, TitleText } from '@/components';
import { navigateTranferById } from '@/common/telegram';
import { TgLink } from '@/common/telegram/types';

type GiftDetailsProps = {
  link: TgLink | null;
  webApp: WebApp;
};

const GiftDetails: React.FC<GiftDetailsProps> = ({ link, webApp }: GiftDetailsProps) => {
  const { addMainButton } = useMainButton();

  if (!link) {
    return (
      <>
        <TitleText className="mb-auto">No gift details available</TitleText>
        <BodyText className="text-text-hint mt-auto" align="center">
          Please check again later
        </BodyText>
      </>
    );
  }

  const handleSendGift = () => {
    navigateTranferById(webApp, link);
  };

  addMainButton(handleSendGift, 'Send to contact');

  return (
    <>
      <TitleText className="mb-auto">The gift has been prepared!</TitleText>
      <BodyText className="text-text-hint mt-auto" align="center">
        Your gifts can be managed on the Main screen
      </BodyText>
    </>
  );
};

export default GiftDetails;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTelegram, useGlobalContext } from '@common/providers';
import { Paths } from '@/common/routing';
import { handleWidget } from '@/common/utils/exchange';
import { isOpenInWeb } from '@/common/telegram';
import { useMainButton } from '@/common/telegram/useMainButton';
import { MediumTitle } from '@/components/Typography';

export default function MercuryoWidgetPage() {
  const { BackButton, webApp } = useTelegram();
  const navigate = useNavigate();
  const { selectedAsset, setSelectedAsset } = useGlobalContext();
  const [isSendBtnVisible, setIsSendBtnVisible] = useState(false);
  const { hideMainButton, addMainButton } = useMainButton();

  useEffect(() => {
    BackButton?.show();
    const handleBackButtonClick = () => navigate(Paths.EXCHANGE_SELECT);
    BackButton?.onClick(handleBackButtonClick);

    if (!selectedAsset || isOpenInWeb(webApp?.platform)) return;

    handleWidget(selectedAsset, handleWidgetStatus, handleWidgetSell);

    return () => {
      BackButton?.offClick(handleBackButtonClick);
    };
  }, [selectedAsset]);

  useEffect(() => {
    if (isSendBtnVisible) {
      addMainButton(() => {
        navigate(Paths.TRANSFER_AMOUNT);
      }, `Send ${selectedAsset?.asset?.symbol} to sell`);
    }

    return () => {
      hideMainButton();
    };
  }, [isSendBtnVisible]);

  const handleWidgetStatus = (data) => {
    if (data.status === 'paid' || data.status === 'new') {
      BackButton?.onClick(() => navigate(Paths.DASHBOARD));
    }
  };

  const handleWidgetSell = (data) => {
    setIsSendBtnVisible(true);
    setSelectedAsset((prev) => ({ ...prev, destinationAddress: data.address, amount: data.amount }));
  };

  return (
    <div className="w-full h-[95svh]" id="mercuryo-widget">
      {isOpenInWeb(webApp?.platform) && (
        <div>
          <MediumTitle align="center">
            Sorry, the widget is not supported in the web version. Proceed with the application.
          </MediumTitle>
        </div>
      )}
    </div>
  );
}

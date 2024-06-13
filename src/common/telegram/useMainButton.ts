import { useCallback, useEffect, useRef } from 'react';
import { MainButton } from '@twa-dev/types';

export const useMainButton = () => {
  const mainButtonEvent = useRef<VoidFunction | null>(null);
  const mainButtonRef = useRef<MainButton | null>(null);

  useEffect(() => {
    mainButtonRef.current = window?.Telegram?.WebApp?.MainButton;
  }, [window?.Telegram]);

  const reset = useCallback(() => {
    const mainButton = mainButtonRef.current;
    if (mainButton) {
      mainButton.setText('Continue');
      mainButton.hideProgress();

      if (mainButtonEvent.current) {
        mainButton.offClick(mainButtonEvent.current);
        mainButtonEvent.current = null;
      }
    }
  }, []);

  const addMainButton = useCallback(
    (event: VoidFunction, text: string = 'Continue') => {
      const mainButton = mainButtonRef.current;
      if (mainButton) {
        reset();
        mainButton.setText(text);
        mainButton.show();
        mainButton.onClick(event);
        mainButtonEvent.current = event;
      }
    },
    [reset],
  );

  const hideMainButton = useCallback(() => {
    const mainButton = mainButtonRef.current;
    if (mainButton) {
      mainButton.hide();
      reset();
    }
  }, [reset]);

  return { addMainButton, hideMainButton, reset, mainButton: mainButtonRef.current };
};

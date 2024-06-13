import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalContent, Button } from '@nextui-org/react';

import { resetWallet } from '@/common/wallet';
import { Paths } from '@/common/routing';
import ResetPassword from './ResetPassword';
import BackupDeleted from './BackupDeleted';
import { BodyText } from '@/components';

const enum Step {
  StepInit,
  StepBackupDeleted,
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ResetPasswordModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(Step.StepInit);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    try {
      resetWallet();
      setStep(Step.StepBackupDeleted);
    } catch (error) {
      setError("Failed to reset password. Please try again later.");
    }
  };

  const handleNavigation = () => {
    onClose();
    if (step === Step.StepBackupDeleted) {
      navigate(Paths.ONBOARDING_START);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      size="xs"
      placement="center"
      classNames={{
        closeButton: 'mt-2 text-2xl text-icon-neutral', // Customize close button appearance
      }}
      onClose={handleNavigation}
    >
      <ModalContent>
        {step === Step.StepInit && <ResetPassword onClose={onClose} onSubmit={handleSubmit} />}
        {step === Step.StepBackupDeleted && <BackupDeleted onClose={handleNavigation} />}
        {error && <BodyText className="text-text-danger">{error}</BodyText>}
      </ModalContent>
    </Modal>
  );
}

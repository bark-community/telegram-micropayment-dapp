import { ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { BigTitle, MediumTitle, Icon } from '@/components';

type Props = {
  onClose: () => void;
};

export default function BackupDeleted({ onClose }: Props) {
  return (
    <>
      <ModalHeader className="p-4">
        <BigTitle>Backup Deleted</BigTitle>
      </ModalHeader>
      <ModalBody className="gap-4 px-4 flex flex-col items-center">
        <Icon name="ResetPasswordDone" size={64} aria-label="Backup Deleted Icon" />
        <MediumTitle align="center">Your backup has been deleted</MediumTitle>
      </ModalBody>
      <ModalFooter className="flex justify-center">
        <Button color="primary" className="w-full rounded-full h-12" onPress={onClose}>
          <MediumTitle className="text-white">Close Modal</MediumTitle>
        </Button>
      </ModalFooter>
    </>
  );
}

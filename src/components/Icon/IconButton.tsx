import { Button } from '@nextui-org/react';
import { Icon, LabelText } from '@/components';
import { IconNames } from './types';

type Props = {
  iconName: IconNames;
  size?: number;
  className?: string;
  text?: string;
  onClick: () => void;
};

const IconButton: React.FC<Props> = ({ iconName, onClick, size = 24, text = '', className }: Props) => {
  return (
    <Button variant="shadow" className={`icon-button ${className}`} onClick={onClick}>
      <div className="icon-wrapper">
        <Icon name={iconName} size={size} className="icon" />
      </div>
      {text && <LabelText>{text}</LabelText>}
    </Button>
  );
};

export default IconButton;

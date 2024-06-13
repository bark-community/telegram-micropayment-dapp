import { Identicon as PolkadotIdenticon } from '@polkadot/react-identicon';
import { IconTheme } from '@polkadot/react-identicon/types';
import { cnTw } from '@/common/utils/twMerge';

type Props = {
  address?: string;
  theme?: IconTheme;
  size?: number;
  background?: boolean;
  className?: string;
};

const Identicon: React.FC<Props> = ({
  address = '',
  theme = 'polkadot',
  background = true,
  size = 32,
  className = '',
}: Props) => {
  const containerClasses = cnTw(
    'relative flex justify-center items-center',
    background && 'bg-white rounded-full',
    className
  );

  const containerStyle = { width: size, height: size };

  return (
    <div className={containerClasses} style={containerStyle} data-testid={`identicon-${address}`}>
      <PolkadotIdenticon
        theme={theme}
        value={address}
        className="pointer-events-none"
        size={background ? size * 0.65 : size}
      />
    </div>
  );
};

export default Identicon;

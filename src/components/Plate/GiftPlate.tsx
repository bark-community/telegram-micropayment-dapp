import { MediumTitle, HelpText, Icon, Plate } from '@/components';
import { Gift, GiftStatus } from '@/common/types';
import { formatDateString } from '@/common/utils';

const GiftPlate = ({ gift, isClaimed }: { gift: Gift; isClaimed: boolean }) => {
  // Format the timestamp of the gift
  const formattedDate = formatDateString(gift.timestamp);

  return (
    <Plate className="mb-2 grid grid-cols-[40px,1fr,auto] items-center gap-x-3">
      {/* Display the gift icon */}
      <Icon
        name="Gift"
        className={`w-10 h-10 ${
          isClaimed ? 'text-bg-icon-accent-primary' : 'text-text-hint'
        }`}
      />
      <div>
        {/* Display the gift balance and its symbol */}
        <MediumTitle>
          {gift.balance} {gift.chainAsset?.symbol}
        </MediumTitle>
        {/* Display the creation date of the gift */}
        <HelpText as="p" className="text-text-hint">
          Created: {formattedDate}
        </HelpText>
        {/* Display the status of the gift */}
        <HelpText
          as="p"
          className={
            gift.status === GiftStatus.UNCLAIMED ? 'text-text-hint' : 'text-text-positive'
          }
        >
          {gift.status}
        </HelpText>
      </div>
      {/* Display a forward icon if the gift is unclaimed */}
      {gift.status === GiftStatus.UNCLAIMED && (
        <Icon name="ChevronForward" className="w-4 h-4 ml-2" />
      )}
    </Plate>
  );
};

export default GiftPlate;

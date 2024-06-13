import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '@/common/routing'; // Importing routing paths
import { BodyText, Icon, Plate, BigTitle, Shimmering } from '@/components'; // Importing UI components
import { GIFT_STORE, getGifts } from '@/common/utils'; // Importing utility functions
import { getStoreName } from '@/common/wallet'; // Importing wallet utility functions
import { useGifts } from '@/common/utils/hooks'; // Custom hook for managing gifts
import { Gift } from '@/common/types'; // Importing types
import { useChainRegistry } from '@/common/chainRegistry'; // Custom hook for managing chain registry

const CreatedGiftPlate = () => {
  const { connectionStates } = useChainRegistry(); // Accessing chain registry
  const { getGiftsState } = useGifts(); // Accessing gifts state
  const [unclaimed, setUnclaimed] = useState<Gift[] | null>(null); // State for unclaimed gifts

  useEffect(() => {
    const fetchUnclaimedGifts = async () => {
      // Function to fetch unclaimed gifts
      const gifts = JSON.parse(localStorage.getItem(getStoreName(GIFT_STORE)) || '[]'); // Fetching gifts from local storage
      if (!gifts) return; // If no gifts found, return
      const mapGifts = getGifts(); // Mapping gifts
      const [unclaimed] = await getGiftsState(mapGifts); // Getting unclaimed gifts state
      setUnclaimed(unclaimed); // Setting unclaimed gifts state
    };

    fetchUnclaimedGifts(); // Calling the function to fetch unclaimed gifts
  }, [getGiftsState, connectionStates]); // Dependencies for the effect

  return (
    <Plate className="w-full h-[90px] rounded-3xl mt-4 active:bg-bg-item-pressed">
      {/* Plate component for displaying created gifts */}
      <Link to={Paths.GIFTS} className="w-full grid grid-cols-[auto,1fr,auto] items-center gap-4">
        {/* Link to navigate to the gifts page */}
        <Icon name="Present" size={60} /> {/* Icon for representing gifts */}
        <div className="grid">
          {/* Grid for aligning title and gift information */}
          <BigTitle align="left">Created Gifts</BigTitle> {/* Title for the section */}
          <BodyText align="left" className="text-text-hint">
            {/* Body text for displaying unclaimed gifts information */}
            {unclaimed ? (
              // If unclaimed gifts are available
              unclaimed.length ? `Unclaimed: ${unclaimed.length}` : 'All your gifts were claimed' // Display the count of unclaimed gifts
            ) : (
              <Shimmering width={100} height={20} /> // If loading, display shimmering effect
            )}
          </BodyText>
        </div>
        <Icon name="ArrowBold" className="w-10 h-10 self-center" /> {/* Icon for navigation */}
      </Link>
    </Plate>
  );
};

export default CreatedGiftPlate; // Exporting the CreatedGiftPlate component

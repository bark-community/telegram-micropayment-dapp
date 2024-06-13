import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import Shimmering from '@/components/Shimmering/Shimmering';
import { formatBalance } from '@/common/utils/balance';

type Props = {
  balance?: string;
  precision?: number;
  animate?: boolean;
};

const Balance = ({ balance, precision = 2, animate = true }: Props) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [balance, precision]);

  if (!balance) {
    return <Shimmering width={100} height={20} />;
  }

  const { formattedValue, suffix, decimalPlaces } = formatBalance(balance, precision);

  return (
    <>
      <CountUp
        key={key}
        start={animate ? 0 : +formattedValue}
        end={+formattedValue}
        duration={0.4}
        preserveValue
        decimals={decimalPlaces}
      />
      {suffix}
    </>
  );
};

export default Balance;

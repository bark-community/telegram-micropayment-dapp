import { useEffect, useState } from 'react';

type Props = {
  initValue: number;
  onFinish: () => void;
};

const Countdown: React.FC<Props> = ({ initValue, onFinish }: Props) => {
  const [counter, setCounter] = useState<number>(initValue);

  useEffect(() => {
    if (counter === 0) {
      onFinish();
      return;
    }
    const timer = setTimeout(() => setCounter((prevCounter) => prevCounter - 1), 1000);

    return () => clearTimeout(timer);
  }, [counter, onFinish]);

  return counter > 0 ? <span>({counter} sec)</span> : null;
};

export default Countdown;

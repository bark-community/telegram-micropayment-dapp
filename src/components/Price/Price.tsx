import { cnTw } from '@/common/utils/twMerge';
import { Shimmering } from '@/components';

type Props = {
  amount?: number;
  decimalSize?: number;
  symbol?: string;
};

const Price = ({ amount, decimalSize, symbol = '$' }: Props) => {
  if (amount === undefined) return <Shimmering width={50} height={30} />;

  const value = amount === 0 ? '0.00' : parseFloat(amount.toFixed(3));
  const [integerPart, decimalPart] = value.toString().split('.');

  const decimalStyle = decimalSize ? `text-${decimalSize}` : 'text-text-hint';

  return (
    <>
      <span className="text-text-hint inline-block">{symbol}</span>
      <span className="inline-block"> {integerPart}</span>
      {decimalPart && (
        <span className={cnTw('inline-block', decimalStyle)}>.{decimalPart}</span>
      )}
    </>
  );
};

export default Price;

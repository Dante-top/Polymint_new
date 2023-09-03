import { Default } from 'components/layouts/Default';
import NFTBalances from 'components/templates/balances/NFT/NFTBalances';

const feed = () => {
  return (
    <Default pageName="Feed">
      <NFTBalances />
    </Default>
  );
};

export default feed;

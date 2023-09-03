import { Default } from 'components/layouts/Default';
import NFTBalances from 'components/templates/balances/NFT/NFTBalances';
import { Profile } from 'components/templates/Profile';

const profile = () => {
  return (
    <Default pageName="Profile">
      <Profile />
      <NFTBalances />
    </Default>
  );
};

export default profile;

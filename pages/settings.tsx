import { Default } from 'components/layouts/Default';
import { EditProfile } from 'components/templates/EditProfile';

const profile = () => {
  return (
    <Default pageName="Profile">
      <EditProfile />
    </Default>
  );
};

export default profile;

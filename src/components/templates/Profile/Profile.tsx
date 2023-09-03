import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { defaultImgs } from '../../../../public/defaultImgs';
import { useAccount } from 'wagmi';
import axios from 'axios';
const Server_url = process.env.NEXT_PUBLIC_SERVER_URL;

const Profile = () => {
  const { address } = useAccount();
  const [userName, setUserName] = useState('');
  const [userBio, setUserBio] = useState('');
  const [banner, setBanner] = useState();
  const [pfp, setPfp] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        await axios
          .get(`${Server_url}getUserData`, {
            params: {
              address,
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => {
            if (response.data.success) {
              console.log('response: ', response);
              setUserName(response.data.userName);
              setUserBio(response.data.userBio);
              setPfp(response.data.userAvatar);
              setBanner(response.data.userBanner);
            } else {
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    if (address) {
      setWalletAddress(address);
      getUserData();
    }
  }, [address]);

  return (
    <div className="page">
      <div className="mainWindow">
        <div className="mainContent">
          <img className="profileBanner" src={banner === '' ? defaultImgs[1] : banner} />
          <div className="pfpContainer">
            <img className="profilePFP" src={pfp === '' ? defaultImgs[0] : pfp} />
            <p className="profileName">{userName}</p>
            <div className="profileWallet">
              {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
            </div>
            <Link href="/settings" className="profileEdit">
              Edit Profile
            </Link>
            <p className="profileBio">{userBio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

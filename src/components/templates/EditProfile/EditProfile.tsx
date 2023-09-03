import React, { useState, useRef, useEffect } from 'react';
import { defaultImgs } from '../../../../public/defaultImgs';
import { useAccount } from 'wagmi';
import { Input, Spinner } from '@chakra-ui/react';
import { CHAIN } from 'web3/contractInfo';
import axios from 'axios';
import { notification } from 'antd';
const Server_url = process.env.NEXT_PUBLIC_SERVER_URL;

const EditProfile = () => {
  const { address } = useAccount();
  const [selectedPFP, setSelectedPFP] = useState();
  const inputAvatarFile = useRef(null);
  const inputBannerFile = useRef(null);
  const [selectedAvatar, setSelectedAvatar] = useState(defaultImgs[1]);
  const [selectedBanner, setSelectedBanner] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState();
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  const [isSaving, setIsSaving] = useState(false);

  const onBannerClick = () => {
    inputBannerFile.current?.click();
  };

  const onAvatarClick = () => {
    inputAvatarFile.current?.click();
  };

  const changeBanner = (event: any) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedBanner(URL.createObjectURL(img));
  };

  const changeAvatar = (event: any) => {
    const img = event.target.files[0];
    setSelectedPFP(img);
    setSelectedAvatar(URL.createObjectURL(img));
  };

  const toBase64 = async (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const saveProfile = async () => {
    setIsSaving(true);
    const walletAddress = address;
    const userName = name;
    const userBio = bio;
    const uploadedAvatar = selectedPFP;
    const uploadedBanner = theFile;
    try {
      const userAvatar = await toBase64(uploadedAvatar);
      const userBanner = await toBase64(uploadedBanner);
      try {
        const userData = {
          address: walletAddress,
          userName,
          userBio,
          userAvatar,
          userBanner,
        };
        const res = await axios.post(`${Server_url}updateUserData`, userData);
        if (res.data.success) {
          notification.success({
            message: res.data.message,
          });
          setIsSaving(false);
        } else {
          setIsSaving(false);
        }
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="page">
        <div className="mainWindow">
          <div className="settingsPage">
            <Input
              placeholder="Input your name."
              size="md"
              onChange={(e: any) => setName(e.target.value)}
              errorBorderColor="red.300"
            />
            <Input
              placeholder="Input your Bio."
              size="md"
              onChange={(e: any) => setBio(e.target.value)}
              errorBorderColor="red.300"
            />
            <div className="pfp">
              Profile Image (Your NFTs, click below to select PFP)
              <div className="pfpOptions">
                <img src={selectedAvatar} onClick={onAvatarClick} className="banner"></img>
                <input
                  type="file"
                  name="file"
                  ref={inputAvatarFile}
                  onChange={changeAvatar}
                  style={{ display: 'none' }}
                />
              </div>
              &nbsp;
              <div className="pfp">
                Profile Banner (Click below to select banner photo)
                <div className="pfpOptions">
                  <img src={selectedBanner} onClick={onBannerClick} className="banner"></img>
                  <input
                    type="file"
                    name="file"
                    ref={inputBannerFile}
                    onChange={changeBanner}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              &nbsp;
              {!isSaving ? (
                <div
                  className="save"
                  onClick={() => {
                    saveProfile();
                  }}
                >
                  Save
                </div>
              ) : (
                <div className="save">
                  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;

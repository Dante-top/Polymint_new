import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Card, Input, Button, Modal, Image, Select, Typography, notification } from 'antd';
import useWindowDimensions from 'utils/useWindowDimensions';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { CHAIN, CONTRACT_ADDRESS } from 'web3/contractInfo';
import axios from 'axios';
import { StoreMetadata } from 'web3/StoreMetaData';
import { mint } from 'web3/web3';

const styles = {
  title: {
    fontSize: '20px',
    fontWeight: '700',
  },
  card: {
    boxShadow: '0 0.5rem 1.2rem rgb(189 197 209 / 20%)',
    border: '1px solid #e7eaf3',
    borderRadius: '0.5rem',
    width: '50%',
  },
  mobileCard: {
    boxShadow: '0 0.5rem 1.2rem rgb(189 197 209 / 20%)',
    border: '1px solid #e7eaf3',
    borderRadius: '0.5rem',
    width: '100%',
  },
  container: {
    padding: '0 2rem',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
  },
  button: {
    float: 'right',
    marginTop: '10px',
  },
  text: {
    fontSize: '16px',
    alignSelf: 'center',
  },
  textAuthor: {
    fontSize: '14px',
    marginLeft: '10px',
    alignSelf: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  childInputContainer: {
    padding: '10px',
  },
};

const { Option } = Select;
const { Text } = Typography;
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
});

export default function MintVideo() {
  const { address } = useAccount();
  const inputImageFile = useRef(null);
  const inputVideoFile = useRef(null);
  const [isNftMintInProcess, setIsNftMintInProcess] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(null);
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [uploadedVideoPath, setUploadedVideoPath] = useState(null);
  const [titleText, setTitleText] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tokenId, setTokenId] = useState(0);

  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  useEffect(() => {
    if (titleText.length !== 0 && uploadedImageFile && uploadedVideoFile && categoryName.length !== 0) {
      setIsInputValid(true);
    }
  }, [titleText, uploadedImageFile, uploadedVideoFile, categoryName]);

  useEffect(() => {
    const options = {
      method: 'GET',
      url: `https://deep-index.moralis.io/api/v2/nft/${CONTRACT_ADDRESS}`,
      params: { chain: CHAIN, format: 'decimal' },
      headers: {
        accept: 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setTokenId(response.data.total === null ? 0 : response.data.total + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const uploadNftToIpfsAndMintToken = async () => {
    if (!isInputValid) {
      window.alert('Not all fields filled in! Please fill in all fields and then re-submit.');
      setIsNftMintInProcess(false);
      return;
    }
    notification.info({
      message: 'Minting in progress',
      description: "Your minting is in progress. Could take up to 1-2 mins. PLEASE DON'T REFRESH PAGE!",
    });

    if (uploadedImageFile) {
      const data: any = uploadedImageFile;
      const metaData: any = await StoreMetadata(data);
      setUploadedImagePath(metaData.path);
    } else {
      notification.error({
        message: 'Invalid image!',
        description: 'You should select the correct image.',
      });
    }

    if (uploadedVideoFile) {
      const data: any = uploadedVideoFile;
      const metaData: any = await StoreMetadata(data);
      setUploadedVideoPath(metaData.path);
    } else {
      notification.error({
        message: 'Invalid image!',
        description: 'You should select the correct image.',
      });
    }

    const infraIpfsGatewayUrl = 'https://skywalker.infura-ipfs.io/ipfs/';
    const pinataGateWayUrl = 'https://sapphire-random-eagle-984.mypinata.cloud/ipfs/';

    const nftMetadataObj = {
      name: titleText,
      image: infraIpfsGatewayUrl + uploadedImagePath,
      video: infraIpfsGatewayUrl + uploadedVideoPath,
      attributes: [{ category: categoryName }],
    };

    const res = await pinata.pinJSONToIPFS(nftMetadataObj);
    const tokenUri = pinataGateWayUrl + res.IpfsHash;
    const data = await mint(address, tokenUri);
    // await refetch()
    // write?.();
    if (data?.success == false) {
      if (data.type == 'estimategas') {
        notification.error({
          message: 'Insufficient funds to mint.',
          description: 'Please consider the price 0.15 Eth, and some gas fee!',
        });
      } else if (data.type == 'mint') {
        notification.error({
          message: 'Error happened while processing',
          description: 'Please try again later',
        });
      }
      setIsNftMintInProcess(false);
    } else if (data?.success == true) {
      notification.success({
        message: 'Mint Success.',
        description: 'You can check your NFT on your profile page.',
      });
      setIsNftMintInProcess(false);
    } else {
      setIsNftMintInProcess(false);
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Block News Media - Mint</title>
        <meta name="description" content="Block News Media - Mint" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.main}>
        <Card
          style={!isMobile ? styles.card : styles.mobileCard}
          title={'Mint your Music as NFM'}
          loading={isNftMintInProcess}
        >
          <Text style={styles.text}>
            Upload the Image that will represent your NFV <b>(JPEG and PNG Files ONLY, max file size: 1Gb)</b>
          </Text>
          <br />
          <br />
          <div>
            <input
              type="file"
              name="file"
              multiple={false}
              accept="image/jpeg, image/png"
              ref={inputImageFile}
              onChange={(e: any) => setUploadedImageFile(e.target.files[0])}
            />
          </div>
          <br />
          <Text style={styles.text}>
            Upload the Video that will represent your NFV <b>(MP4 Files ONLY, max file size: 1Gb)</b>
          </Text>
          <br />
          <br />
          <div>
            <input
              type="file"
              name="file"
              multiple={false}
              accept="video/mp4, video/avi"
              ref={inputVideoFile}
              onChange={(e: any) => {
                setUploadedVideoFile(e.target.files[0]);
              }}
            />
          </div>
          <br />
          <Text style={styles.text}>Video Headline (NFV Title)</Text>
          <Input placeholder="Video Headline" onChange={(e) => setTitleText(e.target.value)} value={titleText} />
          <br />
          <br />
          <div style={styles.inputContainer}>
            <div style={styles.childInputContainer}>
              <Text style={styles.text}>Category</Text>
              <Select
                style={{ width: 155, marginLeft: '10px' }}
                onChange={(e: any) => {
                  setCategoryName(e);
                }}
              >
                <Option value="Business">Business</Option>
                <Option value="Technology">Technology</Option>
                <Option value="Science">Science</Option>
                <Option value="Politics">Politics</Option>
                <Option value="Local Community">Local Community</Option>
                <Option value="Weather">Weather</Option>
                <Option value="Sports">Sports</Option>
                <Option value="Opinion">Opinion</Option>
              </Select>
            </div>
          </div>
          <Button
            style={styles.button}
            type="primary"
            loading={isNftMintInProcess}
            onClick={async () => {
              setIsNftMintInProcess(true);
              await uploadNftToIpfsAndMintToken();
            }}
          >
            Create NFT
          </Button>
        </Card>
      </main>
    </div>
  );
}

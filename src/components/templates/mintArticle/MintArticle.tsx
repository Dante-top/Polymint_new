import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Card, Input, Button, Modal, Image, Select, Typography, notification } from 'antd';

import { CHAIN, CONTRACT_ADDRESS } from '../../../web3/contractInfo';
import useWindowDimensions from '../../../utils/useWindowDimensions';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import axios from 'axios';
import { StoreMetadata } from 'web3/StoreMetaData';
import { parseEther } from 'viem';
import { mint } from 'web3/web3';
import { useColorModeValue } from '@chakra-ui/react';

const styles: any = {
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100vw',
  },
  button: {
    float: 'right',
    marginTop: '10px',
  },
  text: {
    fontSize: '14px',
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

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
});

export default function MintArticle() {
  const { address } = useAccount();
  const inputImageFile = useRef(null);
  const [isNftMintInProcess, setIsNftMintInProcess] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tokenId, setTokenId] = useState(0);

  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  // const { config, error, refetch } = usePrepareContractWrite({
  //   address: CONTRACT_ADDRESS,
  //   abi: [
  //     {
  //       inputs: [
  //         {
  //           internalType: 'string',
  //           name: 'uriOfToken',
  //           type: 'string',
  //         },
  //       ],
  //       name: 'createItem',
  //       outputs: [
  //         {
  //           internalType: 'uint256',
  //           name: '',
  //           type: 'uint256',
  //         },
  //       ],
  //       stateMutability: 'payable',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'createItem',
  //   args: [tokenUri],
  //   account: address,
  //   value: parseEther('0.01'), //the integer value should match your nft minting requirements
  //   enabled: false,
  // });

  // const { data, isLoading, isSuccess, write } = useContractWrite(config);

  useEffect(() => {
    if (descriptionText.length !== 0 && titleText.length !== 0 && uploadedImageFile && categoryName.length !== 0) {
      setIsInputValid(true);
    }
  }, [descriptionText, titleText, uploadedImageFile, categoryName]);

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
      const metaData: any = await StoreMetadata(uploadedImageFile);
      setUploadedImages(metaData.path);
    } else {
      notification.error({
        message: 'Invalid image!',
        description: 'You should select the correct image.',
      });
    }

    const infraIpfsGatewayUrl = 'https://skywalker.infura-ipfs.io/ipfs/';
    const pinataGateWayUrl = 'https://sapphire-random-eagle-984.mypinata.cloud/ipfs/';

    const nftMetadataObj = {
      description: descriptionText,
      name: titleText,
      image: infraIpfsGatewayUrl + uploadedImages,
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

    // async function saveArticle(): Promise<void> {
    //   if (!descriptionText) {
    //     return;
    //   }

    //   const Posts = Moralis.Object.extend('Posts');
    //   const newPost = new Posts();

    //   newPost.set('postDescriptionText', descriptionText);
    //   newPost.set('postImg', img);
    //   newPost.set('postTitle', titleText);
    //   newPost.set('postCategory', categoryName);
    //   newPost.set('tokenId', tokenId);
    //   newPost.set('postPfp', user?.attributes.pfp);
    //   newPost.set('postAcc', user?.attributes.ethAddress);
    //   newPost.set('postUsername', user?.attributes.username);

    //   await newPost.save();
    // }
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
          title={'Mint your Article as NFA'}
          loading={isNftMintInProcess}
        >
          <Text style={styles.text}>
            Upload the Image that will represent your NFA <b>(JPEG and PNG Files ONLY, max file size: 1Gb)</b>
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
          <Text style={styles.text}>Article Headline (NFA Title)</Text>
          <Input placeholder="Article Headline" onChange={(e) => setTitleText(e.target.value)} value={titleText} />
          <br />
          <br />
          <Text style={styles.text}>Article Text</Text>
          <TextArea
            placeholder="Describe your article with up to 512 characters!"
            showCount
            maxLength={512}
            style={{ height: 145 }}
            onChange={(e) => setDescriptionText(e.target.value)}
            value={descriptionText}
            autoSize={{ minRows: 6, maxRows: 6 }}
          />
          <br />
          <div style={styles.inputContainer}>
            <div style={styles.childInputContainer}>
              <Text style={styles.text}>Category</Text>
              <Select
                style={{ width: 155, marginLeft: '10px' }}
                onChange={(e) => {
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

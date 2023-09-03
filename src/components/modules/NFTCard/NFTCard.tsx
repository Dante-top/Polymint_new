import { Box, HStack, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { EvmNft } from '@moralisweb3/common-evm-utils';
import { Matic } from '@web3uikit/icons';
import { FC, useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';

export interface NFTCardParams {
  key: number;
  nft: EvmNft;
}

const NFTCard: FC<NFTCardParams> = ({ nft: { contractType, metadata, tokenUri } }: any) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const [tokenName, setTokenName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState();
  const [nftType, setNftType] = useState('');

  useEffect(() => {
    const getData = async () => {
      const data = await getMetaData();
    };
    getData();
  }, [tokenUri]);

  const getMetaData = async () => {
    if (tokenUri != 'null') {
      await axios.get(tokenUri).then(async (response) => {
        const jsonResponse = response.data;
        if (jsonResponse.name) {
          setTokenName(jsonResponse.name);
        }
        if (jsonResponse.image) {
          setImage(jsonResponse.image);
        }
        if (jsonResponse.attributes[0].category) {
          setCategory(jsonResponse.attributes[0].category);
        }
        if (jsonResponse.description) {
          setDescription(jsonResponse.description);
          setNftType('article');
        }
        if (jsonResponse.audio) {
          setAudio(jsonResponse.audio);
          setNftType('audio');
        }
        if (jsonResponse.video) {
          setVideo(jsonResponse.video);
          setNftType('video');
        }
      });
    }
  };

  return (
    <>
      {tokenUri == 'null' ? (
        <></>
      ) : (
        <Box
          maxWidth="315px"
          bgColor={bgColor}
          padding={3}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
            {nftType === 'video' ? (
              <video autoPlay style={{ minWidth: '260px', minHeight: '260px', objectFit: 'fill' }} controls>
                <source src={video} />
              </video>
            ) : (
              <Image src={image} alt={'nft'} minH="260px" minW="260px" boxSize="100%" objectFit="fill" />
            )}
          </Box>
          <Box mt="1" fontWeight="semibold" as="h2" noOfLines={1} marginTop={2} fontSize={'2xl'}>
            {tokenName}
          </Box>
          <HStack alignItems={'center'}>
            <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="medium">
              Category: {category}
            </Box>
            <Matic fontSize="20px" />
          </HStack>
          {nftType === 'video' ? (
            <></>
          ) : (
            <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="xl" marginTop={2}>
              {nftType === 'article' && (
                <>
                  <Box>
                    <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm">
                      Description
                    </Box>
                    <Box as="h4" noOfLines={1} fontSize="sm">
                      {description}
                    </Box>
                  </Box>
                </>
              )}
              {nftType === 'audio' && <ReactAudioPlayer src={audio} controls />}
            </SimpleGrid>
          )}
        </Box>
      )}
    </>
  );
};

export default NFTCard;

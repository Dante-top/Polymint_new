import { create as ipfsHttpClient } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecretKey = process.env.NEXT_PUBLIC_IPFS_INFRA_API_KEY;
const authorization = `Basic ${btoa(`${projectId}:${projectSecretKey}`)}`;

/// used NFT.storage to prepare the metadata for the NFT
export const StoreMetadata = async (file: any) => {
  const ipfs = ipfsHttpClient({
    url: 'https://ipfs.infura.io:5001/api/v0',
    headers: {
      authorization,
    },
  });

  if (!file || file.length === 0) {
    return alert('No files selected');
  }

  // upload files
  const result = await ipfs.add(file);

  return { cid: result.cid, path: result.path };
};

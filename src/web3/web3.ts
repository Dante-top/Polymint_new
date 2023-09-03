'use client';

import { configureChains } from 'wagmi';
// import { w3mProvider } from "@web3modal/ethereum";
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { createConfig } from 'wagmi';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { CONTRACT_ADDRESS } from './contractInfo';
import { ethers } from 'ethers';

const chains = [polygon, polygonMumbai];

export { Web3Modal } from '@web3modal/react';
export { WagmiConfig } from 'wagmi';

if (!process.env.NEXT_PUBLIC_WALLET_PROJECT_ID) {
  throw new Error('You need to provide NEXT_PUBLIC_WALLET_PROJECT_ID env variable');
}
export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID as string;

export const { publicClient } = configureChains(chains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `https://polygon-mumbai-bor.publicnode.com`,
    }),
  }),
]);

export const wagmiClient = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 2, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);

export const mint = async (address: any, tokenUri: any) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const BlockNewsMediaToken = require('./contracts/abi/BlockNewsMediaTokenV2.json');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BlockNewsMediaToken.abi, signer);
      const mintPrice = ethers.utils.parseEther('0.01');
      let e: any;
      try {
        e = await contract.estimateGas.createItem(tokenUri, {
          value: mintPrice,
          from: address,
        });
      } catch (err) {
        let error = JSON.parse(JSON.stringify(err));
        const errorMessage = error.error.message;
        if (errorMessage.includes('Exceeded sale allowed buy limit')) {
          return { success: false, type: 'SaleLimit' };
        } else {
          return { success: false, type: 'estimategas' };
        }
      }
      let d: any = await provider.getGasPrice();
      let nftTx;
      let tx;

      try {
        nftTx = await contract.createItem(tokenUri, {
          from: address,
          gasLimit: parseInt(e),
          gasPrice: parseInt((1.2 * d).toString()),
          value: mintPrice,
          maxFeePerGas: null,
        });
        tx = await nftTx.wait();
      } catch (u) {
        return { success: false, type: 'mint' };
      }

      if (tx.status == 1) {
        return { success: true, type: 'mint' };
      } else {
        return { success: false, type: 'mint' };
      }
    }
  } catch (e) {
    console.log(e);
  }
};

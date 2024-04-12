import { ethers } from 'ethers';

export const sendBNB = async ({ provider, sender, recipient, amount }) => {
  // Amount in BNB to transfer
  const parsedAmount = ethers.utils.parseUnits(amount.toString(), 'ether');

  const params = [
    {
      from: sender,
      to: recipient,
      value: parsedAmount.toHexString(), // Use the parsed amount
    },
  ];

  //   // const hash = await provider.request({ method: 'eth_sendTransaction', params });
  const transactionHash = await provider.send('eth_sendTransaction', params);
  console.log('Transaction hash: ', transactionHash);
};

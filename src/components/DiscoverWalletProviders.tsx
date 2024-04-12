import { useProvider } from '~/hooks/useProvider';
import { sendBNB } from '~/utils/transaction';
import styles from './DiscoverWalletProviders.module.css';
import { ProviderType } from '~/types';
import { useEffect, useState } from 'react';

const SEND = {
  from: '0xb68bbb37b1506db52309c0e8ca95c6c26da49f53',
  to: '0xf2cf5c431a3fe6372cbc69644e928377d003686a',
  amount: 0.0001,
};

export const DiscoverWalletProviders = (props: { type: ProviderType }) => {
  const { wallets, selectedWallet, selectedAccount, connectWallet, disConnectWallet } = useProvider(props.type);
  const [from, setFrom] = useState<string>(SEND.from);
  const [to, setTo] = useState<string>(SEND.to);
  const [amount, setAmount] = useState<string>(SEND.amount.toString());

  const handleClickSendTransaction = async () => {
    if (!selectedWallet) return;

    try {
      console.log({ provider: selectedWallet.provider });
      console.log('[FROM current]: ', selectedWallet.provider.getSigner());
    } catch (error) {}

    try {
      await sendBNB({
        provider: selectedWallet.provider,
        sender: from,
        recipient: to,
        amount: amount,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    selectedAccount && setFrom(selectedAccount);
  }, [selectedAccount]);

  return (
    <>
      <h2>Wallets Detected:</h2>
      <div className={styles.display}>
        {Object.keys(wallets).length > 0 ? (
          Object.values(wallets).map((provider: ProviderDetail) => (
            <button
              key={provider.info.uuid}
              onClick={() =>
                selectedWallet ? disConnectWallet(selectedWallet.info.uuid) : connectWallet(provider.info.uuid)
              }
            >
              <img src={provider.info.icon} alt={provider.info.name} />
              <div>{provider.info.name}</div>
              {selectedWallet ? <div> [DISCONNECT]</div> : <div> [CONNECT]</div>}
            </button>
          ))
        ) : (
          <div>there are no Announced Providers</div>
        )}
      </div>
      <hr />
      <h2 className={styles.userAccount}>{selectedAccount ? '' : 'No '}Wallet Selected</h2>
      {selectedAccount && (
        <div className={styles.walletDetails}>
          <div className={styles.logo}>
            <img src={selectedWallet.info.icon} alt={selectedWallet.info.name} />
            <div>{selectedWallet.info.name}</div>
          </div>
          <div className={styles.providers}>
            <span>
              <strong>address:</strong> {selectedAccount}
            </span>
            <span>
              <strong>uuid:</strong> {selectedWallet.info.uuid}
            </span>
            <span>
              <strong>rdns:</strong> {selectedWallet.info.rdns}
            </span>
          </div>
          <hr />
          <div className={styles.transaction}>
            <h3 className={styles.userAccount}>TRANSACTION</h3>
            <div className={styles.input}>
              <label htmlFor="transaction-from">From:</label>
              <input id="transaction-from" type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className={styles.input}>
              <label htmlFor="transaction-to">To:</label>
              <input id="transaction-to" type="text" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className={styles.input}>
              <label htmlFor="transaction-amount">Amount:</label>
              <input id="transaction-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <button onClick={handleClickSendTransaction}>sendTransaction</button>
          </div>
        </div>
      )}
    </>
  );
};

const chainChangedHandler = (type, callback) => (data) => {
  console.log(`[${type}]chainChanged:`, data);
  callback && callback(data);
};

const accountsChangedHandler = (type, wallet, callback) => (data) => {
  console.log(`[${type}]accountsChanged:`, data);
  callback && callback(wallet, data);
};

export const addProviderEventListener = ({ wallet, type, callback }) => {
  console.log('[addProviderEventListener]');

  let provider;
  if (type === 'window') provider = wallet.provider.provider;
  if (type === 'eip6963') provider = wallet.provider;
  if (provider) {
    provider.on('chainChanged', chainChangedHandler(type, callback.chainChanged));
    provider.on('accountsChanged', accountsChangedHandler(type, wallet, callback.accountsChanged));
  }
};

export const removeProviderEventListener = ({ wallet, type, callback }) => {
  console.log('[removeProviderEventListener]');

  let provider;
  if (type === 'window') provider = wallet.provider.provider;
  if (type === 'eip6963') provider = wallet.provider;
  if (provider) {
    provider.removeListener('chainChanged', chainChangedHandler(type, callback.chainChanged));
    provider.removeListener('accountsChanged', accountsChangedHandler(type, wallet, callback.accountsChanged));
  }
};

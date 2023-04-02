import { useQuery, useQueryClient } from 'react-query';
import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, getDefaultProvider } from 'ethers';

export const useProvider = () => {
  const queryClient = useQueryClient();

  const query = useQuery('provider', async () => {
    const provider = (await detectEthereumProvider())
      ? new BrowserProvider(window['ethereum'])
      : getDefaultProvider(process.env.PUBLIC_NEXT_GANACHE_URL);

    void (await provider.on('network', (_, oldNetwork) => {
      if (oldNetwork) {
        void queryClient.invalidateQueries('provider');
      }
    }));

    return provider;
  });

  return query.data;
};

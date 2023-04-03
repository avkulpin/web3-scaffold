import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserProvider, getDefaultProvider } from 'ethers';

let providerId = 0;

export const useProvider = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery('provider', async () => {
    const provider = (await detectEthereumProvider()) ? new BrowserProvider(window['ethereum']) : getDefaultProvider(process.env.PUBLIC_NEXT_GANACHE_URL)
    provider.id = providerId++;

    return provider;
  });

  useEffect(() => {
    if (window['ethereum'] && window['ethereum']?._eventsCount !== 2) {
      const handleProviderChange = () =>
        queryClient.invalidateQueries('provider');
      window['ethereum'].on('chainChanged', handleProviderChange);
      window['ethereum'].on('accountsChanged', handleProviderChange);
    }
  }, [data]);

  return data;
};

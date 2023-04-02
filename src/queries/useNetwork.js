import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useProvider } from './useProvider';

export const useNetwork = () => {
  const provider = useProvider();

  const { data } = useQuery(['network', provider], async () => provider.getNetwork(), {
    enabled: Boolean(provider),
  });

  return useMemo(() => ({
    name: data.name,
    chainId: Number(data.chainId),
  }), [data])
};

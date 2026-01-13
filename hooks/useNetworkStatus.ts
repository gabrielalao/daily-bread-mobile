import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export type NetworkStatus = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
};

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(state => {
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...networkStatus,
    isOffline: networkStatus.isConnected === false || networkStatus.isInternetReachable === false,
    isOnline: networkStatus.isConnected === true && networkStatus.isInternetReachable === true,
  };
}

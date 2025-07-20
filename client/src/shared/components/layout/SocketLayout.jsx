import { Outlet } from 'react-router';
import SocketStatus from '../SocketStatus';
// import { useEffect } from 'react';
// import { useSocketStore } from '@/shared/stores/socketStore';

export default function SocketLayout() {
  // const { isConnected, connect, disconnect, isCallingToConnect } =
  //   useSocketStore();

  // useEffect(() => {
  //   if (!isConnected && !isCallingToConnect) {
  //     connect();
  //   }
  //   return () => {
  //     if (isConnected && !isCallingToConnect) {
  //       disconnect();
  //     }
  //   };
  // }, [isConnected, connect, disconnect, isCallingToConnect]);

  // if (!isConnected) {
  //   return null;
  // }

  return (
    <div>
      <SocketStatus />
      <Outlet />
    </div>
  );
}

import { useCallback } from 'react';
import { connect, Socket } from 'socket.io-client';

const sockets: { [key: string]: typeof Socket } = {};
const useSocket = (workspace?: string): [typeof Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, []);
  if (!workspace) return [undefined, disconnect];
  if (!sockets[workspace]) {
    sockets[workspace] = connect(`http://localhost:3095/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};
export default useSocket;
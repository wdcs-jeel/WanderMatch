import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.109.128:3000'; // fixed typo from "loacalhost"

class WSService {
  private socket: Socket | null = null;

  public initializeSocket = async (): Promise<void> => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      console.log('initializing socket', this.socket);

      this.socket.on('connect', () => {
        console.log('--Connected to server--');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('error', (error: any) => {
        console.log('error from server', error);
      });
    } catch (error) {
      console.log('Socket is not initialized', error);
    }
  };

  public emit(event: string, data: any = {}): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not initialized. Cannot emit event.');
    }
  }

  public on(event: string, cb: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, cb);
    } else {
      console.warn('Socket not initialized. Cannot register event listener.');
    }
  }

  public removeListener(listenerName: string): void {
    if (this.socket) {
      this.socket.removeListener(listenerName);
    } else {
      console.warn('Socket not initialized. Cannot remove listener.');
    }
  }
}
const SocketService = new WSService();
export default SocketService;

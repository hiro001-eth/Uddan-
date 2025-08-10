import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env';

let io: SocketIOServer | null = null;

export function initRealtime(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: { origin: env.CORS_ORIGIN, credentials: true },
  });
  return io;
}

export function getIo(): SocketIOServer | null {
  return io;
}

export function emitEvent(eventName: string, payload: unknown) {
  io?.emit(eventName, payload as any);
}

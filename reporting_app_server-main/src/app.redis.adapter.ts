import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { ServerOptions } from 'socket.io';
const pubClient = createClient({url:"redis://localhost:6379"});
const subClient = pubClient.duplicate();

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.adapter(createAdapter(pubClient,subClient))
    return server;
  }
}
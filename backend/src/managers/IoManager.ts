
import http from "http";
import { Server } from "socket.io";

const server = http.createServer();

export class IoManager {
    private static io: Server;

    public static getIo() {
        if (!this.io) {
            const allowedOrigins = [
                "http://localhost:5173",
                process.env.FRONTEND_URL
            ].filter((origin): origin is string => Boolean(origin));

            const io = new Server(server, {
                cors: {
                    origin: allowedOrigins,
                    methods: ["GET", "POST"],
                    credentials: true
                }
            });

            this.io = io;
        }

        return this.io;
    }
}

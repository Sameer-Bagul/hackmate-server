import 'socket.io';

declare module 'socket.io' {
    interface Socket {
        decoded?: {
            id: string;
            username: string;
            email: string;
            role: 'admin' | 'user';
        };
        data: {
            user?: {
                id: string;
                username: string;
                email: string;
                role: 'admin' | 'user';
            };
        };
    }
}

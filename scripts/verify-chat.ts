import { io } from 'socket.io-client';
import jwt from 'jsonwebtoken';

const API_URL = 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Mock user tokens
const userA = { _id: '507f1f77bcf86cd799439011', username: 'alice' };
const userB = { _id: '507f1f77bcf86cd799439012', username: 'bob' };

const tokenA = jwt.sign(userA, JWT_SECRET);
const tokenB = jwt.sign(userB, JWT_SECRET);

const socketA = io(API_URL, { auth: { token: `Bearer ${tokenA}` } });
const socketB = io(API_URL, { auth: { token: `Bearer ${tokenB}` } });

console.log('🔌 Connecting sockets...');

const timeout = setTimeout(() => {
    console.error('❌ Timeout: Message not received');
    process.exit(1);
}, 5000);

socketA.on('connect', () => {
    console.log('✅ User A connected');
    // User A sends message to User B
    setTimeout(() => {
        console.log('📤 User A sending message...');
        socketA.emit('dm:send', { to: userB._id, content: 'Hello Bob!' });
    }, 500);
});

socketB.on('connect', () => {
    console.log('✅ User B connected');
});

socketB.on('dm:receive', (msg: any) => {
    console.log('📩 User B received:', msg);
    if (msg.content === 'Hello Bob!' && msg.senderId === userA._id) {
        console.log('✅ Verification SUCCEEDED');
        clearTimeout(timeout);
        socketA.disconnect();
        socketB.disconnect();
        process.exit(0);
    } else {
        console.error('❌ Content mismatch');
        process.exit(1);
    }
});

socketA.on('connect_error', (err: Error) => console.error('A Error:', err.message));
socketB.on('connect_error', (err: Error) => console.error('B Error:', err.message));

import { io } from "socket.io-client";

// const URL = 'https://imagem-acao-v2.onrender.com';
const URL = 'http://localhost:3000';

export const socket = io(URL);
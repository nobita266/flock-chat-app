import { io } from 'socket.io-client';
import { ENDPOINT } from './constants';

const URL = ENDPOINT;

export const socket = io(URL)
import axios from 'axios';
import { QuoteLengthType } from './types';
import { Namespace } from 'socket.io';

export function generateCode(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let output = '';
  for (let i = 0; i < length; i++) {
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    output += randomChar;
  }
  return output;
}

// export async function fetchQuote(length: QuoteLengthType) {
//   const data = await axios
//     .get(
//       `https://random-word-api.vercel.app/api?${
//         length === 'short'
//           ? '?words=20'
//           : length === 'medium'
//           ? '?words=30'
//           : length === 'long'
//           ? '?words=40'
//           : ''
//       }`
//     )
//     .then((res: any) => {
//       res = Array.isArray(data) ? data.join(' ') : String(data);
//       return res.replace(/—/g, '-').replace(/…/g, '...');
//     });

//   return data;
// }

export async function fetchQuote(length: QuoteLengthType) {
  const wordCount =
    length === 'short' ? 20 : length === 'medium' ? 30 : length === 'long' ? 40 : 0;

  try {
    const { data } = await axios.get(
      `https://random-word-api.vercel.app/api?words=${wordCount}`
    );


    const res = Array.isArray(data) ? data.join(' ') : String(data);


    return res.replace(/—/g, '-').replace(/…/g, '...');
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
}

export function startCountdown(roomCode: string, io1v1: Namespace) {
  const startsIn = 5000;

  const startsAt = new Date().getTime() + startsIn;

  io1v1.to(roomCode).emit('typing-starts-in', startsIn);
  const interval = setInterval(() => {
    const remaining = startsAt - new Date().getTime();

    if (remaining > 0) {
      io1v1.to(roomCode).emit('typing-starts-in', remaining);
    } else {
      io1v1.to(roomCode).emit('typing-started');
      clearInterval(interval);
    }
  }, 1000);
}
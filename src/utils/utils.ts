import { TCommand } from '../types/types';

export const respToString = (responseData: TCommand) => {
  const data = {
    ...responseData,
    data: JSON.stringify(responseData.data),
  };
  return JSON.stringify(data);
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const reset = '\x1b[0m';
export const log = {
  error: (text: string) => console.log('\x1b[31m' + text + reset),
  info: (text: string) => console.log('\x1b[32m' + text + reset),
  warn: (text: string) => console.log('\x1b[33m' + text + reset),
  message: (text: string) => console.log('\x1b[47m' + text + reset),
};

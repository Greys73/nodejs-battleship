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

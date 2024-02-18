import { TCommand } from '../types/types';

export const respToString = (responseData: TCommand) => {
  const data = {
    ...responseData,
    data: JSON.stringify(responseData.data),
  };
  return JSON.stringify(data);
};

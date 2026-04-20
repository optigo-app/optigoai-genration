import { masterApi } from './masterApi';

export const getHistoryApi = async () => {
  return masterApi('GetAiGenerateHistory', {
    p: "{}",
    f: 'Optigo Ai Image Generation (Optigo Ai Image Generation)',
  });
};

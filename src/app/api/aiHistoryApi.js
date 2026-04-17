import { masterApi } from './masterApi';

export const saveAiGenerateHistoryApi = async ({
  EventName = 'SaveAiGenerateHistory',
  PromptJson = [],
}) => {
  return masterApi('SaveAiGenerateHistory', {
    p: JSON.stringify([
      {
        EventName,
        PromptJson,
      },
    ]),
    f: 'Task Management (taskmaster)',
  });
};

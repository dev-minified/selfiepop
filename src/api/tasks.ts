import request from '../util/request';

export const getSubscriptionTasks = async (
  subscriptionId: string,
  sellerId: string = '',
) => {
  return request(
    `/subscription/tasks/${subscriptionId}?sellerId=${sellerId}`,
  ).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

export const markTaskAsComplete = async (
  data: {
    subscriptionId: string;
    taskSlug: string;
    subTaskIndex?: number;
  },
  sellerId: string = '',
) => {
  return request(`/subscription/task/mark-as-complete?sellerId=${sellerId}`, {
    method: 'POST',
    data: {
      subscriptionId: data.subscriptionId,
      taskId: data.taskSlug,
      taskIndex: data.subTaskIndex,
    },
  }).then((res) => {
    if (!res || !res.success) {
      throw new Error(res?.data?.message || '');
    }
    return res;
  });
};

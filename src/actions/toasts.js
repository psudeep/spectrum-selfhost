// @flow
import type { Dispatch } from 'redux';
type Toasts = 'success' | 'error' | 'neutral';

const addToast = (
  id: number,
  kind: Toasts,
  message: string,
  timeout?: number
) => {
  return {
    type: 'ADD_TOAST',
    payload: {
      id,
      kind,
      message,
      timeout,
    },
  };
};

const removeToast = (id: number) => {
  return { type: 'REMOVE_TOAST', id };
};

let nextToastId = 0;
export const addToastWithTimeout = (kind: Toasts, message: string) => (
  dispatch: Dispatch<Object>
) => {
  const timeout = kind === 'success' ? 3000 : 6000;
  let id = nextToastId++;
  dispatch(addToast(id, kind, message, timeout));

  setTimeout(() => {
    dispatch(removeToast(id));
    id = nextToastId--;
  }, timeout);
};

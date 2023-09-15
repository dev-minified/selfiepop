import { useLayoutEffect } from 'react';
import { setLoading as setGlobalLoading } from 'store/reducer/global';
import { useAppDispatch } from './useAppDispatch';

const useRequestLoader = (isLoading: boolean = false) => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(setGlobalLoading(isLoading));
  }, [dispatch, isLoading]);

  const startLoading = () => {
    dispatch(setGlobalLoading(true));
  };

  const stopLoading = (isLoading = false) => {
    dispatch(setGlobalLoading(isLoading));
  };
  const setLoading = (isLoading = false) => {
    dispatch(setGlobalLoading(isLoading));
  };

  const withLoader = async <T>(promise: Promise<T>): Promise<T> => {
    startLoading();
    return await promise
      .then((res) => {
        stopLoading();
        return res;
      })
      .catch((e) => {
        stopLoading();
        throw e;
      });
  };

  return { withLoader, setLoading };
};

export default useRequestLoader;

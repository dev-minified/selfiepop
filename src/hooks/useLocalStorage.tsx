import { useState } from 'react';
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from 'util/index';

function useLocalStorage(key: string) {
  const [state, setState] = useState<any>(getLocalStorage(key));

  const setStoredValue = (value: any) => {
    setLocalStorage(key, value);
    setState(value);
  };

  const removeStoreValue = () => {
    removeLocalStorage(key);
    setState(undefined);
  };
  return [state, setStoredValue, removeStoreValue];
}

export default useLocalStorage;

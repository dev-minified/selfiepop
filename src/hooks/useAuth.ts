import { useContext } from 'react';
import { Auth } from '../context/Auth';

const useAuth = () => {
  return useContext(Auth);
};

export default useAuth;

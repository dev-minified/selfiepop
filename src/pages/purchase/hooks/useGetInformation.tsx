import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useLocalStorage from '../../../hooks/useLocalStorage';

const useGetInformation = ({ type, order: serverOrder }: any) => {
  const { user, setUser } = useAuth();
  const [guestUser] = useLocalStorage('guestUser');
  const [info, setInfo] = useState<any>({ message: '', for: '' });

  useEffect(() => {
    const userData = user || guestUser?.data;
    if (userData && serverOrder) {
      let infoObject = {};
      if (type === 'payma') {
        infoObject = {
          question: serverOrder['paymaAnswer'],
          for: `${userData.pageTitle ?? 'Incognito User'}`,
        };
      } else if (type === 'shoutout') {
        const showFrom = serverOrder.questions[0]?.responseValue === 'no';
        const forName =
          serverOrder.questions[1].responseValue === 'yes'
            ? `${userData.pageTitle ?? 'Incognito User'}`
            : serverOrder.questions[1].responseValue;

        infoObject = {
          showFrom,
          message: serverOrder.questions[2].responseValue,
          for: forName,
        };
      } else {
        const showFrom = false;
        const forName = `${userData.pageTitle ?? 'Incognito User'}`;
        infoObject = {
          showFrom,
          for: forName,
        };
      }
      setInfo(infoObject);
    }
  }, [user, guestUser, serverOrder]);
  return [user || guestUser, info, setUser, setInfo];
};

export default useGetInformation;

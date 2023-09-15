import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const MessagesComponent = () => {
  const history = useHistory();
  useEffect(() => {
    history.replace('/messages/subscriptions');
  }, []);

  return null;
};

export default MessagesComponent;

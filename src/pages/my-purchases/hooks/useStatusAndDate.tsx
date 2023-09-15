import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useStatusAndDate = ({
  order,
}: any): [
  string,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setStatus(order.orderStatus);
    if (order?.orderStatus?.toLowerCase() === 'completed') {
      order?.deliveryDate &&
        setDate(dayjs(order?.deliveryDate).format('MM/DD/YYYY'));
    } else {
      order.dueDate
        ? setDate(dayjs(order.dueDate).format('MM/DD/YYYY'))
        : setDate(
            dayjs(order.dateOrderStarted).add(2, 'day').format('MM/DD/YYYY'),
          );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [status, date, setStatus, setDate];
};

export default useStatusAndDate;

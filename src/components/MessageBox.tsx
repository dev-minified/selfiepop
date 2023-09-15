import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components';

interface Props {
  title: string;
  timestamp: string;
  message: string;
  className?: string;
}

const MessageBox: React.FC<Props> = (props) => {
  const { title, timestamp, message, className } = props;
  return (
    <div className={`message-box ${className}`}>
      <h2>{title}</h2>
      <ul className="list-timing">
        <li>
          Sent:{' '}
          <span className="date">
            {dayjs(timestamp).format('MM/DD/YYYY - h:mm A')}
          </span>
        </li>
      </ul>
      <p>{message}</p>
    </div>
  );
};

export default styled(MessageBox)`
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
  color: var(--pallete-text-main-300);
  font-weight: 400;

  h2 {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    color: var(--pallete-text-main);
    margin: 0 0 10px;
  }

  .list-timing {
    margin: 0 0 20px;
    padding: 0 4% 0 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .date {
      font-weight: 500;
      color: var(--pallete-text-main);
    }
  }

  p {
    margin: 0 0 30px;

    strong {
      font-weight: 500;
      color: var(--pallete-text-main);
    }
  }
`;

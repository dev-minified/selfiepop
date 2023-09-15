import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = { message?: string };

const Error: React.FC<Props> = (props) => {
  const { message } = props;
  return (
    <div
      id="title-error"
      style={{
        width: '100%',
        textAlign: 'right',
      }}
      className="error-msg is-invalid d-block"
    >
      <div>
        <FontAwesomeIcon
          style={{ marginRight: 3 }}
          icon={faExclamationCircle}
        />
        {message}
      </div>
    </div>
  );
};

export default Error;

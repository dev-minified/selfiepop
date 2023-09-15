import Button from 'components/NButton';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../../theme/logo';
type IEventSuccessProps = {
  className?: string;
  type?: string;
  showdashboardbtn?: boolean;
};
function InviteSuccess(props: IEventSuccessProps) {
  const { loggedIn } = useAuth();
  const history = useHistory();
  const { className, showdashboardbtn = true } = props;
  const [message, setmessage] = useState('');
  useEffect(() => {
    if (sessionStorage.getItem('message')) {
      setmessage(sessionStorage.getItem('message') || '');
    } else {
      history.push('/my-profile');
    }

    return () => {
      sessionStorage.removeItem('message');
    };
  }, []);

  return (
    <div className={`landing-page-area ${className}`}>
      <div className="container d-flex justify-content-center">
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </strong>
          <strong className="info-text text-primary">{message}</strong>
          {loggedIn && showdashboardbtn ? (
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                history.replace('/my-profile');
              }}
            >
              Go to your Dashboard
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default styled(InviteSuccess)`
  height: 100vh;
  .form-signup-area {
    text-align: center;
  }
`;

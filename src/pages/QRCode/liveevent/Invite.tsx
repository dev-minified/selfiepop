import { getInviteBytID } from 'api/event';
import Button from 'components/NButton';
import QrCodeGenrateor from 'components/QrCodeGenrator';
import { RequestLoader } from 'components/SiteLoader';
import useAuth from 'hooks/useAuth';
import useQuery from 'hooks/useQuery';
import { useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../../../theme/logo';
type IInvite = {
  className?: string;
};
const RqLoader = styled(RequestLoader)`
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
function Invite(props: IInvite) {
  const { className } = props;
  const { invite } = useQuery();

  const [loading, setDataLoading] = useState(true);
  const [isPunchedStatus, setIsPunchedStatus] = useState(``);
  const { loggedIn } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (invite) {
      getInviteBytID(invite as string)
        .catch((e) => {
          if (e && e?.message) {
            // Cast to ObjectId failed for value
            if (e?.message?.includes('Cast to ObjectId failed for value')) {
              setIsPunchedStatus('Invalid InviteID');
            }
          }
          setIsPunchedStatus(e?.message || 'Something went wrong');
        })
        .then(() => {
          // setPersonName(data.name?.split(' ')[0]);
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else {
      setDataLoading(false);
      setIsPunchedStatus('Invalid InviteID');
    }
  }, [invite]);
  const loader = useMemo(
    () => (
      <RqLoader
        isLoading={true}
        width="40px"
        height="40px"
        color="var(--pallete-primary-main)"
      />
    ),
    [],
  );
  return (
    <div className={`landing-page-area ${className}`}>
      <div className="container justify-content-center">
        <div className="form-signup-area">
          <strong className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </strong>
          {loading ? (
            <strong className="info-text text-primary loadigte">
              {loader}
            </strong>
          ) : !!isPunchedStatus ? (
            isPunchedStatus
          ) : (
            <>
              <strong className="info-text text-primary d-block">
                Here is your ticket for admission.
              </strong>
              <QrCodeGenrateor
                link={`${window.location.origin}/punchticket?inviteid=${invite}`}
                options={{ showProfileLink: false, showDownload: false }}
              />
            </>
          )}
          {!!isPunchedStatus && loggedIn ? (
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                history.push('/my-profile');
              }}
            >
              Go to Dashboard
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default styled(Invite)`
  text-align: center;
  .loadigte {
    text-align: center;
  }
  .name {
    text-transform: capitalize;
  }
`;

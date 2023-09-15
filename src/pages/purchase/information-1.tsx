import SelfiepopText from 'components/selfipopText';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useHistory } from 'react-router';
import Button from '../../components/NButton';
import useAuth from '../../hooks/useAuth';
import useLocalStorage from '../../hooks/useLocalStorage';
dayjs.extend(utc);
dayjs.extend(timezone);

export default function MyProfile() {
  const history = useHistory();
  const { setUser, setToken } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, _, removeUser] = useLocalStorage('guestUser');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokens, setTokens, removetokens] = useLocalStorage('guestTokens');

  const onTakeMeBoarding = async () => {
    try {
      setToken(tokens?.token, tokens?.refreshToken);
      setUser(user.data);
      removetokens();
      removeUser();
      history.push('/onboarding/profile-photo');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className="profile--info mb-30">
        <h3 className="text-center">
          Your{' '}
          <strong>
            <SelfiepopText /> Page
          </strong>{' '}
          is an easy way for you to keep all of your links to all the your pages
          and profiles in a single beautiful link.
        </h3>
      </div>
      <div className="mb-30">
        <div className="warrper sm" style={{ textAlign: 'center' }}>
          <figure style={{ width: '225px', margin: 'auto' }}>
            <img
              src="/assets/images/profilesetupimage.jpg"
              alt="profile set up"
              width="100%"
            />
          </figure>
        </div>
        <div className="d-flex justify-content-center mt-50 mb-15">
          <Button
            type="primary"
            block
            size="x-large"
            onClick={onTakeMeBoarding}
          >
            NEXT
          </Button>
        </div>
      </div>
    </>
  );
}

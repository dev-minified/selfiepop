import {
  AccountMenuIcon,
  AvatarName,
  CreditCardMenuIcon,
  Crown,
  CustomAgentMenuIcon,
  LogoutMenuIcon,
  MembersMenuIcon,
  MyProfileMenuIcon,
  ProfleTickIcon,
  RequestMenuIcon,
  SocialIconMenu,
  StarMenuIcon,
  StarsMenu,
  SubscriptionMenuIcon,
  UnlockOrdersMenuIcon,
  WalletMenuIcon,
} from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import SPLink from 'components/SpLink';
import { ImagesSizes } from 'enums';
import { useAppSelector } from 'hooks/useAppSelector';
import styled from 'styled-components';
import useAuth from '../../../hooks/useAuth';
import useDropDown from '../../../hooks/useDropDown';
const UserDropDown = styled.div`
  display: none;
  font-size: 15px;

  .icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;

    &.crown {
      svg {
        width: 18px;
        height: auto;
        display: block;
        margin: 5px auto;
      }
    }

    .star {
      #Layer_2 {
        fill: currentColor;
      }
    }
  }

  .dropdown-toggle {
    text-decoration: none;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .dropdown-toggle:after {
    display: none;
  }

  .dropdown-menu {
    margin-top: 2px;
  }

  .user-name {
    font-size: 18px;
    font-weight: 500;
    margin: 0 10px 0 0;
    color: #fff;
  }

  .user-name em {
    font-weight: 400;
    font-style: normal;
  }

  .user-img {
    width: 45px;
    height: 45px;
    border-radius: 100%;
    overflow: hidden;
    border: 1px solid #dcdcdc;
  }

  .user-img img {
    width: 43px;
    height: 43px;
    border-radius: 100%;
  }

  @media (max-width: 767px) {
    width: 100%;
    padding: 10px 15px;

    .dropdown-toggle {
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
    }

    .dropdown-menu {
      position: static;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
      width: 100%;
      float: none;
    }

    .user-name {
      margin: 0;
      width: 100%;
      display: block;
      text-align: center;
      -webkit-box-ordinal-group: 3;
      -ms-flex-order: 2;
      order: 2;
      color: #fff;
    }

    .user-img {
      display: block;
      -webkit-box-ordinal-group: 2;
      -ms-flex-order: 1;
      order: 1;
    }
  }
`;
const sizes = [ImagesSizes['64x64']];

const AvatarDropDown = ({ user, handleLogout, alwaysOpen }: any) => {
  const { ref, isVisible } = useDropDown();
  const { user: fullUser } = useAuth();

  let isV = isVisible;
  if (alwaysOpen) {
    isV = alwaysOpen;
  }
  const subscription = useAppSelector((state) => state.counter?.subscription);
  const isUserVerified = fullUser?.isEmailVerified && fullUser?.idIsVerified;
  const showmembers =
    fullUser?.enableMembershipFunctionality && !fullUser?.skipOnBoarding;
  return (
    <>
      <UserDropDown className="dropdown user-dropdown">
        <span
          ref={ref}
          className="dropdown-toggle"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className="user-name">
            {user?.pageTitle ?? 'Incognito User'}{' '}
            {isUserVerified ? <ProfleTickIcon width="13" height="13" /> : null}
          </span>
          <span
            className="user-img"
            style={{
              background: 'var(--pallete-primary-main)',
            }}
          >
            <ImageModifications
              src={user.profileImage}
              // src={
              //   user.profileImage || '/assets/images/default-profile-pic.png'
              // }
              alt="img description"
              imgeSizesProps={{
                onlyMobile: true,

                imgix: {
                  all: sizes[0],
                },
              }}
              fallbackComponent={
                <AvatarName text={fullUser.pageTitle || 'Incognito User'} />
              }
              // fallbackUrl={'/assets/images/default-profile-pic.png'}
            />
          </span>
        </span>
        <div
          className={`dropdown-menu ${isV && 'show'}`}
          aria-labelledby="dropdownMenuButton"
        >
          <SPLink to={`/${user.username}`} className="dropdown-item">
            {' '}
            <span className="icon">
              <StarMenuIcon />
            </span>
            My Pop Page
          </SPLink>
          {showmembers && (
            <SPLink to={'/messages/subscribers'} className="dropdown-item">
              <span className="icon">
                <MembersMenuIcon />
              </span>
              Members
            </SPLink>
          )}
          {!!subscription && (
            <SPLink to={'/messages/subscriptions'} className="dropdown-item">
              <span className="icon">
                <SubscriptionMenuIcon />
              </span>
              Subscriptions
            </SPLink>
          )}
          <SPLink className="dropdown-item" to="/my-profile">
            <span className="icon">
              <MyProfileMenuIcon />
            </span>
            <span className="menu-text">Link In Bio</span>
          </SPLink>

          {fullUser?.showSellerMenu && fullUser?.idIsVerified && (
            <SPLink to={'/orders/my-sales'} className="dropdown-item">
              {' '}
              <span className="icon">
                <RequestMenuIcon />
              </span>
              Requests
            </SPLink>
          )}

          {user.showPurchaseMenu && (
            <SPLink to={'/orders/my-purchases'} className="dropdown-item">
              <span className="icon">
                <UnlockOrdersMenuIcon />
              </span>
              Unlocked
            </SPLink>
          )}
          <SPLink to={'/account/payments'} className="dropdown-item">
            {' '}
            <span className="icon">
              <WalletMenuIcon />
            </span>
            My Wallet
          </SPLink>
          <SPLink to={'/account/billing'} className="dropdown-item">
            {' '}
            <span className="icon">
              <CreditCardMenuIcon />
            </span>
            My Payment Method
          </SPLink>
          {user.isAffiliate && (
            <SPLink to={'/account/inner-circle'} className="dropdown-item">
              <span className="icon">
                <StarsMenu />
              </span>
              Inner Circle
            </SPLink>
          )}

          <SPLink to={'/support'} className="dropdown-item">
            <span className="icon">
              <CustomAgentMenuIcon />
            </span>
            Support
          </SPLink>

          <SPLink to={'/account'} className="dropdown-item">
            <span className="icon">
              <AccountMenuIcon />
            </span>
            My Account
          </SPLink>
          <SPLink to={'/account/social-accounts'} className="dropdown-item">
            <span className="icon">
              <SocialIconMenu />
            </span>
            Social Accounts
          </SPLink>
          {user?.isAcctManager && (
            <SPLink to={'/managed-accounts'} className="dropdown-item">
              <span className="icon crown">
                <Crown fill={'currentColor'} />
              </span>
              Managed Accounts
            </SPLink>
          )}

          <span onClick={handleLogout} className="dropdown-item log-out">
            <span className="icon">
              <LogoutMenuIcon />
            </span>{' '}
            Log Out
          </span>
        </div>
      </UserDropDown>
    </>
  );
};

export default AvatarDropDown;

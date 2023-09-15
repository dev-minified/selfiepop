import styled from 'styled-components';
import Header from './header';

type Props = { [key: string]: any };

const Sidebar = (props: Props) => {
  return (
    <div className={props.className}>
      <Header {...props} removeOnMobile={false} />
    </div>
  );
};

export default styled(Sidebar)`
  width: 68px;
  height: 100vh;
  position: fixed;
  z-index: 9;

  header {
    height: 100vh;
    border-right: 1px solid #353535;
    padding: 15px 0;

    .container-fluid {
      flex-direction: column;
      padding: 0;
    }
    .navbar {
      width: 100%;
    }
    .logo {
      display: none;
    }
    .user-login-box {
      margin: 0 !important;
    }
    .user-login-box .user-dropdown .user-name {
      display: none;
    }
    .navbar-collapse {
      flex-direction: column;
      justify-content: space-between;
      height: calc(100vh - 30px);
    }
  }

  .navbar-nav {
    flex-direction: column;

    .nav-item {
      min-height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;

      .nav-link {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        line-height: 16px;
        padding: 0;
        font-weight: 400;
        color: #fff;

        &.active {
          color: #e51075;
        }

        .menu-icon {
          margin: 0 0 10px;
        }
      }
      + .nav-item {
        margin-left: 0;
      }
    }
  }

  .dropdown-menu {
    top: auto;
    right: auto;
    left: 100%;
    bottom: 100%;
    background: #191919;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    border-radius: 8px;

    .dropdown-item {
      color: #fff;
      font-size: 15px;
      line-height: 17px;
      border-radius: 0;
      padding: 5px 14px;

      &:hover,
      &:focus {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .icon {
      color: currentColor;
      margin-right: 10px;
      text-align: center;

      path {
        fill: currentColor;
      }

      g#Layer_1 {
        path {
          fill: transparent;
        }
      }
    }
  }
`;

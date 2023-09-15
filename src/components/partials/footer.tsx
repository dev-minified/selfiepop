import NButton from 'components/NButton';
import SelfiepopText from 'components/selfipopText';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { Link } from 'react-router-dom';
import 'styles/footer.css';
import 'styles/page-info.css';
import Logo from 'theme/logo';
interface IFooter {
  hideTopFooter?: boolean;
}

const Footer: React.FC<IFooter> = (props) => {
  const { hideTopFooter = false } = props;

  const { loggedIn } = useAuth();

  return (
    <React.Fragment>
      <footer id="footer">
        {!loggedIn && !hideTopFooter && (
          <div className="container py-30">
            <div className="row justify-content-between">
              <div className="col-12 col-md-7 col-lg-7 col-xl-8 order-1 order-md-2">
                <div className="page-info">
                  <strong className="h3">
                    <span className="icon-star1"></span> Start{' '}
                    <span className="primary-text">your</span> own Pop Page
                    &amp; tap into the power of&nbsp;
                    <span className="primary-text">social revenue!</span>
                  </strong>
                </div>
              </div>
              <div className="col-12 col-md-5 col-lg-5 col-xl-4 order-1 order-md-2">
                <div className="page-info">
                  <NButton type="primary" size="large" block>
                    Get Your <SelfiepopText /> Page!
                  </NButton>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="footer-bar">
          <div className="container d-flex flex-wrap justify-content-between">
            <div className="logo">
              <Logo />
            </div>
            <p className="copyrights">
              ©{dayjs().year()} <SelfiepopText />. All rights reserved
            </p>
            <ul className="footer-links d-flex flex-wrap list-inline mb-0">
              <li>
                <Link to="/terms" target="_blank">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/policy" target="_blank">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;

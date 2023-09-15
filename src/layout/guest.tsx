import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'theme/logo';
const Guest: React.FC<any> = ({ children, ...rest }) => {
  const [open, setopen] = useState(false);

  return (
    <>
      <div id="wrapper" className={`${open ? 'footer-active' : ''}`}>
        <div className="landing-page-wrap">
          <span
            className="footer-opener"
            onClick={() => setopen((state) => !state)}
          ></span>
          {React.cloneElement(children, { ...rest })}
        </div>
        <div className="footer-menu">
          <div className="footer-menu-wrap">
            <div className="container">
              <ul className="footer-list">
                <li className="d-none d-md-block">
                  &copy; {dayjs().format('YYYY')}{' '}
                  <span className="f-logo">
                    <Logo />
                  </span>{' '}
                  Inc.
                </li>
              </ul>

              <ul className="footer-list">
                <li>
                  <Link target="_blank" to="/terms">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link target="_blank" to="/policy">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guest;

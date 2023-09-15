import React, { ReactNode } from 'react';
import { isDesktop, isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import Logo from 'theme/logo';

const Invitation: React.FC<{
  index?: number;
  className?: string;
  children?: ReactNode;
}> = ({ children, className }) => {
  return (
    <div className={className}>
      <main id="main" className="flex-grow-1">
        <div className="container page-container">
          <div className="pb-20 content-parent">{children}</div>
        </div>
      </main>
      {isDesktop && (
        <footer>
          <div className="footer-menu">
            <div className="footer-menu-wrap">
              <div className="container">
                <ul className="footer-list">
                  <li>
                    {/* <strong className="footer-logo">
                      <a href="#">
                        <LogoUpdated primaryColor="#000" />
                      </a>
                    </strong> */}
                    <span className="f-logo">
                      <Logo />
                    </span>
                  </li>
                </ul>

                <ul className="footer-list">
                  <li>
                    <a target="_blank" href="/terms">
                      Terms
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="/policy">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default styled(Invitation)`
  ${() => {
    if (isMobileOnly) {
      return `
      .container {
        height: 100vh;
      }
      `;
    }
  }}

  .test {
    height: 100% !important;
    vertical-align: top;
  }

  .slick-list {
    height: 100% !important;
  }
`;

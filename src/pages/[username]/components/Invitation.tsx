import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/invitation.css';
import 'styles/live-link-bar.css';
import 'styles/share-popup.css';
import useCopyToClipBoard from '../../../hooks/useCopyToClipBoard';

Modal.setAppElement('#root');

const PopupArea = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.81);
  overflow: auto;

  .popup-area__wrap {
    display: table;
    width: 100%;
    height: 100%;
  }

  .popup-area__frame {
    display: table-cell;
    vertical-align: middle;
    padding: 0 20px;
  }

  .share-popup.popup-box {
    position: relative;
    border: none;
  }

  .share-popup.popup-box:before {
    position: absolute;
    left: -4px;
    top: -4px;
    right: -4px;
    bottom: -4px;
    background: rgba(0, 0, 0, 0.14);
    content: '';
    z-index: -1;
    border-radius: 20px;
  }

  .popup-box__detail-area {
    padding: 30px 30px 10px;
    color: #fff;
    text-align: center;
    font-size: 18px;
    line-height: 22px;
    font-weight: 400;
    position: relative;
    z-index: 1;
  }

  .popup-box__h2 {
    font-size: 40px;
    line-height: 48px;
    font-weight: 500;
    padding: 0 0 25px;
    margin: 0 0 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }

  .popup-box__logo {
    padding: 0 0 15px;
    margin-bottom: 0px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }

  .popup-box__subtitle {
    font-size: 29px;
    line-height: 42px;
    font-weight: 400;
    padding: 5px 0 5px;
    margin: 0 0 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  }

  .popup-box__h2__name {
    display: block;
  }

  .popup-box__p {
    margin: 0 0 20px;
  }

  .popup-box__link-wrap {
    border-top: 2px dashed rgba(255, 255, 255, 0.4);
    border-bottom: 2px dashed rgba(255, 255, 255, 0.4);
  }

  .popup-box .form-block label {
    color: #fff;
  }

  .popup-box .form-control {
    padding: 15px;
    width: 100%;
    margin: 0 0 5px;
  }

  .popup-box .btn {
    min-width: 160px;
  }

  .popup-box .btn.btn-primary {
    width: auto;
    min-width: 160px;
    display: inline-block;
    vertical-align: top;
  }

  .popup-box .btn .img-circle {
    width: 20px;
    height: 20px;
    background: var(--pallete-background-default);
    display: inline-block;
    vertical-align: middle;
    color: #e51075;
    border-radius: 100%;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    margin: -2px 0 0 15px;
  }

  .popup-box .btn .img-circle .icon {
    margin: 1px 0 0;
  }

  .popup-box .live-link-bar {
    border-radius: 5px;
    padding: 5px 5px 5px 18px;
  }

  .popup-box .live-link-bar .btn {
    min-width: 90px;
    background: #000;
    border-color: #000;
  }

  .popup-box .live-link-bar .btn:hover {
    background: #e61c7c;
    border-color: #e61c7c;
  }

  .popup-box .live-link-bar .btn .icon-url {
    background: none;
  }

  .btn-black {
    background: #000;
    color: #fff;
  }

  .btn-black:hover {
    color: #fff !important;
  }

  &.signup .btn-black {
    width: 100%;
  }

  .confetti {
    position: relative;
  }

  .confetti img {
    position: absolute;
    width: 97%;
    top: 4px;
    left: 6px;
  }
`;

const InvitationModel: React.FC<any> = ({ isOpen, onClose, user }: any) => {
  const [copied, copy] = useCopyToClipBoard();
  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="Overlay"
    >
      <div className="modal-dialog">
        <div className="modal-content" style={{ border: 'hidden' }}>
          <PopupArea className="popup-area" style={{ overflow: 'hidden' }}>
            <figure className="confetti">
              <img src="/assets/images/svg/confetti.svg" alt="confetti" />
            </figure>
            <div className="popup-area__wrap">
              <div className="popup-area__frame">
                <div className="share-popup popup-box mb-30 mb-md-50">
                  <div className="popup-box__detail-area">
                    <span className="btn-close" onClick={onClose}>
                      <span className="icon-clearclose"></span>
                    </span>
                    <h2 className="popup-box__h2">
                      Great,
                      <span className="popup-box__h2__name">
                        You're all set!
                      </span>
                    </h2>
                    <p className="popup-box__p">
                      Please copy the link below and add it to your Social Media
                      accounts.
                    </p>
                    <div className="popup-box__link-wrap py-35">
                      <div className="live-link-bar small mb-0">
                        <p>
                          <Link to="javascript:void(0)">
                            www.selfiepop.com/{user?.username}
                          </Link>
                        </p>
                        <span
                          className="btn btn-secondary"
                          onClick={() =>
                            copy(`www.selfiepop.com/${user?.username}`)
                          }
                        >
                          <span className="icon-url"></span>
                          {copied ? 'Copied' : 'Copy'}
                        </span>
                      </div>
                    </div>
                    <div className="text-center pb-20 pt-30">
                      <button
                        type="submit"
                        className="btn btn-black"
                        onClick={onClose}
                      >
                        OK!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopupArea>
        </div>
      </div>
    </Modal>
  );
};

export default InvitationModel;

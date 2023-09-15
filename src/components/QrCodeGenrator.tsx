import NewButton from 'components/NButton';
import QRCode from 'qrcode.react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

type OptionTypes = {
  showDownload: boolean;
  showProfileLink: boolean;
};
type IQrCodeGenrateor = {
  className?: string;
  userProfileLink?: string;
  link?: string;
  options?: OptionTypes;
};
const QrCodeGenrateor = ({
  userProfileLink,
  link,
  options = {
    showDownload: true,
    showProfileLink: true,
  },
}: IQrCodeGenrateor) => {
  const qrRef = useRef<any>(null);

  const downloadQRCode = (evt: any) => {
    evt.preventDefault();
    const canvas = qrRef.current.querySelector('canvas');
    const image = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = `qr-code.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  return (
    <div className="qr-container">
      <div className="qr-container__qr-code" ref={qrRef}>
        <QRCode
          id="qrCodeElToRender"
          size={184}
          value={link || ''}
          bgColor="white"
          fgColor="#141926"
          level="H"
          imageSettings={{
            src: 'assets/images/sp-icon.png',
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      {(options.showDownload || options.showProfileLink) && (
        <form className="qr-container__form">
          {options.showProfileLink && (
            <div className="user-link-area">
              <span className="img-icon">
                <i className="icon-star1"></i>
              </span>
              <Link to={`/`} className="user-link" target="_blank">
                selfiepop.com/<strong>{userProfileLink}</strong>
              </Link>
            </div>
          )}
          {options.showProfileLink && (
            <NewButton
              type="primary"
              shape="round"
              onClick={downloadQRCode}
              block
            >
              Download QR code
            </NewButton>
          )}
        </form>
      )}
    </div>
  );
};
export default QrCodeGenrateor;

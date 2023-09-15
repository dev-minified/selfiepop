import { Correct, CrossRed } from 'assets/svgs';
import NewButton from 'components/NButton';
import styled from 'styled-components';

interface Props {
  className?: string;
  variation: PriceVariant;
  EditView?: Function;
  onDelete?: (...args: any) => void;
  level: number;
  isDefault?: boolean;
  isArchive?: boolean;
}
const MemberLevelListing = ({
  className,
  variation,
  EditView,
  level,
  isDefault = false,
}: Props) => {
  return (
    <div className={`${className} price-variation`}>
      <div className="variation-head">
        <span className="heading-text">
          Level {level}: {variation?.title}
        </span>
        <div>
          <NewButton
            onClick={() => EditView?.(variation?._id)}
            outline
            size="small"
            shape="round"
          >
            EDIT
          </NewButton>
        </div>
      </div>
      <div className="variation-body">
        <ul className="subscription-description-list">
          <li>
            Title: <strong className="text-color">{variation?.title}</strong>
          </li>
          <li>
            Price:{' '}
            <strong className="text-color"> {`$${variation?.price}`}</strong>
          </li>
          <li>
            Welcome Message:{' '}
            <span className="text-color">{variation?.description}</span>
          </li>
        </ul>
        <ul className="subscription-features-list">
          <li>
            <span className="img">
              {variation?.allowContentAccess ? <Correct /> : <CrossRed />}
            </span>{' '}
            Allow Pop Wall Access
          </li>
          <li>
            <span className="img">
              {variation?.allowBuyerToMessage ? <Correct /> : <CrossRed />}
            </span>
            Allow to Send Direct Messages
          </li>
          {!isDefault && (
            <li>
              <span className="img">
                {variation?.isArchive ? <Correct /> : <CrossRed />}
              </span>
              Archive Membership
            </li>
          )}
          {/* <li>
            <span className="img">
              {variation?.allowUpsaleOffer ? <Correct /> : <CrossRed />}
            </span>
            Include Upsale Offer
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default styled(MemberLevelListing)``;

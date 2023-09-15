import { Heat, SliderScheduledMessageIcon, StarSquare } from 'assets/svgs';
import styled from 'styled-components';
import { SmileIcon } from '../../assets/svgs/index';
interface Props {
  className?: string;
}
const MemberWelcomePage = ({ className }: Props) => {
  return (
    <div className={`${className} empty-block-area`}>
      <div className="welcome-message">
        <div className="img-holder">
          <StarSquare />
        </div>
        <h3>Welcome to your Member Page</h3>
        <p>
          Through your member's page, your best fans can subscribe to receive
          DMs and access to your exclusive content.
        </p>
      </div>
      <div>
        <ul className="list-course-info">
          <li>
            <div className="img-link">
              <Heat />
            </div>
            <div className="text-holder">
              <h4>1. Set your membership levels</h4>
              <p>
                Set different membership levels at different prices so some
                members can message you and see your content while others will
                need to upgrade.
              </p>
            </div>
          </li>
          <li>
            <div className="img-link">
              <SliderScheduledMessageIcon />
            </div>
            <div className="text-holder">
              <h4>2. Schedule a wall post or message</h4>
              <p>
                Set your wall post or bulk DMs only to be available to specific
                membership types or to require payment to unlock the content!
              </p>
            </div>
          </li>
          <li>
            <div className="img-link img-smilyes">
              <SmileIcon />
            </div>
            <div className="text-holder">
              <h4>3. Chat one on one with your fans</h4>
              <p>
                Build a better relationship with your fans in the DMs. Let them
                get to know you in a way that they can not anywhere else!{' '}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default styled(MemberWelcomePage)`
  padding: 20px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  color: var(--pallete-text-main-600);
  max-width: 695px;
  margin: 0 auto;

  @media (max-width: 767px) {
    padding: 5px;
  }

  .welcome-message {
    background: var(--pallete-background-gray-secondary-light);
    border-radius: 4px;
    padding: 30px 10%;
    text-align: center;
    margin: 0 0 17px;

    @media (max-width: 767px) {
      padding: 20px;
    }

    .img-holder {
      width: 60px;
      margin: 0 auto 14px;

      @media (max-width: 767px) {
        width: 40px;
        margin: 0 auto 5px;
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    h3 {
      font-size: 22px;
      line-height: 24px;
      font-weight: 500;
      margin: 0 0 9px;

      @media (max-width: 767px) {
        font-size: 18px;
        line-height: 22px;
        margin: 0 0 5px;
      }
    }

    p {
      margin: 0;
    }
  }

  .list-course-info {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      margin: 0 0 20px;
      background: var(--pallete-background-gray-secondary-light);
      border-radius: 4px;
      padding: 25px 40px 25px 25px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;

      @media (max-width: 767px) {
        padding: 15px;
      }
    }

    .img-link {
      width: 60px;
      min-width: 60px;

      @media (max-width: 767px) {
        width: 40px;
        min-width: 40px;
      }

      circle {
        fill: var(--pallete-text-main-650);
      }

      rect {
        stroke: var(--pallete-text-main-650);

        &:first-child {
          fill: var(--pallete-text-main-650);
        }
      }

      &.img-smilyes {
        height: 60px;
        background: var(--pallete-text-main-650);
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        @media (max-width: 767px) {
          height: 40px;
        }

        svg {
          width: 30px;
          height: auto;
          vertical-align: top;

          @media (max-width: 767px) {
            width: 20px;
          }
        }

        path,
        circle {
          fill: #fff;
        }
      }

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .text-holder {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 30px;

      @media (max-width: 767px) {
        padding: 0 0 0 15px;
      }
    }

    h4 {
      font-size: 18px;
      line-height: 24px;
      margin: 0 0 2px;
      font-weight: 500;
    }

    p {
      margin: 0;
    }
  }
`;

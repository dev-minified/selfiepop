import ImageModifications from 'components/ImageModifications';
import React, { ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

interface Props {
  className?: string;
  title: string;
  skeleton: boolean;
  items: { label?: string; icon: string | ReactElement }[];
}

const ListSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => {
          return (
            <li key={`info-card-list-skelton-${index}`}>
              <div className="w-100">
                <span className="shoutout--icon">
                  <Skeleton circle height={30} width={30} />
                </span>
                <span className="shoutout--text">
                  <Skeleton height={30} />
                </span>
              </div>
            </li>
          );
        })}
    </>
  );
};

export function Infocard({
  className,
  title,
  items = [],
  skeleton = false,
}: Props): ReactElement {
  return (
    <div className={className}>
      <h3>{skeleton ? <Skeleton height={50} /> : title}</h3>
      <ul className="shoutout--list list-unstyled mb-0">
        {!skeleton ? (
          items?.map(({ label, icon }, index) => {
            return (
              <li key={index}>
                <div>
                  <span className="shoutout--icon">
                    {typeof icon === 'string' ? (
                      <ImageModifications
                        src={icon}
                        imgeSizesProps={{
                          onlyMobile: true,
                        }}
                        alt="img description"
                      />
                    ) : (
                      icon
                    )}
                  </span>
                  <span className="shoutout--text">{label}</span>
                </div>
              </li>
            );
          })
        ) : (
          <ListSkeleton count={3} />
        )}
      </ul>
    </div>
  );
}

export default styled(Infocard)`
  overflow: hidden;
  background: var(--pallete-background-default);
  border-radius: 7px;
  border: 1px solid var(--pallete-colors-border);
  margin: 0 0 14px;

  h3 {
    padding: 18px;
    text-align: center;
    font-weight: 500;
    margin: 0;
    background: var(--colors-darkGrey-50);
    border-bottom: 1px solid var(--pallete-colors-border);
  }

  .shoutout--list {
    max-width: 325px;
    margin: 0 auto;
    font-size: 22px;
    font-weight: 500;
    padding: 15px 0;
    // color: #e51075;
  }

  .shoutout--list li {
    padding: 6px 0;
    display: flex;
    align-items: center;
  }

  .shoutout--list li div {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .shoutout--icon {
    width: 45px;
    text-align: center;
    margin: 0 30px 0 0;
  }

  .shoutout--text {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;

    .sp_dark & {
      color: #acacac;
    }
  }

  @media (max-width: 767px) {
    h3 {
      padding: 15px;
    }

    .shoutout--list {
      font-size: 18px;
      max-width: 220px;
    }

    .shoutout--icon {
      margin: 0 20px 0 0;
    }

    .shoutout--icon img,
    .shoutout--icon svg {
      -webkit-transform: scale(0.7);
      -ms-transform: scale(0.7);
      transform: scale(0.7);
    }

    .shoutout-title .img {
      margin: 0 15px 0 0;
    }

    .shoutout-title h2 {
      font-size: 16px;
    }
  }
`;

import { AvatarName, CalendarIcon } from 'assets/svgs';
import classNames from 'classnames';
import ImageModifications from 'components/ImageModifications';
import React from 'react';
import styled from 'styled-components';

interface ISimpleView<T> {
  key: string;
  className?: string;
  data: T[];
  onRowClick?: (row?: T, key?: T[keyof T] | number) => void;
  options?: { [key: string]: boolean };
}

const SimpleView: React.FC<ISimpleView<any>> = (props) => {
  const {
    className,
    data,
    onRowClick,
    key,
    options: displayOptions = {},
  } = props;
  const { date: Ddate = true, price: Dprice = true } = displayOptions;

  return (
    <div id="list-area" className={classNames(className, 'mb-30')}>
      {data?.map((row: any, index: number) => {
        const { image, title, subtitle, status, price, user, date } = row;
        return (
          <div
            key={row[key] || index}
            className="primary-shadow order-widget"
            style={{ display: 'block' }}
            onClick={() => {
              onRowClick && onRowClick(row, row[key] || index);
            }}
          >
            <div className="order-widget-wrap">
              <div className="img-holder">
                <ImageModifications
                  imgeSizesProps={{
                    onlyMobile: true,
                    defaultUrl: image,
                    imgix: {
                      all: 'w=480&h=220',
                    },
                  }}
                  src={image}
                  fallbackComponent={
                    <AvatarName text={user?.pageTitle || 'Incognito User'} />
                  }
                  // fallbackUrl={'/assets/images/default-profile-img.svg'}
                  alt="img description"
                />
              </div>
              <div className="wrap">
                <div className="title-wrap">
                  <strong className="title">{title}</strong>
                  {Dprice && (
                    <strong className="price">
                      ${(Number(price) || 0).toFixed(2)}
                    </strong>
                  )}
                </div>
                <div className="text-wrap">
                  <span className="sub-title">{subtitle}</span>
                  {Ddate && (
                    <span className="date">
                      <span className="calendar">
                        <CalendarIcon />
                      </span>
                      <time dateTime={date}>{date}</time>
                    </span>
                  )}
                  <span className={`status text-capitalize mr-0 ${status}`}>
                    <span>{status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default styled(SimpleView)``;

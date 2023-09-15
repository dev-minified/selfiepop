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
    // options: displayOptions = {},
  } = props;
  // const { date: Ddate = true, price: Dprice = true } = displayOptions;

  return (
    <div id="list-area" className={classNames(className, 'mb-30')}>
      {data?.map((row: any, index: number) => {
        const { image, meta, usertitle, subtitle, status } = row;

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
                  src={image || '/assets/images/default-profile-img.svg'}
                  fallbackUrl={'/assets/images/default-profile-img.svg'}
                  alt="img description"
                />
              </div>
              <div className="wrap">
                <div className="title-wrap">
                  <strong className="title">{usertitle}</strong>
                  <span className={`status text-capitalize ${status}`}>
                    <span>{status}</span>
                  </span>
                  {/* {Dprice && (
                    <strong className="price">
                      ${(Number(price) || 0).toFixed(2)}
                    </strong>
                  )} */}
                </div>
                <div className="text-wrap">
                  <span className="subtext">{subtitle}</span>
                  {meta}
                  {/* {Ddate && (
                    <span className="date">
                      Date Ordered:&nbsp;
                      <time dateTime={date}>{date}</time>
                    </span>
                  )} */}
                  {/* <span className={`status text-capitalize ${status}`}>
                    Status: <span>{status}</span>
                  </span> */}
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

import { getAffliatedData } from 'api/User';
import { InnerCircle, LinkTypeName } from 'appconstants';
import { ChevronLeft, Copy, Stars, TickIcon } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import NewButton from 'components/NButton';
import Select from 'components/Select';
import Pagination from 'components/pagination';
import Tooltip from 'components/tooltip';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import useCopyToClipBoard from 'hooks/useCopyToClipBoard';
import useQuery from 'hooks/useQuery';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/live-link-bar.css';
import ArrowBack from './../../assets/svgs/svgsFiles/ArrowBack';

const ItemRow: React.FC<any> = ({
  affiliateId,
  childId,
  user,
  createdAt,
  notificationType,
  notificationValue,
  notificationTransactionId,
  popType,
}) => {
  const {
    // firstName,
    // lastName,
    profileImage,
    pageTitle = 'Incognito User',
  } = childId;
  const innerCirlcle: Record<string, any> = InnerCircle;
  const GetTag = () => {
    if (innerCirlcle?.[popType as string]) {
      return (
        <strong className="price">
          <span className="icon icon-dollar"></span>{' '}
          {innerCirlcle?.[popType as string]}
        </strong>
      );
    }
    if (notificationValue) {
      return (
        <strong className="price">
          <span className="icon icon-dollar"></span> New sale
        </strong>
      );
    }
    switch (notificationType) {
      case 'new_user':
        return (
          <>
            <strong className="price bg-sky-blue">
              <span className="icon icon-star"></span> User
            </strong>
          </>
        );
      case 'new_grandchild_user':
        return (
          <>
            <strong className="price bg-dark-blue">
              <span className="icon icon-star"></span> Sub-user
            </strong>
          </>
        );
    }
    return <></>;
  };

  const GetCaption = () => {
    let message: any;
    if (innerCirlcle?.[popType as string]) {
      message = <span>{innerCirlcle?.[popType as string]}</span>;
    } else if (notificationValue) {
      message = (
        <span>
          Sold a {(LinkTypeName as any)[notificationTransactionId?.popType]}
        </span>
      );
    } else if (affiliateId._id === user?._id) {
      message = (
        <span>
          Joined with <strong>your partner</strong> code.
        </span>
      );
    } else {
      message = (
        <span>
          Joined with{' '}
          <strong>{affiliateId?.pageTitle || 'Incognito User'}</strong> code.
        </span>
      );
    }

    return <span className="note-text">{message}</span>;
  };
  const style = { width: '100%', height: '100%', borderRadius: '100%' };
  return (
    <div className="table-row">
      <div className="icon blue">
        <ImageModifications
          style={style}
          fallbackUrl={'/assets/images/default-profile-img.svg'}
          src={profileImage || '/assets/images/default-profile-img.svg'}
          imgeSizesProps={{
            onlyMobile: true,

            imgix: { all: 'w=163&h=163' },
          }}
          alt="img description"
        />
      </div>
      <div className="table-content">
        <div className="top-row">
          <div className="text">{pageTitle}</div>

          <div className="text">
            <GetTag />
          </div>
        </div>
        <div className="bottom-row">
          <span className="status">
            <span> {dayjs(createdAt).format('MM/DD/YYYY')}</span>
          </span>
          <GetCaption />
        </div>
      </div>
    </div>
  );
};
const PAGE_LIMIT = 20;
const CopyLink = styled.span`
  color: green;

  width: 100%;
  display: flex;
  justify-content: center;
`;
export const Affiliate = (props: any) => {
  const { className } = props;
  const [copied, copy] = useCopyToClipBoard(3000);
  const [paginatedItems, setPaginatedItems] = useState({
    items: [],
    totalCount: 0,
  });
  const { user } = useAuth();
  const router = useHistory();
  const { withLoader } = useRequestLoader();
  const { page, pageSize } = useQuery();
  const location = useLocation();
  useEffect(() => {
    if (user && !user?.isAffiliate) {
      router.push('/');
      return;
    }
    const pageIndex = parseInt(page as string) || 1;
    const skip = (pageIndex - 1) * (parseInt(pageSize as string) || PAGE_LIMIT);
    const params: Parameters<typeof getAffliatedData>[0] = {
      skip,
      limit: parseInt(pageSize as string) || PAGE_LIMIT || 50,
      sort: 'createdAt',
      order: -1,
    };
    withLoader(getAffliatedData(params))
      .then((res) => {
        if (!!res.totalCount) {
          setPaginatedItems({ items: res.items, totalCount: res.totalCount });
        }
      })
      .catch((e) => {
        console.log(e);
        return {};
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);
  const PageSizeOptions = [
    // { label: '5', value: '5' },
    // { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ];

  const CustomSelect = (props: any) => {
    return (
      <>
        <Select
          {...props}
          isSearchable={false}
          options={PageSizeOptions}
          onChange={(value) =>
            props.onChange(value?.value || PageSizeOptions[0].value)
          }
          defaultValue={PageSizeOptions[0]}
          placeholder="Page Size"
          menuPlacement="top"
          styles={{ container: (base) => ({ ...base, width: '90px' }) }}
          value={{ label: props.value, value: props.value }}
        />
      </>
    );
  };
  CustomSelect.Option = 'option';
  const paginationProps = {
    total: paginatedItems.totalCount,
    current: parseInt(page as string) || 1,
    pageSize: parseInt(pageSize as string) || PAGE_LIMIT,
    onChange: (page: any, size: any) => {
      router.push({
        pathname: location.pathname,
        search: `page=${page}&pageSize=${size}`,
      });
    },
    nextIcon: <ArrowBack />,
    prevIcon: <ArrowBack />,
    showSizeChanger: false,
  };
  const link = `${window.location.host}/innercircle/${user?.username}`;
  return (
    <div className={className}>
      <div className="affiliate-header">
        <img src="/assets/images/innercircle-header.png" alt="banner" />
        <div className="header-text">
          <h2>Grow your inner circle</h2>
          <p>
            to grow your social revenue. Simply share your invitation code below
            and watch your social revenue grow!
          </p>
        </div>
      </div>

      <div className="live-link-bar mb-40">
        <div className="info-frame d-flex align-items-center">
          <div className="icon link-icon">
            <Stars />
          </div>
          <div className="link-link-info">
            <p>
              <strong>Your Invitation Link:</strong>
            </p>
            <p>
              <Link to="#">{link}</Link>
            </p>
          </div>
        </div>

        <Tooltip overlay={'Copied'} visible={copied} showArrow={false}>
          <span
            onClick={() => (copied ? {} : copy(`${link}`))}
            className="link-copy"
          >
            {!copied ? <Copy /> : <TickIcon />}
            {/* <span className="icon-url"></span>
          {copied ? 'Copied' : 'Copy'} */}
          </span>
        </Tooltip>
      </div>

      <h3>Partners Activity</h3>
      <div className="pagination-select-holder">
        {Number(paginationProps?.total) > 20 && (
          <>
            Showing
            <Pagination
              itemRender={() => <></>}
              selectComponentClass={CustomSelect}
              defaultPageSize={PAGE_LIMIT}
              onShowSizeChange={(current: any, size: any) => {
                router.push({
                  pathname: location.pathname,
                  search: `page=1&pageSize=${size}`,
                });
              }}
              nextIcon={<ChevronLeft />}
              prevIcon={<ChevronLeft />}
              showSizeChanger={true}
            />
          </>
        )}
      </div>
      {!!paginatedItems.items.length ? (
        <>
          <div className="transaction-table affiliated-program mb-30">
            <div className="table-body">
              {paginatedItems.items.map((item: any) => (
                <Link
                  to={`/${item?.childId?.username}`}
                  className="header-link-area__link"
                  target="_blank"
                  key={item._id}
                >
                  <ItemRow {...item} user={user} />
                </Link>
              ))}
            </div>
          </div>
          {Number(paginationProps?.total) > 5 && (
            <Pagination {...paginationProps} />
          )}
        </>
      ) : (
        <div style={{ maxWidth: '402px', margin: '0 auto' }}>
          <NewButton
            block
            type="primary"
            shape="circle"
            className="btn-disabled"
          >
            You currently do not have any Partners
          </NewButton>
        </div>
      )}
    </div>
  );
};

export default styled(Affiliate)`
  .link-icon {
    color: white;
    background: var(--pallete-primary-main);
    text-align: center;
    line-height: 40px;
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    margin-right: 12px;

    .sp_dark & {
      background: #c90e67;
    }

    svg {
      height: 30px;
      width: 30px;
    }
  }

  .link-copy {
    width: 20px;
    cursor: pointer;
    color: #fcfbff;
    transition: all 0.4s ease;

    &:hover {
      opacity: 0.4;
    }

    svg {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  h3 {
    font-size: 16px;
    line-height: 20px;
    margin: 0px 0px 21px;
    font-weight: 500;
  }

  .affiliate-header {
    position: relative;
    margin-bottom: 19px;

    img {
      width: 100%;
    }
    .header-text {
      position: absolute;
      color: white;
      bottom: 0;
      text-align: center;
      width: 100%;
      padding: 0 40px;

      p {
        font-size: 18px;
        font-weight: 400;
      }
    }
  }

  .pagination-select-holder {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 14px;

    .rc-pagination {
      margin: 0;

      li {
        padding: 0;
        &:empty {
          display: none;
        }
      }

      .react-select-container {
        width: 45px;
        margin: 0 0 0 3px;
      }

      .react-select__value-container {
        padding: 0;

        input {
          display: none;
        }
      }

      .react-select__indicators {
        width: auto;
        height: auto;
        padding: 0;
        position: static;
        background: none;
      }

      .react-select__single-value {
        position: static;
        transform: none;
      }

      .react-select__indicator {
        padding: 0;

        svg {
          width: 12px;
          height: auto;
        }
      }

      .react-select__control {
        border: none !important;
        background: none;
        padding: 0;
        min-height: inherit;
      }

      .react-select__menu {
        min-width: 68px;
        border-radius: 8px;
        overflow: hidden;
      }
    }
  }

  .live-link-bar {
    position: relative;
    @media (max-width: 767px) {
      display: flex;
      padding-bottom: 10px;
    }

    .info-frame {
      @media (max-width: 767px) {
        width: auto;
        padding: 0 10px 0 0;
        margin: 0;
      }
    }
  }

  .transaction-table {
    .table-row {
      border: none;
      padding: 8px 15px 8px 12px;
      align-items: center;

      @media (max-width: 767px) {
        align-items: flex-start;
      }

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
      }

      &:hover {
        .sp_dark & {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      .text {
        width: auto;
        font-size: 14px;
        line-height: 16px;
        font-weight: 500;

        @media (max-width: 767px) {
          padding-top: 0;
        }
      }

      .top-row {
        @media (max-width: 767px) {
          display: block;
        }
      }

      .bottom-row {
        @media (max-width: 767px) {
          padding: 0;
          position: static;
        }
      }
    }

    .status {
      @media (max-width: 767px) {
        top: 2px;
      }
    }

    .price {
      margin: 0;
    }

    .note-text {
      padding: 0;
      font-size: 12px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.6);

      &:before {
        display: none;
      }
    }

    .icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      margin: 0 12px 0 0;
    }
  }
`;

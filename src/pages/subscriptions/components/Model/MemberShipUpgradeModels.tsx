import { getSubscriptionIdByUserId } from 'api/sales';
import { FireIcon, Spinner } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import Button from 'components/NButton';
import Model from 'components/modal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PostTierTypes } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { forwardRef, useEffect, useState } from 'react';
import { onToggleModal } from 'store/reducer/changeMembershipModal';
import { getUserMembershops } from 'store/reducer/salesState';
import styled from 'styled-components';
import MemberShipUpgrade from './MemberShipUpgrade';
dayjs.extend(utc);

type IMemberShipsUpgrade = {
  item?: any;
  selectedVariation?: any;
  className?: string;
  isOpen?: boolean;
  post?: boolean;
  isAllusersWall?: boolean;
  onClose?: (...args: any[]) => void;
  cbSubmit?: (...args: any[]) => void;
  user?: any;
};

const MemberShipUpgradeModels = forwardRef(
  (
    {
      className,
      item,
      onClose,
      selectedVariation,
      isOpen,
      user,
      cbSubmit,
      post = true,
      isAllusersWall,
    }: IMemberShipsUpgrade,
    ref: any,
  ) => {
    const selectedSubscription = useAppSelector(
      (state) => state.mysales.selectedSubscription,
    );
    const [priceVariations, setPriceVariations] = useState([]);
    const [openupModel, setOpenupModel] = useState(false);
    const [openupupgreadeModel, setOpenupgradeModel] = useState(false);
    const [selectedTier, setSelectedTier] = useState<any>();
    const [subsciption, setUserSubsciption] = useState<any>(null);

    const [isLoading, setIsloading] = useState<any>();

    const dispatch = useAppDispatch();
    const getSubscriptonById = async (id: string) => {
      await getSubscriptionIdByUserId(
        id,
        {},
        {
          ignoreStatusCodes: [404, 500],
        },
      )
        .then((data) => {
          setUserSubsciption(data);
        })
        .catch((e) => {
          console.log({ e });
        });
    };
    useEffect(() => {
      setOpenupModel(!!isOpen);
      setOpenupgradeModel(!!isOpen);
      if (isOpen) {
        setIsloading(true);
        if (post) {
          let userId = item?.userId?._id;
          if (!userId) {
            userId = item?.userId;
          }
          dispatch(
            getUserMembershops({
              id: userId,
              callback: async (data) => {
                const { meberships = [] } = data;
                const memberships: any[] = [];
                if (isAllusersWall) {
                  try {
                    await getSubscriptonById(userId);
                  } catch (error) {}
                }
                const freeToView = item?.membershipAccessType
                  ?.map((m: any) => {
                    const arch = meberships.find(
                      (e: Record<string, any>) => e._id === m.membershipId,
                    );
                    if (arch) {
                      return {
                        ...arch,
                        isArchive: !!arch.isArchive,
                        accessType: m?.accessType || PostTierTypes.free_to_view,
                      };
                    }
                    return {};
                  })
                  ?.filter(
                    (e: any) =>
                      !e?.isArchive &&
                      e?.accessType === PostTierTypes.free_to_view,
                  );

                if (freeToView?.length) {
                  freeToView.forEach((pr: any) => {
                    pr.price = getDiscountedValue(pr?.price || 0);
                    memberships.push(pr);
                  });
                  setPriceVariations(memberships as any);
                }
                setIsloading(false);
              },
              customError: {
                ignoreStatusCodes: [404],
              },
            }),
          )
            .then((e) => {
              if (e.meta.requestStatus === 'rejected') {
                setIsloading(false);
                setPriceVariations([]);
              }
            })
            .catch((e) => {
              setIsloading(false);
              console.log(e);
            });
        } else {
          dispatch(
            getUserMembershops({
              id: user?.sellerId?._id || user?.seller?._id,
              callback: (data) => {
                const { meberships = [] } = data;
                if (meberships.length) {
                  const item = meberships
                    ?.filter((m: any) => !m?.isArchive)
                    .filter((m: any) => m._id !== selectedVariation);
                  item.price = getDiscountedValue(item.price);
                  setPriceVariations(item as any);
                }
                setIsloading(false);
              },
              customError: {
                ignoreStatusCodes: [404],
              },
            }),
          )
            .then((e) => {
              if (e.meta.requestStatus === 'rejected') {
                setIsloading(false);
                setPriceVariations([]);
              }
            })
            .catch((e) => {
              setIsloading(false);
              console.log(e);
            });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, selectedVariation]);
    const getDiscountedValue = (membershipAccessTypePrice: any) => {
      if (membershipAccessTypePrice === 0)
        return membershipAccessTypePrice.toFixed(2);
      const Diff = dayjs(
        selectedSubscription?.periodEnd || subsciption?.periodEnd,
      )
        .utc()
        .diff(dayjs.utc(), 'days');
      const price = item?.membership?.price; // membership.price
      const discount = (price / 30) * (Diff > 0 ? Diff : 0);
      const newMebershipPrice = membershipAccessTypePrice;
      const discountAmount =
        newMebershipPrice - discount < 0 ? 0 : newMebershipPrice - discount;
      return discountAmount;
    };
    const handleClose = () => {
      dispatch(
        onToggleModal({
          isModalOpen: false,
        }),
      );
      onClose?.(false);
      setOpenupModel(false);
      setOpenupgradeModel(false);
    };

    const toggleUpgrade = (selectedItem: any) => {
      setSelectedTier(selectedItem);
      setOpenupgradeModel(!openupupgreadeModel);
    };
    const closeConfirm = () => {
      handleClose();
    };
    const selecteditemkey = Object.keys(selectedTier || {});
    return (
      <div className={className} ref={ref}>
        <Model
          className={className}
          isOpen={openupModel}
          title={
            <div className="title-holder user_list">
              <span className="title-area">
                <span className={`title-icon`}>{<FireIcon />}</span>
                <span className="title-text">{'MEMBERSHIP CHANGE'}</span>
              </span>
            </div>
          }
          showFooter={false}
          onClose={handleClose}
        >
          {isLoading ? (
            <div className="loader-holder">
              <Spinner color="var(--pallete-primary-main)" />
            </div>
          ) : !!priceVariations?.length ? (
            <>
              {openupupgreadeModel ? (
                <MemberShipUpgrade
                  toggleUpgrade={toggleUpgrade}
                  items={priceVariations}
                  onClose={handleClose}
                />
              ) : (
                <div className="detail-area">
                  <div className="membership-area">
                    <strong className="title">
                      Are you sure you want to change your membership?
                    </strong>
                    <div className="profile-detail">
                      <div className="profile-image">
                        <ImageModifications
                          imgeSizesProps={{
                            onlyMobile: true,

                            imgix: { all: 'w=163&h=163' },
                          }}
                          src={
                            user?.sellerId?.profileImage ||
                            user?.seller?.profileImage ||
                            '/assets/images/default-profile-pic.png'
                          }
                          fallbackUrl={'/assets/images/default-profile-pic.png'}
                          alt="user"
                        />
                      </div>
                      <strong className="user-name">
                        {(user?.sellerId?.pageTitle ||
                          user?.seller?.pageTitle) ??
                          'Incognito User'}
                      </strong>
                      {!!selecteditemkey.length && (
                        <Button
                          shape="circle"
                          type="primary"
                          className="price-btn"
                          size="middle"
                        >
                          $
                          {Number(
                            selectedTier?.[selecteditemkey?.[0]]?.price || 0,
                          )?.toFixed(2)}
                        </Button>
                      )}

                      <span className="duration">30 Days</span>
                    </div>
                  </div>
                  <div className="action_buttons">
                    <Button
                      onClick={closeConfirm}
                      className="btn-note"
                      size="small"
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={() => {
                        cbSubmit?.(item?._id, selecteditemkey);
                        handleClose();
                      }}
                      className="btn-note"
                      size="small"
                    >
                      YES, CHANGE
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <Button disabled block shape="circle">
                No variation available...
              </Button>
            </div>
          )}
        </Model>
      </div>
    );
  },
);

export default styled(MemberShipUpgradeModels)`
  max-width: 493px;

  .modal-header {
    padding: 20px 24px 13px;
    border-bottom-color: #e6ecf1;

    .title-icon {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
      width: 14px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .title-text {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .modal-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;

    .title-holder {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .modal-body {
    padding: 0;
  }

  .action_buttons {
    display: flex;
    justify-content: flex-end;
    padding: 13px 16px;
    border-top: 1px solid #e6ecf1;

    .button {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 0;
    }
  }

  .btn-note {
    color: #357ea9;
    text-transform: uppercase;
    background: transparent;
    padding: 3px 10px;

    &:hover {
      color: #fff;
    }

    &.button-sm {
      padding: 3px 10px;
    }

    svg {
      width: 14px;
    }
  }

  .loader-holder {
    padding: 20px;
    text-align: center;
  }

  .membership-area {
    padding: 23px 20px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    max-height: calc(100vh - 170px);
    overflow: auto;

    .title {
      display: block;
      color: #050505;
      margin: 0 0 23px;
      font-weight: 400;

      .sp_dark & {
        /* color: #fff; */
      }
    }

    .profile-detail {
      background: #f4f6f9;
      border-radius: 4px;
      padding: 15px;

      .price-btn {
        cursor: default;
        pointer-events: none;
      }
    }

    .profile-image {
      border: 2px solid #fff;
      width: 54px;
      height: 54px;
      border-radius: 100%;
      margin: 0 auto 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-name {
      display: block;
      font-weight: 500;
      margin: 0 0 4px;
    }

    .button {
      min-width: 103px;
      padding: 6px 10px;
    }
  }

  .duration {
    display: block;
    font-size: 14px;
    line-height: 18px;
    padding: 10px 0 0;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);

    .sp_dark & {
      /* color: rgba(255, 255, 255, 0.85); */
    }
  }
  .loader-holder {
    padding: 20px;
    text-align: center;
  }
`;

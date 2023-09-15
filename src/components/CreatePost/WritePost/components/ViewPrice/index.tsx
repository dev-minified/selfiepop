import { Dollar } from 'assets/svgs';
import { default as FocusInput } from 'components/focus-input';
import Select from 'components/Select';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
interface Props {
  className?: string;
  onChangeMemberShips?: (...args: any[]) => void;
  initialMemberships?: any;
}
const MemberAccessLevels = [
  { label: 'Free to View', value: 'free_to_view' },
  { label: 'Pay to View', value: 'pay_to_view' },
  { label: 'Hidden', value: 'hidden' },
];
const ViewPrice: React.FC<Props> = ({
  className,
  onChangeMemberShips,
  initialMemberships,
}) => {
  const memberships = useAppSelector((state) => state.mysales.userMemberships);
  const [filters, setFilters] = useState<any>({});
  useEffect(() => {
    onChangeMemberShips?.(filters);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => {
    if (initialMemberships) {
      const obj: any = {};
      initialMemberships?.forEach((items: any) => {
        const accessType = MemberAccessLevels.find(
          (m) => m.value === items?.accessType,
        );
        obj[items.membershipId] = {
          ...accessType,
          viewPrice: items?.viewPrice,
        };
      });
      if (memberships && !!memberships.memberShips?.length) {
        memberships.memberShips.forEach((m) => {
          if (!obj[m?._id || '']) {
            obj[m._id || ''] = {
              viewPrice: 0,
              ...MemberAccessLevels[0],
            };
          }
        });
      }
      setFilters((prev: any) => ({
        ...prev,
        ...obj,
      }));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMemberships]);

  useEffect(() => {
    if (!initialMemberships) {
      const obj: Record<string, any> = {};
      memberships?.memberShips?.forEach((m) => {
        obj[m._id!] = {
          viewPrice: 0,
          ...MemberAccessLevels[0],
        };
      });
      setFilters((prev: any) => ({ ...prev, ...obj }));
    }
  }, [memberships, initialMemberships]);
  return (
    <div className={`${className} price-box`}>
      {memberships?.memberShips?.map((m) => {
        const { viewPrice = 0, ...rest } = filters?.[m?._id || ''] || {};
        return (
          <div className="price-selection-area" key={`${m.title}-${m?._id}`}>
            <span className="selection-title">{m.title}:</span>
            <div className="select-wrap">
              <div className="select-holder">
                <Select
                  isSearchable={false}
                  options={MemberAccessLevels}
                  onChange={(value) => {
                    const newValues: any = value;
                    if (value?.value === 'pay_to_view') {
                      newValues!['viewPrice'] = 0;
                    }
                    setFilters((prev: any) => ({
                      ...prev,
                      [m?._id || '']: { ...newValues },
                    }));
                  }}
                  defaultValue={MemberAccessLevels[0]}
                  placeholder="Select"
                  styles={{
                    container: (base) => ({ ...base, width: '90px' }),
                  }}
                  value={rest.value ? rest : undefined}
                />
              </div>
              {rest.value && rest.value === 'pay_to_view' && (
                <div className="price-holder">
                  <FocusInput
                    inputClasses="mb-25"
                    hasIcon={true}
                    id="price"
                    name="price"
                    type="number"
                    icon={<Dollar />}
                    validations={[{ type: 'number' }]}
                    materialDesign
                    onChange={(e) => {
                      e.target.valueAsNumber > 0 &&
                        setFilters((prev: any) => ({
                          ...prev,
                          [m?._id || '']: {
                            ...prev?.[m?._id || ''],
                            viewPrice: Number(e.target.value),
                          },
                        }));
                    }}
                    value={`${viewPrice}`}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default styled(ViewPrice)`
  margin: 0 -20px;
  background: var(--pallete-background-gray-secondary-light);
  border-top: 1px solid var(--pallete-colors-border);
  font-weight: 400;

  .modal-content & {
    background: rgb(249, 250, 252);
    border-top: 1px solid rgb(230, 236, 245);
  }

  @media (max-width: 479px) {
    margin: 0 -15px;
  }

  .selection-title {
    font-size: 13px;
    line-height: 17px;
    color: #8c8c8c;
    margin: 0 15px 0 0;
    text-transform: capitalize;
  }

  .price-selection-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 45px;
    padding: 5px 20px;
    border-bottom: 1px solid var(--pallete-colors-border);
    justify-content: space-between;

    .modal-content & {
      border-bottom: 1px solid rgb(231, 235, 244);
    }

    @media (max-width: 479px) {
      flex-wrap: wrap;
      padding: 5px 15px;
    }

    &:last-child {
      border-bottom: none;
    }

    .price-holder {
      width: 108px;
      margin: 0 0 0 10px;

      .text-input {
        margin-bottom: 0 !important;
      }
    }

    .select-wrap {
      display: flex;
      align-items: center;
      width: auto;
      margin: 0;

      @media (max-width: 479px) {
        padding: 5px 0 0;
      }
    }

    .react-select__control {
      border-radius: 40px;

      .react-select__indicator-separator {
        display: none;
      }

      .react-select__indicators {
        width: 28px;
        height: 28px;
        background: none;
      }
    }

    .select-holder {
      width: 113px;
      .react-select-container {
        width: 100%;
      }

      .title {
        display: none;
      }

      .select-item {
        width: 100%;
      }

      .sort-box {
        width: 100% !important;
      }

      .select-box {
        width: 100%;
      }
    }

    .text-input.ico-input {
      .icon {
        font-size: 0;
        width: 20px;
        left: 5px;
      }

      .form-control {
        padding-left: 30px;
        padding-right: 17px !important;
        height: 40px;

        text-align: right;
        border-color: var(--pallete-colors-border);
      }
    }

    .react-select__value-container {
      font-size: 12px;
      font-weight: 500;
    }

    .react-select__control {
      border-color: #e6ecf5;
      min-height: 30px;

      .modal-content & {
        border-color: #e6ecf5 !important;
      }

      .css-1okebmr-indicatorSeparator {
        background-color: #e6ecf5 !important;
      }
    }

    .react-select__menu {
      overflow: hidden;
      border: 1px solid var(--pallete-colors-border);
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      background: #fff;

      .modal-content & {
        border: 1px solid #e6ebf5;
      }

      .react-select__menu-list {
        padding: 5px;
      }

      .react-select__option {
        background: none;
        color: #8d778d;
        padding: 6px 10px;
        min-width: inherit;
        margin: 0;
        text-align: left;
        font-size: 12px;
        line-height: 15px;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;

        &:hover:not(.react-select__option--is-selected),
        &.react-select__option--is-focused:not(
            .react-select__option--is-selected
          ) {
          color: var(--pallete-text-secondary-100);
          background: rgba(230, 236, 245, 0.62);

          .modal-content & {
            color: #49718f;
          }
        }

        &.react-select__option--is-selected {
          color: var(--pallete-text-secondary-100);
          background: none;

          .modal-content & {
            color: #49718f;
          }
        }
      }
    }
  }
`;

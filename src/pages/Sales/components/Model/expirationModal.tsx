import { ExpiratinIcon } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect, useState } from 'react';
import { onToggleModal } from 'store/reducer/statisticsModelState';
import styled from 'styled-components';

dayjs.extend(utc);

type ExpirationModalProps = {
  onSave?: (...args: any[]) => void;
  title?: string;
  subTitle?: string;
  className?: string;
  expireTime?: string;
  expireDays?: string;
  onCancel?: (...args: any[]) => void;
  onClose?: (...args: any[]) => void;
};
const arrtags = [
  {
    limit: 'No limit',
  },
  {
    limit: 1,
  },
  {
    limit: 3,
  },
  {
    limit: 7,
  },
  {
    limit: 30,
  },
];
function ExpirationModal({
  onSave,
  className,
  onClose,
  expireTime: exTime,
  expireDays,
}: ExpirationModalProps) {
  const [expireTime, setExpireTime] = useState<any>();
  const [days, setDays] = useState<any>();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.stateModal.isModalOpen);
  useEffect(() => {
    if (isOpen) {
      const date = dayjs.utc(exTime);
      isOpen && setExpireTime(exTime !== '' ? date.local().format() : '');
      if (Number(expireDays)) {
        setDays(Number(expireDays));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setExpireTime('');
    setDays('');
    onClose?.();
    dispatch(onToggleModal({ post: {}, isModalOpen: false }));
  };
  const setTime = (daysToExtend: number) => {
    const days = dayjs().add(daysToExtend, 'day').utc().format();
    setExpireTime(days);
    setDays(daysToExtend);
  };

  const onOk = () => {
    onSave?.(expireTime === 'No limit' ? '' : expireTime, `${days}`);
    handleClose();
  };
  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          showFooter={true}
          onOk={onOk}
          className={`${className}`}
          title={
            <>
              <span className="img-title img-delete">
                <ExpiratinIcon />
              </span>{' '}
              EXPIRATION PERIOD
            </>
          }
        >
          <FocusInput
            value={days}
            hasIcon={false}
            onChange={(e) => {
              setTime(e.target.value);
            }}
            inputClasses="mb-10"
            materialDesign
            validations={[{ type: 'number' }]}
          />
          <span className="duration-title">
            Select duration or enter total days
          </span>

          <ul className="duration-tags-list">
            {arrtags.map((e, ind) => {
              return (
                <li key={ind} className={days === e.limit ? `active` : ''}>
                  <span
                    className="duration-tag"
                    onClick={() => {
                      if (e.limit === 'No limit') {
                        setExpireTime('');
                        setDays('No limit');
                      } else {
                        setTime(e?.limit as number);
                      }
                    }}
                  >{`${e.limit} ${
                    ind > 0 ? (e.limit > 1 ? 'days' : 'day') : ''
                  }`}</span>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </>
  );
}
export default styled(ExpirationModal)`
  max-width: 413px;
  margin-left: auto;
  margin-right: auto;

  .modal-content {
    padding: 25px 20px;
    font-weight: 400;
  }

  .modal-header {
    padding: 0 0 12px;
    border: none;
  }

  .modal-body {
    padding: 0;
  }

  .modal-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;
      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
  }

  .modal-content-holder {
    font-size: 16px;
    line-height: 1.375;
    font-weight: 400;
    color: #495057;
  }

  .text-input {
    max-width: 272px;
  }

  .duration-title {
    display: block;
    font-size: 12px;
    line-height: 16px;
    margin: 0 0 8px;
    color: #8c8c8c;
  }

  .duration-tags-list {
    margin: 0 -4px;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    li {
      margin: 0 3px;
      &.active {
        .duration-tag {
          background: #255b87;
          border-color: #255b87;
          color: #fff;
        }
      }
    }

    .duration-tag {
      display: inline-block;
      vertical-align: top;
      border: 2px solid #d7ebf2;
      padding: 4px 12px;
      font-size: 14px;
      line-height: 18px;
      color: #000;
      font-weight: 500;
      transition: all 0.4s ease;
      border-radius: 30px;
      margin: 0 0 6px;
      cursor: pointer;

      &:hover {
        background: #255b87;
        border-color: #255b87;
        color: #fff;
      }
    }
  }

  .modal-footer {
    padding: 20px 0 0;
  }

  .button {
    &.button-sm {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      padding: 5px 10px;
      color: #000;
      border: none;
      &:hover {
        background: var(--pallete-primary-main);
        color: #fff;
        border: none;
      }
      &.button-close {
        color: rgba(0, 0, 0, 0.4);
        &:hover {
          color: #fff;
        }
      }
    }
  }
`;

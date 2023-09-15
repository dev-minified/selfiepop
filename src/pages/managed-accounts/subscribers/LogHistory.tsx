import { Search } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Pagination from 'components/pagination';
import { Card } from 'components/PrivatePageComponents';
import Select from 'components/Select';
import Tag from 'components/Tag';
import dayjs from 'dayjs';
import { RuleTriggerEvent } from 'enums';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
};

const eventOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'After Member First Joins',
    value: RuleTriggerEvent.MembershipJoin,
  },
  {
    label: 'After Tag is Added',
    value: RuleTriggerEvent.TagAdded,
  },
  {
    label: 'After Tag is Removed',
    value: RuleTriggerEvent.TagRemoved,
  },
];

const Log: React.FC<{ log: SubscriptionLog }> = (props) => {
  const { log } = props;
  const ruleTrigger: RuleMetadata['trigger'] = log?.metadata?.trigger;

  return (
    <Card cardClass="card-tasks">
      <Card.Header>
        {ruleTrigger?.event
          ?.split('_')
          .map((word: string) => word[0]?.toUpperCase() + word.slice(1))
          .join(' ')}
        <Tag
          className="log-tag"
          closeAble={false}
          showCloseIcon={false}
          label={
            ruleTrigger?.event === RuleTriggerEvent.MembershipJoin
              ? ruleTrigger?.membershipType
              : ruleTrigger?.tag
          }
          checked={false}
        />
      </Card.Header>
      <Card.Body>
        <div className="card-description">
          <div className="text">
            <>
              <span>Rule ID#: </span>
              <span className="text-highlighted">{log.ruleSlug}</span>
            </>
          </div>
          <div className="text date-txt">
            <span>Execution Date:</span>{' '}
            <span className="text-highlighted">
              {dayjs(log.executionTime).format('MM/DD/YYYY HH:mm:ss A')}
            </span>
          </div>
        </div>
        <div className="card-task-area">
          <strong className="task-title">Logs</strong>
          <p>
            <ul className="logs-list">
              {log.executionSteps?.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

const LogHistory: React.FC<Props> = (props) => {
  const { className } = props;

  const logHistory = useAppSelector((state) => state.chat.logHistory);

  const [page, setPage] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>(
    eventOptions[0].value,
  );
  const [logs, setLogs] = useState<SubscriptionLog[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [paginatedResult, setPaginatedResult] = useState<SubscriptionLog[]>([]);
  useEffect(() => {
    if (logHistory) {
      if (searchText) {
        const filteredLogs = logHistory.filter((log) => {
          const ruleTrigger: RuleMetadata['trigger'] = log?.metadata?.trigger;
          return (
            searchText.includes(log.ruleSlug.toLowerCase()) ||
            ruleTrigger?.tag
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            ruleTrigger?.membershipType
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          );
        });
        setLogs(filteredLogs);
        return;
      }

      if (selectedOption === 'all') {
        setLogs(logHistory);
      } else {
        setLogs(
          logHistory.filter(
            (log) => log.metadata?.trigger?.event === selectedOption,
          ),
        );
      }
    }
  }, [logHistory, selectedOption, searchText]);

  useEffect(() => {
    setPage(1);
    if (page === 1) {
      setPaginatedResult(logs?.slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

  useEffect(() => {
    setPaginatedResult(logs?.slice((page - 1) * 10, page * 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className={className}>
      <div className="logs-block">
        <div className="fields-wrap mb-20">
          <div className="search-area">
            <div className="search_from">
              <FocusInput
                disableFloatingLabel={false}
                placeholder="Rule ID or Tag or Membership Type"
                type="text"
                icon={<Search />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              <Select
                isSearchable={false}
                type="compact"
                value={eventOptions?.find(
                  (option) => selectedOption === option.value,
                )}
                options={eventOptions}
                onChange={(e) => {
                  const value = `${e?.value}`;
                  setSelectedOption(value);
                }}
                size="small"
              />
            </div>
          </div>
        </div>
        <div className="table-body">
          {paginatedResult?.map((log) => (
            <Log key={log.slug} log={log} />
          ))}
        </div>
        <Pagination
          total={logs?.length || 0}
          pageSize={10}
          current={page}
          onChange={(page) => {
            setPage(page);
          }}
        />
      </div>
    </div>
  );
};

export default styled(LogHistory)`
  .logs-block {
    .fields-wrap {
      display: flex;
      flex-direction: row;

      .button-icon-only {
        width: 44px;
        height: 44px;
        margin-right: 5px;
        background: #e6eaf5;
        border-color: #e6eaf5;

        svg {
          path {
            fill: var(--pallete-text-main-550);
          }
        }
      }

      .text-input {
        margin: 0 !important;

        .icon {
          color: #a7b0ba;
          height: 28px;
          left: auto;
          right: 8px;

          path {
            fill: #a7b0ba;
          }
        }
      }

      .search-area {
        flex-grow: 1;
        flex-basis: 0;
      }

      .form-control {
        height: 30px;
        background: var(--pallete-background-default);
        border: 1px solid #d4dee8;
        border-radius: 8px;
        border-radius: 30px;
        font-size: 13px;
        line-height: 16px;
        padding: 6px 50px 6px 17px;

        &:focus {
          padding-left: 17px;
        }

        &::placeholder {
          color: rgba(167, 176, 186, 0.63);
        }
      }
    }

    .search_from {
      display: flex;
      flex-direction: row;

      .text-input {
        flex-grow: 1;
        flex-basis: 0;
      }

      .sm.compact {
        width: 160px;
        margin-left: 10px;
      }
    }

    .react-select__value-container {
      font-size: 12px;
      font-weight: 500;
      padding: 0 8px;
    }

    .react-select__control {
      border-radius: 40px;
      border-color: #d9e2ea;
      min-height: 28px;
      .react-select__indicator-separator {
        display: none;
      }

      .react-select__indicators {
        width: 28px;
        height: 28px;
        background: none;
      }
    }

    .react-select__menu {
      overflow: hidden;
      border: 1px solid var(--pallete-colors-border);
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.08);
      border-radius: 4px;

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
        }

        &.react-select__option--is-selected {
          color: var(--pallete-text-secondary-100);
          background: none;
        }
      }
    }

    .card-Header {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .logs-list {
      padding-left: 18px;

      li::marker {
        font-size: 16px;
      }
    }

    .log-tag {
      margin-left: 10px;

      .label-text {
        padding: 4px 10px 4px 10px;
      }
    }

    .card-tasks {
      margin: 0 0 25px;

      .card-Header {
        font-weight: 500;
        font-size: 15px;
      }

      .card-body {
        padding: 20px 22px;

        p {
          margin: 0 0 16px;
        }
      }

      .card-description {
        position: relative;
        overflow: hidden;
        font-size: 13px;
        line-height: 20px;
        color: var(--pallete-text-light-50);
      }
    }

    .card-task-area {
      background: var(--pallete-background-secondary-light);
      border-radius: 4px;
      padding: 14px 15px 10px;
      margin: 0 -10px 13px;

      p {
        min-height: 50px;
        color: var(--pallete-text-light-50);
        font-size: 13px;
        line-height: 20px;
        margin: 0 0 10px;
        font-weight: 400;
      }

      .task-completed {
        color: var(--pallete-primary-main);
      }
    }

    .button.button-sm {
      font-size: 15px;
      min-width: 150px;
    }

    .task-title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      margin: 0 0 15px;
    }

    .btn-holder {
      padding: 20px 0 0;
    }

    .task-completed {
    }

    .task-completed {
      display: block;
      font-weight: 500;
      margin: 0;
      font-size: 12px;
      line-height: 15px;
    }
  }
`;

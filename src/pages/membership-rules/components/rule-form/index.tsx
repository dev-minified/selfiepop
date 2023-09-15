import { GetMembershipsTiers } from 'api/sales';
import { MessageSendIcon, ProfileIcon } from 'assets/svgs';
import classNames from 'classnames';
import Error from 'components/Error';
import NewButton from 'components/NButton';
import Select from 'components/Select';
import FocusInput from 'components/focus-input';
import EditBack from 'components/partials/components/profileBack';
import { RuleTriggerEvent } from 'enums';
import { useFormik } from 'formik';
import { AnimatePresence, Variants } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useRequestLoader from 'hooks/useRequestLoader';
import PageTransition from 'layout/page-transition';
import cloneDeep from 'lodash/cloneDeep';
import React, { useEffect, useState } from 'react';
import { setHeaderProps } from 'store/reducer/headerState';
import styled from 'styled-components';
import * as yup from 'yup';
import Listing from './Listing';
import MessageEditor from './MessageEditor';
import PostEditor from './PostEditor';
import Tagger from './Tagger';
import TaskEditor from './TaskEditor';

const rtr = {
  pageInitial: {
    opacity: 0,
    left: '660px',
  },
  pageAnimate: {
    opacity: 1,
    left: '0',
  },
  pageExit: {
    opacity: 0,
    left: '660px',
    position: 'absolute',
  },
};
const ltl = {
  pageInitial: {
    opacity: 0,
    left: '-660px',
  },
  pageAnimate: {
    opacity: 1,
    left: '0',
  },
  pageExit: {
    opacity: 0,
    left: '-660px',
    position: 'absolute',
  },
};

type Props = {
  className?: string;
  value?: RuleMetadata;
  onSave: (rule: RuleMetadata) => Promise<unknown>;
  onCancel: () => void;
  showHeader?: boolean;
  backUrl?: string;
  managedAccountId?: string;
};

const eventOptions = [
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

const validationSchema = yup.object().shape({
  title: yup.string().max(500).required('title is required!'),
  trigger: yup
    .object({
      event: yup.string().required('Event is required!'),
      daysToWait: yup.number().min(0, 'Must be greater than or equal to 0'),
    })
    .required('Trigger is required!'),
});

const RuleForm: React.FC<Props> = (props) => {
  const {
    className,
    value,
    onSave,
    onCancel,
    showHeader = true,
    backUrl,
    managedAccountId,
  } = props;
  const managedUsers = useAppSelector(
    (state) => state.managedUsers.item?.permissions,
  );
  const headerTitle = useAppSelector((state) => state.header.title);
  const { withLoader } = useRequestLoader();
  const [memberships, setMemberships] = useState<any>([]);
  const [view, setView] = useState<{
    type: 'message' | 'post' | 'task';
    index?: number;
  }>();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    isSubmitting,
    setErrors,
  } = useFormik<RuleMetadata | {}>({
    validationSchema,
    initialValues: value || {},
    onSubmit: async (v) => {
      const updatedValues = v as RuleMetadata;
      if (
        updatedValues.trigger.event === RuleTriggerEvent.MembershipJoin &&
        !updatedValues.trigger.membershipType
      ) {
        setErrors({
          trigger: {
            membershipType: 'Membership type is required!',
          },
        });
        return;
      } else if (
        [RuleTriggerEvent.TagAdded, RuleTriggerEvent.TagRemoved].includes(
          updatedValues.trigger.event,
        ) &&
        !updatedValues.trigger.tag
      ) {
        setErrors({ trigger: { tag: 'Tag is required!' } });
        return;
      }
      await onSave(updatedValues as RuleMetadata);
    },
  });

  const { title, conditions, actions, trigger } = values as RuleMetadata;
  const { daysToWait, event, membershipType, tag } = trigger || {};
  const {
    addTags = [],
    removeTags = [],
    addMessages = [],
    addPosts = [],
    addTasks = [],
  } = actions || {};
  const { excludedTags = [], includedTags = [] } = conditions || {};

  const eventType = eventOptions.find((e) => e.value === event);
  const membership = memberships.find((m: any) => m._id === membershipType);
  const dispatch = useAppDispatch();

  useEffect(() => {
    withLoader(
      GetMembershipsTiers({ sellerId: managedAccountId }).then((res) => {
        res?.meberships && setMemberships(res.meberships);
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managedAccountId]);

  useEffect(() => {
    if (value) {
      setValues(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const ShowMsgButton =
    managedUsers?.status === 'active' && managedUsers?.allowMessage;
  const ShowPostButton =
    managedUsers?.status === 'active' && managedUsers?.allowContent;
  return (
    <form
      className={classNames(className, 'rule-block')}
      onSubmit={handleSubmit}
    >
      <AnimatePresence initial={false}>
        {view?.type === 'post' && (
          <div key="add-post">
            <PageTransition variants={rtr as Variants}>
              <PostEditor
                onSave={(values) => {
                  if (values.title) {
                    if (view.index != null) {
                      const posts = [...addPosts];
                      posts.splice(view.index, 1, values as any);
                      setFieldValue('actions.addPosts', posts);
                    } else {
                      setFieldValue('actions.addPosts', [...addPosts, values]);
                    }
                    setView(undefined);
                  }
                }}
                onCancel={() => {
                  setView(undefined);
                }}
                value={view.index != null ? addPosts[view.index] : undefined}
                showHeader={showHeader}
                managedAccountId={managedAccountId}
              />
            </PageTransition>
          </div>
        )}
        {view?.type === 'task' && (
          <div key="add-post">
            <PageTransition variants={rtr as Variants}>
              <TaskEditor
                onSave={(values) => {
                  if (view.index != null) {
                    const tasks = [...addTasks];
                    tasks.splice(view.index, 1, values as any);
                    setFieldValue('actions.addTasks', tasks);
                  } else {
                    setFieldValue('actions.addTasks', [...addTasks, values]);
                  }
                  setView(undefined);
                }}
                onCancel={() => {
                  setView(undefined);
                }}
                showHeader={showHeader}
                value={view.index != null ? addTasks[view.index] : undefined}
                managedAccountId={managedAccountId}
              />
            </PageTransition>
          </div>
        )}
        {view?.type === 'message' && (
          <div key="add-message">
            <PageTransition variants={rtr as Variants}>
              <MessageEditor
                onSubmit={(message) => {
                  if (view.index != null) {
                    const messages = [...addMessages];
                    messages.splice(view.index, 1, message as any);
                    setFieldValue('actions.addMessages', messages);
                  } else {
                    setFieldValue('actions.addMessages', [
                      ...addMessages,
                      message,
                    ]);
                  }

                  setView(undefined);
                }}
                onCancel={() => {
                  setView(undefined);
                }}
                value={view.index != null ? addMessages[view.index] : undefined}
                showHeader={showHeader}
                managedAccountId={managedAccountId}
              />
            </PageTransition>
          </div>
        )}
        {!view && (
          <div key="rule-form">
            <PageTransition variants={ltl as Variants}>
              <div>
                {showHeader && (
                  <EditBack
                    title={
                      headerTitle === 'Edit Rule' ? 'Edit Rule' : 'Add Rule'
                    }
                    backUrl={backUrl || '/my-profile/members-content/rules'}
                  />
                )}
                <div className="heading-holder">
                  <FocusInput
                    materialDesign
                    label="Rule Title"
                    name="title"
                    className="mb-0"
                    id="title"
                    onChange={handleChange}
                    value={title}
                    error={(errors as RuleMetadata).title}
                    touched={true}
                  />
                </div>
                <div className="conditions-area">
                  <div className="condition-block">
                    <span className="heading-text">When This Happens</span>
                    <div className="variation-body">
                      <div className="field-holder">
                        <span className="label-title">
                          Choose Event Trigger
                        </span>
                        <Select
                          size="medium"
                          onChange={(value) =>
                            handleChange({
                              target: {
                                name: 'trigger.event',
                                value: value?.value,
                              },
                            })
                          }
                          value={eventType}
                          options={eventOptions}
                        />
                        {(errors as RuleMetadata)?.trigger?.event && (
                          <Error
                            message={(errors as RuleMetadata)?.trigger?.event}
                          />
                        )}
                      </div>
                      {eventType?.value === RuleTriggerEvent.MembershipJoin && (
                        <>
                          <div className="field-holder">
                            <span className="label-title">Membership Type</span>
                            <Select
                              size="medium"
                              onChange={(value) =>
                                handleChange({
                                  target: {
                                    name: 'trigger.membershipType',
                                    value: value?.value,
                                  },
                                })
                              }
                              value={{
                                value: membership?._id,
                                label: membership?.title,
                              }}
                              options={
                                memberships.map((m: any) => ({
                                  label: m.title,
                                  value: m._id,
                                })) || []
                              }
                            />
                            {(errors as RuleMetadata).trigger
                              ?.membershipType && (
                              <Error
                                message={
                                  (errors as RuleMetadata).trigger
                                    ?.membershipType
                                }
                              />
                            )}
                          </div>
                        </>
                      )}
                      {[
                        RuleTriggerEvent.TagAdded,
                        RuleTriggerEvent.TagRemoved,
                      ].includes(eventType?.value as RuleTriggerEvent) && (
                        <div className="field-holder">
                          <span className="label-title">Tags</span>
                          <Tagger
                            title={`If this tag is ${
                              eventType?.value === RuleTriggerEvent.TagAdded
                                ? 'added'
                                : 'removed'
                            }`}
                            name="trigger.tag"
                            onChange={(e) => {
                              setFieldValue(
                                'trigger.tag',
                                e.target.value?.[0] || '',
                              );
                            }}
                            value={[tag]}
                            limit={1}
                          />
                          {(errors as RuleMetadata).trigger?.tag && (
                            <Error
                              message={(errors as RuleMetadata).trigger?.tag}
                            />
                          )}
                        </div>
                      )}
                      <div className="field-holder">
                        <span className="label-title">Wait This Many Days</span>
                        <FocusInput
                          materialDesign
                          label=""
                          type="number"
                          min={0}
                          placeholder="Enter days to wait"
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: 'trigger.daysToWait',
                                value: e.target.value,
                              },
                            })
                          }
                          touched={true}
                          error={(errors as RuleMetadata).trigger?.daysToWait}
                          value={`${daysToWait}`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="condition-block">
                    <span className="heading-text">Check These Conditions</span>
                    <div className="variation-body">
                      <Tagger
                        title="If this tag is present"
                        name="conditions.includedTags"
                        onChange={handleChange}
                        value={includedTags}
                      />
                      <Tagger
                        title="If this tag is not present"
                        name="conditions.excludedTags"
                        onChange={handleChange}
                        value={excludedTags}
                      />
                    </div>
                  </div>
                  <div className="condition-block">
                    <span className="heading-text">
                      If Conditions are met, complete these actions
                    </span>
                    <div className="variation-body">
                      <Tagger
                        title="Add these tags"
                        name="actions.addTags"
                        onChange={handleChange}
                        value={addTags}
                      />
                      <Tagger
                        title="Remove these tags"
                        name="actions.removeTags"
                        onChange={handleChange}
                        value={removeTags}
                      />
                      {ShowPostButton ? (
                        <Listing
                          items={addPosts}
                          onAddClick={() => {
                            setView({ type: 'post' });
                            dispatch(
                              setHeaderProps({
                                title: 'Add Post',
                              }),
                            );
                          }}
                          onDeleteClick={(idx) => {
                            const posts = cloneDeep(addPosts);
                            posts.splice(idx, 1);

                            setFieldValue('actions.addPosts', posts);
                          }}
                          onEditClick={(idx) => {
                            dispatch(
                              setHeaderProps({
                                title: 'Edit Post',
                              }),
                            );
                            setView({ type: 'post', index: idx });
                          }}
                          bindings={{
                            title: 'title',
                            subtitle: 'description',
                          }}
                          title="Add Post(s)"
                          icon={<ProfileIcon />}
                        />
                      ) : null}
                      {ShowMsgButton ? (
                        <Listing
                          items={addMessages}
                          onAddClick={() => {
                            setView({ type: 'message' });
                            dispatch(
                              setHeaderProps({
                                title: 'Add Message',
                              }),
                            );
                          }}
                          onDeleteClick={(idx) => {
                            const messages = cloneDeep(addMessages);
                            messages.splice(idx, 1);

                            setFieldValue('actions.addMessages', messages);
                          }}
                          onEditClick={(idx) => {
                            dispatch(
                              setHeaderProps({
                                title: 'Edit Message',
                              }),
                            );
                            setView({ type: 'message', index: idx });
                          }}
                          bindings={{
                            title: 'messageValue',
                            subtitle: 'description',
                          }}
                          title="Send Message(s)"
                          icon={<MessageSendIcon />}
                        />
                      ) : null}
                      <Listing
                        items={addTasks}
                        onAddClick={() => {
                          setView({ type: 'task' });
                          dispatch(
                            setHeaderProps({
                              title: 'Add Task',
                            }),
                          );
                        }}
                        onDeleteClick={(idx) => {
                          const tasks = cloneDeep(addTasks);
                          tasks.splice(idx, 1);

                          setFieldValue('actions.addTasks', tasks);
                        }}
                        onEditClick={(idx) => {
                          setView({ type: 'task', index: idx });
                          dispatch(
                            setHeaderProps({
                              title: 'Edit Task',
                            }),
                          );
                        }}
                        bindings={{
                          title: 'taskTitle',
                          subtitle: 'taskDescription',
                        }}
                        title="Add Task(s)"
                        icon={<MessageSendIcon />}
                      />
                    </div>
                  </div>
                </div>
                <div className="footer-btns">
                  <NewButton
                    type="default"
                    size="large"
                    shape="circle"
                    onClick={onCancel}
                  >
                    Cancel
                  </NewButton>
                  <NewButton
                    htmlType="submit"
                    type="primary"
                    size="large"
                    shape="circle"
                    isLoading={isSubmitting}
                  >
                    Save
                  </NewButton>
                </div>
              </div>
            </PageTransition>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default styled(RuleForm)`
  background: var(--pallete-background-default);

  .heading-holder {
    padding: 20px 20px 0;
    border: 1px solid #eaeef1;

    .mb-20 {
      margin: 0;
    }
  }

  .conditions-area {
    padding: 23px 20px;
  }

  .condition-block {
    border-radius: 6px;
    border: 2px solid var(--pallete-primary-main);
    margin: 0 0 20px;

    .heading-text {
      display: block;
      background: var(--pallete-primary-main);
      padding: 18px 19px;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      color: #fff;
      margin: -1px 0 0;
    }
  }

  .variation-body {
    padding: 20px 20px 0;

    .field-holder {
      margin: 0 0 18px;

      &:last-child {
        margin: 0;
      }

      &:only-child {
        margin: 0 0 18px;
      }
    }
  }

  .label-title,
  .header-title {
    font-size: 13px;
    line-height: 16px;
    color: var(--pallete-text-light-50);
    font-weight: 500;
    margin: 0 0 10px;
    display: block;
  }

  .tags-area {
    margin: 0 0 18px;

    .label-area {
      margin: 0 !important;
    }

    .tagslist {
      margin: 0 !important;
      border: 1px solid #e6ecf1;
      padding: 3px 30px 3px 3px;
      margin: 4px;
      position: relative;

      .button {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
        color: #e6dee8;

        &:hover {
          color: var(--pallete-text-main);
        }

        svg {
          width: 19px;
          height: 19px;
        }
      }

      .form-control {
        font-size: 15px;
        line-height: 22px;
        font-weight: 500;
        border-left-color: rgba(186, 163, 193, 0.36);
        min-width: 135px !important;
        margin: 4px !important;
        flex-grow: 1;
        flex-basis: 0;

        &::placeholder {
          color: #c3c4d2;
        }
      }

      .tag {
        background: var(--pallete-primary-main);
        margin: 3px 4px;
        font-size: 15px;
        line-height: 18px;
        font-weight: 400;
        text-transform: none;
        padding: 7px 44px 7px 16px;

        .icon-close {
          right: 9px;
          font-size: 18px;
          width: 19px;
          height: 19px;
          line-height: 1;

          &:before {
            display: none;
          }

          svg {
            width: 100%;
            height: auto;
            vertical-align: top;
          }
        }
      }
    }

    .images-list {
      margin: 0 0 -6px;
    }

    .btn-media {
      font-size: 16px;
      line-height: 20px;
      font-weight: 700;
      background: #e6dee8;
      padding: 10px;
      color: #fff;

      &:hover {
        background: var(--pallete-primary-main);
        border-color: transparent;
      }

      svg {
        margin: -2px 15px 0 0;
      }
    }
  }

  /* .pop-card {
    padding: 0;
    border: none;
    margin: 0 0 20px;
  } */

  .addition__art {
    padding: 5px;
    border-radius: 5px;
    background: #e6ecf1;
    border: 1px solid #e6ecf1;
  }

  .card-dragable {
    padding: 10px;
    min-height: 50px;
    margin: 0 0 5px;

    .icon-holder {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
    }

    .icon {
      width: 37px;
      height: 37px;
      background: none;
      border-radius: 0;
      border: none;

      svg {
        width: 100%;

        rect {
          fill: var(--pallete-primary-main);
        }

        path {
          fill: #fff;
        }
      }
    }

    .left-section {
      position: relative;
      padding: 0 0 0 52px;
      display: block;
    }
  }

  .post_icon_list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    color: #92adc3;
    font-size: 13px;
    line-height: 16px;

    .sp_dark & {
      color: #fff;
    }

    path {
      .sp_dark & {
        fill: #fff;
      }
    }

    li {
      display: flex;
      align-items: center;
      margin: 0 13px 0 0;
    }

    .img {
      width: 16px;
      display: block;

      svg {
        display: block;
        width: 100%;
        height: auto;

        path {
          fill: #92adc3;
        }
      }
    }

    .text {
      padding: 0 0 0 8px;
    }
  }

  .card--title {
    display: block;
    font-size: 14px;
    line-height: 16px;
    color: var(--pallete-text-main-550);
    font-weight: 500;
    margin: 0 0 5px;
  }

  .btn-holder {
    text-align: center;
    padding: 5px 0;

    .button {
      margin: 0 !important;
    }
  }

  .footer-btns {
    text-align: center;
    border-top: 1px solid var(--pallete-colors-border);
    padding: 35px 20px;

    @media (max-width: 767px) {
      padding: 20px;
    }
  }
`;

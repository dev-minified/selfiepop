import { createTicket } from 'api/Support';
import { MEDIA_UPLOAD_STATUSES } from 'appconstants';
import FocusInput from 'components/focus-input';
import AdditionalArt from 'components/InlinePopForm/AdditionalArt';
import Modal from 'components/modal';
import NewButton from 'components/NButton';
import FileUploadReduxHoc from 'components/UploadWidget/FileUploadReduxHoc';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { ITicket } from 'interfaces/Ticket';
import { ReactElement, useEffect, useState } from 'react';
import { onFileUploadingCancelled, onRemoveGroup } from 'store/reducer/files';
import {
  addPendingMessage,
  removeFromPendingMessage,
  updatePendingMessage,
} from 'store/reducer/support';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';
import SupportFileContainer from './SupportFileContainer';
interface Props {
  onCreateTicketCallback: (ticket: ITicket) => void;
  className?: string;
}
const validationSchema = yup.object().shape({
  subject: yup.string().required('Subject field is required!'),
  description: yup.string().required('Description field is required!'),
});
const messageKey = uuid();
function SupportFooter({
  onCreateTicketCallback,
  className,
}: Props): ReactElement {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const uploadingGroup = useAppSelector((s) => s.fileGroups);
  const { pendingMessages } = useAppSelector((s) => s.support);
  const dispatch = useAppDispatch();

  const {
    isSubmitting,
    values,
    handleChange,
    errors,
    handleBlur,
    handleSubmit,
    touched,
    resetForm,
  } = useFormik({
    initialValues: {
      subject: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      createSupportTicket(values, []);
    },
  });
  const createSupportTicket = async (
    values: any,
    attachmentes: any[],
    groupId?: string,
  ) => {
    const res = await createTicket({
      issueTitle: values.subject,
      issueDescription: values.description,
      attachments: attachmentes?.filter(
        (f: any) => f?.status !== MEDIA_UPLOAD_STATUSES.CANCELLED,
      ),
    });
    if (res) {
      onCreateTicketCallback(res.ticket);
      resetForm();
    }
    setIsLoading(false);
    setIsTicketModalOpen(false);
    setIsSubmitFormOpen(true);
    groupId && dispatch(onRemoveGroup(groupId));
    groupId &&
      dispatch(
        removeFromPendingMessage({
          groupId: groupId,
        }),
      );
  };
  function checkStatus() {
    const messages = pendingMessages?.find((m) => m.groupId === messageKey);
    const isGroup = uploadingGroup[messages?.groupId || ''];
    if (isGroup) {
      if (isGroup?.status !== MEDIA_UPLOAD_STATUSES.CANCELLED) {
        dispatch(
          updatePendingMessage({
            groupId: messages?.groupId,
            ...isGroup,
            files: isGroup?.files
              ?.filter((f) => f.status !== MEDIA_UPLOAD_STATUSES.CANCELLED)
              .map((f) => ({ ...f, groupId: messages?.groupId })),
          }),
        );
      } else {
        dispatch(
          onRemoveGroup({
            groupId: messages?.groupId,
          }),
        );
        dispatch(
          removeFromPendingMessage({
            groupId: messages?.groupId,
          }),
        );
      }
    }
  }
  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadingGroup]);
  const pendingMessagess = pendingMessages?.find(
    (m) => m?.groupId === messageKey,
  );
  return (
    <FileUploadReduxHoc>
      {(files: any, onChange: any, { onSubmit }: { onSubmit: any }) => {
        const handlesubmit = () => {
          setIsLoading(true);
          if (!!files.length) {
            dispatch(
              addPendingMessage({
                groupId: messageKey,
                files: files,
                status: MEDIA_UPLOAD_STATUSES.IN_PROGRESS,
              }),
            );
            onSubmit({
              key: messageKey,
              // onSingleFileUpload: () => {
              //   onChange([]);
              // },
              onCompletedCallback: (uploadedFiles: any) => {
                createSupportTicket(
                  values,
                  uploadedFiles.files
                    .filter(
                      (f: any) => f?.status !== MEDIA_UPLOAD_STATUSES.CANCELLED,
                    )
                    .map((f: any) => ({
                      width: f.width || 0,
                      height: f.height || 0,
                      type: f.type,
                      path: f.url,
                      url: f.url,
                      size: f.size,
                      thumbnail: f.thumbnail,
                      name: f.name,
                      videoDuration: f.duration,
                    })),
                  uploadedFiles.key,
                );
              },
            });
          } else {
            handleSubmit();
          }
        };

        return (
          <div
            className={`${
              isTicketModalOpen
                ? 'ticket_modal'
                : isSubmitFormOpen
                ? 'thankyou-modal'
                : ''
            } ${className}`}
          >
            <div className="btn-holder">
              <NewButton
                block
                type="primary"
                shape="circle"
                onClick={() => {
                  onChange([]);
                  setIsTicketModalOpen(true);
                }}
              >
                Open a new Ticket
              </NewButton>
            </div>
            {(isTicketModalOpen || isSubmitFormOpen) && (
              <Modal
                styles={{
                  overlayStyle: {
                    overflow: 'auto',
                  },
                }}
                className="support-modal"
                onClose={() => {
                  setIsSubmitFormOpen(false);
                  setIsTicketModalOpen(false);
                }}
                title={!isSubmitFormOpen ? 'Support Ticket' : ''}
                showFooter={false}
                isOpen={isTicketModalOpen || isSubmitFormOpen}
              >
                {isTicketModalOpen && (
                  // <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mb-10">
                      <p>Please let us know how we can help!</p>
                      <h3 className="primary_title">Description</h3>
                      <p>
                        Please describe the issue you are having. Try to be as
                        detailed as possible.
                      </p>
                    </div>
                    <div className="subject">
                      <FocusInput
                        value={values.subject}
                        name="subject"
                        label={'Subject'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.subject}
                        touched={touched.subject}
                        materialDesign
                      />
                    </div>
                    <div className="description">
                      <FocusInput
                        value={values.description}
                        label={'Describe the issue'}
                        type="textarea"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        materialDesign
                        hasLimit={false}
                        error={errors.description}
                        touched={touched.description}
                        name="description"
                      />
                    </div>
                    <div className="mb-10 input-actions__img">
                      {pendingMessagess?.status ===
                      MEDIA_UPLOAD_STATUSES.IN_PROGRESS ? (
                        <AdditionalArt
                          value={pendingMessagess?.files?.map((f: any) => {
                            return {
                              ...f,
                              showProgressBar: true,
                              cbOnCancel: f?.requestToken?.cancel,
                              uploadingProgress: f?.progress,
                              tag: `${
                                f.size ? (f.size / (1024 * 1024)).toFixed(2) : 0
                              }MB`,
                            };
                          })}
                          onChange={(files: any, file: any) => {
                            if (
                              file.status !== MEDIA_UPLOAD_STATUSES.CANCELLED
                            ) {
                              dispatch(
                                onFileUploadingCancelled({
                                  groupId: file.groupId,
                                  fileId: file.id,
                                  status: MEDIA_UPLOAD_STATUSES.CANCELLED,
                                  callBack: ({
                                    groupId,
                                    groupFiles,
                                    isAllCancelled,
                                    isAllUploaded,
                                  }: CancelFileUploadCallbackProps) => {
                                    const is = pendingMessages.find(
                                      (p) => p.groupId === groupId,
                                    );
                                    if (
                                      is &&
                                      (isAllCancelled || isAllUploaded)
                                    ) {
                                      createSupportTicket(
                                        values,

                                        groupFiles,
                                        file.groupId,
                                      ).then(() => {
                                        onChange([]);
                                      });
                                    }
                                  },
                                }),
                              );
                            }
                            // if (
                            //   files.every((f: any) => f.status === 'COMPLETED')
                            // ) {
                            //   createSupportTicket(values, files, messageKey);
                            // } else if (!files.length) {
                            //   createSupportTicket(values, []);
                            //   dispatch(
                            //     onRemoveGroup({
                            //       groupId: messageKey,
                            //     }),
                            //   );
                            //   onChange([]);
                            // }
                            // dispatch(
                            //   onUpdateUploadingFiles({
                            //     groupId: messageKey,
                            //     fileId: file.id,
                            //   }),
                            // );
                          }}
                          binding={{
                            name: 'name',
                            path: 'thumbnail',
                            type: 'type',
                          }}
                        />
                      ) : (
                        <SupportFileContainer
                          // onChange={handleFileChange}
                          onChange={onChange}
                          value={files || []}
                          accept={{ 'image/*': [], 'video/*': [] }}
                          // accept={['image/*', 'video/*']}
                        />
                      )}
                    </div>
                    <NewButton
                      block
                      disabled={!values.subject && !values.description}
                      type={
                        values.subject && values.description
                          ? 'primary'
                          : 'default'
                      }
                      htmlType="submit"
                      className="mt-10"
                      isLoading={isSubmitting || isloading}
                      onClick={() => handlesubmit()}
                    >
                      Submit
                    </NewButton>
                  </div>
                )}
                {isSubmitFormOpen && (
                  <div className="text-center modal-submit">
                    <h2>Thank You!</h2>
                    <p>Your Support Ticket has been submitted</p>
                    <p>We will reply as soon as possible.</p>
                    <div className="btn-holder">
                      <NewButton
                        block
                        size="large"
                        type="primary"
                        shape="circle"
                        onClick={() => setIsSubmitFormOpen(false)}
                      >
                        Ok
                      </NewButton>
                    </div>
                  </div>
                )}
              </Modal>
            )}
          </div>
        );
      }}
    </FileUploadReduxHoc>
  );
}
export default styled(SupportFooter)`
  .btn-holder {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 599px;
    background: var(--pallete-background-default);
    padding: 25px 15px;

    @media (max-width: 1023px) {
      width: 100%;
      padding: 10px;
    }

    .button {
      max-width: 202px;
      margin: 0 auto;
    }
  }
  .actions__img {
    cursor: pointer;
  }
`;

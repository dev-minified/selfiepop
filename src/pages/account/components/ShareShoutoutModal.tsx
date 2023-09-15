import { shareOrderVideo } from 'api/Order';
import FocusInput from 'components/focus-input';
import ImageModifications from 'components/ImageModifications';
import Modal from 'components/modal';
import Button from 'components/NButton';
import { useFormik } from 'formik';
import React from 'react';
import { useParams } from 'react-router-dom';
import 'styles/share-shoutout-modal.css';
import swal from 'sweetalert';
import * as yup from 'yup';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  order?: any;
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  name: yup.string().required('Name is required'),
});

const ShareShoutoutModal: React.FC<Props> = ({ isOpen, order, onClose }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    errors,
    touched,
  } = useFormik({
    validationSchema,
    initialValues: {
      message: '',
      email: '',
      name: '',
    },
    onSubmit: async (values) => {
      await shareOrderVideo(orderId, values);
      onClose();
      swal({
        title: 'Successful',
        text: `Video sent to ${values.name}`,
        icon: 'success',
      });
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      showHeader
      showFooter={false}
      onClose={onClose}
      className={`share-video-modal`}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-head-area text-center">
          <div className="profile-image">
            <ImageModifications
              alt="seller"
              src={order?.profileImage}
              imgeSizesProps={{
                onlyDesktop: true,

                imgix: { all: 'w=163&h=163' },
              }}
            />
          </div>
          <h3>
            Share this video from{' '}
            <strong className="name-holder">
              {order?.page_title ?? 'Incognito User'}
            </strong>
          </h3>
        </div>
        <div className="modal-body-area">
          <strong className="title">Send To:</strong>
          <FocusInput
            placeholder="Recipient Name"
            id="guestName"
            name="name"
            type="text"
            error={errors.name}
            touched={touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            className="mb-10"
            materialDesign
          />
          <FocusInput
            placeholder="Recipient Email Address"
            id="guestEmail"
            name="email"
            type="email"
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            materialDesign
          />
          <FocusInput
            placeholder="Your Message"
            id="message"
            name="message"
            type="textarea"
            error={errors.message}
            touched={touched.message}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.message}
            rows={6}
            materialDesign
          />
        </div>
        <div className="modal-footer-area">
          <Button
            disabled={isSubmitting || !isValid}
            htmlType="submit"
            type="primary"
            shape="round"
            size="large"
          >
            OK!
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ShareShoutoutModal;

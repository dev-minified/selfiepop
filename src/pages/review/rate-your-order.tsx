import { getOrder, SubmitOrderReview } from 'api/Order';
import { RequestLoader } from 'components/SiteLoader';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import Checkbox from '../../components/checkbox';
import FocusInput from '../../components/focus-input';
import Button from '../../components/NButton';
import CRate from '../../components/rate';

const validationSchema = yup.object().shape({
  rate: yup.number().required('Please submit a rating'),
  view: yup.string(),
  sign: yup
    .bool()
    .oneOf([true], 'Accept Terms & Conditions is required')
    .required(),
});
export default function MyProfile() {
  const history = useHistory();
  const { orderId } = useQuery();
  const [order, setOrder] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { seller } = order || {};

  const { pageTitle } = seller || {};
  const {
    values,
    setValues,
    handleChange,
    handleBlur,
    isSubmitting,
    handleSubmit,
    errors,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      rate: 0,
      review: '',
      sign: true,
    },
    onSubmit: async (formData: any) => {
      try {
        await SubmitOrderReview({ ...formData, orderId: order._id });
        return history.push(`/my-purchases?order=${order._id}`);
      } catch (e: any) {
        toast.error(e.message);
      }
    },
  });

  const setValueOfRating = (value: number) => {
    setValues((state: any) => ({ ...state, rate: value }));
  };
  const beforeSubmit = (e?: React.FormEvent<HTMLFormElement> | undefined) => {
    console.error(errors);
    if (Object.keys(errors).length === 1 && errors.sign) {
      toast.info(
        'Please let us know. Did you successfully received your order?',
      );
    }
    handleSubmit(e);
  };

  useEffect(() => {
    setIsLoading(true);
    getOrder(orderId as string)
      .then((res) => {
        setIsLoading(false);
        setOrder(res);
      })
      .catch((e: Error) => {
        setIsLoading(false);

        console.log(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);
  if (isLoading) {
    return <RequestLoader isLoading />;
  }
  if (!order._id) return null;
  return (
    <>
      <div className="content_component mb-80">
        <div className="profile--info ">
          <h2 className="text-center">Rate Your Order</h2>
          <h3 className="text-center">
            Tell&nbsp;{pageTitle}&nbsp; what you think.
          </h3>
        </div>
        <form onSubmit={beforeSubmit}>
          <div className="text-center">
            <CRate value={values.rate} onChange={setValueOfRating} />
          </div>
          <div className="input-wrap  mt-20 mb-30">
            <FocusInput
              id="review"
              name="review"
              label={`Give ${pageTitle}  a review.`}
              type="textarea"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.review}
            />
          </div>
          <div>
            <Checkbox
              name="sign"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultChecked={values.sign}
              label="    I have successfully received my order."
            />
          </div>
          <div className="d-flex justify-content-center mt-50 mb-15">
            <Button
              type="primary"
              size="x-large"
              block
              isLoading={isSubmitting}
              htmlType="submit"
            >
              SUBMIT REVIEW
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

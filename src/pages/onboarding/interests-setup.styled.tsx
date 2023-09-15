// import { updatePop } from 'api/Pop';
// import { update } from 'api/User';
// import { ArrowRightFilled } from 'assets/svgs';
// import Button from 'components/NButton';
// import { ServiceType } from 'enums';
// import { useFormik } from 'formik';
// import { useAnalytics } from 'use-analytics';

// import useAuth from 'hooks/useAuth';
import pluralize from 'pluralize';
// import React, { useEffect } from 'react';
// import { useHistory } from 'react-router';
import styled from 'styled-components';
// import * as yup from 'yup';
import { defaultTags } from 'appconstants';
// import { getUserSetupUri, setLocalStorage } from '../../util';
// import PaymaFrom from './components/PaymaForm';
// import ShoutoutForm from './components/ShoutoutForm';

// const formvalidation = yup.object().shape({
//   title: yup.string().max(255).required('This field is required'),
//   price: yup
//     .number()
//     .required('Price should be from $5 to $2500')
//     .max(2500, 'Price should be from $5 to $2500')
//     .min(5, 'Price should be from $5 to $2500'),
// });
// const validationSchema = yup.object().shape({
//   payma: formvalidation,
//   shoutout: formvalidation,
// });

export const InterestSetup = styled.div`
  padding: 0 0 30px;
  .profile--info {
    .description-text {
      font-weight: 500;
      margin: 0 0 20px;
    }

    h3 {
      margin: 0 0 10px;
    }
  }

  .interests-wrap {
    .header {
      position: relative;
      padding: 0;
      align-items: flex-start;
      .header-right {
        @media (max-width: 767px) {
          flex-wrap: wrap;
        }
      }
      .extras {
        width: 125px;
        @media (max-width: 767px) {
          width: calc(100% + 72px);
          margin: 15px 0 0 -72px;
        }

        > div {
          display: block;
        }
      }
    }

    .body {
      padding: 15px 0 0;
      border-bottom: none;
    }

    .row-holder {
      align-items: center;

      @media (max-width: 480px) {
        flex-direction: column-reverse;
      }

      .col-75 {
        @media (max-width: 480px) {
          width: 100%;
          padding-top: 15px;
        }
      }
    }

    .checkbox {
      .label-text {
        font-size: 14px;
        line-height: 18px;
        font-weight: 500;
        color: var(--pallete-text-main);
      }
    }

    .dashed {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .icon {
      overflow: hidden;
      border: none;
    }

    .title {
      font-size: 18px;
      line-height: 24px;
      margin: 0 0 5px;
      font-weight: 500;
    }

    .caption {
      color: var(--pallete-text-main-300);
      font-size: 14px;
      line-height: 19px;
    }

    .text-input.mb-25 {
      margin-bottom: 0 !important;

      @media (max-width: 480px) {
      }
    }

    .text-input.mb-20 {
      margin-bottom: 10px !important;
    }
  }

  .button-holder {
    border-top: 1px solid var(--pallete-colors-border);
    padding: 30px 30px 30px 40px;
    position: fixed;
    left: 0;
    width: 599px;
    bottom: 0;
    background: var(--pallete-background-default);
    z-index: 11;

    @media (max-width: 1023px) {
      width: auto;
      right: 0;
    }

    @media (max-width: 767px) {
      padding: 15px 20px;
    }
    .img {
      margin: 0 0 0 8px;
    }
  }

  .description {
    color: var(--pallete-text-main-450);
    font-size: 15px;
    margin: 0 0 25px;
  }

  .pop-top-content {
    position: relative;
  }

  .checkbox {
    label {
      padding: 0;
    }
  }

  .logo-holder {
    width: 152px;
    margin: 0 0 36px;

    svg {
      width: 100%;
      height: auto;
      vertical-align: top;
    }
  }

  .sp__card {
    position: relative;
    padding: 15px;
    background: none;
    margin: 0 0 20px;
    border-radius: 5px;
    border: 1px solid var(--pallete-background-pink);

    &.isActive {
      border-color: transparent;
      &:before {
        opacity: 1;
        visibility: visible;
      }
    }

    &:before {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border: 2px solid var(--pallete-primary-main);
      border-radius: 5px;
      content: '';
      opacity: 0;
      visibility: hidden;
    }

    .dashed {
      display: none;
    }
  }

  .steps-detail {
    font-size: 18px;
    line-height: 21px;
    font-weight: 500;
    margin: 0 0 33px;
  }

  .profile--info {
    position: relative;
  }

  h3 {
    font-weight: 500;
    margin: 0 0 24px;
  }

  h4 {
    font-size: 15px;
    margin: 0;
  }

  h6 {
    font-size: 15px;
    line-height: 18px;
    margin: 0 0 20px;
    font-weight: 500;
    color: var(--pallete-text-main);
  }

  .label-area {
    margin: 0 0 24px;
  }

  .label {
    display: block;
    margin: 0 0 8px;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
  }

  .description-text {
    display: block;
    color: var(--pallete-text-main-300);
    font-size: 14px;
    line-height: 18px;
  }

  .schedule-block {
    .dashed {
      display: none;
    }
  }
`;

export const GetTile: React.FC<{ tags: string }> = ({ tags }) => {
  const defaultTagsArray = defaultTags.map((tag) => tag.value).join();
  const tagsArray = tags
    .split(',')
    .filter(
      (tag) =>
        tag.toLocaleLowerCase() !== 'other' && defaultTagsArray.includes(tag),
    );

  if (tagsArray.length)
    return (
      <span className="description-text">
        The following options are the most popular social revenue tools for
        {tagsArray.map((item, index, array) => {
          if (array.length > 1 && array.length - 1 === index)
            return (
              <>
                {' '}
                and <span className="text-capitalize">{pluralize(item)}</span>
              </>
            );
          return (
            <span key={index} className="text-capitalize">
              {' '}
              {pluralize(item)}
            </span>
          );
        })}
        . Please set your prices and other details below.
      </span>
    );

  return (
    <span className="description-text">
      Do you want to get paid by selling EXCLUSIVE CONTENT to your fans?
    </span>
  );
};
// const InterestsSetup: React.FC = () => {
//   const { user, setUser } = useAuth();
//   const analytics = useAnalytics();

//   const history = useHistory();

//   const form = useFormik<{
//     payma: IPop;
//     shoutout: IPop;
//   }>({
//     validationSchema,
//     initialValues: {
//       payma: {},
//       shoutout: {},
//     },
//     onSubmit: async (values) => {
//       setLocalStorage('onBoardingTour', 'true', false);

//       const { payma, shoutout } = values;
//       delete payma['popName'];
//       delete shoutout['popName'];

//       const requests: Promise<any>[] = [];

//       requests.push(
//         updatePop({ isActive: payma.isActive, price: payma.price }, payma._id!),
//       );
//       requests.push(
//         updatePop(
//           {
//             isActive: shoutout.isActive,
//             isThumbnailActive: shoutout.isActive,
//             price: shoutout.price,
//           },
//           shoutout._id!,
//         ),
//       );

//       requests.push(
//         update({
//           userSetupStatus: 2,
//         }),
//       );

//       await Promise.all(requests)
//         .then((res) => {
//           res.pop();
//           setUser({
//             ...user,
//             userSetupStatus: 2,
//             links: user.links.map((ln: any) => {
//               const elemt = res.find(
//                 (i: IPop) => i._id === ln?.popLinksId?._id,
//               );
//               if (elemt) {
//                 return {
//                   ...ln,
//                   popLinksId: elemt,
//                   isActive: elemt.isActive,
//                 };
//               }
//               return ln;
//             }),
//           });

//           history.push(getUserSetupUri(2));
//         })
//         .catch(console.log);
//       analytics.track('new_reg_step_2', {
//         payma: Boolean(payma?.isActive),
//         url: window.location.href,
//         shoutout: Boolean(shoutout?.isActive),
//         onboardingFlowTypeId: user.onboardingTypeId,
//         flowVersion: 1,
//       });
//     },
//   });

//   const {
//     handleChange,
//     handleBlur,
//     values,
//     setValues,
//     handleSubmit,
//     errors,
//     touched,
//     isSubmitting,
//   } = form;

//   const { payma, shoutout } = values;

//   const { payma: paymaErrors, shoutout: shoutoutErrors } = errors;
//   const { payma: paymaTouched, shoutout: shoutoutTouched } = touched;
//   useEffect(() => {
//     if (user?.userSetupStatus !== 1) {
//       setUser({
//         ...user,
//         userSetupStatus: 1,
//       });
//       update({
//         userSetupStatus: 1,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     const links = user.links;
//     if (links) {
//       const payma = links?.find(
//         (i: any) => i?.popLinksId?.popType === ServiceType.PAYMA,
//       )?.popLinksId;
//       const shoutout = links?.find(
//         (i: any) => i?.popLinksId?.popType === ServiceType.SHOUTOUT,
//       )?.popLinksId;

//       setValues({
//         ...values,
//         payma: { ...payma, isActive: true },
//         shoutout: { ...shoutout, isActive: true },
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   return (
//     <InterestSetup>
//       <div className="profile--info mb-30">
//         <h3>Set your Pricing.</h3>
//         <GetTile tags={user?.tags || ''} />
//       </div>
//       <h6>Please set the price of each service you would like to offer:</h6>
//       <div className="interests-wrap">
//         <div>
//           <PaymaFrom
//             values={payma}
//             baseName="payma"
//             errors={paymaErrors}
//             touched={paymaTouched}
//             handleChange={handleChange}
//             handleBlur={handleBlur}
//           />

//           <ShoutoutForm
//             baseName="shoutout"
//             values={shoutout}
//             errors={shoutoutErrors}
//             touched={shoutoutTouched}
//             handleChange={handleChange}
//             handleBlur={handleBlur}
//           />
//         </div>
//         <div className="text-center button-holder">
//           <Button
//             onClick={handleSubmit as any}
//             isLoading={isSubmitting}
//             type="primary"
//             size="large"
//             block
//           >
//             Next Step{' '}
//             <span className="img">
//               <ArrowRightFilled />
//             </span>
//           </Button>
//         </div>
//       </div>
//     </InterestSetup>
//   );
// };

// export default InterestsSetup;

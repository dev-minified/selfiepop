import { checkOrderExists, orderCreate } from 'api/Order';
import { updateGuestUser } from 'api/User';
import { createOrderWithGuestUser } from 'api/Utils';
import { EmailSvg, IconChat, NameSvg } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import ImageModifications from 'components/ImageModifications';
import InformationWidget from 'components/InformationWidget';
import { AppAlert } from 'components/Model';
import Button from 'components/NButton';
import SignInPopUP from 'components/SignInPopUp';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useOpenClose from 'hooks/useOpenClose';
import { IServiceProps } from 'interfaces/IPublicServices';
import { stringify } from 'querystring';
import { ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  resetOrder,
  setGuestUser,
  setGuestUserTokens,
  setOrder,
} from 'store/reducer/checkout';
import styled from 'styled-components';
import { arrayFilter } from 'util/index';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Enter valid email address'),
  name: yup
    .string()
    .required('Enter your full name')
    .matches(/^(\D+\s+\D+)(\s*\D*)*$/, 'Enter your full name'),
  phone: yup
    .string()
    .matches(
      /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
      'Invalid Phone Number',
    )
    .required('Phone is required'),
});

function ChatSubscription({
  className,
  pop,
  ownProfile,
  onStopPOPupOpen,
  publicUser,
}: IServiceProps & { publicUser: IUser }): ReactElement {
  const { user: authUser, loggedIn } = useAuth();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [isOpen, openSignPopUp, closeSignPopUp] = useOpenClose(false);
  const publicUserId = useAppSelector((state) => state.global?.publicUser?._id);
  const gstUser = useAppSelector((state) => state.checkout?.guestUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedV, setSelectedV] = useState<any>({});

  const {
    _id,

    priceVariations = [],
    questions = [],
  } = pop || {};

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik({
    validationSchema,
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },
    onSubmit: async (formData) => {
      handleCreateOrder(formData);
    },
  });
  useEffect(() => {
    const vs: any = [...priceVariations]
      .filter(({ isActive }) => isActive)
      .map((v: any) => {
        return { label: `${v.title || ''} - $${v.price}`, value: v };
      });
    const indexof = vs?.findIndex((el: any) => el?.value?.isDefault === true);
    if (indexof !== -1) {
      setSelectedV(vs[indexof]);
    } else {
      setSelectedV(vs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop]);
  const handleCreateOrder = async (values?: {
    name: string;
    email: string;
    phone: string;
  }) => {
    if (ownProfile && onStopPOPupOpen) {
      onStopPOPupOpen();
      return;
    }

    const selected = selectedV.value;

    const sQuestions = arrayFilter(questions, { isActive: true }).concat(
      arrayFilter(selected?.questions || [], { isActive: true }),
    );

    setIsLoading(true);
    dispatch(resetOrder());

    const requestData: any = {
      questions: sQuestions,
      popId: pop._id,
      vpopId: selected._id,
      buyer:
        loggedIn || gstUser?.data?._id
          ? authUser?._id ?? gstUser?.data?._id
          : null,
    };
    try {
      !loggedIn && (await validationSchema.validate(values));
      const response =
        loggedIn || gstUser?.data?._id
          ? await orderCreate(requestData)
          : await createOrderWithGuestUser(requestData, values?.email);

      const { order, guestUser } = response;
      if (!loggedIn && !gstUser?.data?._id) {
        dispatch(setGuestUser(guestUser));
        dispatch(
          setGuestUserTokens({
            refreshToken: guestUser.refreshToken,
            token: guestUser.token,
          }),
        );
      }

      dispatch(setOrder(order));
      const GuestUser = gstUser?.data?._id ? gstUser : guestUser;
      if (!loggedIn) {
        await validationSchema.validate(values);
        const name = values?.name?.replace(/\s{2,}/g, ' ').trim();
        const firstName = name?.split(' ').slice(0, -1).join(' ');
        const lastName = name?.split(' ').slice(-1).join(' ');
        await updateGuestUser({
          firstName,
          lastName,
          email: values?.email,
          phone: values?.phone,
        }).then((data) => {
          dispatch(setGuestUser({ ...GuestUser, ...data }));
        });
      }
      const prams = stringify({ order: order._id, type: pop.popType });
      return history.push(
        `/${publicUser?.username}/purchase/add-a-card-and-checkout?${prams}`,
      );
    } catch (e: any) {
      setIsLoading(false);
      if (e?.message === 'Email already exists') {
        openSignPopUp();
        return;
      }
      AppAlert({
        title: 'Please Enter Correct information',
        text: e.message,
      });
    }
    setIsLoading(false);
  };
  const onSuccessLoginCB = async (user: any) => {
    closeSignPopUp();
    const selected = selectedV.value;

    const sQuestions = arrayFilter(questions, { isActive: true }).concat(
      arrayFilter(selected?.questions || [], { isActive: true }),
    );

    const requestData: any = {
      questions: sQuestions,
      popId: pop._id,
      vpopId: selected._id,
      buyer: loggedIn && user?._id ? user?._id : null,
    };
    const response = loggedIn
      ? await orderCreate(requestData)
      : await createOrderWithGuestUser(requestData);
    const { order } = response;
    const prams = stringify({ order: order._id, type: pop.popType });

    history.push(
      `/${publicUser?.username}/purchase/add-a-card-and-checkout?${prams}`,
    );
  };
  const { description: vDescription, _id: vId } = selectedV?.value || {};
  return (
    <form
      onSubmit={async (e) => {
        if (loggedIn) {
          e.preventDefault();
          setIsLoading(true);
          await checkOrderExists(pop?._id).then((res: any) => {
            if (res?.isExist) {
              setIsLoading(false);

              AppAlert({
                title: 'Order Already Exists',
                text: 'Redirecting to chat',
                onConfirm: () => {
                  history.push(
                    `/messages/subscriptions?userId=${publicUserId}&type=chat`,
                  );
                },
              });
              return;
            }
            handleCreateOrder();
          });
        } else {
          handleSubmit(e);
        }
      }}
      className={`${className} text-center`}
    >
      <div className="user_info">
        {publicUser?.profileImage && (
          <ImageModifications
            imgeSizesProps={{
              onlyMobile: true,
            }}
            src={
              publicUser?.profileImage ||
              '/assets/images/default-profile-img.svg'
            }
            fallbackUrl={'/assets/images/default-profile-img.svg'}
          />
        )}
        <h1>{`${publicUser?.pageTitle ?? 'Incognito User'}`}</h1>
        <span className="username">@{publicUser?.username}</span>
        <p>{pop?.description}</p>
      </div>
      {/* {variations.length > 1 && (
        <div className="select-wrap mb-30 pb-0">
          <Select
            options={variations}
            defaultValue={selectedV}
            value={selectedV}
            onChange={(data) => {
              setSelectedV(data);
            }}
            size="large"
          />
        </div>
      )} */}
      {vDescription?.length > 0 && vId !== _id && (
        <InformationWidget className="mb-30 ">{vDescription}</InformationWidget>
      )}
      <div className="form_section">
        {/* <div className="loged_in_user">
          <Button
            shape="circle"
            type="secondary"
            htmlType="submit"
            isLoading={false}
            onClick={() => console.log('clicked')}
            style={{ backgroundColor: 'black' }}
          >
            ${prc}
          </Button>
          <p>
            Subscribe for <strong>30 Days</strong> private chat access!
          </p>
        </div> */}
        {!loggedIn && (
          <div className="fields-wrap">
            <FocusInput
              value={values.name}
              hasIcon={true}
              label="Full Name"
              name="name"
              prefixElement={<NameSvg />}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              materialDesign
              touched={touched.name}
            />
            <div className="form_fields">
              <FocusInput
                value={values.email}
                hasIcon={true}
                label="Email Address"
                name="email"
                prefixElement={<EmailSvg />}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                materialDesign
                touched={touched.email}
              />
              {/* <FocusInput
                value={values.phone}
                hasIcon={true}
                label="Mobile Number"
                name="phone"
                prefixElement={<MobileSvg />}
                materialDesign
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                touched={touched.phone}
              /> */}
            </div>
          </div>
        )}
      </div>
      <Button
        shape="circle"
        type="primary"
        htmlType="submit"
        className="chat_btn"
        isLoading={isLoading}
        block
        icon={
          <span className="chat_btn_icon">
            <IconChat />
          </span>
        }
      >
        {pop?.actionText || 'Exclusive Content'}
      </Button>
      <SignInPopUP
        isOpen={isOpen}
        onClose={closeSignPopUp}
        onSuccessCallback={onSuccessLoginCB}
        email={values.email}
      />
    </form>
  );
}

export default styled(ChatSubscription)`
  .user_info {
    font-size: 18px;
    line-height: 26px;
    font-weight: 400;
    margin: 0 0 30px;

    @media (max-width: 640px) {
      font-size: 16px;
      line-height: 24px;
      margin: 0 0 20px;
    }
    .image-comp {
      width: 200px;
      height: 200px;
      border-radius: 100%;
      overflow: hidden;
      margin: 20px auto;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  h1 {
    font-size: 46px;
    line-height: 1;
    margin: 0 0 7px;
    font-weight: 500;

    @media (max-width: 640px) {
      font-size: 36px;
    }
  }

  .username {
    display: inline-block;
    vertical-align: top;
    color: rgba(4, 176, 240, 0.8);
    font-size: 22px;
    line-height: 26px;
    font-weight: 500;
    margin: 0 0 15px;
  }

  .loged_in_user {
    letter-spacing: -0.165px;
    color: #757b7f;
    font-size: 26px;
    line-height: 31px;
    font-weight: 400;

    strong {
      color: #555c61;
      font-weight: 500;
    }
  }

  .form_section {
    /* background: rgba(4, 176, 240, 0.09); */
    border-radius: 15px;
    padding: 20px 20px 10px;
    margin: 0 0 35px;

    .button {
      min-width: 164px;
      margin: 0 0 15px;
      font-size: 30px;
      line-height: 36px;
    }

    p {
      margin: 0 0 10px;
    }
  }

  .fields-wrap {
    .mb-20 {
      margin-bottom: 10px !important;
    }
  }

  .form_fields {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;

    .text-input {
      width: calc(50% - 10px);
      margin-left: 5px;
      margin-right: 5px;

      @media (max-width: 640px) {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  .prefix-element {
    .pre-fix {
      width: 16px;
      top: 0;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .button.chat_btn {
    padding: 15px 60px;
    position: relative;
    font-size: 28px;
    line-height: 33px;
    font-weight: 500;
    /* background: var(--pallete-primary-main) !important; */
    background: black;
    .chat_btn_icon {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translate(0, -50%);
      width: 45px;
      height: 45px;
      background: var(--pallete-background-default);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 100%;
    }
    @media (max-width: 640px) {
      font-size: 22px;
    }

    &:hover {
      /* border-color: var(--pallete-primary-main); */
      border-color: black;
    }

    svg {
      margin: 0;
      width: 30px;
      /* display: none; */

      path {
        /* fill: #602053; */
        fill: black;
      }
    }
  }
`;

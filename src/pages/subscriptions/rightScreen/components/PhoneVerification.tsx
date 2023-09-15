import { updatePhoneNumber, verifyPhoneOTP } from 'api/User';
import { LOGS_EVENTS } from 'appconstants';
import { toast } from 'components/toaster';
import SetPhoneNumberVerification from 'pages/purchase/component/PhoneVerify';
import SetPhoneNumber from 'pages/purchase/component/Setphone';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';

type IPhoneVerificationProps = {
  phone?: string;
  onSubmit?: (isCheked?: boolean, values?: any) => void | Promise<any>;
  sub?: Record<string, any>;
  seller?: Record<string, any>;
  loggedUser?: Record<string, any>;
};
const PhoneVerification = (props: IPhoneVerificationProps) => {
  const { phone, onSubmit, seller, loggedUser } = props;
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<any>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    if (phone) {
      setPhoneNumber(phone);
    }
  }, [phone]);
  const onSendOTP = async (values: any) => {
    try {
      setIsSubmitting(true);
      setPhoneNumber(values.phone);
      const resp = await updatePhoneNumber(values.phone);
      toast.success(`8 digit OTP number sent to your contact number!`);
      setStep(2);
      setIsSubmitting(false);
      return resp;
    } catch (error: any) {
      setIsSubmitting(false);
      if (error?.message) {
        toast.error(
          error?.message ||
            `Your Phone number is not verified Please try again. `,
        );
      }
      return;
    }

    // history.push(`/${username}/purchase/set-password?order=${orderId}`);
  };
  const handleSendOTP = async (values: any) => {
    try {
      setIsSubmitting(true);
      const response = await verifyPhoneOTP(values?.otp + '');

      toast.success(`Your phone number is verified successfully`);
      analytics.track(LOGS_EVENTS.phone_added, {
        email: loggedUser?.email,
        phone: phoneNumber,
      });
      setIsSubmitting(false);
      onSubmit?.(true, phoneNumber);
      setStep(1);
      return response;
    } catch (e: any) {
      setIsSubmitting(false);
      if (e?.message) {
        toast.error(
          e?.message || `Your Phone number is not verified Please try again. `,
        );
      }
      return;
    }
  };
  return (
    <div>
      {step === 1 ? (
        // <AnimatePresence initial={false}>
        //   <motion.div
        //     key="right"
        //     custom={'right'}
        //     initial="initial"
        //     animate="animate"
        //     exit="exit"
        //     variants={variants as any}
        //     style={{ width: '100%', position: 'relative' }}
        //     transition={{ mass: 0.2, duration: 0.6 }}
        //     className="left-col"
        //   >
        <SetPhoneNumber
          phone={phoneNumber}
          onSubmit={onSendOTP}
          showAvatar={false}
          seller={seller}
          isSubmitting={isSubmitting}
        />
      ) : //   </motion.div>
      // </AnimatePresence>
      step === 2 ? (
        // <AnimatePresence initial={false}>
        //   <motion.div
        //     key="left"
        //     custom={'left'}
        //     initial="initial"
        //     animate="animate"
        //     exit="exit"
        //     variants={variants as any}
        //     style={{ width: '100%', position: 'relative' }}
        //     transition={{ mass: 0.2, duration: 0.6 }}
        //     className="left-col"
        //   >
        <SetPhoneNumberVerification
          onSubmit={handleSendOTP}
          showAvatar={false}
          seller={seller}
          isSubmitting={isSubmitting}
          bottomLinkSettings={{
            text: 'Go Back',
            onClick: () => {
              setStep(1);
            },
            showbottomLink: true,
          }}
        />
      ) : //   </motion.div>
      // </AnimatePresence>
      null}
    </div>
  );
};

export default styled(PhoneVerification)``;

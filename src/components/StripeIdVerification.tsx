import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createVerificationSession } from 'api/User';
import { STRIPE_PUBLIC_KEY } from 'config';
import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from 'use-analytics';
import Button, { ButtonProps } from './NButton';
type StripeIdVerificationProps = {
  onSuccess?: (...args: any[]) => void | Promise<any>;
  className?: string;
  buttonTitle?: string;
  btnProps?: ButtonProps;
  isOpen?: boolean;
};
const VerifyButton = ({
  stripePromise,
  onSuccess,
  buttonTitle = 'Verify',
  className,
  btnProps,
  isOpen,
}: StripeIdVerificationProps & {
  stripePromise: Promise<Stripe | null>;
}) => {
  const [loading, setIsloading] = useState(false);
  const [stripe, setStripe] = useState<any>();
  const stripeRef = useRef();
  const analytics = useAnalytics();
  const setHandlerStripe = async () => {
    setStripe(await stripePromise);
  };
  useEffect(() => {
    setHandlerStripe();
  }, []);
  const handleClick = async (event?: any) => {
    // Block native event handling.
    event?.preventDefault();

    if (!stripe) {
      // Stripe.js has not loaded yet. Make sure to disable
      // the button until Stripe.js has loaded.
      return;
    }
    try {
      setIsloading(true);
      const session = await createVerificationSession();
      try {
        // Show the verification modal.
        const { error } = await stripe.verifyIdentity(session.client_secret);
        if (error) {
          analytics.track('react_error', {
            message: error.message,
            type: 'stripe_identity_verification_error',
          });
        } else {
          analytics.track('identity_verification_submitted', {
            message: 'Identity Document Submitted',
          });
          onSuccess?.();
        }
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
      }
    } catch (error) {
      setIsloading(false);
    }
  };
  useEffect(() => {
    if (isOpen && stripeRef?.current) {
      (stripeRef?.current as any)?.click();
    }
  }, [isOpen, stripeRef?.current]);

  return (
    <Button
      className={`btn-bar ${className}`}
      role="link"
      disabled={!stripe}
      isLoading={loading}
      onClick={handleClick}
      ref={stripeRef}
      {...btnProps}
    >
      {buttonTitle}
    </Button>
  );
};

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

let stripePromise: any = null;
try {
  stripePromise = loadStripe(STRIPE_PUBLIC_KEY as string);
} catch (error) {
  console.log({ error });
}

const VerifyUserId = ({
  onSuccess,
  className,
  btnProps,
  buttonTitle,
  isOpen,
}: StripeIdVerificationProps) => {
  return (
    <VerifyButton
      buttonTitle={buttonTitle}
      btnProps={btnProps}
      className={className}
      onSuccess={onSuccess}
      stripePromise={stripePromise}
      isOpen={isOpen}
    />
  );
};

export default VerifyUserId;

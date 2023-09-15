import { IDVerificationStatuses } from 'appconstants';

const InvitationStatus = (user: any, addition: any) => {
  let message = '';
  let button: any = undefined;
  let buttonText = '';
  let showCloseButton = true;
  let showLink = false;
  let type = 'default';
  let showOkButton = true;
  let showinfoIcon = true;
  let bg = '';
  const eventInfo = addition.eventInfo;
  let showEmailLinks = !user.isEmailVerified && user.userSetupStatus > 9;
  const isVerificationStatusInProcessing =
    user?.idVerificationStatus === IDVerificationStatuses.processing;
  const isVerificationFailed =
    user?.idVerificationStatus === IDVerificationStatuses.failed;
  let showVerificationButton =
    user.isEmailVerified && user.userSetupStatus > 9 && !user?.idIsVerified;
  if (user.userSetupStatus > 9) {
    // if (user?.profileStatus === 'pending') {
    //   message =
    //     'Your Pop Page is not available to the public as your application is still under review.';
    //   buttonText = 'OK';
    //   showCloseButton = false;
    //   button = addition.handleClose;
    //   type = 'corner';
    // } else
    if (eventInfo?._id) {
      showOkButton = false;
      showCloseButton = false;
      showVerificationButton = false;
      showinfoIcon = false;
      showEmailLinks = false;

      bg = 'green';
      if (eventInfo?.isVIP === 1) {
        message = 'VIP';
      } else if (eventInfo?.isVIP === 0 && eventInfo?.eventCount === 0) {
        message = 'First Event';
        bg = 'green';
      } else if (eventInfo?.isVIP === 0 && eventInfo?.eventCount > 0) {
        bg = '#d2d400';
        message = 'Verify Profile';
      }
    } else if (!user.isEmailVerified) {
      // message = `Please verify your email address ${user.email} to continue`;
      message = `Please verify your email address (${user?.email}) to use ecommerce and other advanced features.`;
      if (!!!user.allowSelling) {
        // message = `Please verify your email address (${user?.email}) to use ecommerce and other advanced features.`;
        if (addition.isPublicPage) {
          showLink = true;
        }
      }
      button = addition.button;
      buttonText = addition.emailSent;
      showCloseButton = true;
      showVerificationButton = false;
      type = 'corner';
    } else if (!user.idIsVerified) {
      button = () => {};
      buttonText = addition.verifyIdentity;
      message = `Please complete your Identity verification process to use ecommerce and other advanced features. `;
      // if (!!!user.allowSelling) {
      //   showVerificationButton = false;
      //   button = addition.button;
      //   buttonText = addition.emailSent;
      //   message = `Please verify your email address (${user?.email}) to use ecommerce and other advanced features.`;
      //   if (addition.isPublicPage) {
      //     showLink = true;
      //   }
      if (!!!user.allowSelling) {
        if (addition.isPublicPage) {
          showLink = true;
        }
      }
      // } else {
      if (isVerificationStatusInProcessing) {
        showOkButton = false;
        message =
          'Your identity verification is in progress. You will receive an email when complete.';
        showVerificationButton = !isVerificationStatusInProcessing;
      }
      if (isVerificationFailed) {
        showOkButton = false;
        message =
          'There was a problem with your ID verification. Please click the “Resolve Verification” button to resolve the issue.';
        buttonText = 'Resolve Verification';
        showVerificationButton = isVerificationFailed;
      }
      // }

      showCloseButton = true;
      type = 'corner';
    } else if (addition.isPublicPage && !user.isActiveProfile) {
      message =
        'Your pop page is currently inactive. Would you like to activate it? ';

      button = addition.ActivateProfile;
      buttonText = 'ACTIVATE IT';
      type = 'corner';
      showCloseButton = false;
    } else {
      message = 'Your are viewing your public profile page.';
      buttonText = 'EDIT MY POP PAGE';
      button = addition.goToEditProfile;
      showCloseButton = false;
      type = 'corner';
    }
  }
  return {
    message,
    showCloseButton,
    buttonText,
    type,
    showLink,
    onButtonClick: button,
    showEmailLinks,
    showVerificationButton,
    showOkButton,
    showinfoIcon,
    bg,
  };
};

export default InvitationStatus;

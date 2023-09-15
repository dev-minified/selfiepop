import { createGlobalStyle } from 'styled-components';
// import { createTheme } from 'util/themeutil';
// const primary = 'var(--pallete-primary-main)';
// const secondary = 'var(--pallete-primary-main)';
// const secondaryDark = '#236fb7';

export const GlobalStyle = createGlobalStyle`
  /* *, *::before,*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  } */

  ${({ theme }) => {
    // createTheme(theme);
    const {
      pallete: { primary, secondary, text, background },
    } = theme as any;

    return `
      body {
        background-color: ${background?.default};
        color: ${text?.main};
      }
      .btn-primary {
        background-color: ${primary?.main};
        border-color: ${primary?.main};
      }
      .icon--round {
        color: ${primary?.main};
      }
      .input-focus {
        border-color: ${primary?.main} !important;
      }
      .price-setup {
        border: 2px solid ${primary?.main};
      }
      .price-tag {
        background: ${primary?.main};
      }
      .selectable:hover {
        background: ${primary?.main} !important;
        border-color: ${primary?.main} !important;
      }
      .number--tag {
        background: ${primary?.main};
      }
      .btn-outline-primary {
        color: ${primary?.main};
        border-color: ${primary?.main};
      }
      .btn-outline-primary:hover {
        background-color: ${primary?.main};
        border-color: ${primary?.main};
      }
      .btn-outline-primary.disabled,
      .btn-outline-primary:disabled {
        color: ${primary?.main};
      }
      .btn-outline-primary:not(:disabled):not(.disabled):active,
      .btn-outline-primary:not(:disabled):not(.disabled).active,
      .show > .btn-outline-primary.dropdown-toggle {
        background-color: ${primary?.main};
        border-color: ${primary?.main};
      }
      .btn-outline-secondary {
        color: ${secondary?.main};
        border-color: ${secondary?.main};
      }
      .btn-outline-secondary:hover {
        background-color: ${secondary?.main};
        border-color: ${secondary?.main};
      }
      .btn-outline-secondary.disabled,
      .btn-outline-secondary:disabled {
        color: ${secondary?.main};
      }
      .btn-outline-secondary:not(:disabled):not(.disabled):active,
      .btn-outline-secondary:not(:disabled):not(.disabled).active,
      .show > .btn-outline-secondary.dropdown-toggle {
        background-color: ${secondary?.main};
        border-color: ${secondary?.main};
      }
      .badge-primary {
        background-color: ${primary?.main};
      }
      .badge-secondary {
        background-color: ${secondary?.main};
      }
      .bg-primary {
        background-color: ${primary?.main} !important;
      }
      .bg-secondary {
        background-color: ${secondary?.main} !important;
      }
      .border-primary {
        border-color: ${primary?.main} !important;
      }
      .border-secondary {
        border-color: ${secondary?.main} !important;
      }
      .text-primary {
        color: ${primary?.main} !important;
      }
      .text-secondary {
        color: ${secondary?.main} !important;
      }
      .primary-text {
        color: ${primary?.main} !important;
      }
      .secondary-text {
        color: ${secondary?.main} !important;
      }
      hr.divider-primary {
        border-top-color: ${primary?.main};
      }
      hr.divider-secondary {
        border-top-color: ${secondary?.main};
      }
      .icon-star1:before {
        color: ${primary?.main};
      }
      .pager .link-previous [class^='icon-'],
      .pager .link-previous [class*=' icon-'],
      .pager .link-next [class^='icon-'],
      .pager .link-next [class*=' icon-'] {
        color: ${primary?.main};
      }
      .pager .link-previous:hover [class^='icon-'],
      .pager .link-previous:hover [class*=' icon-'],
      .pager .link-next:hover [class^='icon-'],
      .pager .link-next:hover [class*=' icon-'] {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .status-widget .price-box .price {
        background: ${primary?.main};
      }
      .share-popup {
        background: ${primary?.main};
      }
      .question--icon:before {
        background: ${primary?.main};
      }
      .question--icon:after {
        border-color: transparent transparent transparent ${primary?.main};
      }
      .question--price {
        color: ${primary?.main};
      }
      .question--arrow {
        color: ${primary?.main};
        border: 1px solid ${primary?.main};
      }
      .question:hover {
        color: ${primary?.main};
      }
      .question:hover .question--arrow {
        background: ${primary?.main};
      }
      .social:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .btn-simple:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .btn-simple .icon--round {
        background: ${primary?.main};
      }
      .btn-simple:hover .icon--round {
        color: ${primary?.main};
      }
      .promo--price {
        background: ${primary?.main};
        border: 1px solid ${primary?.main};
      }
      .promo:hover .promo--title {
        color: ${primary?.main};
      }
      .bio--img {
        background: ${primary?.main};
      }
      .bio--subtitle {
        color: ${primary?.main};
      }
      .tags a {
        color: ${primary?.main};
      }
      .tags a:hover {
        background: ${primary?.main};
      }
      .shoutout--list li a {
        color: ${primary?.main};
      }
      .slick-arrow {
        color: ${primary?.main};
      }
      .slick-arrow:hover {
        background: ${primary?.main};
      }
      .jcf-select .jcf-select-opener {
        color: ${primary?.main};
      }
      .jcf-select.jcf-drop-active .jcf-select-opener {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .jcf-select-drop.jcf-select-small .jcf-selected {
        background: ${primary?.main};
      }

      .form-control:focus {
        border-color: ${primary?.main};
      }
      .button-fileupload.white:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .fileupload-toolbar .status {
        color: ${primary?.main};
      }
      .fileupload-toolbar .status .icon-tick {
        background: ${primary?.main};
      }
      .creditcard .form-control:focus {
        border-color: ${primary?.main};
      }
      .profile-photo .btn-add {
        background: ${primary?.main};
      }
      .profile-photo .link-skip {
        color: ${primary?.main};
      }
      .date-widget .btn-prev,
      .date-widget .btn-next {
        background: ${primary?.main};
      }
      .date-accordion.active .opener {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .date-accordion .opener:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .sorting-widget .title span {
        color: ${primary?.main};
      }
      .paging li a:hover,
      .paging li span:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .paging li.active a,
      .paging li.active span {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .breadcrumbs li {
        color: ${primary?.main};
      }
      .forfrom-widget a:hover {
        color: ${primary?.main};
      }
      .buyerprice-widget .title {
        color: ${primary?.main};
      }
      .buyerprice-widget .price-box .price {
        background: ${primary?.main};
      }
      .dates-widget .date-box + .date-box .icon {
        background: ${primary?.main};
      }
      .live-link-bar .icon span {
        color: ${primary?.main};
      }
      .addatendee-widget .title span {
        background: ${primary?.main};
      }
      .addatendee-widget .btn.btn-secondary {
        background: ${secondary?.main};
        border-color: ${secondary?.main};
      }
      .attendee-wedget .btn-edit:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .purchased-widget .subtext {
        color: ${secondary?.main};
      }
      .transaction-table .icon.pink {
        background: ${primary?.main};
      }
      .question.dragable .icon:before {
        background: ${primary?.main};
      }
      .question.dragable .icon:after {
        border-color: transparent transparent transparent ${primary?.main};
      }
      .question.dragable .btn-edit:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .section-head .edit-btn:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .chat-header .title a {
        color: ${secondary?.main};
      }
      .chat-box .title a {
        color: ${secondary?.main};
      }
      .message-widget .upload-file:hover .icon-url {
        background: ${primary?.main};
      }
      .message-widget .upload-file:hover .txt {
        color: ${primary?.main};
      }
      .message-widget .btn.btn-success:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .color-chooser .button {
        border: 2px solid ${primary?.main};
      }
      .color-chooser label {
        background: ${secondary?.main};
      }
      .color-chooser .custom-input:after {
        border: 2px solid ${primary?.main};
      }
      .color-chooser [type='radio']:checked + .custom-input {
        background: ${primary?.main};
      }
      .checkbox.checkbox-border .label-text:after {
        border: 2px solid ${primary?.main};
      }
      .checkbox [type='checkbox'] + .custom-input-holder .custom-input:before {
        color: ${primary?.main};
      }
      .checkbox.alt input[type='checkbox']:checked + .custom-input-holder {
        border-right-color: ${primary?.main};
      }
      .checkbox.alt
        input[type='checkbox']:checked
        + .custom-input-holder:after {
        background: ${primary?.main};
      }
      .checkbox.alt .custom-input-holder .custom-input:before {
        color: ${primary?.main};
      }
      .radio.radio-border .label-text:after {
        border: 2px solid ${primary?.main};
      }
      .radio [type='radio'] + .custom-input-holder .custom-input:before {
        background: ${primary?.main};
      }
      .radio
        [type='radio']
        + .custom-input-holder
        .custom-input.active_icon:before {
        background: transparent;
      }
      .radio.alt input[type='radio']:checked + .custom-input-holder {
        border-right-color: ${primary?.main};
      }
      .radio.alt input[type='radio']:checked + .custom-input-holder:after {
        background: ${primary?.main};
      }
      .radio.alt .custom-input-holder .custom-input:before {
        background: ${primary?.main};
      }
      .subscribe--button {
        background: ${primary?.main};
        border: 1px solid ${primary?.main};
      }
      .subscribe p {
        color: ${primary?.main};
      }
      .social-networks li a {
        color: ${primary?.main};
      }
      .footer-links li a:hover {
        color: ${primary?.main};
      }
      /* cropperJS */
      .cropper-view-box {
        outline-color: ${primary?.main} !important;
      }
      .cropper-point {
        background-color: ${primary?.main} !important;
      }
      @media (max-width: 767px) {
        .user-login-box .user-dropdown {
          background: ${primary?.main};
        }
      }
      .dots-area > span:nth-child(1) {
        background: ${primary?.main};
      }
      .dots-area > span:nth-child(2) {
        background: ${secondary?.main};
      }
      .custom-fileupload.custom-fileuploadHover:hover:after {
        border-color: ${primary?.main};
      }
      .color-primary {
        color: ${primary?.main};
      }
      .app-popup {
        background-color: ${primary?.main};
      }
      .primary-shadow:hover {
        cursor: pointer;
        border-color: ${primary?.main}33;
        box-shadow: 0 0 5px ${primary?.main}33;
      }
      .c-rate .rc-rate-star-half .rc-rate-star-first,
      .c-rate .rc-rate-star-full .rc-rate-star-second {
        color: ${primary?.main};
      }
      .time-area .time-holder.active .opener {
        background: ${primary?.main};
      }
      .time-area .opener {
        color: ${primary?.main};
        background: ${primary?.main}1a;
        border-color: ${primary?.main}33;
      }
      .time-area .opener:hover {
        background: ${primary?.main}59;
      }
      .time-area .text:before {
        border-color: transparent transparent transparent ${primary?.main};
      }
      .time-area .btn-close {
        background: ${primary?.main}4D;
      }
      .time-area .link {
        color: ${primary?.main}B3;
      }
      .toggle-switch input:checked + .switcher {
        background: ${primary?.main};
      }
      .rc-tooltip-inner {
        background: ${primary?.main};
        color: #fff;
        border-color: ${primary?.main};
      }
      .rc-tooltip-placement-top .rc-tooltip-arrow,
      .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
      .rc-tooltip-placement-topRight .rc-tooltip-arrow {
        border-top-color: ${primary?.main};
      }
      .background-image-edit .btn.btn-white:hover,
      .profile .btn-edit:hover {
        background: ${primary?.main};
        border-color: ${primary?.main};
      }
      .dot-indicator li.visited::before {
        background: ${primary?.main}99;
      }
      .dot-indicator li.active::after {
        background: ${primary?.main};
      }
      .button-fileupload:hover {
        background: ${primary?.main};
      }
      .notification-bar .btn-bar {
        background: ${primary?.main};
      }
      .notification-bar .btn-bar:hover {
        background: ${primary?.main}a0;
      }
      .notification-bar__left-box a {
        color: ${primary?.main};
      }
      .notification-bar__left-box a:hover {
        color: ${primary?.main}a0;
      }
      .notification-bar__close:hover {
        color: ${primary?.main};
      }
      .user-dropdown .icon {
        color: ${primary?.main};
      }
      .react-datepicker__day--selected {
        background-color: ${primary?.main};
      }
      .react-datepicker__day--selected:hover {
        background-color: ${primary?.main}80;
      }
      .pop-wigdet .header .icon {
        background: ${primary?.main};
      }
      .rc-according.open .rc-header .icon {
        background: ${primary?.main};
      }
      .pop-wigdet .btn.btn-primary .icon {
        color: ${primary?.main};
      }
      .icon-secondary {
        color: ${secondary?.main};
      }
      .icon-secondary-dark {
        color: ${secondary?.dark};
      }
    `;
  }}
`;

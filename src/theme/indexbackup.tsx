import React from 'react';

const index: React.FC<any> = () => {
  // const primay = '255B87';
  // const secondary = '255b87';
  // const secondaryDark = '236fb7';
  return (
    <style>
      {`
        .btn-primary {
          background-color: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .icon--round {
          color: var(--pallete-primary-main);
        }
        .input-focus {
          border-color: var(--pallete-primary-main) !important;
        }
        .price-setup {
          border: 2px solid var(--pallete-primary-main);
        }
        .price-tag {
          background: var(--pallete-primary-main);
        }
        .selectable:hover {
          background: var(--pallete-primary-main) !important;
          border-color: var(--pallete-primary-main) !important;
        }
        .number--tag {
          background: var(--pallete-primary-main);
        }
        .btn-outline-primary {
          color: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .btn-outline-primary:hover {
          background-color: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .btn-outline-primary.disabled,
        .btn-outline-primary:disabled {
          color: var(--pallete-primary-main);
        }
        .btn-outline-primary:not(:disabled):not(.disabled):active,
        .btn-outline-primary:not(:disabled):not(.disabled).active,
        .show > .btn-outline-primary.dropdown-toggle {
          background-color: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .btn-outline-secondary {
          color: var(--pallete-secondary-main);
          border-color: var(--pallete-secondary-main);
        }
        .btn-outline-secondary:hover {
          background-color: var(--pallete-secondary-main);
          border-color: var(--pallete-secondary-main);
        }
        .btn-outline-secondary.disabled,
        .btn-outline-secondary:disabled {
          color: var(--pallete-secondary-main);
        }
        .btn-outline-secondary:not(:disabled):not(.disabled):active,
        .btn-outline-secondary:not(:disabled):not(.disabled).active,
        .show > .btn-outline-secondary.dropdown-toggle {
          background-color: var(--pallete-secondary-main);
          border-color: var(--pallete-secondary-main);
        }
        .badge-primary {
          background-color: var(--pallete-primary-main);
        }
        .badge-secondary {
          background-color: var(--pallete-secondary-main);
        }
        .bg-primary {
          background-color: var(--pallete-primary-main) !important;
        }
        .bg-secondary {
          background-color: var(--pallete-secondary-main) !important;
        }
        .border-primary {
          border-color: var(--pallete-primary-main) !important;
        }
        .border-secondary {
          border-color: var(--pallete-secondary-main) !important;
        }
        .text-primary {
          color: var(--pallete-primary-main) !important;
        }
        .text-secondary {
          color: var(--pallete-secondary-main) !important;
        }
        .primary-text {
          color: var(--pallete-primary-main) !important;
        }
        .secondary-text {
          color: var(--pallete-secondary-main) !important;
        }
        hr.divider-primary {
          border-top-color: var(--pallete-primary-main);
        }
        hr.divider-secondary {
          border-top-color: var(--pallete-secondary-main);
        }
        .icon-star1:before {
          color: var(--pallete-primary-main);
        }
        .pager .link-previous [class^='icon-'],
        .pager .link-previous [class*=' icon-'],
        .pager .link-next [class^='icon-'],
        .pager .link-next [class*=' icon-'] {
          color: var(--pallete-primary-main);
        }
        .pager .link-previous:hover [class^='icon-'],
        .pager .link-previous:hover [class*=' icon-'],
        .pager .link-next:hover [class^='icon-'],
        .pager .link-next:hover [class*=' icon-'] {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .status-widget .price-box .price {
          background: var(--pallete-primary-main);
        }
        .share-popup {
          background: var(--pallete-primary-main);
        }
        .question--icon:before {
          background: var(--pallete-primary-main);
        }
        .question--icon:after {
          border-color: transparent transparent transparent var(--pallete-primary-main);
        }
        .question--price {
          color: var(--pallete-primary-main);
        }
        .question--arrow {
          color: var(--pallete-primary-main);
          border: 1px solid var(--pallete-primary-main);
        }
        .question:hover {
          color: var(--pallete-primary-main);
        }
        .question:hover .question--arrow {
          background: var(--pallete-primary-main);
        }
        .social:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .btn-simple:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .btn-simple .icon--round {
          background: var(--pallete-primary-main);
        }
        .btn-simple:hover .icon--round {
          color: var(--pallete-primary-main);
        }
        .promo--price {
          background: var(--pallete-primary-main);
          border: 1px solid var(--pallete-primary-main);
        }
        .promo:hover .promo--title {
          color: var(--pallete-primary-main);
        }
        .bio--img {
          background: var(--pallete-primary-main);
        }
        .bio--subtitle {
          color: var(--pallete-primary-main);
        }
        .tags a {
          color: var(--pallete-primary-main);
        }
        .tags a:hover {
          background: var(--pallete-primary-main);
        }
        .shoutout--list li a {
          color: var(--pallete-primary-main);
        }
        .slick-arrow {
          color: var(--pallete-primary-main);
        }
        .slick-arrow:hover {
          background: var(--pallete-primary-main);
        }
        .jcf-select .jcf-select-opener {
          color: var(--pallete-primary-main);
        }
        .jcf-select.jcf-drop-active .jcf-select-opener {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .jcf-select-drop.jcf-select-small .jcf-selected {
          background: var(--pallete-primary-main);
        }
      
        .form-control:focus {
          border-color: var(--pallete-primary-main);
        }
        .button-fileupload.white:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .fileupload-toolbar .status {
          color: var(--pallete-primary-main);
        }
        .fileupload-toolbar .status .icon-tick {
          background: var(--pallete-primary-main);
        }
        .creditcard .form-control:focus {
          border-color: var(--pallete-primary-main);
        }
        .profile-photo .btn-add {
          background: var(--pallete-primary-main);
        }
        .profile-photo .link-skip {
          color: var(--pallete-primary-main);
        }
        .date-widget .btn-prev,
        .date-widget .btn-next {
          background: var(--pallete-primary-main);
        }
        .date-accordion.active .opener {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .date-accordion .opener:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .sorting-widget .title span {
          color: var(--pallete-primary-main);
        }
        .paging li a:hover,
        .paging li span:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .paging li.active a,
        .paging li.active span {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .breadcrumbs li {
          color: var(--pallete-primary-main);
        }
        .forfrom-widget a:hover {
          color: var(--pallete-primary-main);
        }
        .buyerprice-widget .title {
          color: var(--pallete-primary-main);
        }
        .buyerprice-widget .price-box .price {
          background: var(--pallete-primary-main);
        }
        .dates-widget .date-box + .date-box .icon {
          background: var(--pallete-primary-main);
        }
        .live-link-bar .icon span {
          color: var(--pallete-primary-main);
        }
        .addatendee-widget .title span {
          background: var(--pallete-primary-main);
        }
        .addatendee-widget .btn.btn-secondary {
          background: var(--pallete-secondary-main);
          border-color: var(--pallete-secondary-main);
        }
        .attendee-wedget .btn-edit:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .purchased-widget .subtext {
          color: var(--pallete-secondary-main);
        }
        .transaction-table .icon.pink {
          background: var(--pallete-primary-main);
        }
        .question.dragable .icon:before {
          background: var(--pallete-primary-main);
        }
        .question.dragable .icon:after {
          border-color: transparent transparent transparent var(--pallete-primary-main);
        }
        .question.dragable .btn-edit:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .section-head .edit-btn:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .chat-header .title a {
          color: var(--pallete-secondary-main);
        }
        .chat-box .title a {
          color: var(--pallete-secondary-main);
        }
        .message-widget .upload-file:hover .icon-url {
          background: var(--pallete-primary-main);
        }
        .message-widget .upload-file:hover .txt {
          color: var(--pallete-primary-main);
        }
        .message-widget .btn.btn-success:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .color-chooser .button {
          border: 2px solid var(--pallete-primary-main);
        }
        .color-chooser label {
          background: var(--pallete-secondary-main);
        }
        .color-chooser .custom-input:after {
          border: 2px solid var(--pallete-primary-main);
        }
        .color-chooser [type='radio']:checked + .custom-input {
          background: var(--pallete-primary-main);
        }
        .checkbox.checkbox-border .label-text:after {
          border: 2px solid var(--pallete-primary-main);
        }
        .checkbox
          [type='checkbox']
          + .custom-input-holder
          .custom-input:before {
          color: var(--pallete-primary-main);
        }
        .checkbox.alt input[type='checkbox']:checked + .custom-input-holder {
          border-right-color: var(--pallete-primary-main);
        }
        .checkbox.alt
          input[type='checkbox']:checked
          + .custom-input-holder:after {
          background: var(--pallete-primary-main);
        }
        .checkbox.alt .custom-input-holder .custom-input:before {
          color: var(--pallete-primary-main);
        }
        .radio.radio-border .label-text:after {
          border: 2px solid var(--pallete-primary-main);
        }
        .radio [type='radio'] + .custom-input-holder .custom-input:before {
          background: var(--pallete-primary-main);
        }
        .radio [type='radio'] + .custom-input-holder .custom-input.active_icon:before {
          background: transparent;
        }
        .radio.alt input[type='radio']:checked + .custom-input-holder {
          border-right-color: var(--pallete-primary-main);
        }
        .radio.alt input[type='radio']:checked + .custom-input-holder:after {
          background: var(--pallete-primary-main);
        }
        .radio.alt .custom-input-holder .custom-input:before {
          background: var(--pallete-primary-main);
        }
        .subscribe--button {
          background: var(--pallete-primary-main);
          border: 1px solid var(--pallete-primary-main);
        }
        .subscribe p {
          color: var(--pallete-primary-main);
        }
        .social-networks li a {
          color: var(--pallete-primary-main);
        }
        .footer-links li a:hover {
          color: var(--pallete-primary-main);
        }
        /* cropperJS */
        .cropper-view-box {
          outline-color: var(--pallete-primary-main) !important;
        }
        .cropper-point {
          background-color: var(--pallete-primary-main) !important;
        }
        @media (max-width: 767px) {
          .user-login-box .user-dropdown {
            background: var(--pallete-primary-main);
          }
        }
        .dots-area > span:nth-child(1) {
          background: var(--pallete-primary-main);
        }
        .dots-area > span:nth-child(2) {
          background: var(--pallete-secondary-main);
        }
        .custom-fileupload.custom-fileuploadHover:hover:after {
          border-color: var(--pallete-primary-main);
        }
        .color-primary {
          color: var(--pallete-primary-main);
        }
        .app-popup {
          background-color: var(--pallete-primary-main);
        }
        .primary-shadow:hover {
          cursor: pointer;
          border-color: rgba(var(--pallete-primary-main-rgb) , 0.2);
          box-shadow: 0 0 5px rgba(var(--pallete-primary-main-rgb) , 0.2);
        }
        .c-rate .rc-rate-star-half .rc-rate-star-first,
        .c-rate .rc-rate-star-full .rc-rate-star-second {
          color: var(--pallete-primary-main);
        }
        .time-area .time-holder.active .opener {
          background: var(--pallete-primary-main);
        }
        .time-area .opener {
          color: var(--pallete-primary-main);
          background: rgba(var(--pallete-primary-main-rgb) , 0.1);
          border-color: rgba(var(--pallete-primary-main-rgb) , 0.2);
        }
        .time-area .opener:hover {
          background: rgba(var(--pallete-primary-main-rgb), 0.35);
        }
        .time-area .text:before {
          border-color: transparent transparent transparent var(--pallete-primary-main);
        }
        .time-area .btn-close {
          background: rgba(var(--pallete-primary-main-rgb), 0.30);
        }
        .time-area .link {
          color: rgba(var(--pallete-primary-main-rgb), 0.70);
        }
        .toggle-switch input:checked + .switcher {
          background: var(--pallete-primary-main);
        }
        .rc-tooltip-inner {
          background: var(--pallete-primary-main);
          color: #fff;
          border-color: var(--pallete-primary-main);
        }
        .rc-tooltip-placement-top .rc-tooltip-arrow,
        .rc-tooltip-placement-topLeft .rc-tooltip-arrow,
        .rc-tooltip-placement-topRight .rc-tooltip-arrow {
          border-top-color: var(--pallete-primary-main);
        }
        .background-image-edit .btn.btn-white:hover,
        .profile .btn-edit:hover {
          background: var(--pallete-primary-main);
          border-color: var(--pallete-primary-main);
        }
        .dot-indicator li.visited::before {
          background: rgba(var(--pallete-primary-main-rgb), 0.60);
        }
        .dot-indicator li.active::after {
          background: var(--pallete-primary-main);
        }
        .button-fileupload:hover {
          background: var(--pallete-primary-main);
        }
        .notification-bar .btn-bar {
          background: var(--pallete-primary-main);
        }
        .notification-bar .btn-bar:hover {
          background: rgba(var(--pallete-primary-main-rgb), 0.63);
        }
        .notification-bar__left-box a {
          color: var(--pallete-primary-main);
        }
        .notification-bar__left-box a:hover {
          color: rgba(var(--pallete-primary-main-rgb), 0.63);
        }
        .notification-bar__close:hover {
          color: var(--pallete-primary-main);
        }
        .user-dropdown .icon {
          // color: var(--pallete-primary-main);
        }
        .react-datepicker__day--selected {
          background-color: var(--pallete-primary-main);
        }
        .react-datepicker__day--selected:hover {
          background-color: rgba(var(--pallete-primary-main-rgb), 0.50);
        }
        .pop-wigdet .header .icon {
          background: var(--pallete-primary-main);
        }
        .rc-according.open .rc-header .icon {
          background: var(--pallete-primary-main);
        }
        .pop-wigdet .btn.btn-primary .icon {
          color: var(--pallete-primary-main);
        }
        .icon-secondary {
          color: var(--pallete-secondary-main);
        }
        .icon-secondary-dark {
          color: var(--pallete-secondary-dark);
        }
        
      `}
    </style>
  );
};

export default index;

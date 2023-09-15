const Link = ({ color }: { color?: string }) => {
  const fill = color || 'var(--pallete-primary-main)';
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill={fill} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.0684 10.2222C25.2681 10.2222 25.4676 10.2222 25.6672 10.2222C28.0765 10.5533 29.4445 11.9257 29.7777 14.3329C29.7777 14.5324 29.7777 14.732 29.7777 14.9315C29.6931 16.6574 28.6112 17.6147 27.6825 18.5433C26.6943 19.5316 25.757 20.4888 24.849 21.3969C23.9319 22.3139 23.0186 23.3369 21.2173 23.4522C19.8364 23.5406 18.7702 22.9947 18.0445 22.3547C17.798 22.1374 17.5035 21.9036 17.3858 21.5764C17.149 20.9175 17.5292 20.3947 18.0045 20.2196C18.8293 19.9154 19.2322 20.6662 19.6607 20.9579C19.9951 21.1856 20.4332 21.3563 20.9577 21.357C21.4868 21.3577 21.912 21.175 22.2348 20.9579C22.6754 20.6617 23.1072 20.1655 23.5319 19.7406C24.3647 18.9078 25.2311 18.0414 26.0462 17.2264C26.4495 16.8231 26.9825 16.3681 27.2834 15.9292C27.4499 15.6866 27.6307 15.2536 27.6626 14.8717C27.7477 13.8482 27.2586 13.1128 26.6049 12.6966C25.8235 12.1991 24.7813 12.2503 24.0907 12.7166C23.7929 12.9175 23.5564 13.1909 23.3124 13.4349C22.5229 14.2244 21.9483 14.8455 21.0576 15.6698C20.362 15.2316 18.937 15.2081 18.184 15.61C19.1578 14.5921 20.1939 13.5603 21.2172 12.537C22.2353 11.5187 23.2036 10.3483 25.0684 10.2222Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9115 29.7778C14.7186 29.7778 14.5257 29.7778 14.3328 29.7778C11.9267 29.4434 10.5534 28.0762 10.2221 25.6672C10.2221 25.4677 10.2221 25.2681 10.2221 25.0686C10.3223 23.3108 11.3812 22.393 12.3173 21.4567C13.3109 20.4631 14.2576 19.5164 15.1709 18.6031C16.08 17.694 16.9905 16.6284 18.8226 16.5478C20.2149 16.4866 21.247 17.0073 21.9754 17.6653C22.2107 17.8779 22.5266 18.1185 22.634 18.4435C22.9224 19.3182 22.0802 20.1646 21.1772 19.7606C20.7652 19.5762 20.5949 19.1832 20.2194 18.9623C19.4824 18.529 18.4025 18.5946 17.7451 19.0422C17.3217 19.3306 16.8905 19.8569 16.488 20.2595C15.6552 21.0923 14.8215 21.9259 14.0136 22.7337C13.6212 23.1261 13.1062 23.5492 12.7764 23.991C12.4856 24.3805 12.3079 24.9315 12.3374 25.5074C12.4152 27.0239 14.147 28.3092 15.7696 27.3832C16.4139 27.0156 16.8578 26.3948 17.3859 25.8667C17.6327 25.6199 17.8954 25.3573 18.1641 25.0885C18.4148 24.8378 18.6659 24.5656 18.9622 24.3501C19.6737 24.761 21.0711 24.7927 21.8159 24.39C20.8496 25.4219 19.7893 26.4366 18.7627 27.4631C17.7445 28.4814 16.7971 29.6723 14.9115 29.7778Z"
        fill="white"
      />
    </svg>
  );
};
export default Link;
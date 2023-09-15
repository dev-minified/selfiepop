const AddScheduleMessage = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '44', height = '44', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M18.35 11V13.1H24.65V11H26.75V13.1H30.95C31.2285 13.1 31.4955 13.2106 31.6925 13.4075C31.8894 13.6045 32 13.8715 32 14.15V30.95C32 31.2285 31.8894 31.4955 31.6925 31.6925C31.4955 31.8894 31.2285 32 30.95 32H12.05C11.7715 32 11.5045 31.8894 11.3075 31.6925C11.1106 31.4955 11 31.2285 11 30.95V14.15C11 13.8715 11.1106 13.6045 11.3075 13.4075C11.5045 13.2106 11.7715 13.1 12.05 13.1H16.25V11H18.35ZM29.9 18.35H13.1V29.9H29.9V18.35Z"
        fill="var(--pallete-text-main)"
      />
      <path
        d="M24.7586 23.3104H22.5862V21.1379H20.4137V23.3104H18.2413V25.4828H20.4137V27.6552H22.5862V25.4828H24.7586V23.3104Z"
        fill="var(--pallete-text-main)"
      />
    </svg>
  );
};
export default AddScheduleMessage;

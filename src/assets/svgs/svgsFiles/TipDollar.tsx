function TipDollar(props: React.SVGAttributes<SVGElement>) {
  const { width = '22', height = '22', fill = 'currentColor', ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 19.9048C15.918 19.9048 19.9048 15.918 19.9048 11C19.9048 6.08204 15.918 2.09524 11 2.09524C6.08204 2.09524 2.09524 6.08204 2.09524 11C2.09524 15.918 6.08204 19.9048 11 19.9048ZM11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z"
        fill={fill}
      />
      <path
        d="M12.5194 13.5276C12.5194 13.1361 12.4055 12.8259 12.1776 12.5967C11.9547 12.3628 11.5733 12.148 11.0334 11.9523C10.4935 11.7566 10.0279 11.5632 9.63659 11.3723C9.24528 11.1766 8.90846 10.9546 8.62612 10.7064C8.34874 10.4534 8.13079 10.1574 7.97229 9.81849C7.81873 9.47957 7.74196 9.0762 7.74196 8.60839C7.74196 7.80165 8.00944 7.14051 8.54439 6.62496C9.07934 6.10941 9.79014 5.80868 10.6768 5.72275V4.19043H11.8656V5.74423C12.7423 5.86357 13.4283 6.21682 13.9237 6.80397C14.419 7.38635 14.6666 8.14296 14.6666 9.07381H12.5194C12.5194 8.50098 12.3956 8.07374 12.1479 7.7921C11.9052 7.50569 11.5783 7.36248 11.1672 7.36248C10.761 7.36248 10.4465 7.47466 10.2236 7.69902C10.0007 7.9186 9.88921 8.22411 9.88921 8.61555C9.88921 8.97834 9.99818 9.26953 10.2161 9.48911C10.4341 9.7087 10.8378 9.93306 11.4272 10.1622C12.0216 10.3913 12.5095 10.6085 12.8909 10.8138C13.2723 11.0143 13.5943 11.2434 13.8568 11.5012C14.1193 11.7542 14.3199 12.0454 14.4586 12.3747C14.5973 12.6994 14.6666 13.0789 14.6666 13.5132C14.6666 14.3248 14.4041 14.9835 13.8791 15.4895C13.354 15.9955 12.6308 16.2939 11.7095 16.3846V17.8095H10.5282V16.3917C9.51276 16.2867 8.72519 15.9406 8.16546 15.3535C7.6107 14.7615 7.33331 13.9763 7.33331 12.9977H9.48056C9.48056 13.5658 9.61925 14.0025 9.89664 14.3081C10.179 14.6088 10.5827 14.7592 11.1077 14.7592C11.5436 14.7592 11.8879 14.6494 12.1405 14.4298C12.3931 14.2054 12.5194 13.9047 12.5194 13.5276Z"
        fill={fill}
      />
    </svg>
  );
}
export default TipDollar;
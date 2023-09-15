const SolidHeart = (props: React.SVGAttributes<SVGElement>) => {
  const { width = '22', height = '20', fill = 'currentColor', ...rest } = props;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox="0 0 1024 1024"
      {...rest}
    >
      <path d="M934.42 148.89c-46.817-53.749-115.373-87.526-191.818-87.526-89.284 0-167.806 46.076-213.087 115.746l-0.6 0.984c-8.265 11.537-16.585 24.832-24.093 38.634l-1.015 2.040c-8.476-15.823-16.785-29.12-25.855-41.836l0.788 1.162c-45.88-70.655-124.403-116.73-213.686-116.73-76.445 0-145.001 33.777-191.557 87.221l-0.26 0.305c-45.543 53.062-73.268 122.573-73.268 198.559 0 1.546 0.011 3.090 0.034 4.631l-0.003-0.233c3.328 95.533 41.971 181.443 103.195 245.621l-0.14-0.148c79.469 86.382 163.755 165.255 253.594 237.503l4.454 3.464c38.994 33.26 79.34 67.584 122.266 105.144l1.311 1.188c5.124 4.503 11.886 7.25 19.29 7.25 0.044 0 0.088 0 0.132 0h-0.007c0.018 0 0.038 0 0.059 0 7.438 0 14.235-2.746 19.432-7.28l-0.035 0.030 1.311-1.188c42.926-37.56 83.272-71.885 122.266-105.144 94.293-75.713 178.579-154.586 256.57-239.341l1.478-1.627c61.073-64.033 99.702-149.945 102.997-244.837l0.018-0.637c0.016-1.162 0.025-2.534 0.025-3.908 0-76.224-27.918-145.927-74.085-199.443l0.332 0.394z"></path>
    </svg>
  );
};
export default SolidHeart;

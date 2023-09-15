const DollarChat = (props: React.SVGAttributes<SVGElement>) => {
  const {
    color = 'var(--pallete-primary-main)',
    width = '24',
    height = '23',
    fill = 'none',
    ...rest
  } = props;
  return (
    <svg
      width={width}
      height={height}
      className="dollar"
      viewBox="0 0 24 23"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M11.7088 0C18.0999 0 23.2805 5.14855 23.2805 11.5C23.2805 17.8514 18.0999 23 11.7088 23C9.73934 23 7.88439 22.5112 6.26089 21.6488L0.137146 23L1.49798 16.9165C0.6301 15.3019 0.137146 13.4585 0.137146 11.5C0.137146 5.14855 5.31779 0 11.7088 0ZM11.7088 2.3C6.59647 2.3 2.45148 6.4193 2.45148 11.5C2.45148 13.0352 2.82872 14.5107 3.53922 15.8309L3.94423 16.583L3.18513 19.9709L6.59646 19.2188L7.3521 19.6201C8.68053 20.3263 10.164 20.7 11.7088 20.7C16.8212 20.7 20.9662 16.5807 20.9662 11.5C20.9662 6.4193 16.8212 2.3 11.7088 2.3Z"
        fill={color}
      />
      <path
        d="M11.0066 18C10.9292 18 10.8596 17.9663 10.7977 17.8989C10.7435 17.8315 10.7164 17.7448 10.7164 17.6389V16.6422C10.1437 16.5556 9.65229 16.3726 9.24212 16.0933C8.83969 15.8141 8.534 15.477 8.32504 15.0822C8.12383 14.6778 8.01548 14.2493 8 13.7967C8 13.7196 8.02322 13.6522 8.06965 13.5944C8.12383 13.527 8.18574 13.4933 8.25539 13.4933H9.71808C9.81095 13.4933 9.88447 13.5174 9.93864 13.5656C10.0006 13.6041 10.0625 13.6667 10.1244 13.7533C10.225 14.0037 10.3836 14.2107 10.6003 14.3744C10.8248 14.5381 11.1266 14.62 11.5058 14.62C11.9469 14.62 12.2836 14.5333 12.5158 14.36C12.7479 14.1867 12.864 13.9507 12.864 13.6522C12.864 13.4404 12.8021 13.267 12.6783 13.1322C12.5622 12.9974 12.3765 12.877 12.1211 12.7711C11.8657 12.6652 11.4865 12.5448 10.9834 12.41C10.047 12.1789 9.35047 11.8274 8.89386 11.3556C8.43726 10.8837 8.20896 10.2144 8.20896 9.34778C8.20896 8.57741 8.43339 7.92259 8.88226 7.38333C9.33112 6.83444 9.94251 6.49741 10.7164 6.37222V5.36111C10.7164 5.25519 10.7435 5.16852 10.7977 5.10111C10.8596 5.0337 10.9292 5 11.0066 5H11.9701C12.0553 5 12.1249 5.0337 12.1791 5.10111C12.2333 5.16852 12.2604 5.25519 12.2604 5.36111V6.40111C12.7711 6.50704 13.2084 6.70926 13.5721 7.00778C13.9436 7.29667 14.2261 7.62889 14.4196 8.00444C14.613 8.38 14.7175 8.75074 14.733 9.11667C14.733 9.1937 14.7098 9.26593 14.6633 9.33333C14.6169 9.39111 14.5589 9.42 14.4892 9.42H12.9569C12.864 9.42 12.7866 9.40074 12.7247 9.36222C12.6705 9.3237 12.6202 9.26111 12.5738 9.17444C12.5274 8.95296 12.3997 8.76518 12.1907 8.61111C11.9895 8.45704 11.738 8.38 11.4362 8.38C11.0879 8.38 10.8209 8.45704 10.6352 8.61111C10.4494 8.76518 10.3566 8.99148 10.3566 9.29C10.3566 9.49222 10.4069 9.66074 10.5075 9.79556C10.6158 9.93037 10.7861 10.0556 11.0182 10.1711C11.2582 10.277 11.5987 10.3878 12.0398 10.5033C12.7595 10.667 13.3322 10.8741 13.7579 11.1244C14.1835 11.3652 14.497 11.6781 14.6982 12.0633C14.8994 12.4485 15 12.9396 15 13.5367C15 14.3841 14.7523 15.0774 14.257 15.6167C13.7617 16.1559 13.0962 16.493 12.2604 16.6278V17.6389C12.2604 17.7448 12.2333 17.8315 12.1791 17.8989C12.1249 17.9663 12.0553 18 11.9701 18H11.0066Z"
        fill={color}
      />
      10
    </svg>
  );
};
export default DollarChat;
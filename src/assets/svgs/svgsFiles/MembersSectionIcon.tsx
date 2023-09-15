const MembersSectionIcon = (props: IconProps) => {
  const { width = 19, height = 20, ...rest } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M11.2444 18L9.2 20L7.15556 18H2.03933C1.49847 18 0.979756 17.7898 0.597307 17.4157C0.214858 17.0415 0 16.5341 0 16.005V1.995C0 0.893 0.912844 0 2.03933 0H16.3607C17.4872 0 18.4 0.893 18.4 1.995V16.005C18.4 16.5341 18.1851 17.0415 17.8027 17.4157C17.4202 17.7898 16.9015 18 16.3607 18H11.2444ZM16.3556 16V2H2.04444V16H8.00196L9.2 17.172L10.398 16H16.3556ZM5.08249 15.18C4.4538 14.9136 3.85414 14.586 3.29258 14.202C3.94094 13.219 4.83099 12.4108 5.88125 11.8514C6.93151 11.292 8.10843 10.9993 9.30427 11C11.7576 11 13.9216 12.207 15.2107 14.047C14.6598 14.4456 14.0694 14.789 13.4484 15.072C12.975 14.43 12.3523 13.9073 11.6318 13.547C10.9112 13.1868 10.1135 12.9993 9.30427 13C7.55116 13 6.00249 13.864 5.08249 15.18ZM9.2 10C8.73016 10 8.26492 9.90947 7.83084 9.73358C7.39677 9.55769 7.00236 9.29988 6.67013 8.97487C6.3379 8.64987 6.07436 8.26403 5.89456 7.83939C5.71476 7.41475 5.62222 6.95963 5.62222 6.5C5.62222 6.04037 5.71476 5.58525 5.89456 5.16061C6.07436 4.73597 6.3379 4.35013 6.67013 4.02513C7.00236 3.70012 7.39677 3.44231 7.83084 3.26642C8.26492 3.09053 8.73016 3 9.2 3C10.1489 3 11.0589 3.36875 11.7299 4.02513C12.4008 4.6815 12.7778 5.57174 12.7778 6.5C12.7778 7.42826 12.4008 8.3185 11.7299 8.97487C11.0589 9.63125 10.1489 10 9.2 10ZM9.2 8C9.60666 8 9.99667 7.84196 10.2842 7.56066C10.5718 7.27936 10.7333 6.89782 10.7333 6.5C10.7333 6.10218 10.5718 5.72064 10.2842 5.43934C9.99667 5.15804 9.60666 5 9.2 5C8.79333 5 8.40333 5.15804 8.11577 5.43934C7.82821 5.72064 7.66667 6.10218 7.66667 6.5C7.66667 6.89782 7.82821 7.27936 8.11577 7.56066C8.40333 7.84196 8.79333 8 9.2 8Z"
        fill="var(--pallete-text-main)"
      />
    </svg>
  );
};
export default MembersSectionIcon;
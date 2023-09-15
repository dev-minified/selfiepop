function AvatarName(
  props: React.SVGAttributes<SVGElement> & {
    text: string;
    textColor?: string;
    slice?: boolean;
  },
) {
  const {
    width = 64,
    height = 64,
    text = '',
    fill = '#3a3a3a',
    textColor = '#ffffff',
    fontSize = 28,
    slice = true,
    ...rest
  } = props;
  const cx = parseFloat(`${width}` || '64');
  const cy = parseFloat(`${height}` || '64');
  if (!text) {
    return null;
  }
  let txt = text;
  if (slice) {
    txt = text.slice(0, 1)?.toUpperCase();
    // const secondt = text.slice(1, 2);
    // if (secondt) {
    //   txt += secondt.toLowerCase();
    // }
  }
  // let splitText = text.split(' ');
  // let txt = '';
  // if (splitText.length > 2) {
  //   splitText = splitText.slice(0, 2);
  // }
  // splitText.forEach((a) => {
  //   txt += (a || '').slice(0, 1);
  // });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={'100%'}
      height={'100%'}
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      {...rest}
    >
      <circle
        fill={fill}
        cx={cx / 2}
        width={width}
        height={height}
        cy={cy / 2}
        r={cy / 2}
      />
      <text
        x="50%"
        y="50%"
        style={{
          color: textColor,
          lineHeight: 1,
          fontFamily: 'inherit',
        }}
        // style="color: #222; line-height: 1;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;"
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="400"
        dy=".1em"
        dominantBaseline="middle"
        fill={textColor}
      >
        {txt || ''}
      </text>
    </svg>
  );
}

export default AvatarName;

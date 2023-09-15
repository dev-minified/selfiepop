const GetSvg = (pattern: string, color?: string) => {
  switch (pattern) {
    case 'pattern4':
      return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 4 4" style="enable-background:new 0 0 4 4;" xml:space="preserve" width="4px" height="4px">
   <rect x="2" width="2" height="2" fill="${color}"/>
   <rect x="2" y="2" width="2" height="2"  fill="${color}"/>
   <rect width="2" height="2"  fill="${color}"/>
   <rect y="2" width="2" height="2"  fill="${color}"/>
   </svg>
 `;
    case 'pattern3':
      return `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 4 4" style="enable-background:new 0 0 4 4;" xml:space="preserve" width="4px" height="4px">
   <rect x="2" width="2" height="2" fill="${color}"/>
   <rect x="2" y="2" width="2" height="2" fill="${color}"/>
   </svg>
  `;
    case 'pattern2':
      return `
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 4 4" style="enable-background:new 0 0 4 4;" xml:space="preserve" width="4px" height="4px">
   <rect y="2" width="2" height="2" fill="${color}"/>
   <rect x="2" y="2" width="2" height="2" fill="${color}"/>
   </svg>

        `;
    default:
      return `
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      viewBox="0 0 4 4" style="enable-background:new 0 0 4 4;" xml:space="preserve" width="4px" height="4px">
   <rect y="2" width="2" height="2" fill="${color}"/>
   <rect x="2" width="2" height="2" fill="${color}"/>
   </svg>
        `;
  }
};

export default GetSvg;

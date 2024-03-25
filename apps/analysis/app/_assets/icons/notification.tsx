import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="19"
    height="22"
    viewBox="0 0 19 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.041 16L18.041 18V19H0.0410156V18L2.04102 16V10C2.04102 6.65 4.40102 3.85 7.54102 3.17V2C7.54102 1.17 8.21102 0.5 9.04102 0.5C9.87102 0.5 10.541 1.17 10.541 2V3.17C13.681 3.85 16.041 6.65 16.041 10V16ZM11.031 20.01C11.031 21.11 10.141 22 9.04102 22C7.94102 22 7.05102 21.11 7.05102 20.01H11.031ZM8.04102 15V13H10.041V15H8.04102ZM8.04102 7V11H10.041V7H8.04102Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as NotificationIcon };

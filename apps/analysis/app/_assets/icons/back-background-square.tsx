import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_5991_5261)">
      <path
        d="M0 0V20H20V0H0ZM7.89297 15.6303L6.95899 14.6994L11.6431 10L6.95899 5.30062L7.89297 4.36971L13.5049 10L7.89297 15.6303Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_5991_5261">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export { SvgComponent as BackSquareIcon };

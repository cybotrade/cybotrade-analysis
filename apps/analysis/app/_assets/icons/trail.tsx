import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="168"
    height="162"
    fill="none"
    viewBox="0 0 168 162"
    {...props}
  >
    <mask
      id="trail"
      width="168"
      height="162"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <rect width="167" height="161" x=".5" y=".5" fill="#DDFFDC" stroke="#F0F0F0" rx="15.5" />
    </mask>
    <g mask="url(#trail)">
      <path
        stroke="#BFEEBD"
        strokeDasharray="4 4"
        strokeWidth="2"
        d="M168.283 24.042c-18.311 2.294-70.104 15.544-106.735 48.174C24.917 104.847 5.919 139.473.999 152.708"
      />
      <path
        stroke="#BFEEBD"
        strokeDasharray="4 4"
        strokeWidth="2"
        d="M-30.035 92.553c24.5 2.838 83.392 6.621 122.965-.94 39.573-7.562 74.207-31.724 86.577-42.86"
      />
    </g>
    <path
      fill="#A8D1A7"
      d="m117.632 38.57 9.734-11.512.166 7.877 4.938 6.31-14.838-2.674ZM82.355 93.764l11.488-9.763-1.126 7.798 3.838 7.032-14.2-5.067Z"
    />
  </svg>
);
export { SvgComponent as TrailBackground };

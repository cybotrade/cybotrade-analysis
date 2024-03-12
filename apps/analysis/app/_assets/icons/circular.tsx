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
      id="acr"
      width="168"
      height="162"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <rect width="167" height="161" x=".5" y=".5" fill="#E4EFFF" stroke="#F0F0F0" rx="15.5" />
    </mask>
    <g mask="url(#acr)">
      <path
        fill="url(#bcr)"
        fillRule="evenodd"
        d="M84 192c40.317 0 73-32.683 73-73s-32.683-73-73-73-73 32.683-73 73 32.683 73 73 73Zm-.486-21.416c27.684 0 50.127-22.442 50.127-50.126 0-27.684-22.443-50.127-50.127-50.127s-50.127 22.443-50.127 50.127 22.443 50.126 50.127 50.126Z"
        clipRule="evenodd"
      />
    </g>
    <circle cx="90" cy="58" r="15" fill="#E4EFFF" />
    <path
      fill="url(#ccr)"
      d="M101 58c0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11 11 4.925 11 11Z"
    />
    <defs>
      <linearGradient id="bcr" x1="84" x2="84" y1="46" y2="150.147" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93ADCF" />
        <stop offset="1" stopColor="#B592FF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ccr" x1="90" x2="90" y1="47" y2="73.583" gradientUnits="userSpaceOnUse">
        <stop stopColor="#95AED1" />
        <stop offset="1" stopColor="#818EFF" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
export { SvgComponent as CircularBackground };

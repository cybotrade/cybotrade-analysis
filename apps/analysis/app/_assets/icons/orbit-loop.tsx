import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="276"
    height="274"
    fill="none"
    viewBox="0 0 276 274"
    {...props}
  >
    <mask
      id="aol"
      width="276"
      height="274"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <rect width="276" height="274" fill="#FBF0FF" rx="20" />
    </mask>
    <g mask="url(#aol)">
      <circle cx="256.943" cy="120.181" r="4.916" fill="#EDCFF8" />
      <circle cx="127.173" cy="187.025" r="4.916" fill="#EDCFF8" />
      <circle cx="150.769" cy="122.134" r="4.916" fill="#EDCFF8" />
      <circle cx="203.857" cy="76.915" r="4.916" fill="#EDCFF8" />
      <circle cx="83.915" cy="240.103" r="4.916" fill="#EDCFF8" />
      <circle cx="226.467" cy="219.475" r="103.709" stroke="#EDCFF8" />
      <circle cx="232" cy="223" r="89.5" stroke="#EDCFF8" />
      <circle cx="235.5" cy="224.5" r="72" stroke="#EDCFF8" />
      <circle cx="226.467" cy="219.457" r="123.371" stroke="#EDCFF8" />
      <circle cx="226.467" cy="219.463" r="143.034" stroke="#EDCFF8" />
    </g>
  </svg>
);
export { SvgComponent as OrbitLoopBackground };

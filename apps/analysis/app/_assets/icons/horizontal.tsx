import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={23}
    viewBox="0 0 28 23"
    fill="none"
    {...props}
  >
    <path
      d="M1.50287 21.5167L1.50206 7.50586H22.0021L22.0029 21.5167H1.50287Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M6 5.49805V1.48242L26.501 1.49414L26.5 14.998H24.0029"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);
export { SvgComponent as Horizontal };
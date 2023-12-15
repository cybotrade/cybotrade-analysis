import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.6963 1.98828L12.6849 -0.000373087L15.9993 3.31401L14.0107 5.30267L10.6963 1.98828Z"
      fill="currentColor"
    />
    <path
      d="M2.12842 10.5566L10.0322 2.65287L13.3466 5.96725L5.4428 13.871L2.12842 10.5566Z"
      fill="currentColor"
    />
    <path d="M0 15.9998L4.65511 14.4065L1.59337 11.3447L0 15.9998Z" fill="currentColor" />
  </svg>
);
export { SvgComponent as Pencil };

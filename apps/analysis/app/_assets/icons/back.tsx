import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="26"
    height="21"
    viewBox="0 0 26 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M25.7962 9.74791H2.80674L11.5694 2.00198L10.5732 0.875L0.125 10.1109V10.8891L10.5732 20.125L11.5694 18.998L2.80674 11.2521H25.7962V9.74791Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as BackIcon };

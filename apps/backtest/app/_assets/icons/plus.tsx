import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.8696 9.13045V0H9.13045V9.13045H0V11.8696H9.13045V21H11.8696V11.8696H21V9.13045H11.8696Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as Plus };

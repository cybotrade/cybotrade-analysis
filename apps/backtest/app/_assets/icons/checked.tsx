import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="18" cy="18" r="18" fill="currentColor" />
    <path
      d="M14.7129 21.2722L25.5598 11L27 12.3639L14.7129 24L9 18.5915L10.4402 17.2275L14.7129 21.2722Z"
      fill="white"
    />
  </svg>
);
export { SvgComponent as Checked };

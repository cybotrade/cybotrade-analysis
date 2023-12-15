import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.6666 0.666016H2.66659C1.93325 0.666016 1.33325 1.26602 1.33325 1.99935V11.3327H2.66659V1.99935H10.6666V0.666016ZM12.6666 3.33268H5.33325C4.59992 3.33268 3.99992 3.93268 3.99992 4.66602V13.9993C3.99992 14.7327 4.59992 15.3327 5.33325 15.3327H12.6666C13.3999 15.3327 13.9999 14.7327 13.9999 13.9993V4.66602C13.9999 3.93268 13.3999 3.33268 12.6666 3.33268ZM5.33325 13.9993H12.6666V4.66602H5.33325V13.9993Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as Copy };

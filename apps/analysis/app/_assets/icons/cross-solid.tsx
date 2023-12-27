import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 0C6.76113 0 0 6.76113 0 15C0 23.2389 6.76113 30 15 30C23.2389 30 30 23.2389 30 15C30 6.76113 23.2389 0 15 0ZM22.4578 19.9721L19.9721 22.4578L15 17.4857L10.0279 22.4578L7.54219 19.9721L12.5143 15L7.54219 10.0279L10.0279 7.54219L15 12.5143L19.9721 7.54219L22.4578 10.0279L17.4857 15L22.4578 19.9721Z"
      fill="#FF4646"
    />
  </svg>
);
export { SvgComponent as CrossSolid };

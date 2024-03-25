import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="225"
    height="142"
    fill="none"
    viewBox="0 0 225 142"
    {...props}
  >
    <circle cx="112.5" cy="112.5" r="112.5" fill="#E3F4E1" fillOpacity=".25" />
    <circle cx="113" cy="108" r="94" fill="#E3F4E1" fillOpacity=".5" />
    <circle cx="112.5" cy="112.5" r="51.5" fill="#E0F0DF" />
  </svg>
);
export { SvgComponent as CoreLoopBackground };

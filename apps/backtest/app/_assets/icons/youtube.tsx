import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="16"
    viewBox="0 0 22 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 3.55749V11.7348C0 13.6996 1.59268 15.2923 3.55749 15.2923H18.4422C20.4071 15.2923 22 13.6996 22 11.7348V3.55749C22 1.59268 20.4071 0 18.4422 0H3.55749C1.59268 0 0 1.59268 0 3.55749ZM8.31399 12.0659V3.22625L15.0157 7.64614L8.31399 12.0659Z"
      fill="currentColor"
    />
  </svg>
);

export { SvgComponent as Youtube };

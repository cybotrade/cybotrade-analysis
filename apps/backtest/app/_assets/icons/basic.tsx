import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="21"
    height="22"
    viewBox="0 0 21 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.9272 5.21466L10.3136 0L0.700195 5.21466L10.3136 10.4295L19.9272 5.21466Z"
      fill="currentColor"
    />
    <path
      d="M11.0117 22.0006L20.6278 16.7845V6.34961L11.0117 11.5656V22.0006Z"
      fill="currentColor"
    />
    <path d="M0 6.34961V16.7845L9.61593 22.0006V11.5656L0 6.34961Z" fill="currentColor" />
  </svg>
);

export { SvgComponent as Basic };

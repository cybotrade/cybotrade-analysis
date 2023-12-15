import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M11.5 1 2 6v2h19V6m-5 4v7h3v-7M2 22h19v-3H2m8-9v7h3v-7m-9 0v7h3v-7H4Z"
    />
  </svg>
);
export { SvgComponent as Bank };

import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" {...props}>
    <path
      fill="currentColor"
      d="M17.875 0h-.938v15.063H32v-.938C32 6.37 25.63 0 17.875 0ZM4.88 28.445C7.355 30.613 10.585 32 14.125 32c7.755 0 14.063-6.37 14.063-14.125v-.938h-11.8L4.88 28.445ZM15.063 3.813h-.938a13.97 13.97 0 0 0-8.2 2.661l9.138 9.138v-11.8ZM4.473 7.674C1.764 10.24 0 13.858 0 17.874c0 3.541 1.387 6.771 3.555 9.246l10.182-10.183-9.264-9.263Z"
    />
  </svg>
);
export { SvgComponent as PieChart };

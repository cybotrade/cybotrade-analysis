import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8.85938 8.85938H18V18H8.85938V8.85938Z" fill="currentColor" />
    <path
      d="M4.57031 9.14062C7.09443 9.14062 9.14062 7.09443 9.14062 4.57031C9.14062 2.0462 7.09443 0 4.57031 0C2.0462 0 0 2.0462 0 4.57031C0 7.09443 2.0462 9.14062 4.57031 9.14062Z"
      fill="currentColor"
    />
    <path
      d="M5.09742 12.3939L6.0607 13.3269L6.8148 12.5957L4.57078 10.3242L2.38477 12.5957L3.14449 13.3269L4.04273 12.3939V16.3489H7.6125V15.2943H5.09742V12.3939Z"
      fill="currentColor"
    />
    <path
      d="M12.9033 5.60352L11.94 4.67047L11.1859 5.40172L13.4299 7.67316L15.6159 5.40172L14.8562 4.67047L13.9579 5.60352V1.64844H10.3882V2.70312H12.9033V5.60352Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as ChangeIcon };

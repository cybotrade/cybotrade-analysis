import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="43"
    viewBox="0 0 22 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.52908 10.2266L8.52989 10.2288L9.53689 12.4537C10.3647 14.2828 9.65717 16.4413 7.90715 17.4253C5.79596 18.2698 4.41168 20.3145 4.41168 22.5882H17.5882V10.6824C17.5882 4.78268 12.8055 0 6.9058 0H0.646973V14.1176H6.29403C6.29403 14.1176 8.5772 12.8924 8.52908 10.2266ZM4.41168 6.27451H2.52933V4.39216H4.41168V6.27451Z"
      fill="currentColor"
    />
    <path d="M0.646973 29.1765H21.3529V32H0.646973V29.1765Z" fill="currentColor" />
    <path d="M2.5293 24.4707H19.4705V27.2942H2.5293V24.4707Z" fill="currentColor" />
  </svg>
);
export { SvgComponent as Knight };

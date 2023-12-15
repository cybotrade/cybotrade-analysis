import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="24"
    viewBox="0 0 32 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M31.9999 0.23877H6.36597V2.78519H31.9999V0.23877Z" fill="currentColor" />
    <path d="M2.54642 0.23877H0V2.78519H2.54642V0.23877Z" fill="currentColor" />
    <path d="M2.54642 17.215H0V19.7614H2.54642V17.215Z" fill="currentColor" />
    <path d="M31.9999 17.215H6.36597V19.7614H31.9999V17.215Z" fill="currentColor" />
    <path d="M2.54642 8.72681H0V11.2732H2.54642V8.72681Z" fill="currentColor" />
    <path d="M31.9999 8.72681H6.36597V11.2732H31.9999V8.72681Z" fill="currentColor" />
  </svg>
);
export { SvgComponent as Menu };

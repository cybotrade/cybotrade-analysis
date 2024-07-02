import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5409 10C17.5409 10.34 17.5109 10.66 17.4709 10.98L19.5809 12.63C19.7709 12.78 19.8209 13.05 19.7009 13.27L17.7009 16.73C17.5809 16.95 17.3209 17.04 17.0909 16.95L14.6009 15.95C14.0809 16.34 13.5209 16.68 12.9109 16.93L12.5309 19.58C12.5009 19.82 12.2909 20 12.0409 20H8.04085C7.79085 20 7.58086 19.82 7.55086 19.58L7.17086 16.93C6.56085 16.68 6.00085 16.35 5.48085 15.95L2.99085 16.95C2.77085 17.03 2.50085 16.95 2.38086 16.73L0.380855 13.27C0.260855 13.05 0.310855 12.78 0.500855 12.63L2.61086 10.98C2.57086 10.66 2.54085 10.33 2.54085 10C2.54085 9.67 2.57086 9.34 2.61086 9.02L0.500855 7.37C0.310855 7.22 0.250855 6.95 0.380855 6.73L2.38086 3.27C2.50085 3.05 2.76085 2.96 2.99085 3.05L5.48085 4.05C6.00085 3.66 6.56085 3.32 7.17086 3.07L7.55086 0.42C7.58086 0.18 7.79085 0 8.04085 0H12.0409C12.2909 0 12.5009 0.18 12.5309 0.42L12.9109 3.07C13.5209 3.32 14.0809 3.65 14.6009 4.05L17.0909 3.05C17.3109 2.97 17.5809 3.05 17.7009 3.27L19.7009 6.73C19.8209 6.95 19.7709 7.22 19.5809 7.37L17.4709 9.02C17.5109 9.34 17.5409 9.66 17.5409 10ZM6.54085 10C6.54085 11.93 8.11086 13.5 10.0409 13.5C11.9709 13.5 13.5409 11.93 13.5409 10C13.5409 8.07 11.9709 6.5 10.0409 6.5C8.11086 6.5 6.54085 8.07 6.54085 10Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as SettingsIcon };
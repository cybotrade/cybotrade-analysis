import { SVGProps } from 'react';
import * as React from 'react';

export const SurfacePlotMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_6277_16120)">
      <circle cx="32" cy="32" r="31.5" stroke="white" />
      <circle cx="32" cy="32" r="29" fill="#FFD69A" />
      <mask
        id="mask0_6277_16120"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="3"
        width="58"
        height="58"
      >
        <circle cx="32" cy="32" r="29" fill="#FFD69A" />
      </mask>
      <g mask="url(#mask0_6277_16120)">
        <path
          opacity="0.75"
          d="M21.2279 22.1516L0.711182 37.7127L14.5286 48.7693L21.0383 38.1897L28.7647 41.8078L30.8582 56.9594L39.6511 48.7693L64.7736 37.7127H52.631L48.0252 29.9322L35.464 27.4752L27.0898 7L21.2279 22.1516Z"
          fill="#C7FFD1"
        />
        <path
          d="M3 36.8555L21.0396 38.1961L59.7586 38.6429V40.4304L39.5191 49.3677L30.7193 57.4112L28.9594 42.6647L21.0396 38.1961L14.4397 49.3677L3.43999 39.9835L3 36.8555Z"
          fill="#B0DFB8"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_6277_16120">
        <rect width="64" height="64" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

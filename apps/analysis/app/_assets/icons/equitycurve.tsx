import * as React from 'react';
import type { SVGProps } from 'react';

export const EquityCurveMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_6277_16139)">
      <circle cx="32" cy="32" r="31.5" stroke="white" />
      <circle cx="32" cy="31.9961" r="29" fill="#EE8E58" />
      <mask
        id="mask0_6277_16139"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="3"
        width="58"
        height="58"
      >
        <circle cx="32" cy="32" r="29" fill="white" />
      </mask>
      <g mask="url(#mask0_6277_16139)">
        <path
          d="M15.8088 24.365C13.5359 27.016 -2.9902 52.7929 -30.9595 40.413L-32.7936 67.4675L3.8875 75.2622L87.337 78.0133L97.7194 30.0546C49.117 36.4738 61.2017 40.413 47.9048 21.1554C34.6079 1.89787 18.5599 21.1564 15.8088 24.365Z"
          fill="#FFD69A"
          stroke="white"
        />
        <path d="M35.5013 15.2695V32.6092" stroke="white" />
        <path
          d="M19.6381 28.0119C5.17302 45.0893 -4.92175 51.6415 -29.5075 33.4458L-29.0152 63.5305L40.6788 69.9497L75.0673 71.7838L82.4036 43.8145L78.7355 29.6005L72.775 25.4727C54.4342 50.4246 43.8884 53.4432 38.3863 39.6878C36.3688 34.6442 31.5075 13.999 19.6381 28.0119Z"
          fill="#B0CAF0"
          stroke="white"
        />
        <line x1="27.8508" y1="26.3322" x2="27.8449" y2="47.3932" stroke="#D5F6ED" />
      </g>
      <circle cx="27.8167" cy="23.2565" r="1.52997" fill="white" />
      <circle cx="35.4676" cy="12.319" r="1.52997" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_6277_16139">
        <rect width="64" height="64" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

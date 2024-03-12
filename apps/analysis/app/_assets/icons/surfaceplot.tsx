import * as React from 'react';
import type { SVGProps } from 'react';

export const ActiveSurfacePlotMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="92"
    height="92"
    viewBox="0 0 92 92"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="45.9815"
      cy="45.9805"
      r="32.3089"
      transform="rotate(-142.699 45.9815 45.9805)"
      stroke="white"
    />
    <circle cx="46.0003" cy="45.9999" r="28.7499" fill="#FFD69A" />
    <mask
      id="mask0_5781_33575"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="17"
      y="18"
      width="57"
      height="58"
    >
      <ellipse cx="45.558" cy="47.1483" rx="28.3076" ry="28.7499" fill="#FFD69A" />
    </mask>
    <g mask="url(#mask0_5781_33575)">
      <path
        d="M35.2931 34.5479L14.9856 49.9503L28.662 60.8941L35.1054 50.4224L42.7529 54.0035L44.8251 69.0006L53.5283 60.8941L78.3946 49.9503H66.3759L61.8171 42.2491L49.3839 39.8171L41.0952 19.5508L35.2931 34.5479Z"
        fill="#C7FFD1"
      />
      <path
        d="M17.2504 49.1016L35.1059 50.4285L73.4301 50.8708V52.64L53.397 61.4861L44.687 69.4476L42.945 54.8515L35.1059 50.4285L28.5734 61.4861L17.6859 52.1977L17.2504 49.1016Z"
        fill="#B0DFB8"
      />
    </g>
  </svg>
);
export const DisableSurfacePlotMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="65"
    height="65"
    fill="none"
    viewBox="0 0 65 65"
    {...props}
  >
    <circle cx="32.5" cy="32.5" r="29.5" fill="url(#a)" />
    <mask
      id="b"
      width="59"
      height="60"
      x="3"
      y="4"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <ellipse cx="32.046" cy="33.516" fill="#FFD69A" rx="29.046" ry="29.5" />
    </mask>
    <g mask="url(#b)">
      <path
        fill="#fff"
        d="M21.513 20.588.675 36.392l14.034 11.23 6.611-10.746 7.847 3.675 2.127 15.388 8.93-8.318 25.515-11.23H53.406L48.73 28.49l-12.76-2.496L27.466 5.2l-5.953 15.389Z"
        opacity=".75"
      />
      <path
        fill="#fff"
        d="m3 35.52 18.321 1.361 39.324.454v1.815L40.09 48.227l-8.938 8.17-1.787-14.977-8.044-4.539-6.703 11.346-11.171-9.53L3 35.519Z"
      />
    </g>
    <circle cx="32.5" cy="32.5" r="32" stroke="#fff" />
    <defs>
      <linearGradient
        id="a"
        x1="11.623"
        x2="52.015"
        y1="55.192"
        y2="8.446"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".059" stopColor="#fff" />
        <stop offset="1" stopColor="#FC9E26" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

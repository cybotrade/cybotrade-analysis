import * as React from 'react';
import type { SVGProps } from 'react';

export const ActiveEquityCurveMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="47.9807"
      cy="47.9812"
      r="33.7355"
      transform="rotate(-142.699 47.9807 47.9812)"
      stroke="white"
    />
    <mask
      id="mask0_5781_33559"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="16"
      y="16"
      width="64"
      height="64"
    >
      <ellipse
        cx="47.9568"
        cy="47.9269"
        rx="31.4283"
        ry="31.2811"
        transform="rotate(-142.699 47.9568 47.9269)"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_5781_33559)">
      <ellipse
        cx="47.7735"
        cy="47.7324"
        rx="31.7292"
        ry="31.5076"
        transform="rotate(-142.699 47.7735 47.7324)"
        fill="#EE8E58"
      />
      <path
        d="M30.5059 39.8856C28.0126 42.7936 9.88416 71.0697 -20.797 57.4895L-22.8088 87.1671L17.4287 95.7176L108.969 98.7354L120.358 46.1268C67.0435 53.1684 80.2999 57.4895 65.7137 36.3648C51.1276 15.2401 33.5237 36.3658 30.5059 39.8856Z"
        fill="#FFD69A"
        stroke="white"
      />
      <path d="M52.1074 29.9062V48.9272" stroke="white" />
      <path
        d="M34.7064 43.8878C18.8389 62.6209 7.76535 69.8084 -19.2041 49.8485L-18.6641 82.8501L57.7872 89.8917L95.5099 91.9036L103.557 61.2225L99.5336 45.6304L92.9953 41.1024C72.8762 68.4735 61.308 71.7848 55.2723 56.6957C53.0593 51.1631 47.7267 28.5162 34.7064 43.8878Z"
        fill="#B0CAF0"
        stroke="white"
      />
      <line x1="43.667" y1="42.0431" x2="43.6604" y2="65.1462" stroke="#D5F6ED" />
    </g>
    <circle cx="43.6783" cy="38.6783" r="1.67832" fill="white" />
    <circle cx="52.0709" cy="26.6783" r="1.67832" fill="white" />
  </svg>
);

export const DisableEquityCurveMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="83"
    height="83"
    fill="none"
    viewBox="0 0 83 83"
    {...props}
  >
    <mask
      id="a"
      width="60"
      height="60"
      x="11"
      y="11"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <ellipse
        cx="41.426"
        cy="41.401"
        fill="#fff"
        rx="29.619"
        ry="29.48"
        transform="rotate(-142.699 41.426 41.401)"
      />
    </mask>
    <g mask="url(#a)">
      <ellipse
        cx="41.253"
        cy="41.212"
        fill="url(#b)"
        rx="29.902"
        ry="29.694"
        transform="rotate(-142.699 41.253 41.212)"
      />
      <path
        fill="#fff"
        stroke="#fff"
        d="M24.98 33.818c-2.35 2.74-19.434 29.388-48.349 16.59l-1.896 27.969 37.921 8.058 86.27 2.844L109.66 39.7c-50.246 6.637-37.752 10.709-51.499-9.2-13.746-19.908-30.337.001-33.18 3.319Z"
      />
      <path stroke="#FFF0DF" d="M45.34 24.41v17.926" />
      <path
        fill="url(#c)"
        stroke="#fff"
        d="M28.939 37.584C13.985 55.24 3.549 62.013-21.868 43.202l.509 31.102 72.05 6.636 35.55 1.896 7.585-28.915-3.792-14.694-6.162-4.268C64.91 60.755 54.009 63.875 48.32 49.655c-2.086-5.214-7.112-26.557-19.382-12.07Z"
      />
      <path stroke="#fff" d="m37.413 35.848-.006 21.773" />
    </g>
    <circle cx="37.434" cy="32.679" r="1.582" fill="#fff" />
    <circle cx="45.344" cy="21.609" r="1.582" fill="#fff" />
    <circle cx="41.5" cy="41.5" r="32" stroke="#fff" />
    <defs>
      <linearGradient
        id="b"
        x1="41.253"
        x2="41.253"
        y1="11.518"
        y2="70.906"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" />
        <stop offset="1" stopColor="#FC9E26" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="c"
        x1="41.17"
        x2="29.425"
        y1="25.391"
        y2="69.094"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF9000" stopOpacity=".42" />
        <stop offset="1" stopColor="#B0CAF0" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

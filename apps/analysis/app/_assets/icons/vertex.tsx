import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="168"
    height="162"
    fill="none"
    viewBox="0 0 168 162"
    {...props}
  >
    <mask
      id="abc"
      width="168"
      height="162"
      x="0"
      y="0"
      maskUnits="userSpaceOnUse"
      style={{ maskType: 'alpha' }}
    >
      <path
        fill="#FFFBDB"
        stroke="#F0F0F0"
        d="M.5 16C.5 7.44 7.44.5 16 .5h136c8.56 0 15.5 6.94 15.5 15.5v130c0 8.56-6.94 15.5-15.5 15.5H16C7.44 161.5.5 154.56.5 146V16Z"
      />
    </mask>
    <g mask="url(#abc)">
      <circle cx="84" cy="157" r="79" fill="url(#bcc)" />
      <path
        stroke="#fff"
        d="M62.406 150.318 44.55 131.822l.724-11.555 34.48-14.912 23.859 7.642-8.617 23.287-32.589 14.034Z"
      />
      <path
        stroke="url(#cdd)"
        d="m52.086 167.379-12.463-33.585 21.675-34.127 68.817-7.042L118.5 135l-66.414 32.379Z"
      />
      <circle cx="61.262" cy="99.967" r="1.967" fill="#D4CB81" />
      <circle cx="38.967" cy="134.069" r="1.967" fill="url(#dee)" />
      <circle cx="118.967" cy="134.967" r="1.967" fill="url(#eff)" />
      <circle cx="130.77" cy="91.967" r="1.967" fill="#D4CB81" />
    </g>
    <defs>
      <linearGradient id="bcc" x1="84" x2="84" y1="78" y2="163.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF5A6" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="cdd"
        x1="84.869"
        x2="84.869"
        y1="92.625"
        y2="167.379"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F4EBA2" />
        <stop offset="1" stopColor="#F4EBA2" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="dee"
        x1="38.967"
        x2="38.967"
        y1="132.102"
        y2="136.036"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D4CB81" />
        <stop offset="1" stopColor="#D4CB81" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="eff"
        x1="118.967"
        x2="118.967"
        y1="133"
        y2="136.934"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D4CB81" />
        <stop offset="1" stopColor="#D4CB81" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
export { SvgComponent as VertexBackground };

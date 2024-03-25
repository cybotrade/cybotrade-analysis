import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="57"
    fill="none"
    viewBox="0 0 128 57"
    {...props}
  >
    <rect width="8" height="35" x="24" y="10" fill="url(#a1)" rx="4" />
    <rect width="8" height="35" x="36" y="7" fill="url(#b2)" rx="4" />
    <rect width="8" height="35" x="48" fill="url(#c3)" rx="4" />
    <rect width="8" height="35" x="60" y="7" fill="url(#d)" rx="4" />
    <rect width="8" height="35" x="72" y="13" fill="url(#e)" rx="4" />
    <rect width="8" height="35" x="84" y="18" fill="url(#f)" rx="4" />
    <rect width="8" height="35" x="96" y="22" fill="url(#g)" rx="4" />
    <rect width="8" height="35" x="108" y="16" fill="url(#h)" rx="4" />
    <rect width="8" height="35" x="120" y="7" fill="url(#i)" rx="4" />
    <rect width="8" height="35" x="12" y="8" fill="url(#j)" rx="4" />
    <rect width="8" height="35" y="1" fill="url(#k)" rx="4" />
    <defs>
      <linearGradient id="a1" x1="28" x2="28" y1="10" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFC4C4" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="b2" x1="40" x2="40" y1="7" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFC4C4" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="c3" x1="52" x2="52" y1="0" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFC4C4" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="d" x1="64" x2="64" y1="7" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFC4C4" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="e" x1="76" x2="76" y1="13" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFB1B1" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="f" x1="88" x2="88" y1="18" y2="53" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD1D1" />
        <stop offset="1" stopColor="#FFB1B1" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g" x1="100" x2="100" y1="22" y2="57" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD1D1" />
        <stop offset="1" stopColor="#FFB1B1" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="h" x1="112" x2="112" y1="16" y2="51" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFC4C4" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="i" x1="124" x2="124" y1="7" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA1A1" />
        <stop offset="1" stopColor="#FFC4C4" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="j" x1="16" x2="16" y1="8" y2="43" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD1D1" />
        <stop offset="1" stopColor="#FFB1B1" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="k" x1="4" x2="4" y1="1" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD1D1" />
        <stop offset="1" stopColor="#FFB1B1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
export { SvgComponent as BarsBackground };

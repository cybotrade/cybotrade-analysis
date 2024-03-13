'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap/dist/gsap';
import { useRef } from 'react';

export const Orbit = () => {
  const orbits = useRef<SVGSVGElement | null>(null);

  useGSAP(
    () => {
      gsap.to('.orbit', 40, {
        rotation: 360,
        svgOrigin: '196 196',
        ease: 'none',
        repeat: -1,
      });
      gsap.to('.orbit > .planet', 40, {
        rotation: -360,
        transformOrigin: 'center center',
        ease: 'none',
        repeat: -1,
      });
    },
    { scope: orbits },
  );
  return (
    <div className="absolute right-72 bottom-0 h-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="400"
        height="150"
        fill="none"
        viewBox="0 0 400 150"
        ref={orbits}
      >
        <circle cx="196" cy="196" r="89.5" stroke="#FDB252" />
        <circle cx="196" cy="196" r="134" stroke="#FDB252" />
        <circle cx="196" cy="196" r="175.5" stroke="#FDB252" />

        <g className="orbit">
          <g className="planet" transform="translate(70 73)">
            <circle r="8" fill="#FDB252" />
          </g>
          <g className="planet" transform="translate(370 200)">
            <circle r="8" fill="#FDB252" />
          </g>
        </g>
        <g className="orbit">
          <g className="planet" transform="translate(280 93)">
            <circle r="8" fill="#FDB252" />
          </g>
          <g className="planet" transform="translate(150 320)">
            <circle r="8" fill="#FDB252" />
          </g>
        </g>
        <g className="orbit">
          <g className="planet" transform="translate(106 183)">
            <circle r="8" fill="#FDB252" />
          </g>
          <g className="planet" transform="translate(275 240)">
            <circle r="8" fill="#FDB252" />
          </g>
        </g>
      </svg>
    </div>
  );
};

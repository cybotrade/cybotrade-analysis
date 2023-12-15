import * as React from 'react';
import type { SVGProps } from 'react';

import { Checked } from './checked';

const SvgComponent = (
  props: SVGProps<SVGSVGElement> & { selected?: boolean; activestep?: boolean },
) => {
  const { selected, activestep, ...rest } = props;
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="18" cy="18" r="17.5" stroke="currentColor" />
      {activestep && <Checked className="text-primary" />}
      {selected && (
        <circle
          cx="50%"
          cy="50%"
          r="6.41441"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.17119"
        />
      )}
    </svg>
  );
};

export { SvgComponent as Step };

import * as React from 'react';
import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={25}
    viewBox="0 0 26 25"
    fill="none"
    {...props}
  >
    <path
      d="M0.500977 -0.00195312V11.5827H12.0856V-0.00195312H0.500977ZM10.2565 9.75354H2.33011V1.82718H10.2564L10.2565 9.75354Z"
      fill="currentColor"
    />
    <path
      d="M13.9131 -0.00195312V11.5827H25.4977V-0.00195312H13.9131ZM23.6686 9.75354H15.7422V1.82718H23.6685L23.6686 9.75354Z"
      fill="currentColor"
    />
    <path
      d="M0.500977 13.416V25.0006H12.0856V13.416H0.500977ZM10.2565 23.1715H2.33011V15.2452H10.2564L10.2565 23.1715Z"
      fill="currentColor"
    />
    <path
      d="M13.9131 13.416V25.0006H25.4977V13.416H13.9131ZM23.6686 23.1715H15.7422V15.2452H23.6685L23.6686 23.1715Z"
      fill="currentColor"
    />
  </svg>
);
export { SvgComponent as Grid };

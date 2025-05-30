import { cn } from '@/lib/utils';

export const AsanaLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2500"
      height="2311"
      viewBox="781.361 0 944.893 873.377"
      className={cn('size-4', className)}
    >
      <radialGradient
        id="a"
        cx="943.992"
        cy="1221.416"
        r=".663"
        gradientTransform="matrix(944.8934 0 0 -873.3772 -890717.875 1067234.75)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#ffb900" />
        <stop offset=".6" stopColor="#f95d8f" />
        <stop offset=".999" stopColor="#f95353" />
      </radialGradient>
      <path
        fill="url(#a)"
        d="M1520.766 462.371c-113.508 0-205.508 92-205.508 205.488 0 113.499 92 205.518 205.508 205.518 113.489 0 205.488-92.019 205.488-205.518 0-113.488-91.999-205.488-205.488-205.488zm-533.907.01c-113.489.01-205.498 91.99-205.498 205.488 0 113.489 92.009 205.498 205.498 205.498 113.498 0 205.508-92.009 205.508-205.498 0-113.499-92.01-205.488-205.518-205.488h.01zm472.447-256.883c0 113.489-91.999 205.518-205.488 205.518-113.508 0-205.508-92.029-205.508-205.518S1140.31 0 1253.817 0c113.489 0 205.479 92.009 205.479 205.498h.01z"
      />
    </svg>
  );
};

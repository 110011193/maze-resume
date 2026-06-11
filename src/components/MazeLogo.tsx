interface MazeLogoProps {
  size?: number;
  className?: string;
}

/** Maze path mark — use inside gradient brand wrappers (color: white). */
export default function MazeLogo({ size = 18, className }: MazeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M6 6h5v5H9v7H6V6zm12 0h-5v5h2v7h3V6z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        d="M11 6h2v5h-2v3h4v3h-2"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

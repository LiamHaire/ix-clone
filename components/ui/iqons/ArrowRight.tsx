import type { IqonProps } from "./types";

const VARIANTS: Partial<Record<string, string>> = {
  outline: `<path d="M13.2197 6.96978C13.5126 6.67689 13.9874 6.67689 14.2803 6.96978L18.7803 11.4698L18.832 11.5264C19.0723 11.821 19.0549 12.2557 18.7803 12.5303L14.2803 17.0303C13.9874 17.3232 13.5126 17.3232 13.2197 17.0303C12.9268 16.7374 12.9269 16.2627 13.2197 15.9698L16.4395 12.7501H5.75C5.33581 12.7501 5.00003 12.4142 5 12.0001C5 11.5858 5.33579 11.2501 5.75 11.2501H16.4395L13.2197 8.03033C12.9268 7.73745 12.9269 7.26268 13.2197 6.96978Z" fill="currentColor"/>`,
  fill: `<path fill-rule="evenodd" clip-rule="evenodd" d="M19 3C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19ZM13.2803 6.96973C12.9874 6.67688 12.5126 6.67688 12.2197 6.96973C11.9269 7.26261 11.9269 7.73739 12.2197 8.03027L15.4395 11.25H6.75C6.33581 11.25 6.00004 11.5858 6 12C6.00003 12.4142 6.33581 12.75 6.75 12.75H15.4395L12.2197 15.9697C11.9269 16.2626 11.9269 16.7374 12.2197 17.0303C12.5126 17.3231 12.9874 17.3231 13.2803 17.0303L17.7803 12.5303C18.0548 12.2557 18.0723 11.8209 17.832 11.5264L17.7803 11.4697L13.2803 6.96973Z" fill="currentColor"/>`,
  duotone: `<path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" fill="currentColor" fill-opacity="0.2"/>
<path d="M13.2197 6.96978C13.5126 6.67689 13.9874 6.67689 14.2803 6.96978L18.7803 11.4698L18.832 11.5264C19.0723 11.821 19.0549 12.2557 18.7803 12.5303L14.2803 17.0303C13.9874 17.3232 13.5126 17.3232 13.2197 17.0303C12.9268 16.7374 12.9269 16.2627 13.2197 15.9698L16.4395 12.7501H5.75C5.33581 12.7501 5.00003 12.4142 5 12.0001C5 11.5858 5.33579 11.2501 5.75 11.2501H16.4395L13.2197 8.03033C12.9268 7.73745 12.9269 7.26268 13.2197 6.96978Z" fill="currentColor"/>`,
};

const AVAILABLE = ["outline","fill","duotone"] as const;
type Variant = (typeof AVAILABLE)[number];

/**
 * ArrowRight icon
 * Variants: outline, fill, duotone
 */
export function ArrowRight({
  variant = "outline",
  size = 24,
  label,
  ...props
}: IqonProps) {
  const inner = VARIANTS[variant] ?? VARIANTS["outline"] ?? "";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      {...props}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

ArrowRight.displayName = "ArrowRight";
ArrowRight.variants = AVAILABLE;

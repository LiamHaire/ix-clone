import type { IqonProps } from "./types";

const VARIANTS: Partial<Record<string, string>> = {
  outline: `<path fill-rule="evenodd" clip-rule="evenodd" d="M17 20C17 21.0357 16.2128 21.887 15.2041 21.9893L15 22H6L5.7959 21.9893C4.85435 21.8938 4.1062 21.1457 4.01074 20.2041L4 20V7C4 5.89543 4.89543 5 6 5H7V4C7 2.89543 7.89543 2 9 2H18C19.1046 2 20 2.89543 20 4V17C20 18.0357 19.2128 18.887 18.2041 18.9893L18 19H17V20ZM9 19L8.7959 18.9893C7.85435 18.8938 7.1062 18.1457 7.01074 17.2041L7 17V6.5H6C5.72386 6.5 5.5 6.72386 5.5 7V20C5.5 20.2761 5.72386 20.5 6 20.5H15C15.2761 20.5 15.5 20.2761 15.5 20V19H9ZM9 3.5C8.72386 3.5 8.5 3.72386 8.5 4V17C8.5 17.2761 8.72386 17.5 9 17.5H18C18.2761 17.5 18.5 17.2761 18.5 17V4C18.5 3.72386 18.2761 3.5 18 3.5H9Z" fill="currentColor"/>`,
  fill: `<path fill-rule="evenodd" clip-rule="evenodd" d="M17 20C17 21.0357 16.2128 21.887 15.2041 21.9893L15 22H6L5.7959 21.9893C4.85435 21.8938 4.1062 21.1457 4.01074 20.2041L4 20V7C4 5.89543 4.89543 5 6 5H7V4C7 2.89543 7.89543 2 9 2H18C19.1046 2 20 2.89543 20 4V17C20 18.1046 19.1046 19 18 19H17V20ZM9 19C7.89543 19 7 18.1046 7 17V6.5H6C5.72386 6.5 5.5 6.72386 5.5 7V20C5.5 20.2761 5.72386 20.5 6 20.5H15C15.2761 20.5 15.5 20.2761 15.5 20V19H9Z" fill="currentColor"/>`,
  duotone: `<path d="M7 4C7 2.89543 7.89543 2 9 2H18C19.1046 2 20 2.89543 20 4V17C20 18.1046 19.1046 19 18 19H9C7.89543 19 7 18.1046 7 17V4Z" fill="currentColor" fill-opacity="0.2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17 20C17 21.0357 16.2128 21.887 15.2041 21.9893L15 22H6L5.7959 21.9893C4.85435 21.8938 4.1062 21.1457 4.01074 20.2041L4 20V7C4 5.89543 4.89543 5 6 5H7V4C7 2.89543 7.89543 2 9 2H18C19.1046 2 20 2.89543 20 4V17C20 18.0357 19.2128 18.887 18.2041 18.9893L18 19H17V20ZM9 19L8.7959 18.9893C7.85435 18.8938 7.1062 18.1457 7.01074 17.2041L7 17V6.5H6C5.72386 6.5 5.5 6.72386 5.5 7V20C5.5 20.2761 5.72386 20.5 6 20.5H15C15.2761 20.5 15.5 20.2761 15.5 20V19H9ZM9 3.5C8.72386 3.5 8.5 3.72386 8.5 4V17C8.5 17.2761 8.72386 17.5 9 17.5H18C18.2761 17.5 18.5 17.2761 18.5 17V4C18.5 3.72386 18.2761 3.5 18 3.5H9Z" fill="currentColor"/>`,
};

const AVAILABLE = ["outline","fill","duotone"] as const;
type Variant = (typeof AVAILABLE)[number];

/**
 * Copy icon
 * Variants: outline, fill, duotone
 */
export function Copy({
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

Copy.displayName = "Copy";
Copy.variants = AVAILABLE;

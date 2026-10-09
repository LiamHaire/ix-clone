import type { IqonProps } from "./types";

const VARIANTS: Partial<Record<string, string>> = {
  outline: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22H4L3.7959 21.9893C2.85435 21.8938 2.1062 21.1457 2.01074 20.2041L2 20V12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12V20C3.5 20.2761 3.72386 20.5 4 20.5H12C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" fill="currentColor"/>
<path d="M12 7C12.4142 7 12.75 7.33579 12.75 7.75V11.25H16.25C16.6642 11.25 17 11.5858 17 12C17 12.4142 16.6642 12.75 16.25 12.75H12.75V16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25V12.75H7.75C7.33579 12.75 7 12.4142 7 12C7 11.5858 7.33579 11.25 7.75 11.25H11.25V7.75C11.25 7.33579 11.5858 7 12 7Z" fill="currentColor"/>`,
  fill: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22H4C2.89543 22 2 21.1046 2 20V12C2 6.47715 6.47715 2 12 2ZM12 7C11.5858 7 11.25 7.33579 11.25 7.75V11.25H7.75C7.33579 11.25 7 11.5858 7 12C7 12.4142 7.33579 12.75 7.75 12.75H11.25V16.25C11.25 16.6642 11.5858 17 12 17C12.4142 17 12.75 16.6642 12.75 16.25V12.75H16.25C16.6642 12.75 17 12.4142 17 12C17 11.5858 16.6642 11.25 16.25 11.25H12.75V7.75C12.75 7.33579 12.4142 7 12 7Z" fill="currentColor"/>`,
  duotone: `<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22H4C2.89543 22 2 21.1046 2 20V12C2 6.47715 6.47715 2 12 2Z" fill="currentColor" fill-opacity="0.2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22H4L3.7959 21.9893C2.85435 21.8938 2.1062 21.1457 2.01074 20.2041L2 20V12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12V20C3.5 20.2761 3.72386 20.5 4 20.5H12C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" fill="currentColor"/>
<path d="M12 7C12.4142 7 12.75 7.33579 12.75 7.75V11.25H16.25C16.6642 11.25 17 11.5858 17 12C17 12.4142 16.6642 12.75 16.25 12.75H12.75V16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25V12.75H7.75C7.33579 12.75 7 12.4142 7 12C7 11.5858 7.33579 11.25 7.75 11.25H11.25V7.75C11.25 7.33579 11.5858 7 12 7Z" fill="currentColor"/>`,
};

const AVAILABLE = ["outline","fill","duotone"] as const;
type Variant = (typeof AVAILABLE)[number];

/**
 * ChatNew icon
 * Variants: outline, fill, duotone
 */
export function ChatNew({
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

ChatNew.displayName = "ChatNew";
ChatNew.variants = AVAILABLE;

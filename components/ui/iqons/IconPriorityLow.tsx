import type { IqonProps } from "./types";

const VARIANTS: Partial<Record<string, string>> = {
  outline: `<path d="M11.4639 15.0176C11.7755 15.2717 12.2245 15.2717 12.5361 15.0176L12.6006 14.96L16.7803 10.7803C17.0732 10.4874 17.0732 10.0126 16.7803 9.71973C16.4874 9.42683 16.0126 9.42683 15.7197 9.71973L12 13.4395L8.28027 9.71973C7.98738 9.42683 7.51262 9.42683 7.21973 9.71973C6.92684 10.0126 6.92684 10.4874 7.21973 10.7803L11.3994 14.96L11.4639 15.0176Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5Z" fill="currentColor"/>`,
  fill: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.5361 15.0176C12.2246 15.2717 11.7755 15.2717 11.4639 15.0176L11.3994 14.96L7.21973 10.7803C6.92683 10.4874 6.92683 10.0126 7.21973 9.71973C7.51262 9.42686 7.98739 9.42684 8.28027 9.71973L12 13.4395L15.7197 9.71973C16.0126 9.42686 16.4874 9.42684 16.7803 9.71973C17.0731 10.0126 17.0731 10.4874 16.7803 10.7803L12.6006 14.96L12.5361 15.0176Z" fill="currentColor"/>`,
  duotone: `<path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" fill="currentColor" fill-opacity="0.2"/>
<path d="M11.4639 15.0176C11.7755 15.2717 12.2245 15.2717 12.5361 15.0176L12.6006 14.96L16.7803 10.7803C17.0732 10.4874 17.0732 10.0126 16.7803 9.71973C16.4874 9.42683 16.0126 9.42683 15.7197 9.71973L12 13.4395L8.28027 9.71973C7.98738 9.42683 7.51262 9.42683 7.21973 9.71973C6.92684 10.0126 6.92684 10.4874 7.21973 10.7803L11.3994 14.96L11.4639 15.0176Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5Z" fill="currentColor"/>`,
};

const AVAILABLE = ["outline","fill","duotone"] as const;
type Variant = (typeof AVAILABLE)[number];

/**
 * IconPriorityLow icon
 * Variants: outline, fill, duotone
 */
export function IconPriorityLow({
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

IconPriorityLow.displayName = "IconPriorityLow";
IconPriorityLow.variants = AVAILABLE;

import type { IqonProps } from "./types";

const VARIANTS: Partial<Record<string, string>> = {
  outline: `<path d="M11.4639 8.98242C11.7755 8.7283 12.2245 8.7283 12.5361 8.98242L12.6006 9.04004L16.7803 13.2197C17.0732 13.5126 17.0732 13.9874 16.7803 14.2803C16.4874 14.5732 16.0126 14.5732 15.7197 14.2803L12 10.5605L8.28027 14.2803C7.98738 14.5732 7.51262 14.5732 7.21973 14.2803C6.92684 13.9874 6.92684 13.5126 7.21973 13.2197L11.3994 9.04004L11.4639 8.98242Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" fill="currentColor"/>`,
  fill: `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.5361 8.98242C12.2245 8.7283 11.7755 8.72832 11.4639 8.98242L11.3994 9.04004L7.21973 13.2197C6.92683 13.5126 6.92683 13.9874 7.21973 14.2803C7.51262 14.5731 7.98739 14.5732 8.28027 14.2803L12 10.5605L15.7197 14.2803C16.0126 14.5731 16.4874 14.5732 16.7803 14.2803C17.0731 13.9874 17.0731 13.5126 16.7803 13.2197L12.6006 9.04004L12.5361 8.98242Z" fill="currentColor"/>`,
  duotone: `<path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="currentColor" fill-opacity="0.2"/>
<path d="M11.4639 8.98242C11.7755 8.7283 12.2245 8.7283 12.5361 8.98242L12.6006 9.04004L16.7803 13.2197C17.0732 13.5126 17.0732 13.9874 16.7803 14.2803C16.4874 14.5732 16.0126 14.5732 15.7197 14.2803L12 10.5605L8.28027 14.2803C7.98738 14.5732 7.51262 14.5732 7.21973 14.2803C6.92684 13.9874 6.92684 13.5126 7.21973 13.2197L11.3994 9.04004L11.4639 8.98242Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" fill="currentColor"/>`,
};

const AVAILABLE = ["outline","fill","duotone"] as const;
type Variant = (typeof AVAILABLE)[number];

/**
 * IconPriorityMedium icon
 * Variants: outline, fill, duotone
 */
export function IconPriorityMedium({
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

IconPriorityMedium.displayName = "IconPriorityMedium";
IconPriorityMedium.variants = AVAILABLE;

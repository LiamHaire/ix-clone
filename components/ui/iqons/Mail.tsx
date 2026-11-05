import type { IqonProps } from "./types";

const VARIANTS: Partial<Record<string, string>> = {
  outline: `<path fill-rule="evenodd" clip-rule="evenodd" d="M20.2041 4.01074C21.2128 4.113 22 4.96435 22 6V18C22 19.0357 21.2128 19.887 20.2041 19.9893L20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H20L20.2041 4.01074ZM15.1553 13.1982C13.3556 14.7978 10.6444 14.7978 8.84473 13.1982L3.5 8.44727V18C3.5 18.2761 3.72386 18.5 4 18.5H20C20.2761 18.5 20.5 18.2761 20.5 18V8.44727L15.1553 13.1982ZM4 5.5C3.72386 5.5 3.5 5.72386 3.5 6V6.44043L9.84082 12.0771C11.0722 13.1717 12.9278 13.1717 14.1592 12.0771L20.5 6.44043V6C20.5 5.72386 20.2761 5.5 20 5.5H4Z" fill="currentColor"/>`,
  fill: `<path fill-rule="evenodd" clip-rule="evenodd" d="M20 4C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H20ZM20.0605 7.83496C19.7854 7.52567 19.3115 7.49756 19.002 7.77246L14.1592 12.0771C12.9278 13.1716 11.0722 13.1716 9.84082 12.0771L4.99805 7.77246C4.6885 7.49763 4.21456 7.52562 3.93945 7.83496C3.66444 8.14448 3.69261 8.61837 4.00195 8.89355L8.84473 13.1982C10.6443 14.7976 13.3557 14.7976 15.1553 13.1982L19.998 8.89355C20.3075 8.61839 20.3356 8.14451 20.0605 7.83496Z" fill="currentColor"/>`,
  duotone: `<path d="M22 18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V7.03418C2.78992 7.13791 3.53534 7.47618 4.13672 8.01074L9.34277 12.6377C10.8583 13.9848 13.1417 13.9848 14.6572 12.6377L19.8633 8.01074C20.4647 7.47618 21.2101 7.13791 22 7.03418V18Z" fill="currentColor" fill-opacity="0.2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.2041 4.01074C21.2128 4.113 22 4.96435 22 6V18C22 19.0357 21.2128 19.887 20.2041 19.9893L20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4H20L20.2041 4.01074ZM15.1553 13.1982C13.3556 14.7978 10.6444 14.7978 8.84473 13.1982L3.5 8.44727V18C3.5 18.2761 3.72386 18.5 4 18.5H20C20.2761 18.5 20.5 18.2761 20.5 18V8.44727L15.1553 13.1982ZM4 5.5C3.72386 5.5 3.5 5.72386 3.5 6V6.44043L9.84082 12.0771C11.0722 13.1717 12.9278 13.1717 14.1592 12.0771L20.5 6.44043V6C20.5 5.72386 20.2761 5.5 20 5.5H4Z" fill="currentColor"/>`,
};

const AVAILABLE = ["outline","fill","duotone"] as const;
type Variant = (typeof AVAILABLE)[number];

/**
 * Mail icon
 * Variants: outline, fill, duotone
 */
export function Mail({
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

Mail.displayName = "Mail";
Mail.variants = AVAILABLE;

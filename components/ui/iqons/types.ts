import type { SVGProps } from "react";

export type IqonVariant = "outline" | "fill" | "duotone" | "thin";

export interface IqonProps extends SVGProps<SVGSVGElement> {
  /** Icon style variant */
  variant?: IqonVariant;
  /** Size in pixels — sets both width and height */
  size?: number | string;
  /** Accessible label — sets aria-label when provided */
  label?: string;
}

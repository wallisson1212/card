export type CardSize = 'xsm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type CardVariant = 'filled' | 'transparent' | 'outlined' | 'borderless' | 'bordered';

export interface CardProps {
  title: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  /**
   * Colors (accepts design tokens or raw CSS values)
   * Examples:
   *  - design token name: "primary" -> resolves to `var(--color-primary)`
   *  - raw CSS var: "--color-primary" or "var(--color-primary)"
   *  - CSS value: "#fff", "rgb(255,255,255)", "linear-gradient(...)"
   */
  titleColor?: string;
  descriptionColor?: string;
  leftIconColor?: string;
  rightIconColor?: string;
  backgroundColor?: string;
  /** Font family to use when rendering / downloading */
  fontFamily?: string;

  size?: CardSize;
  variant?: CardVariant;

  bordered?: boolean; // legacy
  filled?: boolean; // legacy

  disabled?: boolean;
  loading?: boolean;

  onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void;

  /** Actions */
  showActions?: boolean;
  onEdit?: () => void;
  onDownload?: (blob?: Blob, html?: string) => void;
  downloadFileName?: string;

  /** Accessibility */
  'aria-label'?: string;
  'data-testid'?: string;
}

export interface CardStyles {
  container: string;
  title: string;
  description: string;
  icon: string;
}
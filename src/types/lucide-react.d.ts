declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
    children?: React.ReactNode;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const Home: LucideIcon;
  export const Bell: LucideIcon;
  export const PlusSquare: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const User: LucideIcon;
  export const Search: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Droplet: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ArrowDownLeft: LucideIcon;
  export const Mail: LucideIcon;
  export const Lock: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Activity: LucideIcon;
  export const MapPin: LucideIcon;
  export const Navigation: LucideIcon;
  export const Check: LucideIcon;
  export const Plus: LucideIcon;
  export const Pencil: LucideIcon;
  export const Star: LucideIcon;
  export const LogOut: LucideIcon;
  export const Phone: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Building2: LucideIcon;
  export const Hash: LucideIcon;
  export const Camera: LucideIcon;
  export const AtSign: LucideIcon;
  export const Calendar: LucideIcon;
  export const Heart: LucideIcon;
  export const Megaphone: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const BadgeCheck: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Share2: LucideIcon;
  export const Stethoscope: LucideIcon;
  export const X: LucideIcon;

  export const icons: Record<string, LucideIcon>;
  const Lucide: Record<string, LucideIcon>;
  export default Lucide;
}

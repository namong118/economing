import {
  Building2, Globe, Cpu, Zap, Package,
  Banknote, Landmark, CreditCard, AlertTriangle, CheckCircle2,
  Wallet, PiggyBank, TrendingUp, TrendingDown, ShoppingCart,
  BarChart2,
} from 'lucide-react';

const ICON_MAP = {
  Building2, Globe, Cpu, Zap, Package,
  Banknote, Landmark, CreditCard, AlertTriangle, CheckCircle2,
  Wallet, PiggyBank, TrendingUp, TrendingDown, ShoppingCart,
  BarChart2,
};

export default function InfographicIcon({ name, size = 18, color }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}

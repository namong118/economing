import {
  Building2, Globe, Cpu, Zap, Package,
  Banknote, Landmark, CreditCard, AlertTriangle, CheckCircle2,
  Wallet, PiggyBank, TrendingUp, TrendingDown, ShoppingCart,
  BarChart2, ArrowUp, ArrowDown, Home, Briefcase, Receipt,
  Shield, Calendar, Clock, Users, Percent, RefreshCw,
  DollarSign, Award, LineChart, PieChart, Car, Scale, Coins,
} from 'lucide-react';

const ICON_MAP = {
  Building2, Globe, Cpu, Zap, Package,
  Banknote, Landmark, CreditCard, AlertTriangle, CheckCircle2,
  Wallet, PiggyBank, TrendingUp, TrendingDown, ShoppingCart,
  BarChart2, ArrowUp, ArrowDown, Home, Briefcase, Receipt,
  Shield, Calendar, Clock, Users, Percent, RefreshCw,
  DollarSign, Award, LineChart, PieChart, Car, Scale, Coins,
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP).join(', ');

export default function InfographicIcon({ name, size = 18, color }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}

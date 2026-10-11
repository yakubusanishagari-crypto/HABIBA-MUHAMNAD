import { HeroBackgroundOption } from '../types';

export interface HeroBackgroundConfig {
  id: HeroBackgroundOption;
  name: string;
  nameHa: string;
  nameAr: string;
  badge: string;
  desc: string;
  gradientClass: string;
  borderClass: string;
  orb1Class: string;
  orb2Class: string;
  orb3Class: string;
  kickerBgClass: string;
  cardBgClass: string;
  swatchGradient: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
}

export const HERO_BACKGROUND_CONFIGS: Record<HeroBackgroundOption, HeroBackgroundConfig> = {
  royal_emerald: {
    id: 'royal_emerald',
    name: 'Royal Emerald & Gold',
    nameHa: 'Koren Zinariya (Signature)',
    nameAr: 'الزمرد الملكي والذهب',
    badge: 'Signature Brand',
    desc: 'Deep opulent forest green with warm royal gold radiance. The timeless signature identity of Habeebatussunah.',
    gradientClass: 'bg-gradient-to-br from-[#02241A] via-[#064E3B] to-[#011B13]',
    borderClass: 'border-emerald-800/60',
    orb1Class: 'bg-amber-400/15',
    orb2Class: 'bg-emerald-400/20',
    orb3Class: 'bg-amber-500/10',
    kickerBgClass: 'bg-[#031E16]/90 border-amber-400/40 text-amber-300',
    cardBgClass: 'bg-[#031C14]/85 border-emerald-700/60',
    swatchGradient: 'from-[#02241A] via-[#064E3B] to-[#011B13]',
    textColor: 'text-white',
    subtextColor: 'text-emerald-50/90',
    accentColor: 'text-amber-400'
  },
  midnight_noir: {
    id: 'midnight_noir',
    name: 'Midnight Noir & Champagne',
    nameHa: 'Bakin Kawa & Zinari',
    nameAr: 'الأسود الليلي والشمبانيا',
    badge: 'High Fashion Haute',
    desc: 'Prestige obsidian midnight canvas infused with shimmering champagne-gold ambient lighting. Ultra-chic high-fashion poise.',
    gradientClass: 'bg-gradient-to-br from-[#0A0D14] via-[#111827] to-[#030712]',
    borderClass: 'border-slate-800',
    orb1Class: 'bg-amber-300/15',
    orb2Class: 'bg-slate-500/20',
    orb3Class: 'bg-yellow-500/10',
    kickerBgClass: 'bg-slate-900/90 border-amber-400/40 text-amber-300',
    cardBgClass: 'bg-slate-900/85 border-slate-700/60',
    swatchGradient: 'from-[#0A0D14] via-[#111827] to-[#030712]',
    textColor: 'text-white',
    subtextColor: 'text-slate-200/90',
    accentColor: 'text-amber-300'
  },
  imperial_ruby: {
    id: 'imperial_ruby',
    name: 'Imperial Ruby & Warm Gold',
    nameHa: 'Jan Alharini & Zinari',
    nameAr: 'الياقوت الإمبراطوري والذهب',
    badge: 'Festive & Bridal',
    desc: 'Rich velvety wine burgundy accented with warm festive golden luminescence. Perfect for celebrations, bridal wear, and evening glamour.',
    gradientClass: 'bg-gradient-to-br from-[#20050D] via-[#3B0A17] to-[#140207]',
    borderClass: 'border-rose-900/60',
    orb1Class: 'bg-amber-400/15',
    orb2Class: 'bg-rose-500/20',
    orb3Class: 'bg-amber-500/10',
    kickerBgClass: 'bg-[#1C040B]/90 border-amber-400/40 text-amber-300',
    cardBgClass: 'bg-[#1C040B]/85 border-rose-800/60',
    swatchGradient: 'from-[#20050D] via-[#3B0A17] to-[#140207]',
    textColor: 'text-white',
    subtextColor: 'text-rose-100/90',
    accentColor: 'text-amber-400'
  },
  majestic_sapphire: {
    id: 'majestic_sapphire',
    name: 'Majestic Sapphire & Diamond',
    nameHa: 'Shudin Sarauta & Zinari',
    nameAr: 'الياقوت الأزرق الملكي',
    badge: 'Regal Poise',
    desc: 'Deep royal sapphire navy with luminous golden and diamond highlights. Majestic, confident, and sophisticated modern elegance.',
    gradientClass: 'bg-gradient-to-br from-[#061224] via-[#0B2545] to-[#030914]',
    borderClass: 'border-blue-900/60',
    orb1Class: 'bg-amber-400/15',
    orb2Class: 'bg-blue-500/20',
    orb3Class: 'bg-sky-400/10',
    kickerBgClass: 'bg-[#051121]/90 border-amber-400/40 text-amber-300',
    cardBgClass: 'bg-[#051121]/85 border-blue-800/60',
    swatchGradient: 'from-[#061224] via-[#0B2545] to-[#030914]',
    textColor: 'text-white',
    subtextColor: 'text-blue-100/90',
    accentColor: 'text-amber-400'
  },
  sultan_onyx: {
    id: 'sultan_onyx',
    name: 'Sultan Onyx & Golden Bronze',
    nameHa: 'Tagulla & Zinari Na Alfarma',
    nameAr: 'العقيق البرونزي والذهب',
    badge: 'Arabesque Couture',
    desc: 'Opulent dark mocha charcoal and warm desert bronze with shimmering gold reflections. Inspired by rich heritage and Arabesque haute couture.',
    gradientClass: 'bg-gradient-to-br from-[#1C140E] via-[#2D1F16] to-[#0F0A07]',
    borderClass: 'border-amber-900/60',
    orb1Class: 'bg-amber-400/20',
    orb2Class: 'bg-orange-600/15',
    orb3Class: 'bg-yellow-500/15',
    kickerBgClass: 'bg-[#170F0A]/90 border-amber-400/40 text-amber-300',
    cardBgClass: 'bg-[#170F0A]/85 border-amber-800/60',
    swatchGradient: 'from-[#1C140E] via-[#2D1F16] to-[#0F0A07]',
    textColor: 'text-white',
    subtextColor: 'text-amber-100/90',
    accentColor: 'text-amber-400'
  }
};

export const HERO_BACKGROUND_LIST: HeroBackgroundConfig[] = [
  HERO_BACKGROUND_CONFIGS.royal_emerald,
  HERO_BACKGROUND_CONFIGS.midnight_noir,
  HERO_BACKGROUND_CONFIGS.imperial_ruby,
  HERO_BACKGROUND_CONFIGS.majestic_sapphire,
  HERO_BACKGROUND_CONFIGS.sultan_onyx
];

import React from 'react';

export interface PosterData {
  style: 'swiss' | 'editorial' | 'brutalist' | 'vintage' | 'neon' | 'bauhaus';
  title: string;
  subtitle: string;
  accentColor: string;
  overlayText?: boolean;
  filter?: string; // CSS filter string (e.g. 'grayscale(100%)')
  textColor?: string; // Custom text color override
  titleSize?: number; // Font size scale factor (0.5 to 2.0)
}

export interface Pin {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  heightRatio: number; // For masonry layout (e.g. 1.5 for tall, 1 for square)
  isGenerated?: boolean;
  author?: string;
  posterData?: PosterData; // Optional: if present, renders as a poster
}

export interface ThemeConfig {
  background: string; // Hex
  text: string; // Hex
  accent: string; // Hex
  secondary: string; // Hex
  heroGradient1: string; // Tailwind class or hex
  heroGradient2: string; // Tailwind class or hex
  titleFont: string; // Tailwind font class
  titleStyle: React.CSSProperties;
}

export interface Category {
  id: string;
  label: string;
  promptHelper: string;
  theme: ThemeConfig;
}

export enum ViewState {
  GALLERY = 'GALLERY',
  GENERATING = 'GENERATING',
  DETAIL = 'DETAIL'
}
import { ReactNode } from 'react';

export interface CategoryCardType {
  id: string;
  title: string;
  amount: string;
  icon: ReactNode;
  iconName: string;
  color: string;
  row?: number;
}

export interface TopStatType {
  label: string;
  value: string;
}
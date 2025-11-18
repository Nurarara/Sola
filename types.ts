export interface Pin {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  heightRatio: number; // For masonry layout (e.g. 1.5 for tall, 1 for square)
  isGenerated?: boolean;
  author?: string;
}

export interface Category {
  id: string;
  label: string;
  promptHelper: string;
  color: string;
}

export enum ViewState {
  GALLERY = 'GALLERY',
  GENERATING = 'GENERATING',
  DETAIL = 'DETAIL'
}

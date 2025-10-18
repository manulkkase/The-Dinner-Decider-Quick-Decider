export interface Pairing {
  type: string;
  suggestion: string;
  icon: string;
}

export interface LocalTip {
  icon: string;
  title: string;
  description: string;
}

export interface MenuItem {
  id: number;
  name: string;
  imageUrl: string;
  tags: string[];
  funFact: string;
  checklist: string[];
  pairings: Pairing[];
  eatLikeLocal: LocalTip[];
}

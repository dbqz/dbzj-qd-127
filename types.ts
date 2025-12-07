export interface Student {
  id: number;
  name: string;
  status: 'present' | 'absent';
  checkInTime?: string;
}

export type AppState = 'idle' | 'active' | 'summary';

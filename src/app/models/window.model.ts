export type AppId = 'about' | 'skills' | 'projects' | 'contact' | 'terminal';

export interface DesktopIconConfig {
  id: AppId;
  label: string;
  icon: string;
}

export interface OpenWindow {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export type ProjectCategory = 'BI' | 'Desenvolvimento' | 'Infraestrutura de TI';

export interface ProjectEntry {
  title: string;
  description: string;
  repoUrl: string;
  category: ProjectCategory;
}

import React from 'react';

export enum ToolId {
  DASHBOARD = 'dashboard',
  HTML_FETCHER = 'html-fetcher',
  SETTINGS = 'settings' // Placeholder for future
}

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

import React from 'react';
import { Card } from './ui';
import { ToolId } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  onNavigate: (id: ToolId) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
        <p className="text-sm text-app-muted">Select a tool to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tool Card */}
        <button 
          onClick={() => onNavigate(ToolId.HTML_FETCHER)}
          className="group text-left focus:outline-none"
        >
          <Card className="h-full bg-app-surface hover:bg-zinc-800/80 transition-all duration-200 group-hover:border-zinc-700 hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-black border border-zinc-800 rounded-md text-white group-hover:scale-110 transition-transform duration-200">
                {ICONS.CodeBracket}
              </div>
              <span className="text-zinc-600 group-hover:text-white transition-colors duration-300 -mr-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:translate-x-0.5 transition-transform">HTML Fetcher</h3>
            <p className="text-xs text-app-muted leading-relaxed">
              Fetch raw static HTML from any URL via secure proxy. View source and stats.
            </p>
          </Card>
        </button>

        {/* Placeholder Card */}
        <div className="opacity-50 pointer-events-none select-none grayscale">
           <Card className="h-full border-dashed border-zinc-800 bg-transparent">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-transparent border border-zinc-800 rounded-md text-zinc-600">
                {ICONS.ClipboardDocumentCheck}
              </div>
            </div>
            <h3 className="text-sm font-medium text-zinc-500 mb-1.5">JSON Formatter</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Coming soon. Validate and beautify JSON data.
            </p>
          </Card>
        </div>
      </div>
      
      {/* Quick Stats or Footer (Optional decoration) */}
      <div className="mt-12 pt-6 border-t border-app-border grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div>
              <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider mb-1">Status</p>
              <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                  <span className="text-xs font-mono text-zinc-400">System Online</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
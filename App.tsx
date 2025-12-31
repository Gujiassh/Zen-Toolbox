import React, { useEffect, useState } from 'react';
import { Tool, ToolId } from './types';
import { ICONS } from './constants';
import HtmlFetcher from './tools/HtmlFetcher';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<ToolId>(ToolId.DASHBOARD);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Configuration of available tools
  const tools: Tool[] = [
    {
      id: ToolId.HTML_FETCHER,
      name: 'HTML Fetcher',
      description: 'Get static HTML',
      icon: ICONS.CodeBracket,
      component: <HtmlFetcher />
    }
  ];

  const activeTool = tools.find(t => t.id === activeToolId);
  const windowControls = (window as any)?.desktop?.windowControls;

  useEffect(() => {
    if (!windowControls?.onMaximizeChanged) return;
    const off = windowControls.onMaximizeChanged((val: boolean) => setIsMaximized(!!val));
    return () => {
      if (typeof off === 'function') off();
    };
  }, [windowControls]);

  const handleWindowControl = (action: 'minimize' | 'toggle' | 'close') => {
    if (!windowControls) return;
    if (action === 'minimize') windowControls.minimize?.();
    if (action === 'toggle') windowControls.toggleMaximize?.();
    if (action === 'close') windowControls.close?.();
  };

  const renderContent = () => {
    if (activeToolId === ToolId.DASHBOARD) {
      return <Dashboard onNavigate={setActiveToolId} />;
    }
    return activeTool?.component || <div className="p-8 text-app-muted">Tool not found</div>;
  };

  return (
    <div className="flex h-screen bg-app-bg text-app-text overflow-hidden font-sans selection:bg-zinc-700 selection:text-white">
      
      {/* Sidebar - Fixed width, border right, software look */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col bg-black border-r border-app-border">
        {/* App Title Area */}
        <div className="h-14 flex items-center px-4 border-b border-app-border select-none app-drag">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black mr-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">ZEN TOOLBOX</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          <NavItem 
            isActive={activeToolId === ToolId.DASHBOARD}
            onClick={() => setActiveToolId(ToolId.DASHBOARD)}
            icon={ICONS.Home}
            label="Dashboard"
          />

          <div className="mt-6 mb-2 px-3">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Utilities</span>
          </div>

          {tools.map((tool) => (
            <NavItem
              key={tool.id}
              isActive={activeToolId === tool.id}
              onClick={() => setActiveToolId(tool.id)}
              icon={tool.icon}
              label={tool.name}
            />
          ))}
        </nav>

        {/* Status / Footer Area */}
        <div className="p-3 border-t border-app-border">
           <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-app-hover transition-colors cursor-pointer group">
             <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </div>
             <div className="flex flex-col">
               <span className="text-xs font-medium text-app-text group-hover:text-white">User</span>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-app-bg relative">
        {/* Top Header - Contextual */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-app-border bg-app-bg/50 backdrop-blur-sm z-10 sticky top-0 app-drag">
          <div className="flex items-center gap-2 text-sm text-app-muted app-no-drag">
             <span className="hover:text-white cursor-pointer transition-colors" onClick={() => setActiveToolId(ToolId.DASHBOARD)}>Home</span>
             <span className="text-zinc-700">/</span>
             <span className="text-white font-medium">
               {activeToolId === ToolId.DASHBOARD ? 'Dashboard' : activeTool?.name}
             </span>
          </div>
          <div className="flex items-center gap-2 app-no-drag">
             {windowControls ? (
               <>
                 <button
                   className="w-9 h-9 flex items-center justify-center rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                   onClick={() => handleWindowControl('minimize')}
                   title="Minimize"
                 >
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                     <path strokeLinecap="round" d="M5 12h14" />
                   </svg>
                 </button>
                 <button
                   className="w-9 h-9 flex items-center justify-center rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                   onClick={() => handleWindowControl('toggle')}
                   title={isMaximized ? 'Restore' : 'Maximize'}
                 >
                   {isMaximized ? (
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M7 9h8a2 2 0 012 2v6" />
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h8a2 2 0 012 2v8" />
                     </svg>
                   ) : (
                     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                       <rect x="6" y="6" width="12" height="12" rx="1.5" ry="1.5" />
                     </svg>
                   )}
                 </button>
                 <button
                   className="w-9 h-9 flex items-center justify-center rounded hover:bg-red-900/70 text-zinc-400 hover:text-white transition-colors"
                   onClick={() => handleWindowControl('close')}
                   title="Close"
                 >
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                   </svg>
                 </button>
               </>
             ) : null}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto w-full animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Helper for Nav Items
const NavItem: React.FC<{ isActive: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ isActive, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
      isActive
        ? 'bg-zinc-800 text-white shadow-sm'
        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
    }`}
  >
    <span className={`${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'} transition-colors`}>
      {icon}
    </span>
    {label}
  </button>
);

export default App;

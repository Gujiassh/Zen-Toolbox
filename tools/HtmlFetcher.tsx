// Input: React renderer; optional Electron preload bridge (window.desktop.seoFetch)
// Output: UI to fetch and display raw HTML (uses IPC when可用，fallback to CORS proxy)
// Pos: Renderer SEO fetch tool (update me when folder changes)

import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Input, Badge, Separator } from '../components/ui';
import { ICONS } from '../constants';
import prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';

declare global {
  interface Window {
    desktop?: {
      seoFetch?: (url: string) => Promise<{ success: boolean; html?: string; statusCode?: number; redirectedTo?: string; error?: string }>;
      windowControls?: unknown;
    };
  }
}

const HtmlFetcher: React.FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState<string | null>(null);
  const [formattedContent, setFormattedContent] = useState<string | null>(null);
  const [showFormatted, setShowFormatted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchStats, setFetchStats] = useState<{ size: string; time: string; status?: string } | null>(null);
  const isElectron = Boolean(window.desktop?.seoFetch);
  const STORAGE_KEY = 'htmlFetcher:lastUrl';

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setUrl(cached);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const formatHtml = useCallback((html: string) => {
    try {
      return prettier.format(html, {
        parser: 'html',
        plugins: [parserHtml],
        printWidth: 100,
      });
    } catch {
      return html;
    }
  }, []);

  useEffect(() => {
    try {
      if (url) {
        localStorage.setItem(STORAGE_KEY, url);
      }
    } catch {
      // ignore storage errors
    }
  }, [url]);

  const handleFetch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    setLoading(true);
    setError(null);
    setContent(null);
    setFetchStats(null);
    const startTime = performance.now();

    try {
      const endWithError = (message: string) => {
        setError(message);
        setFetchStats(null);
      };

      // Prefer Electron IPC when available to bypass CORS entirely
      if (window.desktop?.seoFetch) {
        const result = await window.desktop.seoFetch(targetUrl);
        const endTime = performance.now();
        if (!result.success || !result.html) {
          endWithError(result.error || 'Fetch failed');
        } else {
          const pretty = formatHtml(result.html);
          setContent(result.html);
          setFormattedContent(pretty);
          setShowFormatted(Boolean(pretty));
          setFetchStats({
            size: (new TextEncoder().encode(result.html).length / 1024).toFixed(2) + ' KB',
            time: `${(endTime - startTime).toFixed(0)}ms`,
            status: `${result.statusCode ?? '200'}${result.redirectedTo ? ' (redirected)' : ''}`,
          });
        }
        return;
      }

      // Browser fallback via CORS proxy (best-effort, may be blocked)
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const endTime = performance.now();
      if (data.contents) {
        const pretty = formatHtml(data.contents);
        setContent(data.contents);
        setFormattedContent(pretty);
        setShowFormatted(Boolean(pretty));
        setFetchStats({
          size: (new TextEncoder().encode(data.contents).length / 1024).toFixed(2) + ' KB',
          time: `${(endTime - startTime).toFixed(0)}ms`,
          status: '200',
        });
      } else {
        throw new Error('No content returned or URL blocked.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, formatHtml]);

  const copyToClipboard = useCallback(() => {
    const text = showFormatted ? formattedContent : content;
    if (text) {
      navigator.clipboard.writeText(text);
    }
  }, [content, formattedContent, showFormatted]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium text-white">HTML Fetcher</h2>
        <p className="text-xs text-app-muted max-w-2xl">
          Retrieve source code from a URL. Uses desktop bridge when available to bypass CORS; falls back to proxy otherwise.
        </p>
        {!isElectron && (
          <p className="text-xs text-amber-400">
            Desktop bridge unavailable - run via Electron (pnpm dev) to bypass CORS.
          </p>
        )}
      </div>

      {/* Input Section */}
      <Card className="bg-app-surface/50">
        <form onSubmit={handleFetch} className="flex gap-3 items-end">
          <Input 
            label="Target URL" 
            placeholder="example.com" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            rightElement={
              loading ? <div className="text-xs text-zinc-500 animate-pulse">Connecting...</div> : null
            }
          />
          <div className="pb-[1px]">
            <Button type="submit" isLoading={loading} disabled={!url} className="h-[38px] px-6">
              Fetch
            </Button>
          </div>
        </form>
      </Card>

      {/* Error Output */}
      {error && (
        <div className="p-3 rounded-md bg-red-950/30 border border-red-900/50 text-red-400 text-xs flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-mono">{error}</span>
        </div>
      )}

      {/* Results Section */}
      {content && (
        <div className="space-y-3 animate-fade-in">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between p-1">
             <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5 bg-black border border-app-border rounded px-2 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-mono text-zinc-400">{fetchStats?.status || '200 OK'}</span>
               </div>
               {fetchStats && (
                 <>
                   <Badge variant="outline">{fetchStats.size}</Badge>
                   <Badge variant="outline">{fetchStats.time}</Badge>
                 </>
               )}
               <div className="ml-3 flex items-center gap-1">
                 <Button
                   variant={showFormatted ? 'ghost' : 'secondary'}
                   onClick={() => setShowFormatted(false)}
                   className="text-xs h-7 px-3"
                 >
                   Raw
                 </Button>
                 <Button
                   variant={showFormatted ? 'secondary' : 'ghost'}
                   onClick={() => setShowFormatted(true)}
                   className="text-xs h-7 px-3"
                   disabled={!formattedContent}
                 >
                   Formatted
                 </Button>
               </div>
             </div>
             <Button variant="ghost" onClick={copyToClipboard} className="text-xs h-7 gap-1.5">
               {ICONS.Copy} Copy
             </Button>
          </div>
          
          {/* Code Editor View */}
          <div className="relative rounded-lg border border-app-border bg-[#0d0d0d] overflow-hidden shadow-sm flex flex-col h-[500px]">
            {/* Fake Window Controls */}
            <div className="h-9 bg-[#111] border-b border-zinc-800 flex items-center px-4 justify-between flex-shrink-0">
              <span className="text-[10px] text-zinc-500 font-mono tracking-tight">source.html</span>
              <div className="flex gap-1.5 opacity-50">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              <pre className="text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-all text-zinc-300">
                <code dangerouslySetInnerHTML={{ __html: (showFormatted && formattedContent ? formattedContent : content).replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
              </pre>
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#111] border-t border-zinc-800 flex items-center px-3 justify-end gap-4 text-[10px] text-zinc-600 font-mono select-none">
               <span>UTF-8</span>
               <span>HTML</span>
               <span>Ln {(showFormatted && formattedContent ? formattedContent : content).split('\n').length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HtmlFetcher;

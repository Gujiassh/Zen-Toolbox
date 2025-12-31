// Input: Node runtime, pnpm scripts dev:renderer/dev:electron
// Output: Runs renderer and Electron processes in parallel for desktop dev
// Pos: Local dev orchestrator replacing concurrently (update me when folder changes)

import { spawn } from 'node:child_process';

const processes = [];
const viteUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:7001';

function run(name, command, args = [], extraEnv = {}) {
  const child = spawn(command, args, {
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });

  processes.push(child);

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown();
    }
  });

  child.on('error', (err) => {
    console.error(`[${name}] failed to start`, err);
    shutdown();
  });
}

function shutdown() {
  while (processes.length) {
    const proc = processes.pop();
    if (proc && !proc.killed) {
      proc.kill();
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

run('renderer', 'pnpm', ['run', 'dev:renderer']);
run('electron', 'pnpm', ['run', 'dev:electron'], { VITE_DEV_SERVER_URL: viteUrl });

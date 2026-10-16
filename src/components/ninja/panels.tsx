import {
  ChevronRight,
  FileCode2,
  Braces,
  ChartNoAxesCombined,
  Bug,
  Workflow,
  FolderPlus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHAT_MODEL } from "@/lib/ai-model";
export const actions = [
  { label: "Generate Code", icon: Braces, prompt: "/code " },
  { label: "Explain Code", icon: ChartNoAxesCombined, prompt: "/explain " },
  { label: "Fix Bug", icon: Bug, prompt: "/fix " },
  { label: "Optimize", icon: Workflow, prompt: "/optimize " },
  { label: "Create Project", icon: FolderPlus, prompt: "/create " },
];
export const files = [
  {
    name: "app.jsx",
    age: "2m ago",
    content:
      "export default function App() {\n  return (\n    <main>\n      <h1>Hello, Ninja.</h1>\n      <p>Build something extraordinary.</p>\n    </main>\n  );\n}",
  },
  {
    name: "index.js",
    age: "5m ago",
    content:
      "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './app';\n\ncreateRoot(document.getElementById('root'))\n  .render(<App />);",
  },
  {
    name: "style.css",
    age: "8m ago",
    content:
      ":root {\n  color-scheme: dark;\n}\n\nbody {\n  margin: 0;\n  font-family: monospace;\n}",
  },
  {
    name: "config.js",
    age: "12m ago",
    content: 'export default {\n  name: "The Code Ninja",\n  version: "1.0.0",\n};',
  },
  {
    name: "package.json",
    age: "15m ago",
    content: '{\n  "name": "code-ninja",\n  "version": "1.0.0",\n  "private": true\n}',
  },
];
function Graph({ variant }: { variant: number }) {
  return (
    <svg viewBox="0 0 160 30" preserveAspectRatio="none" className="monitor-graph">
      <path className="graph-grid" d="M0 10h160M0 20h160M0 29h160M40 0v30M80 0v30M120 0v30" />
      <path
        className="graph-fill"
        d={
          variant === 0
            ? "M0 27 12 27 22 23 31 26 42 27 49 23 57 27 66 27 69 19 89 19 101 21 106 24 117 23 120 10 140 10 140 29 0 29Z"
            : variant === 1
              ? "M0 28 10 26 22 26 24 22 39 22 46 25 58 25 62 27 73 27 77 18 93 18 98 22 115 22 119 10 138 10 138 29 0 29Z"
              : "M0 25 11 25 20 21 31 23 42 23 48 17 56 19 68 25 80 25 84 15 95 13 103 17 111 14 121 19 133 20 140 24 140 29 0 29Z"
        }
      />
      <path
        className="graph-line"
        d={
          variant === 0
            ? "M0 27 12 27 22 23 31 26 42 27 49 23 57 27 66 27 69 19 89 19 101 21 106 24 117 23 120 10 140 10"
            : variant === 1
              ? "M0 28 10 26 22 26 24 22 39 22 46 25 58 25 62 27 73 27 77 18 93 18 98 22 115 22 119 10 138 10"
              : "M0 25 11 25 20 21 31 23 42 23 48 17 56 19 68 25 80 25 84 15 95 13 103 17 111 14 121 19 133 20 140 24"
        }
      />
    </svg>
  );
}
export function RightPanels({
  onPrompt,
  onFile,
}: {
  onPrompt: (p: string) => void;
  onFile: (name: string) => void;
}) {
  return (
    <aside className="right-panels">
      <section className="system-panel" title="Decorative system telemetry from the reference">
        <h3>SYSTEM MONITOR</h3>
        {["CPU", "MEMORY", "NETWORK"].map((label, i) => (
          <div className="metric" key={label}>
            <span>{label}</span>
            <Graph variant={i} />
            <strong>{["12%", "32%", "1.2 MB/s"][i]}</strong>
          </div>
        ))}
      </section>
      <section className="system-panel">
        <h3>ACTIVE MODEL</h3>
        <div className="model-readout" title={`OpenRouter · ${CHAT_MODEL.id}`}>
          {CHAT_MODEL.label} <ChevronDown size={12} />
        </div>
        <div className="ready">
          <i /> Ready
        </div>
      </section>
      <section className="system-panel">
        <h3>QUICK ACTIONS</h3>
        <div className="quick-actions">
          {actions.map(({ label, icon: Icon, prompt }) => (
            <Button variant="ninja" key={label} onClick={() => onPrompt(prompt)}>
              <Icon />
              <span>{label}</span>
              <ChevronRight />
            </Button>
          ))}
        </div>
      </section>
      <section className="system-panel">
        <h3>RECENT FILES</h3>
        {files.map((file) => (
          <Button
            key={file.name}
            variant="nav"
            className="file-row"
            onClick={() => onFile(file.name)}
          >
            <FileCode2 />
            <span>{file.name}</span>
            <small>{file.age}</small>
          </Button>
        ))}
      </section>
      <section className="system-panel quote-panel">
        <p>
          Code is not just a skill,
          <br />
          It's a superpower.
        </p>
        <div className="quote-bar" />
      </section>
    </aside>
  );
}

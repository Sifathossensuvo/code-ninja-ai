import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "framer-motion";
import {
  Home,
  MessageSquarePlus,
  Network,
  Folder,
  History,
  Settings,
  Wrench,
  PanelsTopLeft,
  ChevronRight,
  ChevronDown,
  Terminal,
  Code2,
  MessagesSquare,
  PanelBottom,
  Paperclip,
  Play,
  Menu,
  X,
  Crosshair,
  Copy,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { NinjaMark, Globe } from "./identity";
import { RightPanels, actions, files } from "./panels";
import {
  clearThreads,
  createThread,
  deleteThread,
  readThreads,
  saveMessages,
  type NinjaThread,
} from "@/lib/threads";
import floor from "@/assets/circuit-floor.jpg";
const commands = [
  ["/chat", "Start a new conversation"],
  ["/code", "Generate code"],
  ["/explain", "Explain code"],
  ["/fix", "Fix errors"],
  ["/optimize", "Optimize code"],
  ["/create", "Create a new project"],
  ["/search", "Search the web"],
  ["/tools", "Open tools"],
  ["/clear", "Clear terminal"],
  ["/exit", "Exit the application"],
];
export function NinjaApp({ threadId }: { threadId?: string }) {
  const navigate = useNavigate();
  const [thread, setThread] = useState<NinjaThread | null>(null);
  useEffect(() => {
    if (!threadId) {
      const next = readThreads()[0] || createThread();
      void navigate({ to: "/chat/$threadId", params: { threadId: next.id }, replace: true });
    } else {
      const existing = readThreads().find((t) => t.id === threadId);
      if (existing) setThread(existing);
      else {
        const next = readThreads()[0] || createThread();
        void navigate({ to: "/chat/$threadId", params: { threadId: next.id }, replace: true });
      }
    }
  }, [threadId, navigate]);
  return <Workspace key={thread?.id || "loading"} thread={thread} />;
}
function Workspace({ thread }: { thread: NinjaThread | null }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<NinjaThread[]>([]);
  const [tab, setTab] = useState("Terminal");
  const [mode, setMode] = useState("Prompt");
  const [prompt, setPrompt] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [view, setView] = useState("Home");
  const [selectedFile, setSelectedFile] = useState("app.jsx");
  const [code, setCode] = useState(files[0]?.content || "");
  const [output, setOutput] = useState("");
  const [notice, setNotice] = useState("");
  const [deletion, setDeletion] = useState<NinjaThread | "all" | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    id: thread?.id || "initial",
    messages: thread?.messages || [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId: thread?.id || "initial" },
    }),
    onFinish: ({ messages: completed }) => {
      if (thread) saveMessages(thread.id, completed);
    },
    onError: () => textarea.current?.focus(),
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    setThreads(readThreads());
  }, [thread, messages]);
  useEffect(() => {
    if (thread && messages.length) {
      try {
        saveMessages(thread.id, messages);
      } catch {
        setNotice("Browser storage is full. Your session could not be saved.");
      }
    }
  }, [messages, thread]);
  useEffect(() => {
    if (!busy && view === "Home") textarea.current?.focus();
  }, [busy, thread, view]);
  const newChat = () => {
    const next = createThread();
    void navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
  };
  const confirmDeletion = () => {
    if (!deletion) return;
    try {
      const deletingCurrent = deletion === "all" || deletion.id === thread?.id;
      if (deletingCurrent) stop();
      if (deletion === "all") clearThreads();
      else deleteThread(deletion.id);
      const remaining = readThreads();
      setThreads(remaining);
      setDeletion(null);
      if (deletingCurrent) {
        const next = remaining[0] || createThread();
        void navigate({ to: "/chat/$threadId", params: { threadId: next.id }, replace: true });
      }
    } catch {
      setNotice("Could not delete this history. Please try again.");
    }
  };
  const choosePrompt = (text: string) => {
    setView("Home");
    setPrompt(text);
    setTimeout(() => textarea.current?.focus(), 0);
  };
  const openFile = (name: string) => {
    setSelectedFile(name);
    setCode(files.find((f) => f.name === name)?.content || "");
    setView("Home");
    setTab("Code Editor");
  };
  async function submit(text: string) {
    if (!text.trim() || busy || !thread) return;
    const value = text.trim();
    setPrompt("");
    if (value === "/clear") {
      setMessages([]);
      saveMessages(thread.id, []);
      setTab("Terminal");
      return;
    }
    if (value === "/chat") {
      newChat();
      return;
    }
    if (value === "/tools") {
      setView("Tools");
      return;
    }
    if (value === "/exit") {
      setTab("Terminal");
      return;
    }
    if (value === "help" || value === "/help") {
      setTab("Terminal");
      return;
    }
    setTab("AI Chat");
    await sendMessage({ text: value });
    textarea.current?.focus();
  }
  const nav = [
    { label: "Home", icon: Home },
    { label: "New Chat", icon: MessageSquarePlus, shortcut: "Ctrl+N" },
    { label: "Code Factory", icon: Network, shortcut: "Ctrl+K" },
    { label: "Projects", icon: Folder, shortcut: "Ctrl+P" },
    { label: "History", icon: History, shortcut: "Ctrl+H" },
    { label: "Templates", icon: PanelsTopLeft, shortcut: "Ctrl+T" },
    { label: "Tools", icon: Wrench },
    { label: "Settings", icon: Settings, shortcut: "Ctrl+," },
  ];
  return (
    <div className="ninja-app">
      <header className="topbar">
        <div className="brand">
          <NinjaMark className="brand-mark" />
          <div>
            <h1>THE CODE NINJA</h1>
            <p>
              IDEAS <span>⟶</span> PROMPTS <span>⟶</span> CODE <span>⟶</span> REALITY
            </p>
          </div>
        </div>
        <div className="engine-status">
          <i /> AI ENGINE: ONLINE <span>✦</span>
        </div>
        <div className="header-model">
          Model: GPT-6 Astra <ChevronDown size={13} />
        </div>
        <div className="header-stats">
          <span>CPU 12%</span>
          <span>MEM 32%</span>
          <span>NET 1.2 MB/s</span>
        </div>
        <Button variant="ghost" size="icon-sm" title="Settings" onClick={() => setView("Settings")}>
          <Settings />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title={mobileMenu ? "Close navigation" : "Toggle navigation"}
          aria-label={mobileMenu ? "Close navigation" : "Toggle navigation"}
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </Button>
      </header>
      <div className="workspace-layout">
        {mobileMenu && (
          <div
            className="sidebar-backdrop"
            onClick={() => setMobileMenu(false)}
            aria-hidden="true"
          />
        )}
        <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
          <nav>
            {nav.map(({ label, icon: Icon, shortcut }) => (
              <Button
                variant="nav"
                className={`nav-item ${view === label ? "active" : ""}`}
                key={label}
                onClick={() => {
                  setMobileMenu(false);
                  if (label === "New Chat") newChat();
                  else if (label === "Code Factory") {
                    setView("Home");
                    setTab("Code Editor");
                  } else setView(label);
                }}
              >
                <Icon />
                <span>{label}</span>
                {shortcut ? (
                  <kbd>{shortcut}</kbd>
                ) : label === "Tools" ? (
                  <ChevronDown className="nav-end" />
                ) : label === "Home" ? (
                  <ChevronRight className="nav-end" />
                ) : null}
              </Button>
            ))}
          </nav>
          <div className="active-sessions">
            <div className="sessions-heading">
              <h3>ACTIVE SESSIONS</h3>
              <Button
                variant="ghost"
                size="icon-xs"
                title="Clear all history"
                aria-label="Clear all history"
                disabled={!threads.length}
                onClick={() => setDeletion("all")}
              >
                <Trash2 />
              </Button>
            </div>
            <div className="session-list">
              {threads.map((t) => (
                <div key={t.id} className="session-item">
                  <Button asChild variant="nav" className="session-row">
                    <Link
                      to="/chat/$threadId"
                      params={{ threadId: t.id }}
                      onClick={() => {
                        setMobileMenu(false);
                        setView("Home");
                      }}
                    >
                      <i />
                      <span>{t.title}</span>
                      <small>{t.id === thread?.id ? "Just now" : "Saved"}</small>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="delete-chat"
                    title={`Delete ${t.title}`}
                    aria-label={`Delete chat ${t.title}`}
                    onClick={() => setDeletion(t)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="sidebar-bottom">
            <Globe />
            <div className="version">
              <Crosshair />
              <p>
                The Code Ninja v1.0.0
                <br />
                <span>Built for the real ones.</span>
              </p>
            </div>
          </div>
        </aside>
        <main className="main-workspace">
          <div className="terminal-panel">
            <div className="workspace-tabs">
              {[
                { label: "Terminal", icon: Terminal },
                { label: "Code Editor", icon: Code2 },
                { label: "AI Chat", icon: MessagesSquare },
                { label: "Output", icon: PanelBottom },
              ].map(({ label, icon: Icon }) => (
                <Button
                  variant="ninja"
                  key={label}
                  className={`workspace-tab ${tab === label ? "selected" : ""}`}
                  onClick={() => {
                    setView("Home");
                    setTab(label);
                  }}
                >
                  <Icon />
                  {label}
                </Button>
              ))}
              <span className="panel-cross">×</span>
            </div>
            <div className="terminal-body">
              <img className="circuit-floor" src={floor} alt="" width={1536} height={1024} />
              {view !== "Home" ? (
                <div className="utility-view">
                  <div className="utility-heading">
                    <h2>{view.toUpperCase()}</h2>
                    {(view === "History" || view === "Projects") && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="delete-chat"
                        title="Clear all history"
                        aria-label="Clear all history"
                        disabled={!threads.length}
                        onClick={() => setDeletion("all")}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                  {view === "History" || view === "Projects" ? (
                    <div className="history-list">
                      {threads.map((t) => (
                        <div className="history-item" key={t.id}>
                          <Button asChild variant="ninja">
                            <Link
                              to="/chat/$threadId"
                              params={{ threadId: t.id }}
                              onClick={() => setView("Home")}
                            >
                              <MessagesSquare />
                              <span>{t.title}</span>
                              <small>{t.messages.length} messages</small>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="delete-chat"
                            title={`Delete ${t.title}`}
                            aria-label={`Delete chat ${t.title}`}
                            onClick={() => setDeletion(t)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : view === "Settings" ? (
                    <div className="settings-content">
                      <h3>WORKSPACE CONFIGURATION</h3>
                      <p>
                        AI MODEL <strong>GPT-6 Astra</strong>
                      </p>
                      <p>
                        CONVERSATIONS <strong>Saved in this browser</strong>
                      </p>
                      <p>
                        THEME <strong>Ninja / Emerald</strong>
                      </p>
                      <p>
                        VERSION <strong>1.0.0</strong>
                      </p>
                      <Button
                        variant="ninja"
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(readThreads(), null, 2)], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "ninja-conversations.json";
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download />
                        Export conversations
                      </Button>
                    </div>
                  ) : (
                    <div className="tool-list">
                      {actions.map(({ label, icon: Icon, prompt: p }) => (
                        <Button
                          variant="ninja"
                          key={label}
                          onClick={() =>
                            choosePrompt(
                              view === "Templates"
                                ? `${p}Create a responsive React component with Tailwind CSS`
                                : p,
                            )
                          }
                        >
                          <Icon />
                          {label}
                          <ChevronRight />
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : tab === "Terminal" && messages.length === 0 ? (
                <div className="welcome-content">
                  <div className="terminal-text">
                    <p className="terminal-prompt">thecode-ninja@factory:~$</p>
                    <p>Initializing Code Factory...</p>
                    <p>[✓] Loading AI models...</p>
                    <p>[✓] Connecting to AI engine...</p>
                    <p>[✓] Checking system resources...</p>
                    <p>[✓] Ready for deployment.</p>
                    <br />
                    <p className="terminal-prompt">thecode-ninja@factory:~$</p>
                    <p className="terminal-help">&gt; help</p>
                    <p className="terminal-help">Available commands:</p>
                    <div className="command-list">
                      {commands.map(([cmd, description]) => (
                        <div key={cmd}>
                          <span>{cmd}</span>
                          <span>- {description}</span>
                        </div>
                      ))}
                    </div>
                    <p className="terminal-prompt bottom-prompt">
                      thecode-ninja@factory:~$ <span className="cursor">▌</span>
                    </p>
                  </div>
                  <motion.div
                    className="ninja-welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <NinjaMark className="welcome-mark" />
                    <h2>THE CODE NINJA</h2>
                    <p className="ninja-tagline">AI POWERED · HACKER MODE / CODE FACTORY</p>
                    <div className="status-box">
                      <h3>SYSTEM STATUS</h3>
                      <p>
                        • AI Engine <span>: Online</span>
                      </p>
                      <p>
                        • Model <span>: GPT-6 Astra</span>
                      </p>
                      <p>
                        • API <span>: Connected</span>
                      </p>
                      <p>
                        • Uptime <span>: 00:00:42</span>
                      </p>
                    </div>
                    <blockquote>
                      “Better code. A smarter you.”
                      <br />- The Code Ninja
                    </blockquote>
                  </motion.div>
                </div>
              ) : tab === "Code Editor" ? (
                <div className="code-view">
                  <div className="editor-toolbar">
                    <span>
                      <Code2 size={14} /> {selectedFile}
                    </span>
                    <div>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        title="Copy code"
                        onClick={() => {
                          void navigator.clipboard.writeText(code);
                          setNotice("Code copied.");
                        }}
                      >
                        <Copy />
                      </Button>
                      <Button
                        variant="ninja"
                        size="sm"
                        onClick={() => {
                          setOutput("✓ Source ready\n\n" + code);
                          setTab("Output");
                        }}
                      >
                        Preview source <Play />
                      </Button>
                    </div>
                  </div>
                  <div className="editor-lines">
                    <pre aria-hidden>
                      {code
                        .split("\n")
                        .map((_, i) => i + 1)
                        .join("\n")}
                    </pre>
                    <textarea
                      aria-label="Code editor"
                      spellCheck={false}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>
                </div>
              ) : tab === "Output" ? (
                <div className="output-view">
                  <h3>OUTPUT CONSOLE</h3>
                  <pre>{output || "No output yet.\nWaiting for your next command…"}</pre>
                </div>
              ) : (
                <Conversation className="ninja-conversation">
                  <ConversationContent>
                    {messages.length === 0 && (
                      <div className="chat-empty">
                        <NinjaMark className="empty-mark" />
                        <h2>READY WHEN YOU ARE.</h2>
                        <p>What are we building?</p>
                      </div>
                    )}
                    {messages.map((message) => (
                      <Message from={message.role} key={message.id}>
                        <div className="message-label">
                          {message.role === "user" ? "YOU" : "THE CODE NINJA"} <span>›</span>
                        </div>
                        <MessageContent>
                          {message.parts.map((part, i) =>
                            part.type === "text" ? (
                              <MessageResponse key={i}>{part.text}</MessageResponse>
                            ) : part.type === "reasoning" && part.text ? (
                              <details className="reasoning" key={i}>
                                <summary>Thinking</summary>
                                <MessageResponse>{part.text}</MessageResponse>
                              </details>
                            ) : null,
                          )}
                        </MessageContent>
                      </Message>
                    ))}
                    {busy && (
                      <div className="thinking">
                        <i />
                        <Shimmer>Processing...</Shimmer>
                      </div>
                    )}
                    {error && (
                      <p className="chat-error" role="alert">
                        {error.message}
                      </p>
                    )}
                    <ConversationScrollButton />
                  </ConversationContent>
                </Conversation>
              )}
            </div>
          </div>
          <div className="composer-panel">
            <div className="composer-tabs">
              {["Prompt", "Code", "File", "Web", "Tools"].map((label) => (
                <Button
                  variant="ghost"
                  size="sm"
                  key={label}
                  className={mode === label ? "selected" : ""}
                  onClick={() => {
                    setMode(label);
                    if (label === "Code") choosePrompt("/code ");
                    if (label === "File") fileInput.current?.click();
                    if (label === "Web") choosePrompt("Help me research ");
                    if (label === "Tools") setView("Tools");
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
            <PromptInput onSubmit={({ text }) => submit(text)} className="ninja-composer">
              <PromptInputTextarea
                ref={textarea}
                aria-label="Message or command"
                placeholder="Type your message or command..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                spellCheck={false}
              />
              <PromptInputFooter>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  title="Attach a text or code file"
                  onClick={() => fileInput.current?.click()}
                >
                  <Paperclip />
                </Button>
                <div className="composer-actions">
                  {actions.map(({ label, prompt: p }) => (
                    <Button variant="ninja" size="sm" key={label} onClick={() => choosePrompt(p)}>
                      {label}
                    </Button>
                  ))}
                </div>
                <PromptInputSubmit
                  status={status}
                  onStop={stop}
                  disabled={!thread || (!busy && !prompt.trim())}
                >
                  {busy ? undefined : <Play />}
                </PromptInputSubmit>
              </PromptInputFooter>
            </PromptInput>
            <input
              ref={fileInput}
              hidden
              type="file"
              accept=".txt,.js,.jsx,.ts,.tsx,.json,.css,.md,.py,.html"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 100000) {
                  setNotice("Choose a text file under 100 KB.");
                  return;
                }
                setPrompt(`${prompt}\n\nFile: ${file.name}\n\`\`\`\n${await file.text()}\n\`\`\``);
                textarea.current?.focus();
                e.target.value = "";
              }}
            />
            {notice && (
              <div className="notice">
                {notice}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  title="Dismiss"
                  onClick={() => setNotice("")}
                >
                  <X />
                </Button>
              </div>
            )}
          </div>
        </main>
        <RightPanels onPrompt={choosePrompt} onFile={openFile} />
      </div>
      <footer className="bottom-bar">
        <Crosshair />
        <div className="footer-circuit" />
        <span className="processing">
          <i /> {busy ? "PROCESSING..." : "SYSTEM READY"}
        </span>
        <div className="footer-circuit" />
        <span>SECURE // FAST // POWERFUL</span>
      </footer>
      <AlertDialog
        open={deletion !== null}
        onOpenChange={(open) => {
          if (!open) setDeletion(null);
        }}
      >
        <AlertDialogContent className="delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deletion === "all" ? "Clear all chat history?" : "Delete this chat?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletion === "all"
                ? "All conversations saved in this browser will be permanently deleted."
                : `“${deletion?.title || "This chat"}” and its messages will be permanently deleted.`}{" "}
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="ninja">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={confirmDeletion}>
              <Button variant="destructive">
                <Trash2 />
                {deletion === "all" ? "Delete all chats" : "Delete chat"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

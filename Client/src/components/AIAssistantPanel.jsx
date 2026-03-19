import { useState } from "react";
import { Button, Textarea } from "./primitives";
import { Icon } from "./Icons";

const quickActions = ["Explain this concept", "Generate a quick quiz", "Give me a portfolio example"];

export function AIAssistantPanel({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "I can help summarize lessons, suggest practice questions, and turn course notes into study prompts.",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const next = [
      ...messages,
      { id: `${Date.now()}-user`, role: "user", content: input },
      {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: `Here’s a strong next step for "${input}": review the lesson objective, list the core principles in your own words, then build one practical mini exercise from it.`,
      },
    ];
    setMessages(next);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[620px] w-[min(420px,calc(100%-2rem))] flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-2xl">
      <div className="mesh-card flex items-center justify-between px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--primary)]">
            <Icon name="sparkles" className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">AI Assistant</p>
            <p className="text-sm text-white/70">Course-aware study support</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
          <Icon name="close" className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--background)] p-5">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[86%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-[var(--primary)] text-white" : "bg-white text-[var(--foreground)]"}`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] bg-white px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => setInput(action)}
              className="rounded-full bg-[var(--surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--primary-100)]"
            >
              {action}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about the lesson, quiz prep, or projects..."
            className="min-h-[72px] resize-none"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <Button className="self-end" size="icon" onClick={handleSend}>
            <Icon name="send" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

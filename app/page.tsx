"use client";

import { useRef, useState, useEffect } from "react";
import { NavRail } from "@/components/nav-rail";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
} from "@/components/ai-elements/prompt-input";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowRight, DotsThreeVertical } from "@phosphor-icons/react";
import { AnimatedPlaceholder } from "@/components/animated-placeholder";
import { AdaptiveCardRenderer } from "@/components/chat/adaptive-card-renderer";
import {
  shouldShowCards,
  getRecommendedCardCount,
  getMultipleRandomLayouts,
  type CardLayoutType,
} from "@/lib/adaptive-card-selector";

const MODEL_LABELS: Record<string, string> = {
  "gemini-flash": "Gemini Flash 3.5",
  "gemini-pro": "Gemini Pro",
  "claude-sonnet": "Claude Sonnet",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const STOP_WORDS = new Set([
  "the","a","an","is","are","was","were","what","how","why","when","where",
  "who","can","could","would","should","will","do","does","did","i","you",
  "we","they","it","this","that","these","those","me","my","your","our",
  "their","its","please","help","tell","make","get","find","about","with",
  "for","from","and","or","but","so","if","then","just","some","any",
]);

function generateTitle(prompt: string): string {
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
  const title = words.slice(0, 3).join(" ");
  return title || prompt.slice(0, 28).trim();
}

type Message = { role: "user" | "assistant"; content: string; cards?: CardLayoutType[] };
// home → animating → chat
// overlay is always in DOM; only its opacity + bottom change
type AppState = "home" | "animating" | "chat";

const MOVE_MS = 550;
const CHAT_FADE_MS = 400;
const OVERLAY_FADE_MS = 500;

export default function Home() {
  const [model, setModel] = useState("gemini-flash");
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [appState, setAppState] = useState<AppState>("home");

  // Separate opacity states for each layer
  const [greetingOpacity, setGreetingOpacity] = useState(1);
  const [chatContentOpacity, setChatContentOpacity] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [overlayShadow, setOverlayShadow] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function resetToHome() {
    setMessages([]);
    setIsThinking(false);
    setChatTitle("");
    setValue("");
    setAppState("home");
    setGreetingOpacity(1);
    setChatContentOpacity(0);
    setOverlayVisible(false);
    setOverlayOpacity(1);
    setOverlayShadow(true);
  }

  function handleSubmit() {
    const text = value.trim();
    if (!text || appState === "animating") return;
    setValue("");

    const cards = shouldShowCards(text)
      ? getMultipleRandomLayouts(text, getRecommendedCardCount(text))
      : undefined;

    if (appState === "chat") {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: cards ? "Here's what I found:" : "This is a simulated response. Real AI integration would generate a response here based on your message.",
          cards,
        }]);
      }, 2000);
      return;
    }

    // home → animating
    setChatTitle(generateTitle(text));
    setMessages([{ role: "user", content: text }]);
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: cards ? "Here's what I found:" : "This is a simulated response. Real AI integration would generate a response here based on your message.",
        cards,
      }]);
    }, 2000);

    setAppState("animating");
    setOverlayVisible(true);
    setOverlayOpacity(1);

    requestAnimationFrame(() => {
      // Fade greeting out
      setGreetingOpacity(0);

      requestAnimationFrame(() => {
        // Start input moving down
        if (overlayRef.current) {
          overlayRef.current.style.transition = `bottom ${MOVE_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          overlayRef.current.style.bottom = "40px";
        }
        // Fade shadow out as input approaches its destination
        setTimeout(() => setOverlayShadow(false), 250);

        // Step 2: switch to chat state after input has landed — overlay still at opacity 1 covering it
        setTimeout(() => {
          setAppState("chat");
        }, MOVE_MS + 50);

        // Step 3: fade chat content in — input is at rest at this point
        setTimeout(() => {
          setChatContentOpacity(1);
        }, MOVE_MS + 50);

        // Step 4: start overlay fade AFTER chat content is fully visible
        setTimeout(() => {
          setOverlayOpacity(0);
        }, MOVE_MS + 50 + CHAT_FADE_MS);

        // Step 5: hide overlay after fade completes
        setTimeout(() => {
          setOverlayVisible(false);
          setGreetingOpacity(1);
        }, MOVE_MS + 50 + CHAT_FADE_MS + OVERLAY_FADE_MS);
      });
    });
  }

  const inputInner = (
    <PromptInput
      onSubmit={handleSubmit}
      className="w-full [&>[data-slot=input-group]]:border-0 [&>[data-slot=input-group]]:shadow-none [&>[data-slot=input-group]]:rounded-none [&>[data-slot=input-group]]:focus-within:ring-0 [&>[data-slot=input-group]]:focus-within:border-0 [&>[data-slot=input-group]]:bg-transparent"
    >
      <PromptInputBody className="relative">
        <AnimatedPlaceholder show={value.length === 0} />
        <PromptInputTextarea
          placeholder=""
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
          }}
          className="font-sans text-[16px]! font-normal text-[#1C160F] px-5 pt-5 pb-0 min-h-[76px]"
          style={{ fontVariationSettings: "'wght' 400" }}
        />
      </PromptInputBody>
      <PromptInputFooter className="px-3 pb-3 pt-2">
        <PromptInputTools>
          <button type="button" aria-label="Add attachment"
            className="flex items-center justify-center size-9 rounded-full border border-[#E9E4DB] bg-[#FDFBF8] text-[#776B5A] hover:bg-[#F0EBE3] hover:text-[#1C160F] transition-colors">
            <Plus size={20} />
          </button>
        </PromptInputTools>
        <PromptInputTools className="gap-2">
          <PromptInputSelect value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9 rounded-full border border-[#D8D1C7] bg-[#F0EBE3]/50 text-[#776B5A] text-[14.67px] font-medium px-3 gap-1.5 shadow-none focus:ring-0 hover:bg-[#E9E4DB] hover:text-[#1C160F] transition-colors [&_svg]:size-3.5">
              <SelectValue>{MODEL_LABELS[model]}</SelectValue>
            </SelectTrigger>
            <PromptInputSelectContent>
              <PromptInputSelectItem value="gemini-flash">Gemini Flash 3.5</PromptInputSelectItem>
              <PromptInputSelectItem value="gemini-pro">Gemini Pro</PromptInputSelectItem>
              <PromptInputSelectItem value="claude-sonnet">Claude Sonnet</PromptInputSelectItem>
            </PromptInputSelectContent>
          </PromptInputSelect>
          <button type="button" aria-label="Submit" onClick={handleSubmit}
            className="flex items-center justify-center size-9 rounded-full bg-[#463A2C] text-[#FDFBF8] hover:bg-[#5a4a38] transition-colors">
            <ArrowRight size={20} weight="bold" />
          </button>
        </PromptInputTools>
      </PromptInputFooter>
    </PromptInput>
  );

  const inputCard = (
    <div className="w-full max-w-[720px] rounded-[26px] border border-[#E9E4DB] bg-[#FDFBF8] shadow-[0_2px_4px_-2px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.10)]">
      {inputInner}
    </div>
  );

  const chatMessagesList = (
    <div className="max-w-[720px] mx-auto px-6 pt-10 pb-4 flex flex-col gap-8">
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <div key={i} className="flex justify-end">
            <span className="inline-block font-sans text-[16px] leading-6 text-[#0A0A0A] bg-[#F5F0EB] rounded-xl px-[17px] py-3 max-w-[560px]"
              style={{ fontVariationSettings: "'wght' 400" }}>
              {msg.content}
            </span>
          </div>
        ) : (
          <div key={i} className="flex flex-col gap-4">
            <p className="font-sans text-[16px] leading-7 text-[#1C160F]"
              style={{ fontVariationSettings: "'wght' 400" }}>
              {msg.content}
            </p>
            {msg.cards && <AdaptiveCardRenderer layouts={msg.cards} />}
          </div>
        )
      )}
      {isThinking && (
        <p className="font-sans text-[14px] text-[#776B5A]" style={{ fontVariationSettings: "'wght' 400" }}>
          Thinking…
        </p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  const isHome = appState === "home";
  const isChat = appState === "chat" || appState === "animating";

  return (
    <div className="h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      <NavRail onNewChat={resetToHome} />

      {/* ── Home layer ── */}
      {isHome && (
        <main
          className="flex flex-col flex-1 items-center justify-end pb-[calc(50vh-12px)]"
          style={{ marginLeft: "var(--nav-rail-width)", height: "100%" }}
        >
          <div className="flex flex-col items-center w-full max-w-[720px] px-0">
            <h1
              className="font-sans text-[30px] font-semibold text-[#1C160F] mb-6 tracking-tight"
              style={{ fontVariationSettings: "'wght' 600" }}
            >
              {getGreeting()}, Jonathan
            </h1>
            <div className="relative isolate w-full">
              <img src="/glow.svg" aria-hidden="true" className="absolute pointer-events-none select-none"
                style={{ width: "1097px", maxWidth: "none", height: "400px", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: -1 }} />
              <div className="w-full rounded-[26px] border border-[#E9E4DB] bg-[#FDFBF8] shadow-[0_2px_4px_-2px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.10)]">
                {inputInner}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── Animating: greeting fade layer ── */}
      {appState === "animating" && (
        <>
          <div
            className="fixed flex flex-col items-center justify-end pb-[calc(50vh-12px)]"
            style={{ left: "var(--nav-rail-width)", right: 0, top: 0, bottom: 0 }}
          >
            <h1
              className="font-sans text-[30px] font-semibold text-[#1C160F] mb-6 tracking-tight"
              style={{
                fontVariationSettings: "'wght' 600",
                opacity: greetingOpacity,
                transition: "opacity 0.35s ease",
              }}
            >
              {getGreeting()}, Jonathan
            </h1>
            <div style={{ width: "100%", maxWidth: 720, minHeight: 128 }} aria-hidden />
          </div>
        </>
      )}

      {/* ── Chat layer — rendered during animating AND chat states ── */}
      {isChat && (
        <>
          <header
            className="fixed top-0 right-0 z-20 flex items-start px-5"
            style={{
              left: "var(--nav-rail-width)",
              height: "48px",
              paddingTop: "16px",
              opacity: chatContentOpacity,
              transition: `opacity ${CHAT_FADE_MS}ms ease`,
            }}
          >
            <span className="font-sans text-[16px] font-medium text-[#1C160F] truncate capitalize"
              style={{ fontVariationSettings: "'wght' 500" }}>
              {chatTitle}
            </span>
            <button aria-label="More options"
              className="ml-auto flex items-center justify-center size-9 rounded-full text-[#1C160F] hover:bg-[#F0EBE3] transition-colors"
              style={{ marginTop: "-6px" }}>
              <DotsThreeVertical size={20} />
            </button>
          </header>

          <div
            className="fixed overflow-y-auto"
            style={{
              left: "var(--nav-rail-width)", right: 0, top: "48px", bottom: "210px",
              opacity: chatContentOpacity,
              transition: `opacity ${CHAT_FADE_MS}ms ease`,
            }}
          >
            {chatMessagesList}
          </div>

          {/* Real chat input — hidden while animating (overlay covers it), visible once in chat */}
          <div
            className="fixed z-10 flex justify-center px-6"
            style={{
              left: "var(--nav-rail-width)", right: 0, bottom: "40px",
              visibility: appState === "animating" ? "hidden" : "visible",
            }}
          >
            {inputCard}
          </div>

          <p
            className="fixed z-10 text-center text-[11px] leading-none"
            style={{
              left: "var(--nav-rail-width)", right: 0, bottom: "14px",
              color: "rgba(119,107,90,0.55)",
              opacity: chatContentOpacity,
              transition: `opacity ${CHAT_FADE_MS}ms ease`,
            }}
          >
            IQ may produce inaccurate information. Always verify important details independently.
          </p>
        </>
      )}

      {/* ── Overlay input — always in DOM, visible only during animation ──
           Starts at home position, moves to chat position, fades out over the real input */}
      {overlayVisible && (
        <div
          ref={overlayRef}
          className="fixed z-50 flex justify-center px-6 pointer-events-none"
          style={{
            left: "var(--nav-rail-width)",
            right: 0,
            bottom: "calc(50vh - 12px)",
            opacity: overlayOpacity,
            transition: `opacity ${OVERLAY_FADE_MS}ms ease`,
          }}
        >
          <div
            className="w-full max-w-[720px] rounded-[26px] border border-[#E9E4DB] bg-[#FDFBF8]"
            style={{
              boxShadow: overlayShadow
                ? "0 2px 4px -2px rgba(0,0,0,0.10), 0 4px 6px -2px rgba(0,0,0,0.10)"
                : "none",
              transition: `box-shadow ${MOVE_MS - 250}ms ease`,
            }}
          >
            {inputInner}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
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
import { Plus, ArrowRight, ArrowBendDownRight, DotsThreeVertical, CaretDown, X as PhosphorX, Info, NotePencil } from "@phosphor-icons/react";
import { AnimatedPlaceholder } from "@/components/animated-placeholder";
import { AdaptiveCardRenderer } from "@/components/chat/adaptive-card-renderer";
import { ProgressCard } from "@/components/chat/progress-card";
import { PatientAppointmentItem } from "@/components/chat/patient-appointment-item";
import { pickRandomAppointment, type AppointmentContext } from "@/lib/appointmentData";
import { ThinkingText } from "@/components/chat/thinking-text";
import { MessageToolbar } from "@/components/chat/message-toolbar";
import { WorkspacePanel } from "@/components/chat/workspace-panel";
import { WorkPanel } from "@/components/work/work-panel";
import { SessionHistoryPanel } from "@/components/chat/session-history-panel";
import { SessionResultCard } from "@/components/chat/session-result-card";
import { MOCK_SESSIONS } from "@/components/chat/session-history-list";
import type { Session } from "@/components/chat/session-history-list";
import { PatientSummaryPanel } from "@/components/chat/patient-summary-panel";
import { MedicationReviewForm, type MedicationReviewData } from "@/components/chat/medication-review-form";
import { MedicationReviewSummaryCard } from "@/components/chat/medication-review-summary-card";
import { ACTIVE_PATIENT } from "@/lib/patientData";
import { PatientTaskList } from "@/components/chat/patient-task-list";
import { AdditionalPanel } from "@/components/chat/additional-panel";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { NavRail } from "@/components/nav-rail";
import { NavIsland } from "@/components/nav-island/nav-island";
import { SheetHeader } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Warning } from "@phosphor-icons/react";
import { IndexPopover } from "@/components/chat/index-popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel, Field, FieldContent, FieldTitle } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { ArrowSquareOut } from "@phosphor-icons/react";
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

function sentenceCase(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

type RadioOption = { value: string; label: string };
type Message = { role: "user" | "assistant"; content: string; cards?: CardLayoutType[]; radioOptions?: RadioOption[]; radioLabel?: string; showFileReviewCard?: boolean; showEmailReadyItem?: boolean; showProgressCard?: boolean; showPatientTasks?: boolean; showMedicationReviewForm?: boolean; medicationReviewData?: MedicationReviewData; suggestions?: string[]; appointment?: AppointmentContext; followUpText?: string; sessionResult?: Session };
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
  const [thinkingPhrase, setThinkingPhrase] = useState<string | undefined>(undefined);
  const [chatTitle, setChatTitle] = useState("");
  const [appState, setAppState] = useState<AppState>("home");

  // Separate opacity states for each layer
  const [greeting] = useState(getGreeting);
  const [greetingOpacity, setGreetingOpacity] = useState(1);
  const [chatContentOpacity, setChatContentOpacity] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [overlayShadow, setOverlayShadow] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [navMode, setNavMode] = useState<'navrail' | 'island'>('navrail');
  const [isWorkspace, setIsWorkspace] = useState(false);
  const [closedWorkspaceTitle, setClosedWorkspaceTitle] = useState<string | null>(null);
  const [isAdditional, setIsAdditional] = useState(false);
  const [additionalMode, setAdditionalMode] = useState<'default' | 'draft-email'>('default');
  const [workspaceMode, setWorkspaceMode] = useState<'default' | 'patient-summary' | 'medication-review' | 'work' | 'session-history' | 'settings'>('default');
  function transitionToPanel(fn: () => void, responseMessage?: string, suggestions?: string[]) {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      if (responseMessage) {
        setMessages(prev => [...prev, { role: 'assistant' as const, content: responseMessage, suggestions }]);
      }
      fn();
    }, 1500);
  }

  const overlayRef = useRef<HTMLDivElement>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isWorkspace) chatScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [isWorkspace]);

  useEffect(() => {
    const handler = () => resetToHome();
    window.addEventListener("ix:new-chat", handler);
    return () => window.removeEventListener("ix:new-chat", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      setWorkspaceMode('work');
      setIsWorkspace(true);
      setIsAdditional(false);

      const greetings = [
        "Welcome to the Work view. I can help you manage tasks, track workflows, or find what needs attention today.",
        "Here's your Work view. Want me to summarise what's overdue, or help you prioritise what to tackle first?",
        "Good to see you in the Work view. I can walk you through the features here, or just ask me what you're looking to solve today.",
        "You're in the Work view. I can help you find tasks, manage workflows, or dig into anything that needs your attention.",
      ];
      const suggestions = [
        ["Show me what's overdue", "Walk me through the Work view features", "What tasks are assigned to me?"],
        ["What's my highest priority task?", "Show me blocked items", "Summarise today's workload"],
        ["Show me overdue tasks", "What workflows are awaiting input?", "What are the key features here?"],
        ["What needs my attention today?", "Show me tasks by matter", "Walk me through this view"],
      ];
      const idx = Math.floor(Math.random() * greetings.length);
      const welcomeMessage = {
        role: 'assistant' as const,
        content: greetings[idx],
        suggestions: suggestions[idx],
      };

      setChatTitle("Work");
      setMessages([welcomeMessage]);
      setIsThinking(false);
      setAppState("chat");
      setChatContentOpacity(1);
    };
    window.addEventListener("ix:open-work", handler);
    return () => window.removeEventListener("ix:open-work", handler);
  }, [appState]);

  useEffect(() => {
    const handler = () => {
      setWorkspaceMode('session-history');
      setIsWorkspace(true);
      setIsAdditional(false);

      const variants = [
        { noun: "patient",
          greeting: "Welcome to session history. Your previous sessions are listed in the main view, grouped by patient. Expand a session to see a summary and the items you viewed, or ask me to find something for you." },
        { noun: "case",
          greeting: "Welcome to session history. Your previous sessions are listed in the main view, grouped by case. Expand any session to see what was covered and the items you accessed, or ask me to track something down." },
        { noun: "patient",
          greeting: "Welcome to session history. Your previous sessions are shown in the main view, grouped by patient. Open a session to review its summary and activity, or let me know what you're looking for." },
        { noun: "case",
          greeting: "Welcome to session history. Past sessions are listed in the main view, grouped by case. Expand one to see a summary and everything you viewed, or ask me to find a specific session for you." },
      ];
      const greetings = variants.map(v => v.greeting);
      const suggestions = variants.map(v => [
        "What did I work on yesterday?",
        `Find my most recent session for a ${v.noun}`,
      ]);
      const idx = Math.floor(Math.random() * greetings.length);
      const welcomeMessage = {
        role: 'assistant' as const,
        content: greetings[idx],
        suggestions: suggestions[idx],
      };

      setChatTitle("Session history");
      setMessages([welcomeMessage]);
      setIsThinking(false);
      setAppState("chat");
      setChatContentOpacity(1);
    };
    window.addEventListener("ix:open-session-history", handler);
    return () => window.removeEventListener("ix:open-session-history", handler);
  }, [appState]);

  useEffect(() => {
    const handler = () => {
      setWorkspaceMode('settings');
      setIsWorkspace(true);
      setIsAdditional(false);

      const greetings = [
        "Settings — this is where you fine-tune the way you work. Let me know if you need a hand with anything.",
        "Here are your settings. Everything from appearance to chat behaviour lives here. Just ask if you need help finding something.",
        "You're in Settings. Feel free to explore — or tell me what you're trying to change and I'll point you in the right direction.",
        "Settings. A good place to make IQ feel a bit more like yours. Let me know if I can help with anything here.",
      ];
      const allSuggestions = [
        "How do I change my theme?",
        "Where are my chat preferences?",
        "What can I personalise?",
        "How do I manage my memories?",
        "Walk me through what's here",
        "How do I add a new skill?",
        "What does the Personalisation section do?",
        "How do I update my profile?",
        "Can I change the default AI model?",
      ];
      const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5).slice(0, 3);
      const idx = Math.floor(Math.random() * greetings.length);
      const welcomeMessage = { role: 'assistant' as const, content: greetings[idx], suggestions: shuffled };

      setChatTitle("Settings");
      setMessages([welcomeMessage]);
      setIsThinking(false);
      setAppState("chat");
      setChatContentOpacity(1);
    };
    window.addEventListener("ix:open-settings", handler);
    return () => window.removeEventListener("ix:open-settings", handler);
  }, [appState]);

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
    setIsWorkspace(false);
    setClosedWorkspaceTitle(null);
    setIsAdditional(false);
    setWorkspaceMode('default');
    setAdditionalMode('default');
  }

  function detectLayout(text: string): "inline" | "workspace" | "additional" | undefined {
    const lower = text.toLowerCase();
    if (lower.includes("show small data") || lower.includes("small data")) return "inline";
    if (lower.includes("show large data") || lower.includes("large data")) return "workspace";
    if (lower.includes("show additional data") || lower.includes("additional data")) return "additional";
    return undefined;
  }

  function handleSubmit(overrideText?: string, layout?: "inline" | "workspace" | "additional") {
    const text = (overrideText ?? value).trim();
    if (!text || appState === "animating") return;
    setValue("");

    if (text.toLowerCase() === "show island") { setNavMode('island'); return; }
    if (text.toLowerCase() === "show navrail") { setNavMode('navrail'); return; }
    if (text.toLowerCase() === "new notification") { window.dispatchEvent(new CustomEvent('ix:new-notification')); return; }
    if (text.toLowerCase() === "show meeting") { window.dispatchEvent(new CustomEvent('ix:appointment-reminder')); return; }

    const isFileReview = text.toLowerCase().includes("file review");
    const isFileReviewYes = text === "__file_review_yes__";
    const isDraftEmailYes = text === "__draft_email_yes__";
    const isNextAppointment = text.toLowerCase().includes("next appointment");
    const isChangeAddress = text.toLowerCase().includes("change address");
    const appt = isNextAppointment ? pickRandomAppointment() : undefined;
    const resolvedExplicitLayout = layout ?? detectLayout(text) ?? "inline";

    const showCards = resolvedExplicitLayout === "inline" && !isFileReview && !isFileReviewYes && !isDraftEmailYes && !isNextAppointment && !isChangeAddress;
    const cards = isChangeAddress
      ? ['address-form' as const]
      : showCards
      ? getMultipleRandomLayouts(text, getRecommendedCardCount(text))
      : undefined;
    const radioOptions: RadioOption[] | undefined = isFileReview
      ? [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]
      : isFileReviewYes
      ? [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]
      : undefined;
    const radioLabel = isFileReviewYes
      ? "Would you like me to draft an email to the owning fee earner regarding the corrective actions?"
      : isFileReview
      ? "Would you like me to select a file at random?"
      : undefined;
    const showFileReviewCard = isFileReviewYes;

    const resolvedLayout = resolvedExplicitLayout;

    function applyLayout() {
      if (resolvedLayout === "workspace") { setIsWorkspace(true); setIsAdditional(false); }
      else if (resolvedLayout === "additional") { setIsAdditional(true); setIsWorkspace(false); }
      else { setIsWorkspace(false); setIsAdditional(false); }
    }

    if (appState === "chat") {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: isNextAppointment && appt ? `Your next appointment is in ${appt.minutesUntil} minutes at ${appt.time} with ${appt.patientName}.` : isDraftEmailYes ? "Your draft email is ready for review." : isFileReviewYes ? "Okay, I've reviewed the following file and it scores 95% because there's a conflict check that hasn't been done." : isFileReview ? "I'd be happy to help you do a file review! To assist you best, I need a bit more information:" : cards ? "Here's what I found:" : "This is a simulated response. Real AI integration would generate a response here based on your message.",
          cards,
          radioOptions,
          radioLabel,
          showFileReviewCard,
          showEmailReadyItem: isDraftEmailYes,
          appointment: appt,
          followUpText: appt?.followUpText,
          suggestions: undefined,
        }]);
        applyLayout();
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
        content: isNextAppointment && appt ? `Your next appointment is in ${appt.minutesUntil} minutes at ${appt.time} with ${appt.patientName}.` : isFileReview ? "I'd be happy to help you do a file review! To assist you best, I need a bit more information:" : cards ? "Here's what I found:" : "This is a simulated response. Real AI integration would generate a response here based on your message.",
        cards,
        radioOptions,
        radioLabel,
        appointment: appt,
        followUpText: appt?.followUpText,
        suggestions: undefined,
      }]);
      applyLayout();
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
          overlayRef.current.style.bottom = "51px";
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
          className="font-sans text-[16px]! font-normal text-foreground px-5 pt-5 pb-0 min-h-[76px]"
          style={{ fontVariationSettings: "'wght' 400" }}
        />
      </PromptInputBody>
      <PromptInputFooter className="px-3 pb-3 pt-2">
        <PromptInputTools>
          <button type="button" aria-label="Add attachment"
            className="flex items-center justify-center size-9 rounded-full border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Plus size={20} />
          </button>
        </PromptInputTools>
        <PromptInputTools className="gap-2">
          <PromptInputSelect value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9 rounded-full border border-border bg-secondary/50 text-muted-foreground text-[14.67px] font-medium px-3 gap-1.5 shadow-none focus:ring-0 hover:bg-accent hover:text-foreground transition-colors [&_svg]:size-3.5">
              <SelectValue>{MODEL_LABELS[model]}</SelectValue>
            </SelectTrigger>
            <PromptInputSelectContent>
              <PromptInputSelectItem value="gemini-flash">Gemini Flash 3.5</PromptInputSelectItem>
              <PromptInputSelectItem value="gemini-pro">Gemini Pro</PromptInputSelectItem>
              <PromptInputSelectItem value="claude-sonnet">Claude Sonnet</PromptInputSelectItem>
            </PromptInputSelectContent>
          </PromptInputSelect>
          <button type="button" aria-label="Submit" onClick={handleSubmit}
            className="flex items-center justify-center size-9 rounded-full bg-action text-action-foreground hover:bg-action-hover transition-colors">
            <ArrowRight size={20} weight="bold" />
          </button>
        </PromptInputTools>
      </PromptInputFooter>
    </PromptInput>
  );

  const inputCard = (
    <div className="w-full max-w-[720px] rounded-[26px] border border-border bg-surface-raised shadow-sm">
      {inputInner}
    </div>
  );

  const isHome = appState === "home";
  const isChat = appState === "chat" || appState === "animating";
  const lastAssistantIdx = messages.reduce((acc, m, i) => m.role === 'assistant' ? i : acc, -1);

  return (
    <div className="h-full overflow-hidden bg-background flex flex-1 min-w-0">
      {navMode === 'navrail' && <NavRail />}
      {navMode === 'island' && (
        <NavIsland
          onSessionHistory={() => window.dispatchEvent(new CustomEvent('ix:open-session-history'))}
          onWork={() => window.dispatchEvent(new CustomEvent('ix:open-work'))}
          onSettings={() => window.dispatchEvent(new CustomEvent('ix:open-settings'))}
        />
      )}
      <div className="relative flex flex-col flex-1 min-w-0 h-full overflow-hidden" style={{ minHeight: 0 }}>
      {/* Alert banner */}
      {showAlert && (
        <div
          className="absolute z-50 px-4"
          style={{ left: 0, right: 0, top: "40px" }}
        >
          <div className="max-w-[720px] mx-auto flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-border shadow-sm">
            <Warning size={16} weight="fill" className="text-warning shrink-0 self-start mt-[3px]" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-foreground leading-5">File review due!</p>
              <p className="text-[14px] text-muted-foreground leading-5 mt-0.5">We&apos;ve noticed it&apos;s nearly a month since the last file review. It&apos;s time to complete another one to keep files up to date and meet compliance requirements.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" className="bg-foreground hover:bg-foreground/90 text-background rounded-[10px] px-4 h-8 text-[13px]" onClick={() => { setShowAlert(false); handleSubmit("Help me perform a file review", "inline"); }}>
                Start a review
              </Button>
              <button
                onClick={() => setShowAlert(false)}
                aria-label="Dismiss"
                className="flex items-center justify-center size-8 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
              >
                <PhosphorX size={14} />
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── Home layer ── */}
      {isHome && (
        <main
          className="relative flex flex-col flex-1 items-center justify-end pb-[calc(50vh-12px)]"
          style={{ height: "100%" }}
        >
          <div className="flex flex-col items-center w-full max-w-[720px] px-0">
            <h1
              className="font-sans text-[30px] font-semibold text-foreground mb-6 tracking-tight"
              style={{ fontVariationSettings: "'wght' 600" }}
            >
              {greeting}, Jonathan
            </h1>
            <div className="relative isolate w-full">
              <img src="/glow.svg" aria-hidden="true" className="absolute pointer-events-none select-none"
                style={{ width: "1097px", maxWidth: "none", height: "400px", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: -1 }} />
              <div className="w-full rounded-[26px] border border-border bg-surface-raised shadow-sm">
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
            className="absolute flex flex-col items-center justify-end pb-[calc(50vh-12px)]"
            style={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <h1
              className="font-sans text-[30px] font-semibold text-foreground mb-6 tracking-tight"
              style={{
                fontVariationSettings: "'wght' 600",
                opacity: greetingOpacity,
                transition: "opacity 0.35s ease",
              }}
            >
              {greeting}, Jonathan
            </h1>
            <div style={{ width: "100%", maxWidth: 720, minHeight: 128 }} aria-hidden />
          </div>
        </>
      )}

      {/* ── Chat layer — rendered during animating AND chat states ── */}
      {isChat && (
        <div
          className="absolute flex overflow-hidden"
          style={{
            left: 0, right: 0, top: 0, bottom: 0,
            opacity: chatContentOpacity,
            transition: `opacity ${CHAT_FADE_MS}ms ease`,
          }}
        >
          {/* ── Workspace panel ── */}
          <div
            className={`h-full overflow-hidden ${navMode === 'island' ? 'border-l' : 'border-r'} border-border`}
            style={{
              flex: isWorkspace ? "2 1 0" : "0 0 0",
              minWidth: 0,
              order: navMode === 'island' ? 1 : 0,
              transition: "flex 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {isWorkspace && workspaceMode === 'patient-summary' && (
              <PatientSummaryPanel
                onClose={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
                onTasksClick={() => {
                  setIsThinking(true);
                  setTimeout(() => {
                    setIsThinking(false);
                    setMessages(prev => [...prev,
                      { role: 'user', content: 'Show outstanding tasks' },
                      { role: 'assistant', content: `Here are the ${ACTIVE_PATIENT.patientTracker?.outstandingTasks ?? 0} outstanding tasks for ${ACTIVE_PATIENT.demographics.displayName}.`, showPatientTasks: true },
                    ]);
                  }, 1200);
                }}
              />
            )}
            {isWorkspace && workspaceMode === 'medication-review' && (
              <div className={`h-full flex flex-col bg-popover ${navMode === 'island' ? 'border-l' : 'border-r'} border-border`}>
                <SheetHeader className="px-4 pt-4 pb-3 flex-row items-start justify-between gap-2 shrink-0 border-b border-border">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-heading text-base font-medium text-foreground leading-none">Medication review</p>
                  </div>
                  <button
                    onClick={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
                    className="flex items-center justify-center size-8 rounded-full text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Close"
                  >
                    <PhosphorX size={16} />
                  </button>
                </SheetHeader>
                <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-6">
                  <MedicationReviewForm
                    onCancel={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
                    onSave={() => {
                      setIsWorkspace(false);
                      setWorkspaceMode('default');
                      setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `Medication review for ${ACTIVE_PATIENT.demographics.displayName} has been saved successfully.`,
                      }]);
                    }}
                  />
                </div>
              </div>
            )}
            {isWorkspace && workspaceMode === 'default' && (
              <WorkspacePanel
                title="Today's Appointments"
                onClose={() => {
                  setClosedWorkspaceTitle("Today's Appointments");
                  setIsWorkspace(false);
                }}
              />
            )}
            {isWorkspace && workspaceMode === 'work' && (
              <WorkPanel
                onClose={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
              />
            )}
            {isWorkspace && workspaceMode === 'session-history' && (
              <SessionHistoryPanel
                onClose={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
              />
            )}
            {isWorkspace && workspaceMode === 'settings' && (
              <SettingsPanel
                onClose={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
              />
            )}
          </div>

          {/* ── Chat panel — full, or 1/3 (workspace), or 2/3 (additional) ── */}
          <div
            ref={chatPanelRef}
            className="relative flex flex-col h-full overflow-hidden"
            style={{
              flex: isWorkspace ? "1 0 0" : isAdditional ? "2 1 0" : "1 1 0",
              minWidth: 0,
              order: navMode === 'island' ? 0 : 1,
              transition: "flex 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
  
            {/* Header */}
            <SheetHeader className="flex-shrink-0 px-4 pt-4 pb-3 flex-row items-center justify-between gap-2 border-b border-border">
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="font-heading text-base font-medium text-foreground leading-none truncate">{sentenceCase(chatTitle)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {navMode === 'island' && (
                  <Tooltip>
                    <TooltipTrigger
                      aria-label="New session"
                      onClick={() => window.dispatchEvent(new CustomEvent('ix:new-chat'))}
                      className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                    >
                      <NotePencil size={18} weight="duotone" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">New session</TooltipContent>
                  </Tooltip>
                )}
                <IndexPopover index={MOCK_SESSIONS[0].index} />
                <button
                  aria-label="More options"
                  className="flex items-center justify-center size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                >
                  <DotsThreeVertical size={18} weight="bold" />
                </button>
              </div>
            </SheetHeader>

            {/* Messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[720px] px-4 pt-6 pb-4 flex flex-col gap-8">
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <span className="inline-block font-sans text-[16px] leading-6 text-bubble-foreground bg-bubble rounded-xl px-[17px] py-3 max-w-[400px]"
                        style={{ fontVariationSettings: "'wght' 400" }}>
                        {msg.content === "__email_sent__" ? "Your email has been sent" : ["__file_review_yes__", "__draft_email_yes__", "__task_yes__"].includes(msg.content) ? "Yes" : msg.content}
                      </span>
                    </div>
                  ) : (
                    <div key={i} className="flex flex-col gap-4">
                      {msg.content.includes('\n\n') ? (
                        <div className="flex flex-col gap-4">
                          {msg.content.split('\n\n').map((para, pi) => (
                            <p key={pi} className="font-sans text-[16px] leading-7 text-foreground" style={{ fontVariationSettings: "'wght' 400" }}>{para}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="font-sans text-[16px] leading-7 text-foreground" style={{ fontVariationSettings: "'wght' 400" }}>
                          {msg.content}
                        </p>
                      )}
                      {msg.cards && !isWorkspace && <AdaptiveCardRenderer layouts={msg.cards} />}
                      {msg.showFileReviewCard && (
                        <Card className="gap-0">
                          <CardHeader className="border-b border-border">
                            <CardTitle>File review</CardTitle>
                            <CardDescription>Summary</CardDescription>
                          </CardHeader>
                          <CardContent className="px-2 pb-4 pt-2">
                            {[
                              { label: "Client", value: "Sarah & James Whitmore", highlight: false },
                              { label: "Matter", value: "Purchase of 12 Oakwood Avenue", highlight: false },
                              { label: "Reference", value: "CON-2026-0626", highlight: false },
                              { label: "Score", value: "95%", highlight: true },
                            ].map(({ label, value, highlight }) => (
                              <div key={label} className={`flex items-center justify-between py-3 [&:not(:last-child)]:border-b border-border${highlight ? " bg-muted/40" : ""}`}>
                                <span className="text-[14px] font-medium text-foreground px-2">{label}</span>
                                <span className="text-[14px] text-muted-foreground px-2">{value}</span>
                              </div>
                            ))}
                          </CardContent>
                          <CardFooter className="justify-end gap-2">
                            <Button variant="outline" size="sm" className="rounded-[10px] h-8 px-4 text-[13px]">Export</Button>
                            <Button variant="outline" size="sm" className="rounded-[10px] h-8 px-4 text-[13px]">More details</Button>
                          </CardFooter>
                        </Card>
                      )}
                      {msg.showEmailReadyItem && (
                        <Item variant="outline">
                          <ItemMedia variant="icon" className="self-center">
                            <div className="flex size-8 items-center justify-center rounded-[10px] border border-border">
                              <Info size={16} className="text-muted-foreground" />
                            </div>
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>Email ready for review</ItemTitle>
                            <ItemDescription>Here&apos;s a draft email for you to review and send to the fee earner</ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <Button variant="outline" size="sm" className="rounded-[10px] h-8 px-4 text-[13px] gap-1.5" onClick={() => transitionToPanel(() => { setAdditionalMode('draft-email'); setIsAdditional(true); setIsWorkspace(false); }, 'Opening draft email for review.')}>
                              Review <ArrowRight size={13} />
                            </Button>
                          </ItemActions>
                        </Item>
                      )}
                      {msg.appointment && (
                        <PatientAppointmentItem
                          appointment={msg.appointment}
                          onView={() => transitionToPanel(() => { setWorkspaceMode('patient-summary'); setIsWorkspace(true); setIsAdditional(false); }, `Opened OneView patient summary for ${ACTIVE_PATIENT.demographics.displayName}.`, ['Show outstanding tasks for this patient?', 'Review current medications before the appointment?'])}
                        />
                      )}
                      {msg.sessionResult && (
                        <SessionResultCard session={msg.sessionResult} />
                      )}
                      {msg.showPatientTasks && ACTIVE_PATIENT.tasks && (
                        <PatientTaskList
                          tasks={ACTIVE_PATIENT.tasks}
                          onTaskClick={(task) => {
                            if (task.title.toLowerCase().includes('medication review')) {
                              setIsThinking(true);
                              setTimeout(() => {
                                setIsThinking(false);
                                setMessages(prev => [...prev,
                                  { role: 'user', content: task.title },
                                  { role: 'assistant', content: 'Here\'s the medication review form for Margaret Ellison.', showMedicationReviewForm: true },
                                ]);
                              }, 1000);
                            }
                          }}
                        />
                      )}
                      {msg.medicationReviewData && (
                        <MedicationReviewSummaryCard data={msg.medicationReviewData} />
                      )}
                      {msg.showMedicationReviewForm && (
                        <MedicationReviewForm
                          onCancel={() => setMessages(prev => prev.filter(m => !m.showMedicationReviewForm))}
                          onSave={(data) => {
                            // Replace form with summary card, then append success message
                            setMessages(prev => prev.map(m =>
                              m.showMedicationReviewForm
                                ? { ...m, showMedicationReviewForm: false, medicationReviewData: data }
                                : m
                            ));
                            setThinkingPhrase('Saving...');
                            setIsThinking(true);
                            setTimeout(() => {
                              setIsThinking(false);
                              setThinkingPhrase(undefined);
                              setMessages(prev => [...prev, {
                                role: 'assistant',
                                content: `Medication review for ${ACTIVE_PATIENT.demographics.displayName} has been completed and saved. The next review has been scheduled in ${data.nextReview}.`,
                              }]);
                            }, 1200);
                          }}
                        />
                      )}
                      {msg.followUpText && (
                        <p className="font-sans text-[16px] leading-7 text-foreground" style={{ fontVariationSettings: "'wght' 400" }}>{msg.followUpText}</p>
                      )}
                      {msg.showProgressCard && (
                        <ProgressCard onComplete={() => {
                          setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: 'All done! A task has been created and assigned to the owning fee earner, and the 14-day deadline has been diarised.',
                            suggestions: [
                              'Schedule a follow-up review?',
                              'Create a task to chase the corrective actions?',
                              'Review another file at random?',
                            ],
                          }]);
                        }} />
                      )}
                      {msg.radioOptions && (
                        <div className={`flex flex-col gap-4${msg.showFileReviewCard || msg.showEmailReadyItem ? ' mt-4' : ''}`}>
                        {msg.radioLabel && <p className="font-sans text-[16px] leading-7 text-foreground" style={{ fontVariationSettings: "'wght' 400" }}>{msg.radioLabel}</p>}
                        <RadioGroup className="gap-2" onValueChange={(val) => {
                          if (val === "yes" && msg.radioLabel?.includes("select a file at random")) {
                            setTimeout(() => handleSubmit("__file_review_yes__", "inline"), 300);
                          } else if (val === "yes" && msg.radioLabel?.includes("draft an email")) {
                            setTimeout(() => handleSubmit("__draft_email_yes__", "inline"), 300);
                          } else if (val === "yes" && !msg.radioLabel) {
                            setTimeout(() => {
                              setMessages(prev => [...prev,
                                { role: 'user', content: '__task_yes__' },
                                { role: 'assistant', content: '', showProgressCard: true },
                              ]);
                            }, 300);
                          }
                        }}>
                          {msg.radioOptions.map((opt) => (
                            <FieldLabel key={opt.value}>
                              <Field orientation="horizontal">
                                <RadioGroupItem value={opt.value} id={opt.value} />
                                <FieldContent>
                                  <FieldTitle>{opt.label}</FieldTitle>
                                </FieldContent>
                              </Field>
                            </FieldLabel>
                          ))}
                        </RadioGroup>
                        </div>
                      )}
                      <MessageToolbar
                        onCopy={() => navigator.clipboard.writeText(msg.content)}
                        onRepeat={() => { setValue(messages.findLast(m => m.role === "user")?.content ?? ""); }}
                      />
                      {msg.suggestions && i === lastAssistantIdx && !isThinking && (
                        <div className="flex flex-col items-start gap-1">
                          {msg.suggestions.map((s) => (
                            <Button key={s} variant="ghost" size="sm"
                              className="h-auto py-1 px-2 text-[14px] text-muted-foreground hover:text-foreground gap-2 font-normal"
                              onClick={() => {
                                if (s.toLowerCase().includes('what did i work on yesterday')) {
                                  const yesterday = new Date();
                                  yesterday.setDate(yesterday.getDate() - 1);
                                  const yDate = yesterday.toISOString().slice(0, 10);
                                  const yesterdaySessions = MOCK_SESSIONS.filter(s => s.isoDate.startsWith(yDate));
                                  if (yesterdaySessions.length === 0) {
                                    setMessages(prev => [...prev,
                                      { role: 'user', content: s },
                                      { role: 'assistant', content: "I couldn't find any sessions from yesterday." },
                                    ]);
                                  } else {
                                    const session = yesterdaySessions[0];
                                    setMessages(prev => [...prev,
                                      { role: 'user', content: s },
                                      { role: 'assistant', content: `Yesterday you worked on "${session.title}". Here's a summary of the session and everything you accessed.`, sessionResult: session },
                                    ]);
                                  }
                                } else if (s.toLowerCase().startsWith('find my most recent session for a')) {
                                  const noun = s.endsWith('patient') ? 'patient' : 'case';
                                  setMessages(prev => [...prev,
                                    { role: 'user', content: s },
                                    { role: 'assistant', content: `Which ${noun} would you like to search for?` },
                                  ]);
                                } else if (s.toLowerCase().includes('patient summary')) {
                                  transitionToPanel(() => { setWorkspaceMode('patient-summary'); setIsWorkspace(true); setIsAdditional(false); }, `Opened OneView patient summary for ${ACTIVE_PATIENT.demographics.displayName}.`, ['Show outstanding tasks for this patient?', 'Review current medications before the appointment?']);
                                } else if (s.toLowerCase().includes('review current medications') || s.toLowerCase().includes('medication review')) {
                                  transitionToPanel(() => { setWorkspaceMode('medication-review'); setIsWorkspace(true); setIsAdditional(false); }, `Opening medication review form for ${ACTIVE_PATIENT.demographics.displayName}.`);
                                } else if (s.toLowerCase().includes('outstanding tasks') || s.toLowerCase().includes('tasks for')) {
                                  setIsThinking(true);
                                  setTimeout(() => {
                                    setIsThinking(false);
                                    setMessages(prev => [...prev,
                                      { role: 'user', content: s },
                                      { role: 'assistant', content: `Here are the ${ACTIVE_PATIENT.patientTracker?.outstandingTasks ?? 0} outstanding tasks for ${ACTIVE_PATIENT.demographics.displayName}.`, showPatientTasks: true },
                                    ]);
                                  }, 1200);
                                }
                              }}
                            >
                              <ArrowBendDownRight size={14} className="shrink-0" />
                              {s}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
                {closedWorkspaceTitle && (
                  <Item variant="outline">
                    <ItemContent>
                      <ItemTitle>{closedWorkspaceTitle} closed</ItemTitle>
                      <ItemDescription>The workspace view has been closed.</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsWorkspace(true)}
                        className="gap-1.5"
                      >
                        <ArrowSquareOut size={14} />
                        Re-open
                      </Button>
                    </ItemActions>
                  </Item>
                )}
                {isThinking && <ThinkingText phrase={thinkingPhrase} />}
              </div>
            </div>

            {/* Input */}
            <div
              className="flex-shrink-0 flex justify-center px-4 pt-4 mb-4"
              style={{ visibility: appState === "animating" ? "hidden" : "visible" }}
            >
              <div className="w-full max-w-[720px] rounded-[26px] border border-border bg-surface-raised shadow-sm">
                {inputInner}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="flex-shrink-0 text-center text-[11px] leading-none pb-6 text-muted-foreground/55">
              IQ can make mistakes. <span className="underline underline-offset-2">Read our AI usage policy.</span>
            </p>
          </div>

          {/* ── Additional panel (left in navrail, right in island) ── */}
          <div
            className={`h-full overflow-hidden ${navMode === 'island' ? 'border-l' : 'border-r'} border-border`}
            style={{
              flex: isAdditional ? "1 0 0" : "0 0 0",
              minWidth: 0,
              order: navMode === 'island' ? 1 : 0,
              transition: "flex 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {isAdditional && (
              <AdditionalPanel
                title={additionalMode === 'draft-email' ? 'Draft email' : 'Related Content'}
                variant={additionalMode}
                onClose={() => { setIsAdditional(false); setAdditionalMode('default'); }}
                onSend={() => {
                  setIsAdditional(false);
                  setAdditionalMode('default');
                  setMessages(prev => [
                    ...prev,
                    { role: 'user', content: '__email_sent__' },
                  ]);
                  setIsThinking(true);
                  setTimeout(() => {
                    setIsThinking(false);
                    setMessages(prev => [...prev, {
                      role: 'assistant',
                      content: "The email has been sent to the owning fee earner (Arthur Pendleton) and has been read.\n\nShall I create a fee earner task and diarise the 14-day deadline?",
                      radioOptions: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
                    }]);
                  }, 2000);
                }}
              />
            )}
          </div>

        </div>
      )}

      {/* ── Overlay input — always in DOM, visible only during animation ──
           Starts at home position, moves to chat position, fades out over the real input */}
      {overlayVisible && (
        <div
          ref={overlayRef}
          className="absolute z-50 flex justify-center px-6 pointer-events-none"
          style={{
            left: 0,
            right: 0,
            bottom: "calc(50vh - 12px)",
            opacity: overlayOpacity,
            transition: `opacity ${OVERLAY_FADE_MS}ms ease`,
          }}
        >
          <div
            className={`w-full max-w-[720px] rounded-[26px] border border-border bg-surface-raised transition-shadow`}
            style={{ transitionDuration: `${MOVE_MS - 250}ms`, boxShadow: overlayShadow ? undefined : "none" }}
          >
            {inputInner}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

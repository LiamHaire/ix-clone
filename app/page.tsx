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
import { Plus, ArrowRight, ArrowBendDownRight, DotsThreeVertical, CaretDown, X as PhosphorX, Info } from "@phosphor-icons/react";
import { AnimatedPlaceholder } from "@/components/animated-placeholder";
import { AdaptiveCardRenderer } from "@/components/chat/adaptive-card-renderer";
import { ProgressCard } from "@/components/chat/progress-card";
import { PatientAppointmentItem } from "@/components/chat/patient-appointment-item";
import { pickRandomAppointment, type AppointmentContext } from "@/lib/appointmentData";
import { ThinkingText } from "@/components/chat/thinking-text";
import { MessageToolbar } from "@/components/chat/message-toolbar";
import { WorkspacePanel } from "@/components/chat/workspace-panel";
import { PatientSummaryPanel } from "@/components/chat/patient-summary-panel";
import { AdditionalPanel } from "@/components/chat/additional-panel";
import { SheetHeader } from "@/components/ui/sheet";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Warning } from "@phosphor-icons/react";
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
type Message = { role: "user" | "assistant"; content: string; cards?: CardLayoutType[]; radioOptions?: RadioOption[]; radioLabel?: string; showFileReviewCard?: boolean; showEmailReadyItem?: boolean; showProgressCard?: boolean; suggestions?: string[]; appointment?: AppointmentContext; followUpText?: string };
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

  const [showAlert, setShowAlert] = useState(false);
  const [isWorkspace, setIsWorkspace] = useState(false);
  const [closedWorkspaceTitle, setClosedWorkspaceTitle] = useState<string | null>(null);
  const [isAdditional, setIsAdditional] = useState(false);
  const [additionalMode, setAdditionalMode] = useState<'default' | 'draft-email'>('default');
  const [workspaceMode, setWorkspaceMode] = useState<'default' | 'patient-summary'>('default');

  const overlayRef = useRef<HTMLDivElement>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isWorkspace) chatScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [isWorkspace]);

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

    const isFileReview = text.toLowerCase().includes("file review");
    const isFileReviewYes = text === "__file_review_yes__";
    const isDraftEmailYes = text === "__draft_email_yes__";
    const isNextAppointment = text.toLowerCase().includes("next appointment");
    const appt = isNextAppointment ? pickRandomAppointment() : undefined;
    const resolvedExplicitLayout = layout ?? detectLayout(text) ?? "inline";

    const showCards = resolvedExplicitLayout === "inline" && !isFileReview && !isFileReviewYes && !isDraftEmailYes && !isNextAppointment;
    const cards = showCards
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
          suggestions: isNextAppointment && appt ? appt.suggestions : undefined,
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
        suggestions: isNextAppointment && appt ? appt.suggestions : undefined,
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
    <div className="w-full max-w-[720px] rounded-[26px] border border-border bg-surface-raised shadow-[0_2px_4px_-2px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.10)]">
      {inputInner}
    </div>
  );

  const isHome = appState === "home";
  const isChat = appState === "chat" || appState === "animating";

  return (
    <div className="h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      <NavRail onNewChat={resetToHome} onInfo={() => setShowAlert(true)} />

      {/* Alert banner */}
      {showAlert && (
        <div
          className="fixed z-50 px-4"
          style={{ left: "var(--nav-rail-width)", right: 0, top: "40px" }}
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
          className="flex flex-col flex-1 items-center justify-end pb-[calc(50vh-12px)]"
          style={{ marginLeft: "var(--nav-rail-width)", height: "100%" }}
        >
          <div className="flex flex-col items-center w-full max-w-[720px] px-0">
            <h1
              className="font-sans text-[30px] font-semibold text-foreground mb-6 tracking-tight"
              style={{ fontVariationSettings: "'wght' 600" }}
            >
              {getGreeting()}, Jonathan
            </h1>
            <div className="relative isolate w-full">
              <img src="/glow.svg" aria-hidden="true" className="absolute pointer-events-none select-none"
                style={{ width: "1097px", maxWidth: "none", height: "400px", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: -1 }} />
              <div className="w-full rounded-[26px] border border-border bg-surface-raised shadow-[0_2px_4px_-2px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.10)]">
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
              className="font-sans text-[30px] font-semibold text-foreground mb-6 tracking-tight"
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
        <div
          className="fixed flex overflow-hidden"
          style={{
            left: "var(--nav-rail-width)", right: 0, top: 0, bottom: 0,
            opacity: chatContentOpacity,
            transition: `opacity ${CHAT_FADE_MS}ms ease`,
          }}
        >
          {/* ── Workspace panel (left, 2/3) ── */}
          <div
            className="h-full overflow-hidden"
            style={{
              flex: isWorkspace ? "2 1 0" : "0 0 0",
              minWidth: 0,
              transition: "flex 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {isWorkspace && workspaceMode === 'patient-summary' && (
              <PatientSummaryPanel
                onClose={() => { setIsWorkspace(false); setWorkspaceMode('default'); }}
              />
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
          </div>

          {/* ── Chat panel — full, or 1/3 (workspace), or 2/3 (additional) ── */}
          <div
            className="relative flex flex-col h-full overflow-hidden"
            style={{
              flex: isWorkspace ? "1 0 0" : isAdditional ? "2 1 0" : "1 1 0",
              minWidth: 0,
              transition: "flex 500ms cubic-bezier(0.16, 1, 0.3, 1)",
              borderLeft: "none",
            }}
          >
            {/* Header */}
            <SheetHeader className="flex-shrink-0 px-5 pt-5 pb-4 flex-row items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="font-heading text-base font-medium text-foreground truncate">{sentenceCase(chatTitle)}</p>
                <p className="text-sm text-muted-foreground truncate max-w-[240px]">
                  {messages[0]?.content
                    ? sentenceCase(
                        messages[0].content.length > 72
                          ? messages[0].content.slice(0, 72).trimEnd() + "…"
                          : messages[0].content
                      )
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {isWorkspace && (
                  <Tooltip>
                    <TooltipTrigger
                      className="flex items-center justify-center size-8 rounded-full text-sidebar-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Collapse Chat"
                    >
                      <CaretDown size={16} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Collapse Chat</TooltipContent>
                  </Tooltip>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-sidebar-foreground hover:text-foreground"
                  aria-label="Actions"
                >
                  <DotsThreeVertical size={20} />
                </Button>
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
                        {["__file_review_yes__", "__draft_email_yes__", "__email_sent__", "__task_yes__"].includes(msg.content) ? "Yes" : msg.content}
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
                            <Button variant="outline" size="sm" className="rounded-[10px] h-8 px-4 text-[13px] gap-1.5" onClick={() => { setAdditionalMode('draft-email'); setIsAdditional(true); setIsWorkspace(false); }}>
                              Review <ArrowRight size={13} />
                            </Button>
                          </ItemActions>
                        </Item>
                      )}
                      {msg.appointment && (
                        <PatientAppointmentItem
                          appointment={msg.appointment}
                          onView={() => { setWorkspaceMode('patient-summary'); setIsWorkspace(true); setIsAdditional(false); }}
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
                      {msg.suggestions && (
                        <div className="flex flex-col items-start gap-1">
                          {msg.suggestions.map((s) => (
                            <Button key={s} variant="ghost" size="sm"
                              className="h-auto py-1 px-2 text-[14px] text-muted-foreground hover:text-foreground gap-2 font-normal"
                              onClick={() => {
                                if (s.toLowerCase().includes('patient summary')) {
                                  setWorkspaceMode('patient-summary');
                                  setIsWorkspace(true);
                                  setIsAdditional(false);
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
                {isThinking && <ThinkingText />}
              </div>
            </div>

            {/* Input */}
            <div
              className="flex-shrink-0 flex justify-center px-4 pt-4 mb-4"
              style={{ visibility: appState === "animating" ? "hidden" : "visible" }}
            >
              <div className="w-full max-w-[720px] rounded-[26px] border border-border bg-surface-raised shadow-[0_2px_4px_-2px_rgba(0,0,0,0.10),0_4px_6px_-2px_rgba(0,0,0,0.10)]">
                {inputInner}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="flex-shrink-0 text-center text-[11px] leading-none pb-6 text-muted-foreground/55">
              IQ can make mistakes. <span className="underline underline-offset-2">Read our AI usage policy.</span>
            </p>
          </div>

          {/* ── Additional panel (right, 1/3) ── */}
          <div
            className="h-full overflow-hidden"
            style={{
              flex: isAdditional ? "1 0 0" : "0 0 0",
              minWidth: 0,
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
            className="w-full max-w-[720px] rounded-[26px] border border-border bg-surface-raised"
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

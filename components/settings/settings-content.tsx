"use client";

const fill = "bg-muted rounded";

// ── Shared skeleton primitives ────────────────────────────────────────────────

function SkeletonTitle({ wide }: { wide?: boolean }) {
  return <div className={`h-3.5 ${wide ? "w-36" : "w-24"} ${fill}`} />;
}

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 flex flex-col gap-4">
      <SkeletonTitle />
      <div className="h-px bg-border" />
      {children}
    </div>
  );
}

function SkeletonRow({ wide }: { wide?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <div className="flex flex-col gap-1.5">
        <div className={`h-3 ${wide ? "w-40" : "w-32"} ${fill}`} />
        <div className={`h-2.5 ${wide ? "w-64" : "w-48"} ${fill} opacity-60`} />
      </div>
      <div className={`h-5 w-10 rounded-full ${fill} shrink-0`} />
    </div>
  );
}

function SkeletonSelectRow({ wide }: { wide?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <div className="flex flex-col gap-1.5">
        <div className={`h-3 ${wide ? "w-40" : "w-28"} ${fill}`} />
        <div className={`h-2.5 w-44 ${fill} opacity-60`} />
      </div>
      <div className={`h-8 w-32 rounded-md border border-border ${fill} shrink-0`} />
    </div>
  );
}

function SkeletonInputRow() {
  return (
    <div className="flex flex-col gap-1.5 py-0.5">
      <div className={`h-3 w-24 ${fill}`} />
      <div className={`h-8 w-full rounded-md border border-border ${fill}`} />
    </div>
  );
}

function SkeletonAvatarRow() {
  return (
    <div className="flex items-center gap-4 py-0.5">
      <div className={`size-14 rounded-full ${fill} shrink-0`} />
      <div className="flex flex-col gap-2">
        <div className={`h-3 w-28 ${fill}`} />
        <div className={`h-2.5 w-44 ${fill} opacity-60`} />
        <div className={`h-7 w-24 rounded-md border border-border ${fill}`} />
      </div>
    </div>
  );
}

function SkeletonListRow({ n = 4 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-0.5">
          <div className={`size-9 rounded-lg ${fill} shrink-0`} />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className={`h-3 ${i % 2 === 0 ? "w-32" : "w-44"} ${fill}`} />
            <div className={`h-2.5 ${i % 3 === 0 ? "w-56" : "w-40"} ${fill} opacity-60`} />
          </div>
          <div className={`h-5 w-10 rounded-full ${fill} shrink-0`} />
        </div>
      ))}
    </>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

// ── Section views ─────────────────────────────────────────────────────────────

function AccountSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        <SkeletonAvatarRow />
        <Divider />
        <SkeletonInputRow />
        <SkeletonInputRow />
        <SkeletonInputRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow />
        <Divider />
        <SkeletonSelectRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonInputRow />
        <SkeletonInputRow />
      </SkeletonCard>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <div className={`h-16 w-full rounded-lg border-2 border-border ${fill}`} />
              <div className={`h-2.5 w-12 mx-auto ${fill} opacity-60`} />
            </div>
          ))}
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`size-8 rounded-full ${fill} border border-border`} />
          ))}
        </div>
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow />
        <Divider />
        <SkeletonSelectRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
        <SkeletonRow />
        <SkeletonRow />
      </SkeletonCard>
    </div>
  );
}

function PersonalisationSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        <SkeletonSelectRow />
        <Divider />
        <SkeletonSelectRow wide />
        <Divider />
        <SkeletonSelectRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
        <SkeletonRow />
        <SkeletonRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonInputRow />
        <SkeletonInputRow />
        <SkeletonInputRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
    </div>
  );
}

function AboutSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between py-0.5">
            <div className={`h-3 ${i % 2 === 0 ? "w-28" : "w-36"} ${fill}`} />
            <div className={`h-3 ${i % 2 === 0 ? "w-20" : "w-24"} ${fill} opacity-70`} />
          </div>
        ))}
      </SkeletonCard>
      <SkeletonCard>
        <div className="flex flex-col gap-3">
          <div className={`h-3 w-64 ${fill}`} />
          <div className={`h-3 w-48 ${fill} opacity-60`} />
          <div className={`h-3 w-56 ${fill} opacity-60`} />
        </div>
        <div className={`h-7 w-28 rounded-md border border-border ${fill}`} />
      </SkeletonCard>
      <SkeletonCard>
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center justify-between py-0.5">
            <div className={`h-3 ${i === 2 ? "w-44" : "w-36"} ${fill}`} />
            <div className={`h-4 w-4 rounded ${fill} opacity-50`} />
          </div>
        ))}
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <div className="flex flex-col gap-3">
          <div className={`h-3 w-56 ${fill}`} />
          <div className={`h-3 w-72 ${fill} opacity-60`} />
        </div>
      </SkeletonCard>
    </div>
  );
}

function ChatSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
        <SkeletonRow />
        <SkeletonRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow wide />
        <Divider />
        <SkeletonSelectRow />
        <Divider />
        <div className={`h-7 w-36 rounded-md border border-border ${fill}`} />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow />
        <Divider />
        <SkeletonSelectRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
        <SkeletonRow />
      </SkeletonCard>
    </div>
  );
}

function SkillsSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        <SkeletonListRow n={5} />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <div className={`h-3 w-64 ${fill} opacity-70`} />
        <div className={`h-8 w-32 rounded-md border border-border ${fill}`} />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonListRow n={4} />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow wide />
        <Divider />
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
      </SkeletonCard>
    </div>
  );
}

function MemoriesSettings() {
  return (
    <div className="flex flex-col gap-4">
      <SkeletonCard>
        <SkeletonRow />
        <SkeletonRow wide />
      </SkeletonCard>
      <SkeletonCard>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-0.5">
            <div className={`size-7 rounded-md ${fill} shrink-0 mt-0.5`} />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className={`h-3 ${i % 2 === 0 ? "w-48" : "w-64"} ${fill}`} />
              <div className={`h-2.5 ${i % 3 === 0 ? "w-56" : "w-40"} ${fill} opacity-60`} />
            </div>
            <div className={`h-6 w-6 rounded-md ${fill} shrink-0 opacity-50`} />
          </div>
        ))}
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow />
        <Divider />
        <SkeletonRow wide />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonRow wide />
        <Divider />
        <div className={`h-7 w-36 rounded-md border border-destructive/40 ${fill}`} />
      </SkeletonCard>
      <SkeletonCard>
        <SkeletonSelectRow />
        <Divider />
        <SkeletonRow />
      </SkeletonCard>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────

const VIEWS: Record<string, React.ComponentType> = {
  account:         AccountSettings,
  appearance:      AppearanceSettings,
  personalisation: PersonalisationSettings,
  about:           AboutSettings,
  chat:            ChatSettings,
  skills:          SkillsSettings,
  memories:        MemoriesSettings,
};

export function SettingsContent({ activeView }: { activeView: string }) {
  const View = VIEWS[activeView] ?? AccountSettings;
  return <View />;
}

export type Priority = "high" | "medium" | "low";

export const ASSIGNEE_NAMES: Record<string, string> = {
  LH: "Liam Haire",
  JS: "Jane Smith",
};

export interface Task {
  id: string;
  title: string;
  notes?: string;
  tags?: string[];
  ref: string;
  priority: Priority;
  assignee?: string;
}

export interface Lane {
  id: string;
  label: string;
  tasks: Task[];
}

export const TASK_DATA: Lane[] = [
  {
    id: "due",
    label: "Due today",
    tasks: [
      {
        id: "t1",
        title: "Review outstanding file compliance checks",
        notes: "Several files flagged in the Q4 audit have not yet been reviewed. Prioritise matters opened before September and cross-reference against the compliance tracker.",
        tags: ["Compliance", "Q4"],
        ref: "WRK-1132",
        priority: "high",
        assignee: "JS",
      },
      {
        id: "t2",
        title: "Update client contact details for Whitmore matter",
        notes: "New correspondence address confirmed by phone. Update in the case management system and notify the fee earner.",
        ref: "WRK-1190",
        priority: "high",
        assignee: "JS",
      },
    ],
  },
  {
    id: "inprogress",
    label: "In progress",
    tasks: [
      {
        id: "t3",
        title: "Medication review — Margaret Ellison",
        notes: "Annual review overdue by 12 days. Patient has a follow-up appointment scheduled for next week.",
        tags: ["Clinical"],
        ref: "WRK-809",
        priority: "medium",
        assignee: "LH",
      },
      {
        id: "t4",
        title: "Draft settlement agreement for Hendricks case",
        notes: "Opposing counsel has indicated willingness to settle. Draft to be reviewed by Arthur Pendleton before circulation.",
        tags: ["Litigation"],
        ref: "WRK-814",
        priority: "high",
        assignee: "JS",
      },
    ],
  },
  {
    id: "blocked",
    label: "Blocked",
    tasks: [],
  },
];

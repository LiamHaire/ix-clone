"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconPriorityHigh } from "@/components/ui/iqons/IconPriorityHigh";
import { IconPriorityMedium } from "@/components/ui/iqons/IconPriorityMedium";
import { IconPriorityLow } from "@/components/ui/iqons/IconPriorityLow";
import { TASK_DATA, type Task } from "./task-data";

function PriorityIcon({ priority }: { priority: Task["priority"] }) {
  if (priority === "high")   return <IconPriorityHigh   size={20} variant="duotone" className="text-destructive" />;
  if (priority === "medium") return <IconPriorityMedium size={20} variant="duotone" className="text-warning" />;
  return                            <IconPriorityLow    size={20} variant="duotone" className="text-muted-foreground" />;
}

const LANE_LABEL: Record<string, string> = {
  due:        "Due",
  inprogress: "In progress",
  blocked:    "Blocked",
};

interface TaskTableProps {
  search: string;
  filter: string;
}

export function TaskTable({ search, filter }: TaskTableProps) {
  const allTasks = TASK_DATA.flatMap(lane =>
    lane.tasks.map(t => ({ ...t, lane: lane.id }))
  );

  const filtered = allTasks.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.lane === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="overflow-auto h-full px-4 py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="w-24">Ref</TableHead>
            <TableHead className="w-24">Tags</TableHead>
            <TableHead className="w-16">Assignee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No tasks found</TableCell>
            </TableRow>
          )}
          {filtered.map(task => (
            <TableRow key={task.id} className="cursor-pointer">
              <TableCell><PriorityIcon priority={task.priority} /></TableCell>
              <TableCell>
                <p className="text-[14px] font-medium text-foreground leading-snug">{task.title}</p>
                {task.notes && <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-1">{task.notes}</p>}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border border-border text-foreground">
                  {LANE_LABEL[task.lane] ?? task.lane}
                </span>
              </TableCell>
              <TableCell className="font-mono text-[12px] text-muted-foreground">{task.ref}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {task.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border border-border text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <span className="flex items-center justify-center size-6 rounded-full bg-foreground text-background text-[10px] font-semibold">
                    {task.assignee}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[12px]">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

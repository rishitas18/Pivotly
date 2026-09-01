import { useMemo } from "react";
import ReactFlow, {
  Background,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import type { ProcessStage } from "../types";

function bottleneckTone(value: number) {
  if (value >= 70) return { border: "#8b2a3b", bg: "#f7e9ec", text: "#8b2a3b" };
  if (value >= 45) return { border: "#bd5b21", bg: "#fbeee3", text: "#bd5b21" };
  return { border: "#1f4d3a", bg: "#e7f1eb", text: "#1f4d3a" };
}

function StageNode({ data }: NodeProps<{ stage: ProcessStage; selected: boolean; onSelect: () => void }>) {
  const { stage, selected, onSelect } = data;
  const tone = bottleneckTone(stage.bottleneck_potential);
  return (
    <div
      onClick={onSelect}
      className="w-56 cursor-pointer rounded-xl border-2 bg-[var(--color-surface)] p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: selected ? "#14120f" : tone.border }}
    >
      <Handle type="target" position={Position.Left} style={{ background: "#8c8471" }} />
      <p className="text-sm font-semibold text-[var(--color-ink)]">{stage.name}</p>
      <p className="mt-1 line-clamp-2 text-xs text-[var(--color-muted)]">{stage.description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: tone.bg, color: tone.text }}
        >
          Bottleneck {stage.bottleneck_potential}
        </span>
        <span className="text-[10px] text-[var(--color-muted)]">{stage.manual_effort} effort</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#8c8471" }} />
    </div>
  );
}

const nodeTypes = { stage: StageNode };

export function ProcessFlowDiagram({
  stages,
  selectedStageId,
  onSelectStage,
}: {
  stages: ProcessStage[];
  selectedStageId: string | null;
  onSelectStage: (id: string) => void;
}) {
  const nodes: Node[] = useMemo(
    () =>
      stages.map((stage, i) => ({
        id: stage.id,
        type: "stage",
        position: { x: i * 280, y: i % 2 === 0 ? 0 : 60 },
        data: { stage, selected: stage.id === selectedStageId, onSelect: () => onSelectStage(stage.id) },
        draggable: false,
      })),
    [stages, selectedStageId, onSelectStage],
  );

  const edges: Edge[] = useMemo(
    () =>
      stages.slice(1).map((stage, i) => ({
        id: `${stages[i].id}-${stage.id}`,
        source: stages[i].id,
        target: stage.id,
        type: "smoothstep",
        style: { stroke: "#d6c9ac", strokeWidth: 2 },
      })),
    [stages],
  );

  return (
    <div style={{ height: 320 }} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll={false}
      >
        <Background color="#e7dfcb" gap={20} />
      </ReactFlow>
    </div>
  );
}

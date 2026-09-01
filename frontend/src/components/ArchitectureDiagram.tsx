import { useMemo } from "react";
import ReactFlow, { Background, Handle, Position, type Edge, type Node, type NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import type { ArchitectureLayer } from "../types";
import { ACCENT_PALETTE } from "./primitives";

function LayerNode({ data }: NodeProps<{ layer: ArchitectureLayer; index: number }>) {
  const { layer, index } = data;
  const color = ACCENT_PALETTE[index % ACCENT_PALETTE.length];
  return (
    <div className="w-[560px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <Handle type="target" position={Position.Top} style={{ background: "#8c8471" }} />
      <div className="h-1.5" style={{ backgroundColor: color.bg }} />
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: color.bg }}>
          Layer {index + 1}
        </p>
        <p className="text-sm font-bold text-[var(--color-ink)]">{layer.name}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {layer.components.map((c) => (
            <span
              key={c}
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: color.soft, color: color.bg }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#8c8471" }} />
    </div>
  );
}

const nodeTypes = { layer: LayerNode };

export function ArchitectureDiagram({ layers }: { layers: ArchitectureLayer[] }) {
  const nodes: Node[] = useMemo(
    () =>
      layers.map((layer, i) => ({
        id: layer.id,
        type: "layer",
        position: { x: 0, y: i * 150 },
        data: { layer, index: i },
        draggable: false,
      })),
    [layers],
  );

  const edges: Edge[] = useMemo(
    () =>
      layers.slice(1).map((layer, i) => ({
        id: `${layers[i].id}-${layer.id}`,
        source: layers[i].id,
        target: layer.id,
        style: { stroke: "#d6c9ac", strokeWidth: 2 },
      })),
    [layers],
  );

  return (
    <div style={{ height: 620 }} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
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

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { dictionaries } from "../i18n/dictionaries";
import { workflowNodePaths } from "../lib/chat-engine";
import type { Locale, ScenarioId } from "../lib/types";

type NodeId = (typeof workflowNodePaths)[ScenarioId][number];

const CANVAS_WIDTH = 1530;
const CANVAS_HEIGHT = 690;
const NODE_WIDTH = 206;
const NODE_HEIGHT = 112;

const nodeIds: NodeId[] = [
  "trigger",
  "normalize",
  "agent",
  "router",
  "business",
  "invoice",
  "handoff",
  "response"
];

const positions: Record<NodeId, { x: number; y: number }> = {
  trigger: { x: 38, y: 142 },
  normalize: { x: 284, y: 142 },
  agent: { x: 530, y: 142 },
  router: { x: 776, y: 142 },
  business: { x: 776, y: 366 },
  invoice: { x: 1022, y: 366 },
  handoff: { x: 1268, y: 366 },
  response: { x: 1268, y: 574 }
};

const edges: { from: NodeId; to: NodeId; d: string }[] = [
  { from: "trigger", to: "normalize", d: "M244 198 H284" },
  { from: "normalize", to: "agent", d: "M490 198 H530" },
  { from: "agent", to: "router", d: "M736 198 H776" },
  {
    from: "router",
    to: "business",
    d: "M982 198 C1015 245 730 330 776 422"
  },
  {
    from: "router",
    to: "invoice",
    d: "M982 198 C1040 235 990 340 1022 422"
  },
  {
    from: "router",
    to: "handoff",
    d: "M982 198 C1130 230 1200 325 1268 422"
  },
  {
    from: "router",
    to: "response",
    d: "M982 198 C1120 160 1371 350 1371 574"
  },
  {
    from: "business",
    to: "response",
    d: "M982 422 C1090 422 1150 630 1268 630"
  },
  {
    from: "invoice",
    to: "response",
    d: "M1228 422 C1255 460 1228 580 1268 630"
  },
  {
    from: "handoff",
    to: "response",
    d: "M1474 422 C1510 520 1475 630 1474 630"
  },
];

const nodeStyles: Record<NodeId, { icon: string; tone: string }> = {
  trigger: { icon: "↙", tone: "mint" },
  normalize: { icon: "≋", tone: "blue" },
  agent: { icon: "✳", tone: "violet" },
  router: { icon: "⑂", tone: "amber" },
  business: { icon: "▤", tone: "blue" },
  invoice: { icon: "▧", tone: "green" },
  response: { icon: "↗", tone: "mint" },
  handoff: { icon: "◎", tone: "coral" }
};

export default function WorkflowDiagram({
  locale,
  scenario,
  active
}: {
  locale: Locale;
  scenario: ScenarioId;
  active: boolean;
}) {
  const copy = dictionaries[locale];
  const workflow = copy.automation;
  const [selectedNode, setSelectedNode] = useState<NodeId>("agent");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [fitScale, setFitScale] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const activeNodes = new Set(active ? workflowNodePaths[scenario] : []);
  const currentNode = selectedNode;

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const scale = Math.max(
        0.62,
        Math.min(1, (entry.contentRect.width - 32) / CANVAS_WIDTH)
      );
      setFitScale(scale);
      setZoom(1);
      setOffset({
        x: Math.max(12, (entry.contentRect.width - CANVAS_WIDTH * scale) / 2),
        y: Math.max(12, (entry.contentRect.height - CANVAS_HEIGHT * scale) / 2)
      });
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  function startPan(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX - offset.x,
      y: event.clientY - offset.y
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePan(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    setOffset({
      x: event.clientX - drag.current.x,
      y: event.clientY - drag.current.y
    });
  }

  function stopPan() {
    drag.current = null;
  }

  function resetView() {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div className="space-y-6">
      <section
        className="overflow-hidden rounded-[18px] border border-[#d6d8da] bg-[#eceeef]"
        aria-labelledby="workflow-diagram-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4d7d9] bg-[#f7f8f8] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ea4b71] text-sm font-bold text-white" aria-hidden="true">
              n
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#74797d]">
                {workflow.diagramTitle}
              </p>
              <h2 id="workflow-diagram-title" className="text-sm font-bold text-[#292d31]">
                {copy.chat.menuOptions[scenario]}
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(1.7, value + 0.1))}
              aria-label={workflow.zoomIn}
              className="workflow-control"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(0.55, value - 0.1))}
              aria-label={workflow.zoomOut}
              className="workflow-control"
            >
              −
            </button>
            <button
              type="button"
              onClick={resetView}
              aria-label={workflow.resetZoom}
              className="rounded-md border border-[#d4d7d9] bg-white px-2.5 py-2 text-[11px] font-semibold text-[#555b5f] hover:bg-[#f2f3f4]"
            >
              {workflow.resetZoom}
            </button>
          </div>
        </div>

        <div
          ref={viewport}
          className="workflow-viewport relative overflow-hidden"
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={stopPan}
          onPointerCancel={stopPan}
          onLostPointerCapture={stopPan}
          aria-label={workflow.diagramTitle}
        >
          <div
            className="workflow-canvas"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${fitScale * zoom})`
            }}
          >
            <svg
              className="workflow-edges"
              viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="workflow-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L6,3 z" fill="#777d82" />
                </marker>
                <marker
                  id="workflow-arrow-active"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L6,3 z" fill="#169b67" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const isActive =
                  activeNodes.has(edge.from) && activeNodes.has(edge.to);
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={edge.d}
                    className={isActive ? "workflow-edge-active" : "workflow-edge"}
                    markerEnd={
                      isActive
                        ? "url(#workflow-arrow-active)"
                        : "url(#workflow-arrow)"
                    }
                  />
                );
              })}
            </svg>
            {nodeIds.map((id) => {
              const style = nodeStyles[id];
              const isActive = activeNodes.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedNode(id)}
                  aria-pressed={currentNode === id}
                  aria-label={`${workflow.nodeLabels[id]}: ${workflow.nodeOperations[id]}`}
                  className={`workflow-node workflow-node-${style.tone} ${
                    isActive ? "workflow-node-active" : ""
                  } ${currentNode === id ? "workflow-node-selected" : ""}`}
                  style={{
                    left: positions[id].x,
                    top: positions[id].y,
                    width: NODE_WIDTH,
                    minHeight: NODE_HEIGHT
                  }}
                >
                  <span className="workflow-node-handle workflow-node-input" aria-hidden="true" />
                  <span className="workflow-node-handle workflow-node-output" aria-hidden="true" />
                  <span className="workflow-node-icon" aria-hidden="true">
                    {style.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-1">
                      <span className="block text-[13px] font-bold leading-4 text-[#252a2e]">
                        {workflow.nodeLabels[id]}
                      </span>
                      {isActive && (
                        <span className="workflow-node-pulse" aria-label={workflow.activeNode} />
                      )}
                    </span>
                    <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.09em] text-[#73797e]">
                      {workflow.nodeKinds[id]}
                    </span>
                    <span className="mt-1 block text-[10px] leading-[1.4] text-[#555b60]">
                      {workflow.nodeOperations[id]}
                    </span>
                  </span>
                  <span className="workflow-node-footer">
                    {workflow.nodeDescriptions[id]}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-[#c7cacc] bg-[#f6f7f7]/95 px-2 py-1 text-[10px] text-[#555b60]">
            {workflow.dragToPan}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#d4d7d9] bg-[#f7f8f8] px-4 py-2.5 text-[10px] text-[#60666a]">
          <span className="inline-flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-[#169b67]" />
            {workflow.activeNode}
          </span>
          <span>{workflow.nodeLabels[currentNode]}</span>
        </div>
        <p className="bg-white px-4 py-3 text-xs leading-5 text-[#666d71] sm:px-5">
          {workflow.liveNote}
        </p>
      </section>
    </div>
  );
}

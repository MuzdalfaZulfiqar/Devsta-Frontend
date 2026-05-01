import React, { useEffect, useMemo, useRef, useState } from "react";
import { Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { EmptyState } from "./SkillPageLayout";
import { clampNumber } from "./skillPageUtils";

const TREE_NODE_BASE_WIDTH = 270;
const TREE_NODE_MAX_WIDTH = 360;
const TREE_TARGET_BASE_WIDTH = 320;
const TREE_HORIZONTAL_PADDING = 32;
const TREE_CARD_VERTICAL_GAP = 38;
const TREE_LEVEL_GAP = 112;

function getTextLineCount(text, width) {
  const safeText = String(text || "").trim();
  if (!safeText) return 1;

  const usableWidth = Math.max(140, width - TREE_HORIZONTAL_PADDING);
  const estimatedCharsPerLine = Math.max(18, Math.floor(usableWidth / 7.2));

  return Math.max(1, Math.ceil(safeText.length / estimatedCharsPerLine));
}

function getJourneyNodeSize(node) {
  const label = String(node?.label || "").trim();
  const isTarget = node?.type === "target";
  const isMilestone = node?.type === "milestone";

  const baseWidth = isTarget
    ? TREE_TARGET_BASE_WIDTH
    : isMilestone
    ? TREE_NODE_BASE_WIDTH + 24
    : TREE_NODE_BASE_WIDTH;

  const extraWidth = label.length > 34 ? 34 : label.length > 24 ? 18 : 0;
  const width = clampNumber(baseWidth + extraWidth, baseWidth, TREE_NODE_MAX_WIDTH);

  const labelLines = getTextLineCount(label, width);
  const hasMeta = Boolean(node?.importance || node?.type);
  const metaHeight = hasMeta ? 18 : 0;
  const minHeight = isTarget ? 104 : isMilestone ? 98 : 92;
  const calculatedHeight = 58 + labelLines * 19 + metaHeight;

  return {
    width,
    height: Math.max(minHeight, calculatedHeight),
  };
}

function getJourneyNodeTheme(node) {
  if (node.type === "target") {
    return {
      card: "border-indigo-200 bg-indigo-50",
      dot: "bg-indigo-500",
      label: "Target",
      labelClass: "bg-indigo-100 text-indigo-700",
      stroke: "#6366f1",
    };
  }

  if (node.type === "milestone") {
    return {
      card: "border-blue-200 bg-blue-50",
      dot: "bg-blue-500",
      label: "Milestone",
      labelClass: "bg-blue-100 text-blue-700",
      stroke: "#2563eb",
    };
  }

  if (node.status === "owned") {
    return {
      card: "border-emerald-200 bg-emerald-50",
      dot: "bg-emerald-500",
      label: "Owned",
      labelClass: "bg-emerald-100 text-emerald-700",
      stroke: "#10b981",
    };
  }

  if (node.status === "learning") {
    return {
      card: "border-amber-200 bg-amber-50",
      dot: "bg-amber-500",
      label: "Learning",
      labelClass: "bg-amber-100 text-amber-700",
      stroke: "#f59e0b",
    };
  }

  return {
    card: "border-rose-200 bg-rose-50",
    dot: "bg-rose-500",
    label: "Gap",
    labelClass: "bg-rose-100 text-rose-700",
    stroke: "#f43f5e",
  };
}

function createPositionedNode(node, layoutX, layoutY, depth) {
  const size = getJourneyNodeSize(node);

  return {
    ...node,
    layoutX,
    layoutY,
    layoutWidth: size.width,
    layoutHeight: size.height,
    depth,
  };
}

function buildJourneyTreeLayout(graph) {
  const rawNodes = graph?.nodes || [];
  const rawEdges = graph?.edges || [];

  if (!rawNodes.length) return null;

  const targetNode = rawNodes.find((node) => node.type === "target") || rawNodes[0];
  const milestoneNodes = rawNodes.filter((node) => node.type === "milestone");
  const skillNodes = rawNodes.filter((node) => node.type === "skill");
  const otherNodes = rawNodes.filter(
    (node) => !["target", "milestone", "skill"].includes(node.type)
  );

  const nodeSizeMap = new Map(rawNodes.map((node) => [node.nodeId, getJourneyNodeSize(node)]));

  const widestNode = Math.max(
    TREE_NODE_BASE_WIDTH,
    ...Array.from(nodeSizeMap.values()).map((size) => size.width)
  );

  const positionedMap = new Map();
  const rawNodeMap = new Map(rawNodes.map((node) => [node.nodeId, node]));

  const columnGap = Math.max(widestNode + 92, 340);
  const canvasWidth = Math.max(1100, Math.max(milestoneNodes.length, 1) * columnGap + 180);

  const targetSize = nodeSizeMap.get(targetNode.nodeId) || getJourneyNodeSize(targetNode);
  const targetTop = 58;
  const targetCenterY = targetTop + targetSize.height / 2;

  positionedMap.set(targetNode.nodeId, createPositionedNode(targetNode, canvasWidth / 2, targetCenterY, 0));

  const generatedEdges = [];

  function addEdge(from, to, relation = "related", weight = 1) {
    if (!from || !to || from === to) return;
    if (!positionedMap.has(from) || !positionedMap.has(to)) return;

    const edgeKey = `${from}-${to}`;
    if (generatedEdges.some((edge) => edge.key === edgeKey)) return;

    generatedEdges.push({ key: edgeKey, from, to, relation, weight });
  }

  if (milestoneNodes.length) {
    const milestoneTop = targetTop + targetSize.height + TREE_LEVEL_GAP;

    milestoneNodes.forEach((node, index) => {
      const nodeSize = nodeSizeMap.get(node.nodeId) || getJourneyNodeSize(node);
      const layoutX = canvasWidth / 2 - ((milestoneNodes.length - 1) * columnGap) / 2 + index * columnGap;
      const layoutY = milestoneTop + nodeSize.height / 2;

      positionedMap.set(node.nodeId, createPositionedNode(node, layoutX, layoutY, 1));
    });

    const milestoneIds = new Set(milestoneNodes.map((node) => node.nodeId));
    const parentByChild = new Map();

    rawEdges.forEach((edge) => {
      if (milestoneIds.has(edge.from)) parentByChild.set(edge.to, edge.from);
      if (milestoneIds.has(edge.to)) parentByChild.set(edge.from, edge.to);
    });

    const childBuckets = new Map(milestoneNodes.map((node) => [node.nodeId, []]));

    [...skillNodes, ...otherNodes].forEach((node, index) => {
      const parentId = parentByChild.get(node.nodeId) || milestoneNodes[index % milestoneNodes.length]?.nodeId;
      if (!parentId) return;
      childBuckets.get(parentId)?.push(node);
    });

    const tallestMilestone = Math.max(
      ...milestoneNodes.map((node) => nodeSizeMap.get(node.nodeId)?.height || getJourneyNodeSize(node).height)
    );

    const childrenTop = milestoneTop + tallestMilestone + TREE_LEVEL_GAP;
    let maxY = childrenTop;

    milestoneNodes.forEach((milestone) => {
      const milestonePosition = positionedMap.get(milestone.nodeId);
      const children = childBuckets.get(milestone.nodeId) || [];
      let cursorY = childrenTop;

      children.forEach((child) => {
        const childSize = nodeSizeMap.get(child.nodeId) || getJourneyNodeSize(child);
        const layoutY = cursorY + childSize.height / 2;

        positionedMap.set(child.nodeId, createPositionedNode(child, milestonePosition.layoutX, layoutY, 2));

        cursorY += childSize.height + TREE_CARD_VERTICAL_GAP;
        maxY = Math.max(maxY, cursorY + 60);
      });
    });

    rawEdges.forEach((edge) => {
      const fromNode = rawNodeMap.get(edge.from);
      const toNode = rawNodeMap.get(edge.to);
      if (!fromNode || !toNode) return;
      if (!positionedMap.has(edge.from) || !positionedMap.has(edge.to)) return;

      const fromDepth = positionedMap.get(edge.from)?.depth || 0;
      const toDepth = positionedMap.get(edge.to)?.depth || 0;
      const normalizedFrom = fromDepth <= toDepth ? edge.from : edge.to;
      const normalizedTo = fromDepth <= toDepth ? edge.to : edge.from;

      addEdge(normalizedFrom, normalizedTo, edge.relation, edge.weight);
    });

    milestoneNodes.forEach((milestone) => {
      const hasRootEdge = generatedEdges.some((edge) => edge.from === targetNode.nodeId && edge.to === milestone.nodeId);
      if (!hasRootEdge) addEdge(targetNode.nodeId, milestone.nodeId, "contains", 1);

      const children = childBuckets.get(milestone.nodeId) || [];
      children.forEach((child) => {
        const hasChildEdge = generatedEdges.some((edge) => edge.from === milestone.nodeId && edge.to === child.nodeId);
        if (!hasChildEdge) addEdge(milestone.nodeId, child.nodeId, "requires", 1);
      });
    });

    return {
      nodes: Array.from(positionedMap.values()),
      edges: generatedEdges,
      nodeMap: positionedMap,
      width: canvasWidth,
      height: Math.max(680, maxY),
    };
  }

  const remainingNodes = rawNodes.filter((node) => node.nodeId !== targetNode.nodeId);
  const columns = Math.min(3, Math.max(1, remainingNodes.length));
  const cardGapX = Math.max(widestNode + 90, 340);
  const gridWidth = columns * cardGapX;
  const startX = canvasWidth / 2 - gridWidth / 2 + cardGapX / 2;
  const gridTop = targetTop + targetSize.height + TREE_LEVEL_GAP;
  const rowHeights = [];

  remainingNodes.forEach((node, index) => {
    const row = Math.floor(index / columns);
    const nodeSize = nodeSizeMap.get(node.nodeId) || getJourneyNodeSize(node);
    rowHeights[row] = Math.max(rowHeights[row] || 0, nodeSize.height);
  });

  remainingNodes.forEach((node, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const previousRowsHeight = rowHeights.slice(0, row).reduce((sum, height) => sum + height + TREE_CARD_VERTICAL_GAP, 0);
    const nodeSize = nodeSizeMap.get(node.nodeId) || getJourneyNodeSize(node);

    positionedMap.set(
      node.nodeId,
      createPositionedNode(node, startX + col * cardGapX, gridTop + previousRowsHeight + nodeSize.height / 2, 1)
    );
  });

  rawEdges.forEach((edge) => {
    if (positionedMap.has(edge.from) && positionedMap.has(edge.to)) addEdge(edge.from, edge.to, edge.relation, edge.weight);
  });

  remainingNodes.forEach((node) => {
    const alreadyConnected = generatedEdges.some((edge) => edge.from === targetNode.nodeId && edge.to === node.nodeId);
    if (!alreadyConnected) addEdge(targetNode.nodeId, node.nodeId, "contains", 1);
  });

  const gridHeight = rowHeights.reduce((sum, height) => sum + height + TREE_CARD_VERTICAL_GAP, 0);

  return {
    nodes: Array.from(positionedMap.values()),
    edges: generatedEdges,
    nodeMap: positionedMap,
    width: canvasWidth,
    height: Math.max(680, gridTop + gridHeight + 80),
  };
}

function JourneyNodeCard({ node, selectedNodeId, onSelectNode }) {
  const theme = getJourneyNodeTheme(node);
  const isSelected = selectedNodeId === node.nodeId;

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectNode(node);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelectNode(node);
      }}
      onKeyDown={handleKeyDown}
      className={`flex min-h-full w-full flex-col rounded-[22px] border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme.card} ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${theme.dot}`} />
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${theme.labelClass}`}>
            {theme.label}
          </span>
        </div>

        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {node.confidence || 0}%
        </span>
      </div>

      <p className="mt-2 whitespace-normal break-words text-sm font-semibold leading-snug text-slate-900">
        {node.label}
      </p>

      <p className="mt-2 whitespace-normal break-words text-[11px] capitalize leading-snug text-slate-500">
        {node.type === "target" ? "Growth target" : node.type}
        {node.importance ? ` • ${node.importance}/100 priority` : ""}
      </p>
    </div>
  );
}

export default function GraphCanvas({ graph, selectedNodeId, onSelectNode }) {
  const svgRef = useRef(null);
  const lastPanPointRef = useRef({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const graphData = useMemo(() => buildJourneyTreeLayout(graph), [graph]);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsPanning(false);
  }, [graph?._id, graph?.generatedAt, graph?.nodes?.length]);

  if (!graphData) {
    return (
      <EmptyState
        title="Journey map will appear here"
        subtitle="Select a generated roadmap to view its related journey map."
      />
    );
  }

  function updateZoom(nextZoom) {
    setZoom((previous) => {
      const value = typeof nextZoom === "function" ? nextZoom(previous) : nextZoom;
      return clampNumber(Number(value.toFixed(2)), 0.6, 1.8);
    });
  }

  function handleResetView() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsPanning(false);
  }

  function handleMouseDown(event) {
    if (event.button !== 0) return;

    setIsPanning(true);
    lastPanPointRef.current = { x: event.clientX, y: event.clientY };
  }

  function handleMouseMove(event) {
    if (!isPanning) return;

    const rect = svgRef.current?.getBoundingClientRect();
    const dx = event.clientX - lastPanPointRef.current.x;
    const dy = event.clientY - lastPanPointRef.current.y;

    const svgDx = rect ? (dx * graphData.width) / rect.width / zoom : dx / zoom;
    const svgDy = rect ? (dy * graphData.height) / rect.height / zoom : dy / zoom;

    setPan((previous) => ({ x: previous.x + svgDx, y: previous.y + svgDy }));

    lastPanPointRef.current = { x: event.clientX, y: event.clientY };
  }

  function handleMouseUp() {
    setIsPanning(false);
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Interactive journey tree</p>
          <p className="mt-1 text-xs text-slate-500">Drag the canvas to move. Use the buttons to zoom in, zoom out, or reset.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            <Move size={14} />
            {Math.round(zoom * 100)}%
          </div>

          <button type="button" onClick={() => updateZoom((value) => value - 0.15)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
            <ZoomOut size={14} />
            Zoom out
          </button>

          <button type="button" onClick={() => updateZoom((value) => value + 0.15)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
            <ZoomIn size={14} />
            Zoom in
          </button>

          <button type="button" onClick={handleResetView} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="overflow-auto bg-slate-100 p-3 sm:p-4">
        <div className="min-w-[760px] sm:min-w-[980px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${graphData.width} ${graphData.height}`}
            className="h-[680px] w-full rounded-[24px] bg-white shadow-inner"
            preserveAspectRatio="xMidYMid meet"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isPanning ? "grabbing" : "grab" }}
          >
            <defs>
              <pattern id="journey-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>

            <rect x="0" y="0" width={graphData.width} height={graphData.height} fill="url(#journey-grid)" rx="24" />

            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              {graphData.edges.map((edge) => {
                const from = graphData.nodeMap.get(edge.from);
                const to = graphData.nodeMap.get(edge.to);

                if (!from || !to) return null;

                const fromTheme = getJourneyNodeTheme(from);
                const startX = from.layoutX;
                const startY = from.layoutY + from.layoutHeight / 2;
                const endX = to.layoutX;
                const endY = to.layoutY - to.layoutHeight / 2;
                const middleY = startY + Math.max(60, (endY - startY) / 2);
                const path = `M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`;

                return (
                  <path
                    key={edge.key}
                    d={path}
                    fill="none"
                    stroke={fromTheme.stroke}
                    strokeWidth={edge.relation === "related" ? 1.6 : 2.2}
                    strokeLinecap="round"
                    strokeDasharray={edge.relation === "related" ? "7 7" : "0"}
                    opacity="0.55"
                  />
                );
              })}

              {graphData.nodes.map((node) => {
                const width = node.layoutWidth || TREE_NODE_BASE_WIDTH;
                const height = node.layoutHeight || getJourneyNodeSize(node).height;

                return (
                  <foreignObject
                    key={node.nodeId}
                    x={node.layoutX - width / 2}
                    y={node.layoutY - height / 2}
                    width={width}
                    height={height}
                    style={{ overflow: "visible" }}
                  >
                    <div xmlns="http://www.w3.org/1999/xhtml" className="h-full w-full">
                      <JourneyNodeCard node={node} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} />
                    </div>
                  </foreignObject>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

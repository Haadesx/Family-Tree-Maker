import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';
import { buildFamilyTree, layoutTree } from '../layout/treeBuilder';
import { TreeNode } from '../models/types';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 80;
const NODE_SPACING = 20;

const TreeCanvas: React.FC = () => {
  const { state, dispatch } = useStore();
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Build and layout tree when focus or depth changes
  useEffect(() => {
    if (state.focusPersonId) {
      const builtTree = buildFamilyTree(
        state.focusPersonId,
        state.data,
        state.ancestorDepth,
        state.descendantDepth
      );
      
      if (builtTree) {
        const laidOut = layoutTree(builtTree, NODE_WIDTH + NODE_SPACING, NODE_HEIGHT + NODE_SPACING);
        setTree(laidOut);
      } else {
        setTree(null);
      }
    } else {
      setTree(null);
    }
  }, [state.focusPersonId, state.data, state.ancestorDepth, state.descendantDepth]);

  // Pan and Zoom handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale * delta)),
    }));
  }, []);

  const handleZoomIn = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(3, prev.scale * 1.2),
    }));
  };

  const handleZoomOut = () => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, prev.scale * 0.8),
    }));
  };

  const handleReset = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  // Render tree nodes recursively
  const renderNode = (node: TreeNode, offsetX: number = 0, offsetY: number = 0): React.ReactNode => {
    if (!node.x || !node.y) return null;

    const x = node.x + offsetX;
    const y = node.y + offsetY;

    // Determine node color based on sex
    let fillColor = '#e0e7ff'; // default blue-100
    if (node.person.sex === 'M') fillColor = '#dbeafe'; // blue-100
    if (node.person.sex === 'F') fillColor = '#fce7f3'; // pink-100

    const isSelected = state.selectedPersonId === node.id;
    const isFocused = state.focusPersonId === node.id;

    return (
      <g key={node.id}>
        {/* Node rectangle */}
        <rect
          x={x - NODE_WIDTH / 2}
          y={y - NODE_HEIGHT / 2}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx={8}
          fill={fillColor}
          stroke={isFocused ? '#9333ea' : isSelected ? '#2563eb' : '#6b7280'}
          strokeWidth={isFocused ? 3 : isSelected ? 2 : 1}
          className="cursor-pointer"
          onClick={() => {
            dispatch({ type: 'SELECT_PERSON', payload: node.id });
          }}
        />
        
        {/* Name */}
        <text
          x={x}
          y={y - 10}
          textAnchor="middle"
          className="text-xs font-semibold fill-gray-900 pointer-events-none"
        >
          {node.person.firstName} {node.person.lastName}
        </text>
        
        {/* Dates */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="text-[10px] fill-gray-600 pointer-events-none"
        >
          {node.person.birthDate ? node.person.birthDate.substring(0, 4) : '?'} -
          {node.person.deathDate ? node.person.deathDate.substring(0, 4) : 'Present'}
        </text>
        
        {/* Sex indicator */}
        {node.person.sex && (
          <text
            x={x}
            y={y + 18}
            textAnchor="middle"
            className="text-[10px] fill-gray-500 pointer-events-none"
          >
            [{node.person.sex}]
          </text>
        )}

        {/* Spouse indicator */}
        {node.spouses && node.spouses.length > 0 && (
          <text
            x={x + NODE_WIDTH / 2 - 5}
            y={y - NODE_HEIGHT / 2 + 10}
            textAnchor="end"
            className="text-[9px] fill-purple-600 font-bold pointer-events-none"
          >
            ♥ {node.spouses.length}
          </text>
        )}
      </g>
    );
  };

  // Render connections between nodes
  const renderConnections = (node: TreeNode, offsetX: number = 0, offsetY: number = 0): React.ReactNode[] => {
    const connections: React.ReactNode[] = [];
    
    if (!node.x || !node.y) return connections;

    const parentX = node.x + offsetX;
    const parentY = node.y + offsetY;

    // Render spouse connections (horizontal)
    if (node.spouses && node.spouses.length > 0) {
      // Find spouse nodes in the tree (simplified - just show indicator)
      // In a full implementation, we'd need to find the spouse's position
    }

    // Render parent-child connections (vertical)
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        if (child.x && child.y) {
          const childX = child.x + offsetX;
          const childY = child.y + offsetY;
          
          connections.push(
            <line
              key={`line-${node.id}-${child.id}`}
              x1={parentX}
              y1={parentY + NODE_HEIGHT / 2}
              x2={childX}
              y2={childY - NODE_HEIGHT / 2}
              stroke="#6b7280"
              strokeWidth={1.5}
            />
          );

          // Recursively render child connections
          connections.push(...renderConnections(child, offsetX, offsetY));
        }
      });
    }

    return connections;
  };

  if (!state.focusPersonId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🌳</div>
          <p className="text-lg font-medium">No focus person selected</p>
          <p className="text-sm mt-1">Select a person and set them as focus in the right sidebar</p>
          <p className="text-sm mt-1">or load demo data from the top bar</p>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-lg font-medium">Building tree...</p>
        </div>
      </div>
    );
  }

  // Calculate viewBox to fit the tree
  const minX = -500;
  const minY = -500;
  const width = 2000;
  const height = 2000;

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded shadow hover:bg-gray-50 text-gray-700"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded shadow hover:bg-gray-50 text-gray-700"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleReset}
          className="bg-white p-2 rounded shadow hover:bg-gray-50 text-gray-700"
          title="Reset View"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        viewBox={`${minX} ${minY} ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>          
          {/* Render connections first (so they appear behind nodes) */}
          {renderConnections(tree)}
          
          {/* Render nodes */}
          {renderNode(tree)}
        </g>
      </svg>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded shadow text-xs text-gray-600">
        <div>Scale: {(transform.scale * 100).toFixed(0)}%</div>
        <div>Drag to pan, scroll to zoom</div>
      </div>
    </div>
  );
};

export default TreeCanvas;

import { useState } from 'react';
import { GitBranch, Search, ChevronRight, ChevronDown, Wrench, Cog, CircleDot, Truck, Zap, Droplets, Thermometer, Fuel, Wind, Square, Circle, Droplet, Filter, Shield, Package } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { learningTree } from '@/data/mock';
import type { CategoryNode } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Wind, Cog, CircleDot, Truck, Zap, Droplets, Thermometer, Fuel, Square, Circle, Droplet, Filter, Wrench, Shield, Package,
};

export default function Tree() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['cat3']));
  const [selectedNode, setSelectedNode] = useState<CategoryNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(true);
  const { showToast } = useToast();

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getBreadcrumb = (node: CategoryNode): string[] => {
    const findPath = (nodes: CategoryNode[], targetId: string, path: string[]): string[] | null => {
      for (const n of nodes) {
        if (n.id === targetId) return [...path, n.name];
        if (n.children) {
          const result = findPath(n.children, targetId, [...path, n.name]);
          if (result) return result;
        }
      }
      return null;
    };
    return findPath(learningTree, node.id, []) || [node.name];
  };

  const renderNode = (node: CategoryNode, depth: number = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const Icon = iconMap[node.icon] || Wrench;
    const isVisible = showInactive || node.active;
    if (!isVisible) return null;

    const matchesSearch = searchQuery === '' ||
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.children?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) ?? false);

    if (searchQuery && !matchesSearch && depth > 0) return null;

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) toggleExpand(node.id);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
            isSelected ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' : 'text-gray-300 hover:bg-white/5'
          } ${!node.active ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {hasChildren && (
            <span className="text-gray-500">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          )}
          {!hasChildren && <span className="w-3.5" />}
          <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`} />
          <span className="text-sm">{node.name}</span>
          {!node.active && <span className="ml-auto text-[10px] text-gray-600">(inactive)</span>}
        </button>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Left Panel */}
        <div className="lg:w-[30%] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Learning Tree
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Find category..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Show Inactive Toggle */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">Show inactive categories</span>
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`w-9 h-5 rounded-full transition-all ${showInactive ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showInactive ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto space-y-0.5 -mx-2 px-2">
            {learningTree.map(node => renderNode(node))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-[70%] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          {selectedNode ? (
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
                {getBreadcrumb(selectedNode).map((crumb, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <ChevronRight className="w-3 h-3" />}
                    <span className={i === getBreadcrumb(selectedNode).length - 1 ? 'text-cyan-400 font-medium' : ''}>{crumb}</span>
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{selectedNode.name}</h2>
              <p className="text-sm text-gray-400 mb-6">{selectedNode.description || 'Category description goes here. This powers search, academy, and promotions across the platform.'}</p>

              {/* Tags */}
              {selectedNode.tags && (
                <div className="mb-6">
                  <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Metadata Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => showToast(`Searching ${selectedNode.name}...`, 'info')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:brightness-110 transition-all"
                >
                  Search This Category
                </button>
                {selectedNode.relatedModules && (
                  <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:border-white/20 transition-all">
                    Related Academy Modules
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <GitBranch className="w-12 h-12 text-gray-700 mb-3" />
              <p className="text-gray-500">Select a category from the tree to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

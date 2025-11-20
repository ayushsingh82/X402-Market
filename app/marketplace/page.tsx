'use client';

import Link from 'next/link';

import React from 'react';

import { motion } from 'framer-motion';

import { useAccount } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

// Agent type
interface Agent {
  id: number;
  name: string;
  category: string;
  pricePerCall: number;
  description?: string;
  rating: number;
  totalCalls: number;
}

// Hardcoded agents for now
const hardcodedAgents: Agent[] = [
  {
    id: 1,
    name: 'Code Assistant Agent',
    category: 'Development',
    pricePerCall: 100, // 1.00 USDC
    description: 'Helps with code generation, debugging, and code reviews. Supports multiple programming languages.',
    rating: 4.5,
    totalCalls: 1250
  },
  {
    id: 2,
    name: 'Data Analytics Agent',
    category: 'Analytics',
    pricePerCall: 150, // 1.50 USDC
    description: 'Analyzes data patterns, generates insights, and creates visualizations for your business metrics.',
    rating: 4.8,
    totalCalls: 890
  },
  {
    id: 3,
    name: 'Content Writer Agent',
    category: 'Content',
    pricePerCall: 80, // 0.80 USDC
    description: 'Creates engaging blog posts, articles, and marketing copy tailored to your brand voice.',
    rating: 4.3,
    totalCalls: 2100
  },
  {
    id: 4,
    name: 'Research Assistant',
    category: 'Research',
    pricePerCall: 120, // 1.20 USDC
    description: 'Conducts deep research on topics, summarizes findings, and provides citations.',
    rating: 4.6,
    totalCalls: 750
  },
  {
    id: 5,
    name: 'Image Generator Agent',
    category: 'Media',
    pricePerCall: 200, // 2.00 USDC
    description: 'Generates high-quality images from text descriptions using advanced AI models.',
    rating: 4.7,
    totalCalls: 3200
  },
  {
    id: 6,
    name: 'Translation Agent',
    category: 'Language',
    pricePerCall: 50, // 0.50 USDC
    description: 'Translates text between 100+ languages with high accuracy and context awareness.',
    rating: 4.4,
    totalCalls: 5600
  }
];

export default function Marketplace() {
  const { address, isConnected } = useAccount();
  const [showAddAgentModal, setShowAddAgentModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const agentCategories = ['Development', 'Analytics', 'Content', 'Research', 'Media', 'Language', 'AI Tools', 'Trading'];

  // Get unique categories from agents
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(hardcodedAgents.map(agent => agent.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, []);

  const filteredAgents = hardcodedAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [formData, setFormData] = React.useState({
    name: '',
    endpointUrl: '',
    pricePerCall: '',
    category: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    setIsSubmitting(true);
    // For now, just show success message
    setTimeout(() => {
      alert('Agent registration will be implemented soon!');
      setShowAddAgentModal(false);
      setFormData({
        name: '',
        endpointUrl: '',
        pricePerCall: '',
        category: '',
        description: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="font-sans tracking-tight relative overflow-x-hidden">
      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-16 pb-20 px-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Agent Marketplace</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover and interact with AI agents (MCPs) deployed on NullShot. Pay per use with x402 micropayments.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3] placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border-2 rounded-lg font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#FFD1B3] text-black border-[#FFD1B3] shadow-[4px_4px_0_0_rgba(255,209,179,0.5)]'
                    : 'bg-black text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const priceInUSDC = (agent.pricePerCall / 100).toFixed(2);
            const rating = agent.rating > 0 ? agent.rating.toFixed(1) : '0.0';

            return (
              <div key={agent.id} className="bg-black border-2 border-gray-700 hover:border-[#FFD1B3] shadow-[8px_8px_0_0_rgba(255,209,179,0.3)] rounded-2xl p-6 hover:shadow-[4px_4px_0_0_rgba(255,209,179,0.5)] transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white mb-2">{agent.name}</h3>
                    <span className="inline-block bg-[#FFD1B3] text-black text-xs font-bold px-2 py-1 rounded border border-[#FFD1B3]">
                      {agent.category}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                  {agent.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold text-white">{rating}</span>
                    <span className="text-xs text-gray-400">({agent.totalCalls} calls)</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-[#FFD1B3]">{priceInUSDC} USDC</div>
                    <div className="text-xs text-gray-400">per call</div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-700 mb-4">
                  <div className="text-xs text-gray-500 font-mono truncate mb-4">
                    Agent ID: {agent.id}
                  </div>
                  <Link
                    href={`/agent/${agent.id}`}
                    className="w-full bg-[#FFD1B3] border-2 border-[#FFD1B3] text-black font-bold py-3 px-4 rounded-lg hover:bg-[#FFD1B3]/80 shadow-[4px_4px_0_0_rgba(255,209,179,0.5)] hover:shadow-[2px_2px_0_0_rgba(255,209,179,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 flex items-center justify-center"
                  >
                    Buy & Access
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400">No agents found. Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* ADD AGENT BUTTON - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          onClick={() => {
            if (!isConnected) {
              alert('Please connect your wallet first');
              return;
            }
            setShowAddAgentModal(true);
          }}
          className="bg-[#FFD1B3] border-2 border-[#FFD1B3] shadow-[6px_6px_0_0_rgba(255,209,179,0.5)] px-6 py-3 rounded-lg cursor-pointer hover:shadow-[4px_4px_0_0_rgba(255,209,179,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
        >
          <span className="text-2xl font-black text-black">+ Add Agent</span>
        </button>
      </div>

      {/* ADD AGENT MODAL */}
      {showAddAgentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border-2 border-gray-700 shadow-[12px_12px_0_0_rgba(255,209,179,0.3)] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-white">Register New Agent</h2>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="bg-black border-2 border-gray-700 shadow-[4px_4px_0_0_rgba(255,209,179,0.3)] px-4 py-2 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,209,179,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black text-white text-xl"
              >
                ✕
              </button>
            </div>

            {!isConnected && (
              <div className="mb-6 p-4 bg-yellow-900/30 border-2 border-yellow-600 rounded-lg">
                <p className="text-sm text-yellow-200 font-bold">Please connect your wallet to register an agent</p>
                <div className="mt-2">
                  <ConnectButton />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Code Assistant Agent"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3] placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Helps with code generation, debugging, and code reviews..."
                  rows={3}
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3] placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Agent Endpoint *
                </label>
                <input
                  type="url"
                  required
                  value={formData.endpointUrl}
                  onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                  placeholder="https://api.example.com/mcp"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3] placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Price per Call (USDC) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.pricePerCall}
                    onChange={(e) => setFormData({ ...formData, pricePerCall: e.target.value })}
                    placeholder="0.01"
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3] placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3]"
                  >
                    <option value="" className="text-gray-500">Select category</option>
                    {agentCategories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isConnected && address && (
                <div className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Owner Wallet</p>
                  <p className="text-sm font-mono text-white">{address}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAgentModal(false)}
                  className="flex-1 bg-gray-800 border-2 border-gray-700 shadow-[4px_4px_0_0_rgba(255,209,179,0.3)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,209,179,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isConnected || isSubmitting}
                  className="flex-1 bg-[#FFD1B3] border-2 border-[#FFD1B3] shadow-[4px_4px_0_0_rgba(255,209,179,0.5)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,209,179,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Registering...' : 'Register Agent'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

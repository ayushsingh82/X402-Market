'use client';

import Link from 'next/link';

import React from 'react';

import { motion } from 'framer-motion';

import { useAccount } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

// Agent type from backend API

interface Agent {

  id: number;

  name: string;

  category: string;

  pricePerCall: number;

  description?: string;

  createdAt: string;

  rating: number;

  totalCalls: number;

}

// Backend URL - configurable via environment variable

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export default function Marketplace() {

  const { address, isConnected } = useAccount();

  const [showAddAgentModal, setShowAddAgentModal] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [agents, setAgents] = React.useState<Agent[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);

  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({

    name: '',

    endpointUrl: '',

    pricePerCall: '',

    category: '',

    description: '',

  });

  // Fetch agents from backend API

  React.useEffect(() => {

    const fetchAgents = async () => {

      try {

        setIsLoading(true);

        const response = await fetch(`${BACKEND_URL}/api/agents`);

        

        if (!response.ok) {

          throw new Error('Failed to fetch agents');

        }

        

        const data = await response.json();

        setAgents(data);

        setError(null);

      } catch (err: any) {

        console.error('Error fetching agents:', err);

        setError(err.message || 'Failed to load agents');

      } finally {

        setIsLoading(false);

      }

    };

    fetchAgents();

  }, []);

  const blueCircles = [

    { className: 'fixed left-[-40px] top-[-40px] w-40 h-40', color: 'bg-[#0048E0]/70', blur: 'blur-sm', delay: 0 },

    { className: 'fixed left-[-32px] bottom-[-32px] w-32 h-32', color: 'bg-[#7183F5]/70', blur: 'blur', delay: 0.2 },

    { className: 'fixed right-[-40px] top-[-40px] w-40 h-40', color: 'bg-[#0048E0]/70', blur: 'blur-sm', delay: 0.4 },

    { className: 'fixed right-[-32px] bottom-[-32px] w-32 h-32', color: 'bg-[#7183F5]/70', blur: 'blur', delay: 0.6 },

  ];

  const [searchQuery, setSearchQuery] = React.useState('');

  const [selectedCategory, setSelectedCategory] = React.useState('All');

  // Get unique categories from agents

  const categories = React.useMemo(() => {

    const uniqueCategories = new Set(agents.map(agent => agent.category));

    return ['All', ...Array.from(uniqueCategories).sort()];

  }, [agents]);

  const agentCategories = ['Development', 'Analytics', 'Content', 'Research', 'Media', 'Language', 'AI Tools', 'Trading'];

  const filteredAgents = agents.filter(agent => {

    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

      (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;

  });

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    

    if (!isConnected || !address) {

      alert('Please connect your wallet first');

      return;

    }

    setIsSubmitting(true);

    try {

      // Convert price to cents (e.g., 0.01 USDC = 1 cent)

      const priceInCents = Math.round(parseFloat(formData.pricePerCall) * 100);

      const response = await fetch(`${BACKEND_URL}/api/agents`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          name: formData.name,

          owner: address,

          endpointUrl: formData.endpointUrl,

          pricePerCall: priceInCents,

          category: formData.category,

          description: formData.description,

        }),

      });

      if (!response.ok) {

        const error = await response.json();

        throw new Error(error.error || 'Failed to register agent');

      }

      const result = await response.json();

      alert(`Agent registered successfully! ID: ${result.agentId}`);

      setShowAddAgentModal(false);

      setFormData({

        name: '',

        endpointUrl: '',

        pricePerCall: '',

        category: '',

        description: '',

      });

      // Refresh agents list

      const agentsResponse = await fetch(`${BACKEND_URL}/api/agents`);

      if (agentsResponse.ok) {

        const agentsData = await agentsResponse.json();

        setAgents(agentsData);

      }

    } catch (error: any) {

      alert(`Error: ${error.message}`);

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="min-h-screen bg-white font-sans tracking-tight relative overflow-x-hidden">

      {/* Animated blue background circles */}

      {blueCircles.map((circle, i) => (

        <motion.div

          key={i}

          initial={{ opacity: 0, scale: 0.9 }}

          animate={{ opacity: 1, scale: [0.9, 1.05, 0.9] }}

          transition={{ duration: 10, repeat: Infinity, delay: circle.delay, ease: 'easeInOut' }}

          className={`${circle.className} ${circle.color} ${circle.blur} rounded-full border-2 border-gray-300 pointer-events-none z-0`}

        />

      ))}

      {/* HEADER */}

      <div className="absolute top-6 left-6 z-10">

        <Link href="/" className="focus:outline-none">

          <div className="bg-[#0048E0] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg cursor-pointer hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">

            <h1 className="text-2xl font-black text-white">PayPerAgent</h1>

          </div>

        </Link>

      </div>

      {/* WALLET CONNECT & SOCIAL LINKS */}

      <div className="absolute top-6 right-6 z-10 flex gap-3 items-center">

        <ConnectButton />

        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">

          <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>

          </svg>

        </a>

        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">

          <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>

          </svg>

        </a>

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

          className="bg-[#0048E0] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg cursor-pointer hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"

        >

          <span className="text-2xl font-black text-white">+ Add Agent</span>

        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto">

        {/* Page Header */}

        <div className="text-center mb-12">

          <h1 className="text-5xl font-black text-black mb-4">Agent Marketplace</h1>

          <p className="text-lg text-black/70 max-w-2xl mx-auto">

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

              className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0048E0]"

            />

          </div>

          <div className="flex gap-2 flex-wrap">

            {categories.map((category) => (

              <button

                key={category}

                onClick={() => setSelectedCategory(category)}

                className={`px-4 py-2 border-2 border-black rounded-lg font-bold transition-all ${

                  selectedCategory === category

                    ? 'bg-[#0048E0] text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]'

                    : 'bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)]'

                }`}

              >

                {category}

              </button>

            ))}

          </div>

        </div>

        {/* Loading State */}

        {isLoading && (

          <div className="text-center py-12">

            <p className="text-lg text-black/50">Loading agents...</p>

          </div>

        )}

        {/* Error State */}

        {error && !isLoading && (

          <div className="text-center py-12">

            <p className="text-lg text-red-500">Error: {error}</p>

            <button

              onClick={() => window.location.reload()}

              className="mt-4 px-4 py-2 bg-[#0048E0] text-white border-2 border-black rounded-lg font-bold hover:bg-[#0038C0]"

            >

              Retry

            </button>

          </div>

        )}

        {/* Agents Grid */}

        {!isLoading && !error && (

          <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredAgents.map((agent) => {

                // Format price from cents to USDC

                const priceInUSDC = (agent.pricePerCall / 100).toFixed(2);

                // Format rating (from SC, 0 if no ratings yet)

                const rating = agent.rating > 0 ? agent.rating.toFixed(1) : '0.0';

                

                return (

                  <Link key={agent.id} href={`/agent/${agent.id}`}>

                    <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-2xl p-6 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 cursor-pointer">

                      <div className="flex items-start justify-between mb-4">

                        <div className="flex-1">

                          <h3 className="text-xl font-black text-black mb-2">{agent.name}</h3>

                          <span className="inline-block bg-[#7183F5] text-white text-xs font-bold px-2 py-1 rounded border border-black">

                            {agent.category}

                          </span>

                        </div>

                      </div>

                      

                      <p className="text-sm text-black/70 mb-4 line-clamp-2">

                        {agent.description || 'No description available'}

                      </p>

                      

                      <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-1">

                          <span className="text-yellow-500">★</span>

                          <span className="font-bold text-black">{rating}</span>

                          <span className="text-xs text-black/50">({agent.totalCalls} calls)</span>

                        </div>

                        <div className="text-right">

                          <div className="text-lg font-black text-[#0048E0]">{priceInUSDC} USDC</div>

                          <div className="text-xs text-black/50">per call</div>

                        </div>

                      </div>

                      

                      <div className="pt-4 border-t-2 border-black">

                        <div className="text-xs text-black/50 font-mono truncate">

                          Agent ID: {agent.id}

                        </div>

                      </div>

                    </div>

                  </Link>

                );

              })}

            </div>

            {filteredAgents.length === 0 && !isLoading && (

              <div className="text-center py-12">

                <p className="text-lg text-black/50">No agents found. Try a different search or category.</p>

              </div>

            )}

          </>

        )}

      </div>

      {/* ADD AGENT MODAL */}

      {showAddAgentModal && (

        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <motion.div

            initial={{ opacity: 0, scale: 0.9 }}

            animate={{ opacity: 1, scale: 1 }}

            className="bg-white border-2 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"

          >

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-black text-black">Register New Agent</h2>

              <button

                onClick={() => setShowAddAgentModal(false)}

                className="bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-4 py-2 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black text-black text-xl"

              >

                ✕

              </button>

            </div>

            {!isConnected && (

              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">

                <p className="text-sm text-black font-bold">Please connect your wallet to register an agent</p>

                <div className="mt-2">

                  <ConnectButton />

                </div>

              </div>

            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>

                <label className="block text-sm font-bold text-black mb-2">

                  Agent Name *

                </label>

                <input

                  type="text"

                  required

                  value={formData.name}

                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}

                  placeholder="Code Assistant Agent"

                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0048E0] placeholder:text-gray-500 text-black"

                />

              </div>

              <div>

                <label className="block text-sm font-bold text-black mb-2">

                  Description

                </label>

                <textarea

                  value={formData.description}

                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}

                  placeholder="Helps with code generation, debugging, and code reviews..."

                  rows={3}

                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0048E0] placeholder:text-gray-500 text-black"

                />

              </div>

              <div>

                <label className="block text-sm font-bold text-black mb-2">

                  Agent Endpoint *

                </label>

                <input

                  type="url"

                  required

                  value={formData.endpointUrl}

                  onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}

                  placeholder="https://api.example.com/mcp"

                  className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0048E0] placeholder:text-gray-500 text-black"

                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-bold text-black mb-2">

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

                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0048E0] placeholder:text-gray-500 text-black"

                  />

                </div>

                <div>

                  <label className="block text-sm font-bold text-black mb-2">

                    Category *

                  </label>

                  <select

                    required

                    value={formData.category}

                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}

                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0048E0] bg-white text-black"

                  >

                    <option value="" className="text-gray-500">Select category</option>

                    {agentCategories.map((cat) => (

                      <option key={cat} value={cat}>

                        {cat}

                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {isConnected && address && (

                <div className="p-4 bg-gray-50 border-2 border-black rounded-lg">

                  <p className="text-xs text-black/50 mb-1">Owner Wallet</p>

                  <p className="text-sm font-mono text-black">{address}</p>

                </div>

              )}

              <div className="flex gap-4 pt-4">

                <button

                  type="button"

                  onClick={() => setShowAddAgentModal(false)}

                  className="flex-1 bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-black"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={!isConnected || isSubmitting}

                  className="flex-1 bg-[#0048E0] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"

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


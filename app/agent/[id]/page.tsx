'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';

// Hardcoded agents data (same as marketplace)
const agents = [
  {
    id: 1,
    name: 'Code Assistant Agent',
    category: 'Development',
    pricePerCall: 100,
    description: 'Helps with code generation, debugging, and code reviews. Supports multiple programming languages.',
    rating: 4.5,
    totalCalls: 1250,
    endpointUrl: 'https://api.example.com/mcp'
  },
  {
    id: 2,
    name: 'Data Analytics Agent',
    category: 'Analytics',
    pricePerCall: 150,
    description: 'Analyzes data patterns, generates insights, and creates visualizations for your business metrics.',
    rating: 4.8,
    totalCalls: 890,
    endpointUrl: 'https://api.example.com/mcp'
  },
  {
    id: 3,
    name: 'Content Writer Agent',
    category: 'Content',
    pricePerCall: 80,
    description: 'Creates engaging blog posts, articles, and marketing copy tailored to your brand voice.',
    rating: 4.3,
    totalCalls: 2100,
    endpointUrl: 'https://api.example.com/mcp'
  },
  {
    id: 4,
    name: 'Research Assistant',
    category: 'Research',
    pricePerCall: 120,
    description: 'Conducts deep research on topics, summarizes findings, and provides citations.',
    rating: 4.6,
    totalCalls: 750,
    endpointUrl: 'https://api.example.com/mcp'
  },
  {
    id: 5,
    name: 'Image Generator Agent',
    category: 'Media',
    pricePerCall: 200,
    description: 'Generates high-quality images from text descriptions using advanced AI models.',
    rating: 4.7,
    totalCalls: 3200,
    endpointUrl: 'https://api.example.com/mcp'
  },
  {
    id: 6,
    name: 'Translation Agent',
    category: 'Language',
    pricePerCall: 50,
    description: 'Translates text between 100+ languages with high accuracy and context awareness.',
    rating: 4.4,
    totalCalls: 5600,
    endpointUrl: 'https://api.example.com/mcp'
  }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = parseInt(params.id as string);
  const agent = agents.find(a => a.id === agentId);
  const { address, isConnected } = useAccount();
  
  const [hasAccess, setHasAccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Agent not found</h1>
          <Link href="/marketplace" className="text-[#FFD1B3] hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const priceInUSDC = (agent.pricePerCall / 100).toFixed(2);

  const handleBuyAccess = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setHasAccess(true);
      setIsProcessing(false);
      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: `Welcome! You now have access to ${agent.name}. You can start sending prompts to interact with this MCP agent.`,
        timestamp: new Date()
      }]);
    }, 2000);
  };

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim()) return;
    if (!hasAccess) {
      alert('Please purchase access first');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: inputPrompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    // Simulate MCP agent response
    // In production, this would call the actual MCP endpoint
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `[MCP Response] This is a simulated response from ${agent.name}. In production, this would query the DKG Edge Node via MCP protocol and return actual data from the Knowledge Graph. Your prompt: "${inputPrompt}"`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Agent Info Card */}
        <div className="bg-black border-2 border-gray-700 rounded-2xl p-6 mb-8 shadow-[8px_8px_0_0_rgba(255,209,179,0.3)]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-black text-white mb-2">{agent.name}</h1>
              <span className="inline-block bg-[#FFD1B3] text-black text-xs font-bold px-3 py-1 rounded border border-[#FFD1B3] mb-4">
                {agent.category}
              </span>
              <p className="text-gray-300 mb-4">{agent.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold">{agent.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">{agent.totalCalls} calls</span>
                <span className="text-[#FFD1B3] font-bold">{priceInUSDC} USDC per call</span>
              </div>
            </div>
          </div>
        </div>

        {/* Access Section */}
        {!hasAccess ? (
          <div className="bg-black border-2 border-gray-700 rounded-2xl p-8 text-center shadow-[8px_8px_0_0_rgba(255,209,179,0.3)]">
            <h2 className="text-2xl font-bold text-white mb-4">Purchase Access</h2>
            <p className="text-gray-300 mb-6">
              {!isConnected 
                ? 'Please connect your wallet using the button in the navbar to purchase access and interact with this MCP agent via the DKG Edge Node.'
                : 'Purchase access to interact with this MCP agent via the DKG Edge Node.'
              }
            </p>
            {isConnected && (
              <button
                onClick={handleBuyAccess}
                disabled={isProcessing}
                className="bg-[#FFD1B3] border-2 border-[#FFD1B3] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#FFD1B3]/80 shadow-[4px_4px_0_0_rgba(255,209,179,0.5)] hover:shadow-[2px_2px_0_0_rgba(255,209,179,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : `Buy Access - ${priceInUSDC} USDC`}
              </button>
            )}
          </div>
        ) : (
          /* MCP Prompt Interface */
          <div className="bg-black border-2 border-gray-700 rounded-2xl p-6 shadow-[8px_8px_0_0_rgba(255,209,179,0.3)]">
            <h2 className="text-2xl font-bold text-white mb-6">MCP Agent Interface</h2>
            
            {/* Messages */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 h-96 overflow-y-auto border-2 border-gray-700">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <p>Start a conversation with {agent.name}</p>
                  <p className="text-sm mt-2">Send prompts to interact with the MCP agent via DKG Edge Node</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-[#FFD1B3] text-black'
                            : 'bg-gray-800 text-white border-2 border-gray-700'
                        }`}
                      >
                        <p className="text-sm font-semibold mb-1">
                          {msg.role === 'user' ? 'You' : agent.name}
                        </p>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white border-2 border-gray-700 rounded-lg p-4">
                        <p className="text-sm">Thinking...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-4">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendPrompt()}
                placeholder="Enter your prompt to query the MCP agent..."
                className="flex-1 px-4 py-3 bg-black border-2 border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD1B3] focus:border-[#FFD1B3] placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendPrompt}
                disabled={isLoading || !inputPrompt.trim()}
                className="bg-[#FFD1B3] border-2 border-[#FFD1B3] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#FFD1B3]/80 shadow-[4px_4px_0_0_rgba(255,209,179,0.5)] hover:shadow-[2px_2px_0_0_rgba(255,209,179,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


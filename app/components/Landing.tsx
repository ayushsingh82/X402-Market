"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CreativeMetallicEffect from './CreativeMetallicEffect';
import MagicBento, { BentoCardProps } from './MagicBento';
import SplashCursor from './SplashCursor';
 

const Landing = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is X402-Market?",
      answer: "X402-Market is an AI agent marketplace powered by the x402 payment protocol. Discover and interact with AI agents (MCPs) deployed on NullShot. Pay per use with x402 micropayments using USDC on Base Sepolia."
    },
    {
      question: "How does x402 payment work?",
      answer: "x402 is an open protocol for internet-native payments using the HTTP 402 Payment Required status code. Pay for agent access directly with cryptocurrency - no credit cards, no KYC, no high fees. Just connect your wallet and pay 0.10 USDC per agent access."
    },
    {
      question: "What are AI Agents (MCPs)?",
      answer: "AI Agents are Model Context Protocol (MCP) servers that provide specialized AI capabilities. Each agent can help with different tasks like code generation, data analytics, content writing, research, image generation, and translation."
    },
    {
      question: "Do I need to pay every time?",
      answer: "Once you pay 0.10 USDC to access an agent, your payment is stored and you can access that agent anytime from the same wallet without paying again. Each wallet has its own payment record."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  return (
    <div className="bg-black relative">
      {/* Hero Section */}
      <section className="px-8 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <SplashCursor />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-semibold font-serif text-white mb-6 leading-tight">
              Discover{' '}
              <Link href="/marketplace" className="text-[#FFD1B3] hover:text-[#FFD1B3]/80 underline decoration-[#FFD1B3] decoration-2 underline-offset-4 transition-colors cursor-pointer">
                AI Agents
              </Link>{' '}
              with x402 Payments
            </h1>
            <p className="text-2xl text-gray-300 leading-tight mb-10 max-w-3xl">
              Access powerful AI agents (MCPs) on-demand. Pay 0.10 USDC per agent with instant, gasless micropayments using the x402 protocol.
            </p>
            <Link
              href="/marketplace"
              className="bg-[#FFD1B3] border-2 border-[#FFD1B3] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#FFD1B3]/80 shadow-[6px_6px_0_0_rgba(255,209,179,0.5)] hover:shadow-[4px_4px_0_0_rgba(255,209,179,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 text-lg"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Why x402 Marketplace?
          </h3>
          <p className="text-lg text-gray-300 mb-16 max-w-3xl mx-auto">
            Access AI agents instantly with frictionless crypto payments. No accounts, no subscriptions, just pay per use.
          </p>

          <MagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="255, 209, 179"
            customCards={[
              {
                color: '#060010',
                title: '⚡ Instant Access',
                description: 'Pay 0.10 USDC and get immediate access to any AI agent. No waiting, no approvals.',
                label: 'Speed'
              },
              {
                color: '#060010',
                title: '🔒 Wallet-Based',
                description: 'Your payment is tied to your wallet. Access agents anytime from the same wallet without paying again.',
                label: 'Security'
              },
              {
                color: '#060010',
                title: '💎 Gasless Payments',
                description: 'Using ERC-3009 TransferWithAuthorization, payments are gasless and instant on Base Sepolia.',
                label: 'Efficiency'
              }
            ]}
          />

        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-700 hover:border-[#FFD1B3] rounded-lg transition-colors">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#FFD1B3]/20 transition-colors hover:border-[#FFD1B3]"
                >
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <span className="text-2xl font-light text-gray-400">
                    {openFAQ === index ? '−' : '+'}
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;

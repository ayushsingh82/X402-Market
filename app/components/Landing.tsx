"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import CreativeMetallicEffect from './CreativeMetallicEffect';
import MagicBento from './MagicBento';
import SplashCursor from './SplashCursor';
 

const Landing = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is X402-Market?",
      answer: "X402-Market is a DeFi infrastructure platform that provides yield bidding engines and liquidity auction mechanisms for applications."
    },
    {
      question: "How does the yield bidding work?",
      answer: "Our real-time auction layer sources optimal DeFi yields across multiple protocols, ensuring the best returns for your users."
    },
    {
      question: "Do I need to write smart contracts?",
      answer: "No, X402-Market provides pre-built DeFi-native yield, vaults, and structured products that you can embed without writing any smart contracts."
    },
    {
      question: "What APIs do you provide?",
      answer: "We offer simple REST APIs with comprehensive documentation to make integration fast and easy for developers."
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
              Become the{' '}
              <Link href="/marketplace" className="text-[#FFD1B3] hover:text-[#FFD1B3]/80 underline decoration-[#FFD1B3] decoration-2 underline-offset-4 transition-colors cursor-pointer">
                DeFi
              </Link>{' '}
              backbone 
            </h1>
            <p className="text-2xl text-gray-300 leading-tight mb-10 max-w-3xl">
              Instantly embed DeFi-native yield, vaults, and structured products — without writing smart contracts.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Features
          </h3>
          <p className="text-lg text-gray-300 mb-16 max-w-3xl mx-auto">
            From idea to a billion users — X402-Market gives apps the DeFi rails to scale without limits.
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

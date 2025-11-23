"use client";

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-16 py-4">
      <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
        Polkadot
      </Link>
      <div className="flex items-center space-x-2">
        <Link
          href="/marketplace"
          className="px-4 py-2 rounded-lg border-2 bg-white text-black border-white hover:bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold"
        >
          Marketplace
        </Link>
      </div>
      <ConnectButton />
    </nav>
  );
}


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
          className="px-4 py-2 rounded-lg border-2 bg-black text-white border-black hover:bg-gray-800 transition-colors"
        >
          Marketplace
        </Link>
      </div>
      <ConnectButton />
    </nav>
  );
}


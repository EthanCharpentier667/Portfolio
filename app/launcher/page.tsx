"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaWindows, FaApple, FaLinux } from "react-icons/fa";

export default function LauncherPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 items-center justify-center p-4">
      <div className={`text-center max-w-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          New World Launcher
        </h1>
        
        <p className="text-lg text-gray-200 mb-12 leading-relaxed">
          Découvrez une nouvelle dimension de jeu avec notre launcher New World. 
          Accédez à tous vos jeux favoris en un seul endroit, avec des performances 
          optimisées et une interface intuitive conçue pour les vrais gamers.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16">
          <Link
            href="/launcher/windows/NewWorldInstaller.exe"
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium transition-all"
          >
            <FaWindows size={24} />
            <span>Windows</span>
          </Link>

          <Link
            href="/launcher/macos/NewWorldInstaller.dmg"
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium transition-all"
          >
            <FaApple size={24} />
            <span>MacOS</span>
          </Link>

          <Link
            href="/launcher/linux/NewWorldInstaller.deb"
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-br from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 text-white font-medium transition-all"
          >
            <FaLinux size={24} />
            <span>Linux</span>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
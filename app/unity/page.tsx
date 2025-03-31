"use client";

import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import Link from "next/link";

export default function UnityPage() {
  const { unityProvider, isLoaded } = useUnityContext({
    loaderUrl: "UnityGame/Build/Build.loader.js",
    dataUrl: "UnityGame/Build/Build.data",
    frameworkUrl: "UnityGame/Build/Build.framework.js",
    codeUrl: "UnityGame/Build/Build.wasm",
  });

  const [isUnityLoaded, setIsUnityLoaded] = useState(false);

  useEffect(() => {
    setIsUnityLoaded(isLoaded)
  }, [isLoaded, isUnityLoaded]);

  const handleGoBack = () => {
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900 items-center justify-center">
      <div className="flex flex-row items-center justify-center mb-10">
      <h1 className="gradient-text mr-10 text-3xl">Obake</h1>
      <Link
          href="/"
          className="px-6 py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 hover:bg-slate-200 text-white"
          onClick={handleGoBack}
      >
          Go Back
      </Link>
      </div>
      {isUnityLoaded ? (
        <p className="text-white"></p>
      ) : (
        <p className="text-white">Loading...</p>
      )}
      <Unity unityProvider={unityProvider} style={{ width: "1280px", height: "720px" }} />
    </main>
  );
}
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR issues with canvas/localStorage
const Editor = dynamic(() => import('@/components/editor/editor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
        <p className="text-sm text-slate-500 font-medium">Loading Sinhala Canvas...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Editor />;
}

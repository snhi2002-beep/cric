'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuthAndFetchData = async () => {
      try {
        const authRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (!authRes.ok) {
          router.replace('/login');
          return;
        }
        const authData = await authRes.json();
        if (!authData.success || !authData.user) {
          router.replace('/login');
          return;
        }
        setUser(authData.user);

        const streamRes = await fetch('/api/stream/info', { credentials: 'include' });
        if (streamRes.ok) {
          const streamData = await streamRes.json();
          if (streamData.success) {
            setStream(streamData.stream);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAuthAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.replace('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090a0f] text-gray-400">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <span>Loading Cric IPTV...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#090a0f] text-gray-100">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Live Sports Stream</h1>
            <p className="text-xs text-gray-400">High-Definition HLS IPTV Broadcast</p>
          </div>
          <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            Operational
          </span>
        </div>

        {stream?.streamUrl ? (
          <VideoPlayer streamUrl={stream.streamUrl} />
        ) : (
          <div className="flex aspect-video w-full max-w-5xl items-center justify-center rounded-2xl border border-white/10 bg-black text-gray-500">
            No stream configured.
          </div>
        )}
      </main>
    </div>
  );
}

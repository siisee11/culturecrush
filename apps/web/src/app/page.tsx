'use client';

import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { CoreValueInput } from '@/components/setup/CoreValueInput';
import { TranscriptInput } from '@/components/setup/TranscriptInput';
import { TranscriptViewer } from '@/components/results/TranscriptViewer';
import { AlignmentReport } from '@/components/results/AlignmentReport';
// Import LoadingScreen via require to avoid circular dependency if needed needed, but standard import is better if no cycle.
// Actually, let's use standard import.
import { LoadingScreen } from '@/components/analysis/LoadingScreen';

export default function Home() {
  const { coreValues, transcript, isCeoMode, toggleCeoMode, status, setStatus, setAnalysisResult } = useAppStore();

  useEffect(() => {
    (window as any).ceo = toggleCeoMode;
    console.log("Welcome! Type 'window.ceo()' to toggle CEO Mode.");
  }, [toggleCeoMode]);

  const handleAnalyze = async () => {
    setStatus('analyzing');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, coreValues }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data);
      setStatus('done');
    } catch (e: any) {
      console.error(e);
      setStatus('error');
      alert(e.message || 'Analysis failed. Please try again.');
    }
  };

  if (status === 'analyzing') {
    return <LoadingScreen />;
  }

  if (status === 'done') {
    return (
      <main className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--color-primary)' }}>Analysis Complete!</h1>
          <button className="btn" onClick={() => setStatus('idle')} style={{ background: '#eee' }}>Start Over</button>
        </div>

        <AlignmentReport />
        <TranscriptViewer />

        <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5 }}>
          <p>Current Mode: {isCeoMode ? <b style={{ color: 'red' }}>CEO MODE</b> : <b>General Mode</b>}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
        Culture Crush
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text-subtle)', marginBottom: '3rem' }}>
        Check your meeting alignment with style.
      </p>

      {/* Setup Step */}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <CoreValueInput />
        <TranscriptInput />

        <div style={{ marginTop: '2rem' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '1.2rem' }}
            disabled={coreValues.length === 0 || !transcript.trim()}
            onClick={handleAnalyze}
          >
            ANALYZE MEETING
          </button>
        </div>
      </div>

      <div style={{ marginTop: '4rem', opacity: 0.5, fontSize: '0.9rem' }}>
        <p>Current Mode: {isCeoMode ? <b style={{ color: 'red' }}>CEO MODE</b> : <b>General Mode</b>}</p>
      </div>
    </main>
  );
}

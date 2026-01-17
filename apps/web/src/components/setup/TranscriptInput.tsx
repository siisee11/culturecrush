import { useAppStore } from '@/store/useAppStore';
import styles from './TranscriptInput.module.css';

export function TranscriptInput() {
    const { transcript, setTranscript } = useAppStore();

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>2. Meeting Transcript</label>
            <div className={styles.container}>
                <textarea
                    className={styles.textarea}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder={`Speaker 1\nHello, how are we aligning with our values?\n\nSpeaker 2\nI think we should move fast and break things!`}
                    spellCheck={false}
                />
                <div className={styles.footer}>
                    <span>{transcript.length} chars</span>
                </div>
            </div>
        </div>
    );
}

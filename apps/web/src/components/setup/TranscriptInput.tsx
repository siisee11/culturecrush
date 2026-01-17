import { useAppStore } from '@/store/useAppStore';
import styles from './TranscriptInput.module.css';
import { Plus, Trash2 } from 'lucide-react';

export function TranscriptInput() {
    const { transcript, setTranscript, speakerMappings, setSpeakerMappings } = useAppStore();

    const handleMappingChange = (index: number, field: 'original' | 'replacement', value: string) => {
        const newMappings = [...speakerMappings];
        newMappings[index] = { ...newMappings[index], [field]: value };
        setSpeakerMappings(newMappings);
    };

    const addMapping = () => {
        setSpeakerMappings([
            ...speakerMappings,
            { original: `Speaker ${speakerMappings.length + 1}`, replacement: '' }
        ]);
    };

    const removeMapping = (index: number) => {
        const newMappings = speakerMappings.filter((_, i) => i !== index);
        setSpeakerMappings(newMappings);
    };

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

            {/* Speaker Mapping Section */}
            <div className={styles.mappingSection}>
                <div className={styles.mappingHeader}>
                    <span>Speaker Identity Mapping</span>
                </div>

                {speakerMappings.map((mapping, idx) => (
                    <div key={idx} className={styles.mappingRow}>
                        <div className={styles.mappingLabel}>
                            <input
                                className={styles.mappingInputOriginal}
                                value={mapping.original}
                                onChange={(e) => handleMappingChange(idx, 'original', e.target.value)}
                                placeholder="Speaker X"
                            />
                        </div>
                        <span className={styles.arrow}>&rarr;</span>
                        <input
                            className={styles.mappingInput}
                            value={mapping.replacement}
                            onChange={(e) => handleMappingChange(idx, 'replacement', e.target.value)}
                            placeholder="Display Name"
                        />
                        <button
                            className={styles.removeBtn}
                            onClick={() => removeMapping(idx)}
                            title="Remove mapping"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <button className={styles.addMappingBtn} onClick={addMapping}>
                    <Plus size={18} /> ADD SPEAKER
                </button>
            </div>
        </div>
    );
}

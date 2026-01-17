import { useAppStore, TranscriptSegment } from '@/store/useAppStore';
import { getColorForValue } from '@/utils/colors';
import styles from './TranscriptViewer.module.css';

export function TranscriptViewer() {
    const { analysisResult, isCeoMode, coreValues } = useAppStore();

    if (!analysisResult) return null;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Transcript Review</h2>
            <div className={styles.transcriptContainer}>
                {analysisResult.segments.map((segment) => (
                    <TranscriptBubble
                        key={segment.id}
                        segment={segment}
                        isCeoMode={isCeoMode}
                        allValues={coreValues}
                    />
                ))}
            </div>
        </div>
    );
}

function TranscriptBubble({ segment, isCeoMode, allValues }: {
    segment: TranscriptSegment,
    isCeoMode: boolean,
    allValues: string[]
}) {
    const { scores } = segment;

    // Find highest impact score
    let bestMatch = { value: '', score: 0 };

    scores.forEach(({ value, score }) => {
        // Prioritize Positive High Scores first
        if (score >= 3) {
            if (score > bestMatch.score) bestMatch = { value, score };
        }
        // If CEO Mode, consider negatives
        else if (isCeoMode && score <= -1) {
            if (score < bestMatch.score || bestMatch.score === 0) bestMatch = { value, score };
        }
    });

    const isPositive = bestMatch.score >= 3;
    const isNegative = bestMatch.score <= -1;
    const hasHighlight = isPositive || (isCeoMode && isNegative);

    const highlightStyle = hasHighlight ? {
        '--bubble-border-color': isPositive ? getColorForValue(bestMatch.value, allValues) : 'var(--color-warning)',
        '--bubble-bg-color': isPositive ? `${getColorForValue(bestMatch.value, allValues)}15` : '#FF4B4B10',
    } as React.CSSProperties : {
        '--bubble-border-color': '#E5E5E5', // Default grey
        '--bubble-bg-color': '#FFFFFF', // Default white
    } as React.CSSProperties;

    return (
        <div className={styles.bubbleWrapper}>
            <div className={styles.speaker}>{segment.speaker}</div>
            <div
                className={`${styles.bubble} ${hasHighlight ? styles.highlighted : ''}`}
                style={highlightStyle}
            >
                {segment.text}

                {hasHighlight && (
                    <div className={styles.tooltip}>
                        <span
                            className={styles.scoreBadge}
                            style={{ backgroundColor: isPositive ? getColorForValue(bestMatch.value, allValues) : 'var(--color-warning)' }}
                        >
                            {bestMatch.score > 0 ? `+${bestMatch.score}` : bestMatch.score}
                        </span>
                        <span className={styles.scoreLabel}>{bestMatch.value}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

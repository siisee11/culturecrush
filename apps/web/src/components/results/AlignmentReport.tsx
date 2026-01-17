import { useAppStore } from '@/store/useAppStore';
import { getColorForValue } from '@/utils/colors';
import { Trophy, Star, Zap } from 'lucide-react';
import styles from './AlignmentReport.module.css';

export function AlignmentReport() {
    const { analysisResult, coreValues } = useAppStore();

    if (!analysisResult) return null;

    // 1. Participant Stats Calculation
    const stats: Record<string, { totalScore: number; valueScores: Record<string, number> }> = {};

    analysisResult.segments.forEach((seg) => {
        if (!stats[seg.speaker]) {
            stats[seg.speaker] = { totalScore: 0, valueScores: {} };
        }

        seg.scores.forEach(({ value, score }) => {
            // Only count positive contributions for XP in Gamification context
            if (score > 0) {
                stats[seg.speaker].totalScore += score;
                stats[seg.speaker].valueScores[value] = (stats[seg.speaker].valueScores[value] || 0) + score;
            }
        });
    });

    // Find Champion
    let champion = { name: '', score: 0 };
    Object.entries(stats).forEach(([name, data]) => {
        if (data.totalScore > champion.score) {
            champion = { name, score: data.totalScore };
        }
    });

    return (
        <div className={styles.wrapper}>
            {/* Summary Section */}
            <section className={styles.summarySection}>
                <h2 className={styles.heading}>Meeting Summary</h2>
                <p className={styles.summaryText}>{analysisResult.summary}</p>
            </section>

            {/* Champion Section */}
            {champion.score > 0 && (
                <section className={styles.championSection}>
                    <div className={styles.trophyIcon}>
                        <Trophy size={48} color="#FFD700" fill="#FFD700" />
                    </div>
                    <div className={styles.championInfo}>
                        <span className={styles.championLabel}>CULTURE CHAMPION</span>
                        <h3 className={styles.championName}>{champion.name}</h3>
                        <span className={styles.championScore}>{champion.score} XP Gained</span>
                    </div>
                </section>
            )}

            {/* Leaderboard / XP Bars */}
            <section className={styles.statsSection}>
                <h2 className={styles.heading}>Alignment XP</h2>
                <div className={styles.grid}>
                    {Object.entries(stats).map(([name, data]) => (
                        <div key={name} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.avatar}>{name[0]}</span>
                                <span className={styles.name}>{name}</span>
                                <span className={styles.totalXp}><Zap size={16} fill="currentColor" /> {data.totalScore}</span>
                            </div>

                            <div className={styles.xpBars}>
                                {Object.entries(data.valueScores)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([val, score]) => (
                                        <div key={val} className={styles.barRow}>
                                            <span className={styles.barLabel}>{val}</span>
                                            <div className={styles.barTrack}>
                                                <div
                                                    className={styles.barFill}
                                                    style={{
                                                        width: `${Math.min((score / 20) * 100, 100)}%`, // Scale based on arbitrary max
                                                        backgroundColor: getColorForValue(val, coreValues)
                                                    }}
                                                ></div>
                                            </div>
                                            <span className={styles.barValue}>+{score}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

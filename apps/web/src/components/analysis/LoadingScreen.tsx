import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

const LOADING_MESSAGES = [
    "Listening to the meeting...",
    "Identifying the speakers...",
    "Calculating Alignment XP...",
    "Finding the Value Champion...",
    "Almost there...",
    "Polishing the badges...",
];

export function LoadingScreen() {
    const [messageIdx, setMessageIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={styles.mascot}>
                    {/* Simple CSS Mascot Animation */}
                    <div className={styles.eyeLeft}></div>
                    <div className={styles.eyeRight}></div>
                    <div className={styles.mouth}></div>
                </div>

                <h2 className={styles.message} key={messageIdx}>
                    {LOADING_MESSAGES[messageIdx]}
                </h2>

                <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                </div>
            </div>
        </div>
    );
}

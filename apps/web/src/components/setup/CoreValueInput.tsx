import { useState, KeyboardEvent } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, Plus } from 'lucide-react';
import styles from './CoreValueInput.module.css';

const PRESET_COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)',
    '#FF5A5F', // Airbnb Red
    '#00A699', // Cyan
    '#767676', // Grey
];

export function CoreValueInput() {
    const { coreValues, setCoreValues } = useAppStore();
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addValue(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && coreValues.length > 0) {
            removeValue(coreValues[coreValues.length - 1]);
        }
    };

    const addValue = (val: string) => {
        if (!coreValues.includes(val)) {
            setCoreValues([...coreValues, val]);
        }
        setInputValue('');
    };

    const removeValue = (val: string) => {
        setCoreValues(coreValues.filter((v) => v !== val));
    };

    return (
        <div className={styles.wrapper}>
            <label className={styles.label}>1. Core Values (Key Press Enter)</label>
            <div className={styles.inputContainer}>
                {coreValues.map((value, idx) => (
                    <span
                        key={value}
                        className={styles.tag}
                        style={{ backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length] }}
                    >
                        {value}
                        <button onClick={() => removeValue(value)} className={styles.removeBtn}>
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    className={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={coreValues.length === 0 ? "e.g. Move Fast" : "Add another..."}
                    autoFocus
                />
                <button
                    className={styles.addBtn}
                    onClick={() => inputValue.trim() && addValue(inputValue.trim())}
                    disabled={!inputValue.trim()}
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}

export const PRESET_COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)',
    '#FF5A5F', // Airbnb Red
    '#00A699', // Cyan
    '#767676', // Grey
    '#7B00FF', // Purple
    '#FF00D6', // Pink
];

export function getColorForValue(value: string, allValues: string[]) {
    const index = allValues.indexOf(value);
    if (index === -1) return PRESET_COLORS[0];
    return PRESET_COLORS[index % PRESET_COLORS.length];
}

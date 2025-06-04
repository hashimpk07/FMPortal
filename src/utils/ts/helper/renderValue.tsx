function renderValue(value: unknown): React.ReactNode {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (Array.isArray(value)) return value.map(renderValue).join(', ');
    if (typeof value === 'object') {
        if ('name' in value && typeof (value as any).name === 'string') return (value as any).name;
        if ('id' in value && 'type' in value) return `${(value as any).type} #${(value as any).id}`;
        return JSON.stringify(value);
    }
    return String(value);
}

export default renderValue;

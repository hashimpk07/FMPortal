import SAFE_COLOR_PAIRS from '../../constants/safeColorPairs';

interface AvatarProps {
    name: string;
    email: string;
    size?: number;
    className?: string;
}

function getInitials(name: string): string {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0][0]?.toUpperCase() || '';
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getColorIndex(name: string, email: string, colorCount: number): number {
    if (!name && !email) return 0;
    const str = `${name}:${email}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % colorCount;
}

function Avatar({ name, email, size = 40, className = '' }: AvatarProps) {
    if (!name && !email) return null;
    const initials = getInitials(name);
    const colorIndex = getColorIndex(name, email, SAFE_COLOR_PAIRS.length);
    const { backgroundColor, color } = SAFE_COLOR_PAIRS[colorIndex];

    return (
        <span
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor,
                color,
                width: size,
                height: size,
                fontSize: size * 0.45,
                borderRadius: '50%',
                fontWeight: 700,
                userSelect: 'none',
            }}
            aria-label={name}
            role="img"
            title={name}
            data-testid="avatar"
        >
            {initials}
        </span>
    );
}

export default Avatar;

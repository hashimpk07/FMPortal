export const getAvatarInitials = (value: string) => {
    if (!value) {
        return '';
    }
    const names = value.toUpperCase().split(' ');
    return `${names[0].charAt(0)}${names[1]?.charAt(0) || ''}`;
};

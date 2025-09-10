import React from "react";

interface AvatarProps {
    name: string;
    size?: number;
    className?: string;
}

export default function Avatar({ name, size = 40, className = "" }: AvatarProps) {
    // Generate initials from name
    const initials = name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Generate a consistent color based on the name
    const getColorFromName = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 60%, 50%)`;
    };

    const backgroundColor = getColorFromName(name);

    return (
        <div
            className={`inline-flex items-center justify-center rounded-full text-white font-semibold ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor,
                fontSize: `${size * 0.4}px`,
            }}
        >
            {initials}
        </div>
    );
}

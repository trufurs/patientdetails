import React, { useState } from "react";
import Image from "next/image";
import Avatar from "./Avatar";

interface SafeImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

export default function SafeImage({
    src,
    alt,
    width,
    height,
    className = ""
}: SafeImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (hasError || !src || src.toLowerCase() === "null") {
        // Use Avatar component as fallback
        return (
            <Avatar
                name={alt}
                size={Math.max(width, height)}
                className={className.replace(/w-\d+|h-\d+/g, '')} // Remove width/height classes
            />
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div
                    className={`${className} bg-gray-200 animate-pulse`}
                    style={{ width: `${width}px`, height: `${height}px` }}
                />
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                onLoad={() => setIsLoading(false)}
                unoptimized // This helps with external images that might have CORS issues
                priority={false} // Don't prioritize loading to avoid timeout issues
            />
        </div>
    );
}

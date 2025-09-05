import { useState, useEffect } from "react";
import { HourglassIcon, HourglassHighIcon, HourglassMediumIcon, HourglassLowIcon } from "@phosphor-icons/react";

export function MyLinksLoading() {
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    const icons = [ HourglassIcon, HourglassHighIcon, HourglassMediumIcon, HourglassLowIcon ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIconIndex((prevIndex) => 
                (prevIndex + 1) % icons.length
            );
        }, 750); // 1000ms = 1 segundo
        
        return () => clearInterval(interval);
    }, [icons.length]);

    const CurrentIcon = icons[currentIconIndex];

    return (
        <div className="flex flex-col items-center justify-center text-gray-500 text-center py-8">
            <CurrentIcon size={32} className="mt-4" />
            <div className="text-xs uppercase mt-4 mb-12">Verificando se há links cadastrados</div>
        </div>
    )
}
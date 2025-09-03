import { LinkIcon } from "@phosphor-icons/react";

export function MyLinksEmpty() {
    return (
        <div className="flex flex-col items-center justify-center text-gray-500 text-center py-8">
            <LinkIcon size={32} className="mt-4" />
            <div className="text-xs uppercase mt-4 mb-12">Ainda não existem links cadatrados</div>
        </div>
    )
}
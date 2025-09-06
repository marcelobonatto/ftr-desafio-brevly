import type { Link } from "@/types/Link"
import { Button } from "@/components/ui/button"
import { CopyIcon, TrashIcon } from "@phosphor-icons/react"

interface MyLinksItemListProps {
    link: Link
}

export function MyLinksListItem({ link }: MyLinksItemListProps) {
    return (
        <li className="border-0 border-b-2 p-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                <div className="min-w-0">
                    <p className="truncate">
                        <a href={`${import.meta.env.VITE_FRONTEND_URL}/${link.short}`}
                           className="my-text-md overflow-hidden text-ellipsis text-blue-800 hover:text-blue-900">
                            <strong>brev.ly/{link.short}</strong>
                        </a>
                    </p>
                    <p className="truncate my-text-sm">{link.original}</p>
                </div>
                <div className="my-text-sm whitespace-nowrap text-right my-auto">
                    {link.accesses} acesso{ link.accesses == 1 ? '' : 's'}
                </div>
                <div>
                    <Button variant="outline" size="icon" className="mr-2 bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none">
                        <CopyIcon size={16} />
                    </Button>
                    <Button variant="outline" size="icon" className="bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none">
                        <TrashIcon size={16} />
                    </Button>
                </div>
            </div>
        </li>
    )
}
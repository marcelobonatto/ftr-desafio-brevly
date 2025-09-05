import { useLinkStore } from "@/store/useLinks"
import { useEffect } from "react"
import { MyLinksLoading } from "@/components/my-links-loading"
import { MyLinksEmpty } from "@/components/my-links-empty"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from "./ui/button"
import { CopyIcon, TrashIcon } from "@phosphor-icons/react"

export function MyLinksList() {
    const { links, loading, error, fetchLinks } = useLinkStore()

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if (loading) return <MyLinksLoading />
    if (links.length == 0) return <MyLinksEmpty />

    return (
        <ScrollArea className="w-full">
            <ul className="mt-0">
            {links.map((link) => (
                <li key={link.id} className="border-0 border-b-2 p-2">
                    <div className="grid grid-cols-[1fr_max-content_max-content">
                        <div>
                            <p className="truncate">
                                <a href={`${import.meta.env.VITE_FRONTEND_URL}/${link.short}`}
                                className="overflow-hidden text-ellipsis text-blue-800 hover:text-blue-900 text-lg font-semibold">
                                    <strong>brev.ly/{link.short}</strong>
                                </a>
                            </p>
                            <p className="truncate text-sm">{link.original}</p>
                        </div>
                        <div className="text-sm ml-auto">
                            {link.accesses} acesso{ link.accesses == 1 ? '' : 's'}
                        </div>
                        <div className="ml-auto">
                            <Button variant="outline" size="icon" className="mr-2 bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none">
                                <CopyIcon size={16} />
                            </Button>
                            <Button variant="outline" size="icon" className="bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none">
                                <TrashIcon size={16} />
                            </Button>
                        </div>
                    </div>
                </li>
            ))}
            </ul>
        </ScrollArea>
    )
}
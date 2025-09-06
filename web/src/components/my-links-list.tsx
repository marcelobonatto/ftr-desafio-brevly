import { useLinkStore } from "@/store/useLinks"
import { useEffect } from "react"
import { MyLinksLoading } from "@/components/my-links-loading"
import { MyLinksEmpty } from "@/components/my-links-empty"
import { ScrollArea } from '@/components/ui/scroll-area'
import { MyLinksListItem } from "@/components/my-links-list-item"

export function MyLinksList() {
    const { links, loading, error, fetchLinks } = useLinkStore()

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if (loading) return <MyLinksLoading />
    if (links.length == 0) return <MyLinksEmpty />

    return (
        <ScrollArea className="w-full h-full">
            <ul className="mt-0">
            {links.map((link) => (
                <MyLinksListItem link={link} key={link.id} />
            ))}
            </ul>
        </ScrollArea>
    )
}
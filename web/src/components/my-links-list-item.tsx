import type { Link } from "@/types/Link"
import { Button } from "@/components/ui/button"
import { CopyIcon, TrashIcon } from "@phosphor-icons/react"
import { toast } from "sonner";
import { useLinkStore } from "@/store/useLinks";

interface MyLinksItemListProps {
    link: Link
}

export function MyLinksListItem({ link }: MyLinksItemListProps) {
    const { deleteLink, loading, error } = useLinkStore()

    async function onCopyToClipboard() {
        try {
            await navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_URL}/${link.short}`);
            toast.success('Link copiado com sucesso!')
        } catch (error) {
            toast.error('Ocorreu um erro ao copiar o link: ' + (error || 'Erro desconhecido'))
        }
    }

    async function onDeleteLink(id: string) {
        await deleteLink(id)

        if (error)
            toast.error('Ocorreu um erro ao excluir o link: ' + (error || 'Erro desconhecido'))
        else {
            toast.success('Link excluído com sucesso!')
        }
    }

    return (
        <li className="border-0 border-b-2 p-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                <div className="min-w-0">
                    <p className="truncate">
                        <a href={`${import.meta.env.VITE_FRONTEND_URL}/${link.short}`}
                           className="my-text-md overflow-hidden text-ellipsis text-blue-800 hover:text-blue-900"
                           target="_blank">
                            <strong>brev.ly/{link.short}</strong>
                        </a>
                    </p>
                    <p className="truncate my-text-sm">{link.original}</p>
                </div>
                <div className="my-text-sm whitespace-nowrap text-right my-auto">
                    {link.accesses} acesso{ link.accesses == 1 ? '' : 's'}
                </div>
                <div>
                    <Button variant="outline" size="icon" 
                            className="mr-2 bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none"
                            onClick={onCopyToClipboard}>
                        <CopyIcon size={16} />
                    </Button>
                    <Button variant="outline" size="icon" 
                            className="bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none"
                            onClick={() => onDeleteLink(link.id)} disabled={loading}>
                        <TrashIcon size={16} />
                    </Button>
                </div>
            </div>
        </li>
    )
}
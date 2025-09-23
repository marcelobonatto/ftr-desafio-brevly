import { useLinkStore } from "@/store/useLinks";
import { useEffect } from "react";
import { MyLinksLoading } from "@/components/my-links-loading";
import { MyLinksEmpty } from "@/components/my-links-empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MyLinksListItem } from "@/components/my-links-list-item";

export function MyLinksList() {
  const { links, loading, fetchLinks } = useLinkStore();

  useEffect(() => {
    fetchLinks();
    function handleStorage(event: StorageEvent) {
      if (event.key === "links-updated") {
        fetchLinks();
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchLinks]);

  if (loading) return <MyLinksLoading />;
  if (links.length == 0) return <MyLinksEmpty />;

  return (
    <ScrollArea className="w-full h-full max-h-[280px]">
      <ul className="mt-0">
        {links.map((link) => (
          <MyLinksListItem link={link} key={link.id} />
        ))}
      </ul>
    </ScrollArea>
  );
}

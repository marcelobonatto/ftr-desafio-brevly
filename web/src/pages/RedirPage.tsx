import { NotFoundScreen } from "@/components/not-found-screen";
import { RedirScreen } from "@/components/redir-screen";
import { useLinkStore } from "@/store/useLinks";
import type { Link } from "@/types/Link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

export function RedirPage() {
  const { short } = useParams<{ short: string }>();
  const { selectByShort, updateAccesses, links, loading, error } =
    useLinkStore();


  useEffect(() => {
    if (short) {
      selectByShort(short!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [short]); // selectByShort is stable from zustand, safe to omit

  // Guarda o último foundLink válido para evitar sumiço durante update
  const [lastValidLink, setLastValidLink] = useState<Link | null>(null);
  const foundLink = links.find((link) => link.short === short);

  useEffect(() => {
    if (foundLink) setLastValidLink(foundLink);
  }, [foundLink]);

  // Para evitar múltiplos redirecionamentos/updates
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (lastValidLink && !hasRedirected.current) {
      hasRedirected.current = true;
      (async () => {
        await updateAccesses(lastValidLink.id);
        localStorage.setItem("links-updated", Date.now().toString());
        setTimeout(() => {
          window.location.assign(lastValidLink.original);
        }, 1000);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastValidLink]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-80 max-w-5xl max-h-72 bg-white py-12 px-5 md:py-16 md:px-12">
      {(!loading && error) ?
        <NotFoundScreen /> :
        <RedirScreen original={lastValidLink?.original ?? ""} />
      }
    </div>
  )
}

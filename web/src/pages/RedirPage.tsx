import { NotFoundScreen } from "@/components/not-found-screen";
import { RedirScreen } from "@/components/redir-screen";
import { useLinkStore } from "@/store/useLinks";
import type { Link } from "@/types/Link";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export function RedirPage() {
  const { short } = useParams<{ short: string }>();
  const { selectByShort, updateAccesses, links, loading, error } =
    useLinkStore();

  useEffect(() => {
    if (short) {
      selectByShort(short!);
    }
  }, [selectByShort, short]);

  const foundLink = links.find((link) => link.short === short);

  useEffect(() => {
    if (foundLink) {
      updateAccesses(foundLink.id);
      window.location.href = foundLink.original;
    }
  }, [foundLink, updateAccesses]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-80 max-w-5xl max-h-72 bg-white py-12 px-5 md:py-16 md:px-12">
        <RedirScreen />
      </div>
    );
  }

  if (error || !foundLink) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-80 max-w-5xl max-h-72 bg-white py-12 px-5 md:py-16 md:px-12">
        <NotFoundScreen />
      </div>
    );
  }

  // 3. Estado Encontrado (renderiza enquanto o useEffect acima redireciona)
  return (
    <div className="flex flex-col items-center justify-center w-full h-80 max-w-5xl max-h-72 bg-white py-12 px-5 md:py-16 md:px-12">
      <RedirScreen original={foundLink.original} />
    </div>
  );
}

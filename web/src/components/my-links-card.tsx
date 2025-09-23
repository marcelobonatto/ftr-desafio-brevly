import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MyLinksList } from "./my-links-list";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useState } from "react";

export function MyLinksCard() {
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadCsv() {
    try {
      setDownloading(true);
      const url = await api.exportLinksToCsv();
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao exportar CSV");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <h1 className="my-text-xl">Meus Links</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 my-text-sm-semi bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none"
            onClick={handleDownloadCsv}
            disabled={downloading}
          >
            <DownloadSimpleIcon size={16} />{" "}
            {downloading ? "Gerando..." : "Baixar CSV"}
          </Button>
        </div>
        <hr />
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <MyLinksList />
      </CardContent>
    </Card>
  );
}

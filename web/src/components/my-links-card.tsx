import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MyLinksList } from "./my-links-list";

export function MyLinksCard() {
    return (
        <Card className="w-full md:w-3/5 flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="my-text-xl">Meus Links</h1>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 my-text-sm-semi bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none">
                        <DownloadSimpleIcon size={16} /> Baixar CSV
                    </Button>
                </div>
                <hr />
            </CardHeader>
            {/* <CardContent className="flex-1 min-h-0"> */}
            <CardContent className="flex-1 min-h-0">
                <MyLinksList />
            </CardContent>
        </Card>
    )
}
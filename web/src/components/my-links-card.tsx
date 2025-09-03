import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MyLinksEmpty } from "./my-links-empty";

export function MyLinksCard() {
    return (
        <Card className="w-full md:w-3/5">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl leading-8 font-bold">Meus Links</h1>
                    <Button variant="outline" size="sm" className="text-xs flex items-center gap-2 bg-gray-200 text-gray-500 border-2 border-transparent hover:bg-gray-200 hover:border-blue-800 rounded-none">
                        <DownloadSimpleIcon size={16} /> Baixar CSV
                    </Button>
                </div>
                <hr />
            </CardHeader>
            <CardContent>
                <MyLinksEmpty />
            </CardContent>
        </Card>
    )
}
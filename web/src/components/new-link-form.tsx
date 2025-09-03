import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function NewLinkForm() {
    return (
        <Card className="w-full md:w-2/5 mb-4 md:mb-0">
            <CardHeader>
                <h1 className="text-xl leading-8 font-bold">Novo Link</h1>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 focus-within:text-blue-800 transition-colors duration-200">
                    <Label htmlFor="original" className="text-xs leading-3.5 uppercase block">Link Original</Label>
                    <Input type="url" id="original" className="focus-visible:border-blue-800 focus-visible:ring-2 focus-visible:ring-ring" placeholder="www.exemplo.com.br" />
                </div>
                <div className="flex flex-col gap-2 focus-within:text-blue-800 transition-colors duration-200">
                    <Label htmlFor="short" className="text-xs leading-3.5 uppercase block">Link Original</Label>
                    <Input type="text" id="short" className="focus-visible:border-blue-800 focus-visible:ring-2 focus-visible:ring-ring" placeholder="brev.ly/" />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" size="lg" className="w-full bg-blue-800 hover:bg-blue-900 active:bg-blue-900 text-white">
                    Salvar Link
                </Button>
            </CardFooter>
        </Card>
    )
}
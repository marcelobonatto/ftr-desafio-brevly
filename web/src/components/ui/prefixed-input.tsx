import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PrefixedInputProps extends React.ComponentProps<"input"> {
    prefix: string;
}

const PrefixedInput = React.forwardRef<HTMLInputElement, PrefixedInputProps>(
    ({ className, prefix, ...props }, ref) => {
        return (
            // 1. O container que simula o componente Input
            // Ele usa `focus-within` para aplicar o anel de foco quando o Input interno é focado.
            <div className={cn("flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-offsite-2", className)}>
                {/* 2. O prefixo não editável */}
                {/* Usamos `text-muted-foreground` para dar a cor de placeholder */}
                <span className="text-muted-foreground">{ prefix }</span>

                {/* 3. O Input real, com todos os seus estilo padrão removidos */}
                {/* Ele se expande para preencher o espaço restante */}
                <Input className="h-auto flex-grow border-0 bg-transparent p-0 shadow-none ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                       ref={ref} {...props} />
            </div>
        )
    }
);

PrefixedInput.displayName = "PrefixedInput";

export { PrefixedInput }
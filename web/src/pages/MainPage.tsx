import { MyLinksCard } from "@/components/my-links-card";
import { NewLinkForm } from "@/components/new-link-form";

export function MainPage() {
    return (
        <div className="w-full max-w-5xl flex flex-col">
            {/* Logo */}
            <img src="/img/Logo.svg" alt="Brev.ly" className="w-36 mb-4 mx-auto sm:mx-0" />

            {/* Layout responsivo */}
            <div className="flex flex-col md:flex-row md:gap-4 flex-1">
                {/* Form fixo em cima */}
                <div className="flex-shrink-0 md:basis-2/5">
                    <NewLinkForm />
                </div>

                {/* Lista que rola no espaço restante */}
                <div className="flex-1 md:basis-3/5 flex">
                    <MyLinksCard />
                </div>
            </div>
        </div>
    )
}
import { MyLinksCard } from "./my-links-card";
import { NewLinkForm } from "./new-link-form";

export function BrevlyForm() {
    return (
        <div className="w-full max-w-5xl">
            <img src="/img/Logo.svg" alt="Brev.ly" className="w-36 mb-4 mx-auto sm:mx-0" />
            <div className="w-full flex flex-col md:flex-row md:gap-4">
                <NewLinkForm />
                <MyLinksCard />
            </div>
        </div>
    )
}
export function NotFoundScreen() {
  return (
    <>
      <img src="/img/404.svg" alt="Brev.ly" className="w-48 h-20 mb-4" />
      <h1 className="my-text-xl mb-2">Link não encontrado</h1>
      <p className="mb-1 text-center max-w-[500px] mx-auto">
        O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
        <span className="block md:inline">
          {" "}Saiba mais em{" "}
          <a href={import.meta.env.VITE_FRONTEND_URL} className="underline text-blue-800 hover:text-blue-900 hover:font-bold">
            brev.ly
          </a>.
        </span>
      </p>
    </>
  )
}

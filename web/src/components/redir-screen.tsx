interface RedirScreenProps {
  original: string;
}

//export function RedirScreen({ original }: RedirScreenProps) {
export function RedirScreen() {
  return (
    <>
      <img src="/img/Logo_Icon.svg" alt="Brev.ly" className="w-12 h-12 mb-4" />
      <h1 className="my-text-xl mb-2">Redirecionando</h1>
      <p className="mb-1 text-center">
        O link será aberto automaticamente em alguns instantes.
      </p>
      <p>
        Não foi redirecionado?{" "}
        <a
          href="#"
          className="underline text-blue-800 hover:text-blue-900 hover:font-bold"
        >
          Acesse aqui
        </a>
      </p>
    </>
  );
}

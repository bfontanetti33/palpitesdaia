export function Footer() {
  return (
    <footer className="border-t border-border mt-16 pb-24 md:pb-10">
      <div className="container-app py-10 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
          <a href="#" className="hover:text-foreground">Termos de uso</a>
          <a href="#" className="hover:text-foreground">Política de privacidade</a>
          <a href="#" className="hover:text-foreground">Jogue com responsabilidade</a>
        </div>
        <p className="text-xs leading-relaxed max-w-3xl">
          Este site é apenas para fins informativos. As análises são geradas por inteligência artificial
          com base em dados estatísticos e não representam garantia de resultado. Aposte com responsabilidade.
          <strong className="block mt-1 text-foreground">Proibido para menores de 18 anos.</strong>
        </p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} Palpites da I.A — Análise inteligente de futebol.</p>
      </div>
    </footer>
  );
}

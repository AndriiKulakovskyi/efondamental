export function AppFooter() {
  return (
    <footer className="border-t border-[#E3E8F0] bg-white/80 backdrop-blur-sm py-3 px-12 flex-shrink-0">
      <div className="w-full flex items-center justify-between text-sm text-[#62748E]">
        <p>© 2026 Fondation FondaMental • Réseau de Centres Experts</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#314158] transition-colors">Aide</a>
          <a href="#" className="hover:text-[#314158] transition-colors">Contact</a>
          <a href="#" className="hover:text-[#314158] transition-colors">Confidentialité</a>
        </div>
      </div>
    </footer>
  );
}


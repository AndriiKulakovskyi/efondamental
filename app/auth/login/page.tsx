import { LoginForm } from "@/components/login-form";
import { AppFooter } from "@/components/ui/app-footer";

export default function Page() {
  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-12 py-8 overflow-hidden">
        <div className="w-full h-full flex items-center" style={{ paddingRight: "10%" }}>
          <div className="flex-1 relative h-full flex items-center">
            <div className="absolute top-1/3 left-0 -translate-y-1/2 w-[536px] h-[700px] bg-gradient-to-br from-[#FF6467] to-[#FF8904] rounded-full blur-[128px] opacity-60 pointer-events-none" />
            
            <div className="relative z-10 space-y-8 max-w-[500px]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-bold text-[#0E1729]">Fondation</h1>
                  <h1 className="text-5xl font-bold text-[#E7000B]">FondaMental</h1>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-[#0E1729] leading-tight">
                  Bienvenue sur la plateforme
                </h2>

                <div className="space-y-6">
                  <p className="text-lg text-[#45566C] leading-relaxed">
                  Accédez aux applications spécialisées des Centres Experts FondaMental pour le suivi des pathologies psychiatriques.
                  </p>

                  <div className="space-y-3 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#E7000B] flex-shrink-0" />
                      <p className="text-base text-[#314158]">eBipolar - Troubles bipolaires</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#009966] flex-shrink-0" />
                      <p className="text-base text-[#314158]">eSchizo - Schizophrénie</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#9810FA] flex-shrink-0" />
                      <p className="text-base text-[#314158]">Asperger - Troubles autistiques</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#F54900] flex-shrink-0" />
                      <p className="text-base text-[#314158]">eCedr - Dépression résistante</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end ml-12">
            <LoginForm />
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

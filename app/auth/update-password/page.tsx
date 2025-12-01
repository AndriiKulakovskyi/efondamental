import { UpdatePasswordForm } from "@/components/update-password-form";
import { AppFooter } from "@/components/ui/app-footer";

export default function Page() {
  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-12 py-8 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex-1 relative h-full flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[536px] h-[700px] bg-gradient-to-br from-[#FF6467] to-[#FF8904] rounded-full blur-[128px] opacity-40 pointer-events-none" />
            
            <div className="relative z-10">
              <UpdatePasswordForm />
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

import { MagicLinkForm } from "@/components/magic-link-form";

export default function MagicLinkPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <MagicLinkForm />
      </div>
    </div>
  );
}


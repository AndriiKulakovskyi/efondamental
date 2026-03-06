import { notFound } from "next/navigation";
import { MiniMatrixPreviewClient } from "./preview-client";

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <MiniMatrixPreviewClient />;
}


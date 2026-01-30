import { NextRequest, NextResponse } from "next/server";
import { requireProfessional } from "@/lib/rbac/middleware";

const EXTERNAL_API_URL = "https://medicaments-api.giygas.dev";

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const cis = searchParams.get("cis");

  try {
    // Basic auth check
    await requireProfessional();
    
    let endpoint = "";
    
    if (query) {
      // Search by name
      endpoint = `/medicament/${encodeURIComponent(query)}`;
    } else if (cis) {
      // Get by CIS
      endpoint = `/medicament/id/${cis}`;
    } else {
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    // Forward request to external API with explicit headers to avoid blocking
    console.log(`[Medication Proxy] Fetching: ${EXTERNAL_API_URL}${endpoint}`);
    
    const response = await fetch(`${EXTERNAL_API_URL}${endpoint}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    console.log(`[Medication Proxy] Upstream status: ${response.status}`);

    if (response.status === 404 || response.status === 400) {
       // 404: Not found, 400: Bad request (query too short)
       return NextResponse.json([]);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Medication Proxy] Upstream error: ${errorText}`);
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Medication proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch medication data" }, 
      { status: 500 }
    );
  }
}

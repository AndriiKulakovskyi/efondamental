import { NextRequest, NextResponse } from "next/server";
import { getUserContext } from "@/lib/rbac/middleware";
import { getPatientsByCenter } from "@/lib/services/patient.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const context = await getUserContext();
    
    if (!context || !context.profile.center_id) {
      return NextResponse.json(
        { error: "Unauthorized or no center assigned" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "patients";
    const format = searchParams.get("format") || "csv";

    const supabase = await createClient();

    let csvContent = "";
    let filename = `${type}-${new Date().toISOString().split("T")[0]}.csv`;

    if (type === "patients") {
      const patients = await getPatientsByCenter(context.profile.center_id);
      
      // CSV Headers
      csvContent = "MRN,First Name,Last Name,Date of Birth,Gender,Pathology,Status,Created Date\n";
      
      // CSV Rows
      patients.forEach((patient) => {
        csvContent += `"${patient.medical_record_number}","${patient.first_name}","${patient.last_name}","${patient.date_of_birth}","${patient.gender || ""}","${patient.pathology_name}","${patient.active ? "Active" : "Inactive"}","${new Date(patient.created_at).toLocaleDateString()}"\n`;
      });
    } else if (type === "visits") {
      const { data: visits } = await supabase
        .from("v_visits_full")
        .select("*")
        .eq("patient_id", await getPatientIdsByCenter(context.profile.center_id, supabase))
        .order("scheduled_date", { ascending: false });

      csvContent = "Visit ID,Patient Name,MRN,Visit Type,Scheduled Date,Status,Conducted By\n";
      
      visits?.forEach((visit: any) => {
        csvContent += `"${visit.id}","${visit.patient_first_name} ${visit.patient_last_name}","${visit.medical_record_number}","${visit.visit_type}","${visit.scheduled_date || ""}","${visit.status}","${visit.conducted_by_first_name || ""} ${visit.conducted_by_last_name || ""}"\n`;
      });
    } else if (type === "statistics") {
      const { data: patients } = await supabase
        .from("patients")
        .select("pathology_id, active")
        .eq("center_id", context.profile.center_id);

      csvContent = "Metric,Value\n";
      csvContent += `"Total Patients","${patients?.length || 0}"\n`;
      csvContent += `"Active Patients","${patients?.filter((p) => p.active).length || 0}"\n`;
      csvContent += `"Export Date","${new Date().toISOString()}"\n`;
    }

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Export failed:", error);
    return NextResponse.json(
      { error: error.message || "Export failed" },
      { status: 500 }
    );
  }
}

async function getPatientIdsByCenter(centerId: string, supabase: any): Promise<string[]> {
  const { data: patients } = await supabase
    .from("patients")
    .select("id")
    .eq("center_id", centerId);
  
  return patients?.map((p: any) => p.id) || [];
}


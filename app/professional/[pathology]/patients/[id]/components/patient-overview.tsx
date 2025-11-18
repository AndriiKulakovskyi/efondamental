"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Mail, Phone, MapPin, Users, Heart } from "lucide-react";
import { formatShortDate, calculateAge } from "@/lib/utils/date";

interface PatientOverviewProps {
  patient: any;
}

export function PatientOverview({ patient }: PatientOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-700" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex items-start gap-3 group">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {patient.first_name} {patient.last_name}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {formatShortDate(patient.date_of_birth)}
                  <span className="text-slate-500 ml-2">({calculateAge(patient.date_of_birth)} years old)</span>
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <Users className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gender</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5 capitalize">
                  {patient.gender || "Not specified"}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <Heart className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pathology</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {patient.pathology_name}
                </dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-slate-700" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex items-start gap-3 group">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5 break-all">
                  {patient.email || "Not provided"}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {patient.phone || "Not provided"}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3 group">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Address</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {patient.address || "Not provided"}
                </dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      {patient.emergency_contact && (
        <Card className="md:col-span-2 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-700" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</dt>
                  <dd className="text-sm text-slate-900 font-medium mt-0.5">
                    {patient.emergency_contact.name}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</dt>
                  <dd className="text-sm text-slate-900 font-medium mt-0.5">
                    {patient.emergency_contact.phone}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">Relationship</dt>
                  <dd className="text-sm text-slate-900 font-medium mt-0.5 capitalize">
                    {patient.emergency_contact.relationship}
                  </dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


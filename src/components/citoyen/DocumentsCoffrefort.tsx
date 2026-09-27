"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Download,
  ExternalLink,
  Landmark,
  Coins,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  FileCheck2,
  Lock,
} from "lucide-react";
import { CitoyenDocument } from "./citoyen-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DocumentsCoffrefortProps {
  documents: CitoyenDocument[];
  onSelectDocument: (doc: CitoyenDocument) => void;
}

export function DocumentsCoffrefort({ documents, onSelectDocument }: DocumentsCoffrefortProps) {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) => {
    const matchesType =
      filterType === "ALL" ||
      (filterType === "CERTIFICAT" && (doc.type === "CERTIFICAT_COMMUNAL" || doc.type === "TITRE_CADASTRAL")) ||
      (filterType === "TRESOR" && doc.type === "QUITTANCE_TRESOR") ||
      (filterType === "BORNAGE" && doc.type === "PV_BORNAGE") ||
      (filterType === "CONVENTION" && (doc.type === "CONVENTION" || doc.type === "CARNET_FONCIER"));

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      doc.titre.toLowerCase().includes(query) ||
      doc.referenceOfficielle.toLowerCase().includes(query) ||
      doc.parcelleCode.toLowerCase().includes(query) ||
      doc.signataireNom.toLowerCase().includes(query);

    return matchesType && matchesQuery;
  });

  const getTypeIcon = (type: CitoyenDocument["type"]) => {
    switch (type) {
      case "CERTIFICAT_COMMUNAL":
        return <Landmark className="w-4 h-4 text-emerald-400" />;
      case "QUITTANCE_TRESOR":
        return <Coins className="w-4 h-4 text-amber-400" />;
      case "PV_BORNAGE":
        return <MapPin className="w-4 h-4 text-purple-400" />;
      case "CONVENTION":
        return <FileCheck2 className="w-4 h-4 text-blue-400" />;
      case "CARNET_FONCIER":
        return <HeartHandshake className="w-4 h-4 text-pink-400" />;
      default:
        return <FileText className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeBadgeVariant = (type: CitoyenDocument["type"]): "success" | "secondary" | "warning" | "outline" => {
    switch (type) {
      case "CERTIFICAT_COMMUNAL":
      case "TITRE_CADASTRAL":
        return "success";
      case "QUITTANCE_TRESOR":
        return "warning";
      case "PV_BORNAGE":
      case "CONVENTION":
      case "CARNET_FONCIER":
      default:
        return "secondary";
    }
  };

  return (
    <Card className="border-border shadow-xl bg-card">
      <CardHeader className="p-5 sm:p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Coffre-fort Numérique : Mes Documents Fonciers &amp; Actes Officiels
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Accédez à l&apos;intégralité de vos titres, certificats communaux, quittances TrésorPay, procès-verbaux de bornage et conventions scellés avec empreinte SHA-256.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold">
              {documents.length} acte{documents.length > 1 ? "s" : ""} scellé{documents.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Barre de recherche et filtres de catégories */}
        <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par référence, titre, parcelle (ex : CERTIF, OUI-0421, DGTCP)..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                filterType === "ALL"
                  ? "bg-purple-600 text-white"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Tous ({documents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("CERTIFICAT")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                filterType === "CERTIFICAT"
                  ? "bg-purple-600 text-white"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Titres &amp; Mairie
            </button>
            <button
              type="button"
              onClick={() => setFilterType("TRESOR")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                filterType === "TRESOR"
                  ? "bg-purple-600 text-white"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              TrésorPay
            </button>
            <button
              type="button"
              onClick={() => setFilterType("BORNAGE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                filterType === "BORNAGE"
                  ? "bg-purple-600 text-white"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Bornage GPS
            </button>
            <button
              type="button"
              onClick={() => setFilterType("CONVENTION")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                filterType === "CONVENTION"
                  ? "bg-purple-600 text-white"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Conventions &amp; Carnet
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-3">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 rounded-xl bg-background/50 border border-border text-center space-y-2">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-xs text-muted-foreground">Aucun document ne correspond aux critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-background/80 hover:bg-background border border-border hover:border-purple-500/50 transition-all flex flex-col justify-between gap-3 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-card border border-border/80 shrink-0">
                        {getTypeIcon(doc.type)}
                      </div>
                      <div>
                        <Badge variant={getTypeBadgeVariant(doc.type)} className="text-[10px] font-semibold">
                          {doc.typeLabel}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          Parcelle : <strong className="text-foreground font-mono">{doc.parcelleCode}</strong>
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {new Date(doc.dateEmission).toLocaleDateString("fr-BJ", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-xs leading-snug">{doc.titre}</h3>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/60">
                    <span className="font-mono text-foreground font-bold truncate max-w-[200px]">
                      {doc.referenceOfficielle}
                    </span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      SHA-256 : {doc.hashSha256.slice(0, 10)}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onSelectDocument(doc)}
                    className="flex-1 h-8 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Consulter l&apos;Acte Officiel</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectDocument(doc)}
                    aria-label={`Visualiser et imprimer l'acte ${doc.referenceOfficielle}`}
                    className="h-8 px-2.5 text-xs cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  Landmark,
  ShieldCheck,
  Bell,
  Users,
  HeartHandshake,
  CheckCircle2,
  UserCheck,
  MapPin,
  FileText,
  PlusCircle,
  AlertTriangle,
  Lock,
  Eye,
  Scale,
  FolderLock,
  Compass,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { anyigbaRepo } from "@/repositories/index";
import {
  getSituationDetailleeParcelle,
  getDocumentsOfficielsCitoyen,
  CitoyenDocument,
  SituationParcelleDiagnostic,
} from "@/components/citoyen/citoyen-data";
import { ParcelleSituationModal } from "@/components/citoyen/ParcelleSituationModal";
import { DocumentViewerModal } from "@/components/citoyen/DocumentViewerModal";
import { DocumentsCoffrefort } from "@/components/citoyen/DocumentsCoffrefort";

export default function CitoyenPage() {
  const { user } = useAuth();
  const [carnetSuccess, setCarnetSuccess] = useState(false);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [documents, setDocuments] = useState<CitoyenDocument[]>([]);
  const [showDeclareModal, setShowDeclareModal] = useState(false);

  // Modales d'interaction
  const [selectedParcelleForSituation, setSelectedParcelleForSituation] =
    useState<SituationParcelleDiagnostic | null>(null);
  const [selectedDocumentForViewer, setSelectedDocumentForViewer] = useState<CitoyenDocument | null>(null);

  // Formulaire de déclaration de parcelle
  const [newCode, setNewCode] = useState("");
  const [newCommune, setNewCommune] = useState("Ouidah");
  const [newArrondissement, setNewArrondissement] = useState("Pahou");
  const [newVillage, setNewVillage] = useState("Hounhanmèdji");
  const [newSuperficie, setNewSuperficie] = useState("1000");
  const [newStatut, setNewStatut] = useState<"COUTUMIER" | "TITRE_FONCIER" | "CPF">("COUTUMIER");
  const [declareSuccess, setDeclareSuccess] = useState<string | null>(null);

  // Ayants-droit personnalisés
  const [heritiers, setHeritiers] = useState<any[]>([
    { nom: "Blaise Dossou", qualite: "Héritier 1 - Quote-part 50%", statut: "Consentement Validé" },
    { nom: "Sophie Dossou", qualite: "Héritière 2 - Quote-part 50%", statut: "Consentement Validé" },
  ]);
  const [newHeritierNom, setNewHeritierNom] = useState("");
  const [newHeritierPart, setNewHeritierPart] = useState("50");

  const loadParcelles = () => {
    const all = anyigbaRepo.getAllParcelles();
    const userNpi = user?.npi || "FICTIF-BEN-2026-0041";
    const userParcelles = all.filter(
      (p) => p.proprietaireNpi === userNpi || (!user && p.proprietaireNpi === "FICTIF-BEN-2026-0041")
    );

    let resolvedParcelles = userParcelles;
    if (resolvedParcelles.length === 0 && user?.nom) {
      const byName = all.filter((p) => p.proprietaireNom.toLowerCase().includes(user.nom.toLowerCase()));
      resolvedParcelles = byName.length > 0 ? byName : all.slice(0, 1);
    } else if (resolvedParcelles.length === 0) {
      resolvedParcelles = all.slice(0, 1);
    }

    setParcelles(resolvedParcelles);

    // Chargement immédiat des actes officiels rattachés aux parcelles
    const codes = resolvedParcelles.map((p) => p.codeUnique);
    const docs = getDocumentsOfficielsCitoyen(userNpi, codes);
    setDocuments(docs);
  };

  useEffect(() => {
    loadParcelles();
  }, [user]);

  const handleDeclareParcelle = (e: React.FormEvent) => {
    e.preventDefault();
    const code =
      newCode.trim().toUpperCase() ||
      `PAR-${newCommune.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const created = anyigbaRepo.createParcelle({
      codeUnique: code,
      commune: newCommune,
      arrondissement: newArrondissement,
      village: newVillage,
      superficieM2: Number(newSuperficie),
      statutJuridique: newStatut,
      usage: "HABITATION",
      enVerrouMutation: false,
      enLitige: false,
      proprietaireNom: `${user?.prenom || "Germain"} ${user?.nom || "Dossou"}`,
      proprietaireNpi: user?.npi || "FICTIF-BEN-2026-0041",
      proprietaireTel: "+229 97 45 21 00",
      polygoneGeojson: {
        type: "Polygon",
        coordinates: [
          [
            [2.0815, 6.365],
            [2.083, 6.365],
            [2.083, 6.3665],
            [2.0815, 6.3665],
            [2.0815, 6.365],
          ],
        ],
      },
    });

    setDeclareSuccess(`Parcelle ${created.codeUnique} enregistrée avec succès au cadastre et rattachée à votre NPI.`);
    setShowDeclareModal(false);
    loadParcelles();
    setTimeout(() => setDeclareSuccess(null), 5000);
  };

  const handleAddHeritier = () => {
    if (!newHeritierNom.trim()) return;
    setHeritiers([
      ...heritiers,
      {
        nom: newHeritierNom.trim(),
        qualite: `Ayant-droit déclaré - Quote-part ${newHeritierPart}%`,
        statut: "Enregistré au carnet",
      },
    ]);
    setNewHeritierNom("");
  };

  const handleOpenSituation = (codeUnique: string) => {
    const diag = getSituationDetailleeParcelle(codeUnique);
    if (diag) {
      setSelectedParcelleForSituation(diag);
    }
  };

  const handleSelectDocumentByRef = (ref: string) => {
    const doc = documents.find(
      (d) =>
        d.referenceOfficielle.toUpperCase() === ref.toUpperCase() ||
        (d.quittanceTresorRef && d.quittanceTresorRef.toUpperCase() === ref.toUpperCase())
    );
    if (doc) {
      setSelectedParcelleForSituation(null);
      setSelectedDocumentForViewer(doc);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main
        id="main-content"
        className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise"
      >
        {/* En-tête Espace Citoyen dynamique */}
        <Card className="border-purple-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Espace Citoyen &amp; Patrimoine Foncier
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2.5">
                      {user ? `${user.prenom} ${user.nom}` : "Germain Dossou"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Consultation des parcelles enregistrées au cadastre national, diagnostic juridique certifié en direct,
                    coffre-fort numérique des actes officiels et carnet de famille foncier
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">NPI Citoyen (ANIP)</span>
                  <strong className="font-mono text-foreground">{user?.npi || "FICTIF-BEN-2026-0041"}</strong>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">
                    {user?.commune ? `${user.commune} (${user.departement})` : "Ouidah (Atlantique)"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {declareSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold leading-relaxed">{declareSuccess}</span>
          </div>
        )}

        {/* Grille principale : Parcelles & Carnet de famille */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Parcelles détenues (6 colonnes sur 12) */}
          <Card className="lg:col-span-6 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">Mes Parcelles Répertoriées</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Parcelles rattachées à votre Numéro Personnel d&apos;Identification (NPI).
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowDeclareModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer h-8"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Déclarer une Parcelle</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              {parcelles.map((p) => (
                <div key={p.codeUnique} className="p-4 rounded-xl bg-background/80 border border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-foreground text-sm sm:text-base">{p.codeUnique}</span>
                    <Badge
                      variant={p.statutJuridique === "TITRE_FONCIER" ? "success" : "outline"}
                      className="text-[10px] font-semibold"
                    >
                      {p.statutJuridique === "TITRE_FONCIER"
                        ? "Titre Foncier Immatriculé"
                        : p.statutJuridique === "CPF"
                        ? "Certificat CPF"
                        : "Certificat Coutumier Déclaré"}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Commune de {p.commune} &bull; Arr. {p.arrondissement} &bull; Village {p.village} &bull; Superficie certifiée :{" "}
                    <strong className="text-foreground font-mono">{p.superficieM2.toLocaleString()} m²</strong>
                  </p>

                  {p.enVerrouMutation && (
                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Verrou de mutation en cours (séquestre notarié activé)</span>
                    </div>
                  )}

                  {p.enLitige && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Gel conservatoire CSAF actif sur ce bien</span>
                    </div>
                  )}

                  {/* Bouton interactif de situation complète */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border/60">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenSituation(p.codeUnique)}
                      className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Consulter la situation complète</span>
                    </Button>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Zéro Litige CSAF
                      </span>
                      <span className="flex items-center gap-1 text-purple-400 font-semibold">
                        <Compass className="w-3 h-3" /> 4 Bornes GPS
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-border/40">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Bell className="w-3.5 h-3.5 text-secondary" /> Alerte SMS anti-spoliation active
                    </span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Registre d&apos;État certifié
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Carnet de famille foncier (6 colonnes sur 12) */}
          <Card className="lg:col-span-6 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Carnet de Famille Foncier</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-semibold">
                  Anticipation Successorale
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Consignez de votre vivant l&apos;accord de vos héritiers légitimes pour prévenir tout contentieux successoral
                devant la CSAF.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              {carnetSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-rise">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Carnet de famille actualisé et scellé au registre national avec l&apos;accord des ayants-droit.</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3.5">
                  <div className="font-semibold text-foreground text-xs">Ayants-droit Reconnus (Consentements ANIP vérifiés) :</div>
                  <ul className="space-y-2 text-[11px] text-muted-foreground">
                    {heritiers.map((h, i) => (
                      <li key={i} className="p-2 rounded-lg bg-card border border-border/60 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-foreground">{h.nom}</span>
                          <span className="text-[10px] text-muted-foreground ml-2">({h.qualite})</span>
                        </div>
                        <span className="text-emerald-500 font-semibold text-[10px]">{h.statut}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Ajout d'un ayant-droit */}
                  <div className="pt-2 border-t border-border flex items-center gap-2">
                    <Input
                      type="text"
                      value={newHeritierNom}
                      onChange={(e) => setNewHeritierNom(e.target.value)}
                      placeholder="Nom & prénom héritier..."
                      className="h-8 text-xs bg-card"
                    />
                    <Input
                      type="number"
                      value={newHeritierPart}
                      onChange={(e) => setNewHeritierPart(e.target.value)}
                      placeholder="%"
                      className="h-8 text-xs w-16 bg-card"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddHeritier}
                      className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shrink-0"
                    >
                      Ajouter
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setCarnetSuccess(true)}
                    className="w-full h-10 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer mt-2"
                  >
                    Sceller le Carnet Familial Numérique au Livre Foncier
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SECTION COFFRE-FORT NUMÉRIQUE : DOCUMENTS FONCIERS & ACTES OFFICIELS */}
        <DocumentsCoffrefort
          documents={documents}
          onSelectDocument={(doc) => setSelectedDocumentForViewer(doc)}
        />

        {/* Modal de situation détaillée de parcelle */}
        <ParcelleSituationModal
          diagnostic={selectedParcelleForSituation}
          onClose={() => setSelectedParcelleForSituation(null)}
          onSelectDocument={handleSelectDocumentByRef}
        />

        {/* Modal de visualisation immersive d'acte officiel */}
        <DocumentViewerModal
          document={selectedDocumentForViewer}
          onClose={() => setSelectedDocumentForViewer(null)}
        />

        {/* Modal de déclaration de parcelle */}
        {showDeclareModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-rise text-xs">
              <div className="flex items-center gap-2 text-purple-600">
                <PlusCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-foreground">Déclaration d&apos;une Nouvelle Parcelle</h3>
              </div>
              <p className="text-muted-foreground text-xs">
                Rattachez une parcelle déclarée à votre identifiant citoyen certifié <strong>{user?.npi || "BEN-0041"}</strong>.
              </p>

              <form onSubmit={handleDeclareParcelle} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Code ou Référence Parcelle</label>
                  <Input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ex: OUI-0550 (laisser vide pour génération automatique)"
                    className="h-9 text-xs font-mono uppercase bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold mb-1">Commune</label>
                    <Input
                      type="text"
                      value={newCommune}
                      onChange={(e) => setNewCommune(e.target.value)}
                      className="h-9 text-xs bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Arrondissement</label>
                    <Input
                      type="text"
                      value={newArrondissement}
                      onChange={(e) => setNewArrondissement(e.target.value)}
                      className="h-9 text-xs bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold mb-1">Superficie (m²)</label>
                    <Input
                      type="number"
                      value={newSuperficie}
                      onChange={(e) => setNewSuperficie(e.target.value)}
                      className="h-9 text-xs font-mono bg-background"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Statut Juridique</label>
                    <select
                      value={newStatut}
                      onChange={(e) => setNewStatut(e.target.value as any)}
                      className="w-full h-9 rounded-md border border-border bg-background px-3 text-xs"
                    >
                      <option value="COUTUMIER">Droit Coutumier</option>
                      <option value="CPF">Certificat de Propriété (CPF)</option>
                      <option value="TITRE_FONCIER">Titre Foncier</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeclareModal(false)}
                    className="text-xs cursor-pointer"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Valider l&apos;Enregistrement
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

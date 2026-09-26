/**
 * Dictionnaire phonétique et synthèses vocales pour l'accessibilité multilingue
 * (Français, Fongbe, Yoruba, Goun).
 */

export interface VoicePhrase {
  fr: string;
  fon: string;
  yo: string;
  ha?: string;
  audioSampleKey: string;
}

export const VOCAL_PHRASES: Record<string, VoicePhrase> = {
  parcelle_titre_foncier_valide: {
    fr: "Cette parcelle possède un Titre Foncier authentique et valide délivré par l'ANDF. Aucun litige enregistré.",
    fon: "Anyigba elɔ ɖó Titre Foncier gbéjinɔtɔ sín ANDF gɔ́n. Hlɔnhlɔn kpo avan ɖebú kún ɖ'é jí ó.",
    yo: "Ilẹ̀ yìí ní Ìwé Ẹ̀rí Ilẹ̀ tí ó fẹsẹ̀ múlẹ̀ láti ọwọ́ ANDF. Kò sí aáwọ̀ kankan lórí rẹ̀.",
    ha: "Wannan fili yana da cikakken takardar shaidar mallaka daga ANDF. Babu wani rikici.",
    audioSampleKey: "tf_valide",
  },
  parcelle_en_litige: {
    fr: "Attention : cette parcelle fait l'objet d'un litige actif devant la Cour Spéciale des Affaires Foncières (CSAF). Toute vente est interdite.",
    fon: "Hwɛndo ! Anyigba elɔ ɖó hwɛ ɖò kɔ́jí CSAF tɔn. È gbɛ́ vɔ́vɔ́ ɖɔ è ma sà ó.",
    yo: "Ìkìlọ̀ ! Ilẹ̀ yìí wà nínú ẹjọ́ ní Ilé Ẹjọ́ Ilẹ̀ CSAF. Ẹnikẹ́ni kò gbọdọ̀ tà á.",
    ha: "Hattara : Wannan fili yana da shari'a a gaban kotun CSAF. An haramta sayar da shi.",
    audioSampleKey: "litige_alerte",
  },
  parcelle_verrouillee: {
    fr: "Information : Une transaction de mutation notariée est actuellement en cours sur cette parcelle. Le verrou anti-double-vente est actif.",
    fon: "Nǔmɔmɔ : È ɖò anyigba elɔ sà wɛ dìn ɖò Notaire gɔ́n. È sɔ́ caca dó d'é jí bɔ mɛ ɖevo kún sixu sà gbeɖé ó.",
    yo: "Ìfitónilétí : Ìgbésẹ̀ títà ilẹ̀ yìí ń lọ lọ́wọ́ lọ́dọ̀ Notaire. Ààbò lórí rẹ̀ wà ní títìpa.",
    ha: "Sanarwa : Ana kan aiwatar da cinikin wannan fili a ofishin Notaire. An kulle shi don hana sayarwa sau biyu.",
    audioSampleKey: "verrou_actif",
  },
  convention_assistee_validee: {
    fr: "Témoignage du Chef de Village : Les limites de ce terrain ont été vérifiées et approuvées en présence de tous les voisins de bornes.",
    fon: "Tɔgbo tɔn gbe : È dɔn dogbó anyigba elɔ tɔn lɛ kpɔ́n bɔ tòxólɔ kpo akɔnta lɛ bǐ kplé bó yí gbe.",
    yo: "Ẹ̀rí Baálẹ̀ : A ti yẹ ààlà ilẹ̀ yìí wò níwájú àwọn aládùúgbò gbogbo.",
    ha: "Shaidar Mai Garin : An duba iyakokin wannan fili tare da amincewar dukkan makwabta.",
    audioSampleKey: "temoignage_chef",
  },
};

export function getAudioTranslation(key: string, lang: "fr" | "fon" | "yo" | "ha" = "fr"): string {
  const phrase = VOCAL_PHRASES[key];
  if (!phrase) return "";
  return (phrase as any)[lang] || phrase.fr;
}


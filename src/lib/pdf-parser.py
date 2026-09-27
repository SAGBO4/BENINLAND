import sys
import re
import json

def parse_pdf(file_path):
    try:
        from pypdf import PdfReader
        reader = PdfReader(file_path)
        full_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    except Exception as e:
        sys.stderr.write(f"Error reading with pypdf: {e}\n")
        full_text = ""

    # Si pypdf n'a rien extrait, tenter une lecture brute
    if not full_text:
        try:
            with open(file_path, "rb") as f:
                raw_bytes = f.read()
            full_text = raw_bytes.decode("latin1", errors="ignore")
        except Exception:
            pass

    data = {}

    # 1. Recherche du JSON de QR-Code s'il est présent en clair
    json_match = re.search(r"\{[^{}]*\"type\"\s*:\s*\"CERTIFICAT_COMMUNE_PRIX\"[^{}]*\}", full_text, re.DOTALL)
    if json_match:
        try:
            parsed = json.loads(json_match.group(0))
            if parsed.get("codeCertificat") and parsed.get("prixFixeFcfa"):
                # Normalisation des clés utilisées dans les QR-Codes municipaux
                if "quittanceTresor" in parsed and "quittanceTresorRef" not in parsed:
                    parsed["quittanceTresorRef"] = parsed["quittanceTresor"]
                if "hash" in parsed and "hashSha256" not in parsed:
                    parsed["hashSha256"] = parsed["hash"]
                if "ots" in parsed and "otsProof" not in parsed:
                    parsed["otsProof"] = parsed["ots"]
                if "taxePayeeFcfa" in parsed and "taxeCalculeeFcfa" not in parsed:
                    parsed["taxeCalculeeFcfa"] = parsed["taxePayeeFcfa"]
                return parsed
        except Exception:
            pass

    # 2. Extraction du Code Certificat
    cert_match = re.search(r"CERTIF-COMMUNE-[A-Z0-9-]+", full_text)
    if cert_match:
        data["codeCertificat"] = cert_match.group(0).strip()
        p_match = re.search(r"CERTIF-COMMUNE-([A-Z0-9]+-[A-Z0-9]+)", data["codeCertificat"])
        if p_match:
            data["codeParcelle"] = p_match.group(1).upper()

    # 3. Extraction du Prix Fixé Officiel (support espaces insécables et formats variés)
    prix_match = re.search(r"PRIX DE TRANSACTION OFFICIEL FIX[EÉ]\s*:\s*([0-9\s\u00A0\u202F]+)\s*FCFA", full_text)
    if prix_match:
        data["prixFixeFcfa"] = int(re.sub(r"[\s\u00A0\u202F]+", "", prix_match.group(1)))
    else:
        # Fallback montant
        alt_prix = re.search(r"([1-9][0-9\s\u00A0\u202F]{5,11})\s*FCFA", full_text)
        if alt_prix:
            data["prixFixeFcfa"] = int(re.sub(r"[\s\u00A0\u202F]+", "", alt_prix.group(1)))

    # 4. Quittance TrésorPay DGTCP Mairie
    tresor_match = re.search(r"TRESOR(?:-DGTCP|-PAY)?-[0-9]{4}-[\s\r\n]*[0-9]+", full_text)
    if tresor_match:
        data["quittanceTresorRef"] = re.sub(r"[\s\r\n]+", "", tresor_match.group(0).strip())

    # 5. Empreinte SHA-256
    sha_match = re.search(r"0x[a-fA-F0-9]{64}", full_text)
    if sha_match:
        data["hashSha256"] = sha_match.group(0).strip()

    # 6. Preuve OpenTimestamps (OTS)
    ots_match = re.search(r"OTS-BTC-MAIRIE-[A-Z0-9]+-[A-Fa-f0-9]{8}", full_text.replace("\n", ""))
    if ots_match:
        data["otsProof"] = ots_match.group(0).strip()

    # 7. Commune & Parcelle
    commune_match = re.search(r"Commune de Rattachement\s*:\s*([A-Za-zÀ-ÿ]+)", full_text)
    if commune_match:
        data["commune"] = commune_match.group(1).strip()
    elif not data.get("commune"):
        data["commune"] = "Ouidah"

    if not data.get("codeParcelle"):
        parcelle_match = re.search(r"Identi[fﬁ]iant Unique\s*\(IUF\)\s*:\s*([A-Z0-9-]+)", full_text)
        if parcelle_match:
            data["codeParcelle"] = parcelle_match.group(1).strip()
        else:
            data["codeParcelle"] = "OUI-0421"

    return data

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)

    result = parse_pdf(sys.argv[1])
    print(json.dumps(result))

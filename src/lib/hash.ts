import crypto from "crypto";

const PEPPER = process.env.HASH_PEPPER || "benin_anyigba_pepper_secret_salting_hash_2026";

/**
 * Calcule l'empreinte SHA-256 salée d'un contenu ou objet structuré.
 */
export function calculateDocumentHash(content: string | Record<string, unknown>, salt?: string): {
  hash: string;
  salt: string;
} {
  const effectiveSalt = salt || crypto.randomBytes(16).toString("hex");
  const normalizedContent = typeof content === "string" ? content : JSON.stringify(content);
  const dataToHash = `${normalizedContent}:${effectiveSalt}:${PEPPER}`;
  const hash = crypto.createHash("sha256").update(dataToHash).digest("hex");

  return { hash, salt: effectiveSalt };
}

/**
 * Vérifie si le contenu correspond à l'empreinte et au sel enregistrés.
 */
export function verifyDocumentIntegrity(
  content: string | Record<string, unknown>,
  expectedHash: string,
  salt: string
): boolean {
  const { hash } = calculateDocumentHash(content, salt);
  return hash.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Simule la référence de transaction blockchain BéninChain et ancrage OpenTimestamps.
 */
export function generateBlockchainProof(hash: string): {
  txId: string;
  blockNumber: number;
  otsProof: string;
  timestamp: string;
} {
  const shortHash = hash.slice(0, 16);
  return {
    txId: `0xbc${shortHash}8899aabbccddeeff`,
    blockNumber: 421890 + Math.floor(Math.random() * 100),
    otsProof: `OTS-BTC-SEAL-${shortHash.toUpperCase()}`,
    timestamp: new Date().toISOString(),
  };
}

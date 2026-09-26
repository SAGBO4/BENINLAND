import crypto from "crypto";

const PEPPER = process.env.HASH_PEPPER || "benin_anyigba_pepper_secret_salting_hash_2026";

function canonicalStringify(obj: any, seen = new WeakSet()): string {
  if (obj === null || typeof obj !== "object") {
    if (typeof obj === "symbol" || typeof obj === "function") {
      return "null";
    }
    return JSON.stringify(obj);
  }
  if (seen.has(obj)) {
    return '"[Circular]"';
  }
  seen.add(obj);

  if (Array.isArray(obj)) {
    return `[${obj.map((item) => canonicalStringify(item, seen)).join(",")}]`;
  }
  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map((k) => `${JSON.stringify(k)}:${canonicalStringify(obj[k], seen)}`);
  return `{${pairs.join(",")}}`;
}

/**
 * Calcule l'empreinte SHA-256 salée d'un contenu ou objet structuré avec sérialisation canonique.
 */
export function calculateDocumentHash(content: string | Record<string, unknown>, salt?: string): {
  hash: string;
  salt: string;
} {
  const effectiveSalt = (typeof salt === "string" && salt.trim().length > 0)
    ? salt
    : crypto.randomBytes(16).toString("hex");
  const normalizedContent = typeof content === "string" ? content : canonicalStringify(content);
  const dataToHash = `${normalizedContent}:${effectiveSalt}:${PEPPER}`;
  const hash = crypto.createHash("sha256").update(dataToHash).digest("hex");

  return { hash, salt: effectiveSalt };
}

/**
 * Vérifie si le contenu correspond à l'empreinte et au sel enregistrés (résistant aux timing attacks).
 */
export function verifyDocumentIntegrity(
  content: string | Record<string, unknown>,
  expectedHash: string,
  salt: string
): boolean {
  if (!expectedHash || typeof expectedHash !== "string" || !salt || typeof salt !== "string") {
    return false;
  }

  // Vérifier format hex SHA-256
  const cleanExpected = expectedHash.trim().toLowerCase();
  if (cleanExpected.length !== 64 || !/^[0-9a-f]{64}$/.test(cleanExpected)) {
    return false;
  }

  const { hash } = calculateDocumentHash(content, salt);
  const hashBuffer = Buffer.from(hash.toLowerCase(), "utf8");
  const expectedBuffer = Buffer.from(cleanExpected, "utf8");

  if (hashBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
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
  const safeHash = typeof hash === "string" && hash.length > 0 ? hash : "0000000000000000";
  const shortHash = safeHash.slice(0, 16).padEnd(16, "0");
  return {
    txId: `0xbc${shortHash}8899aabbccddeeff`,
    blockNumber: 421890 + Math.floor(Math.random() * 100),
    otsProof: `OTS-BTC-SEAL-${shortHash.toUpperCase()}`,
    timestamp: new Date().toISOString(),
  };
}

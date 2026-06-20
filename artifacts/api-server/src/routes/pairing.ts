import { Router } from "express";
import { db, membershipTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RequestPairCodeBody, RequestPairCodeResponse } from "@workspace/api-zod";
import { requestPairingCode } from "../lib/sessionManager";
import { checkRateLimit } from "../lib/rateLimit";
import { dbLog } from "../lib/dbLogger";
import { v4 as uuidv4 } from "uuid";
import type { IRouter } from "express";

const WA_GROUP = "https://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd?s=cl&p=a&mlu=0";
const WA_CHANNEL = "https://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o";

const router: IRouter = Router();

router.post("/pair/request", async (req, res): Promise<void> => {
  const parsed = RequestPairCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { phoneNumber, sessionId: providedSessionId } = parsed.data;
  const phone = phoneNumber.replace(/\D/g, "");

  // Rate limit: max 3 per 60s per phone
  if (!checkRateLimit(phone)) {
    res.status(429).json({
      error: "Rate limit exceeded. Maximum 3 pairing requests per minute per phone number.",
    });
    return;
  }

  // Membership gate
  const [member] = await db
    .select()
    .from(membershipTable)
    .where(eq(membershipTable.phoneNumber, phone));

  if (!member?.confirmed) {
    res.status(400).json({
      error: "Membership not confirmed. Please join our WhatsApp group and channel first.",
      groupLink: WA_GROUP,
      channelLink: WA_CHANNEL,
    });
    return;
  }

  const sessionId = providedSessionId ?? `session_${uuidv4().slice(0, 8)}`;

  try {
    const pairingCode = await requestPairingCode(sessionId, phone);
    await dbLog("info", `Pairing code issued for ${phone}`, sessionId);
    res.json(RequestPairCodeResponse.parse({ pairingCode, sessionId, expiresIn: 60 }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await dbLog("error", `Pairing failed for ${phone}: ${message}`, sessionId);
    res.status(500).json({ error: `Pairing failed: ${message}` });
  }
});

export default router;

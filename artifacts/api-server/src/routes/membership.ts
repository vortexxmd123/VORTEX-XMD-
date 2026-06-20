import { Router } from "express";
import { db, membershipTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ConfirmMembershipBody,
  ConfirmMembershipResponse,
  GetMembershipStatusQueryParams,
  GetMembershipStatusResponse,
} from "@workspace/api-zod";
import type { IRouter } from "express";

const router: IRouter = Router();

router.post("/membership/confirm", async (req, res): Promise<void> => {
  const parsed = ConfirmMembershipBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const phone = parsed.data.phoneNumber.replace(/\D/g, "");
  const now = new Date();

  await db
    .insert(membershipTable)
    .values({ phoneNumber: phone, confirmed: true, confirmedAt: now })
    .onConflictDoUpdate({
      target: membershipTable.phoneNumber,
      set: { confirmed: true, confirmedAt: now },
    });

  res.json(ConfirmMembershipResponse.parse({ success: true, message: "Membership confirmed" }));
});

router.get("/membership/status", async (req, res): Promise<void> => {
  const params = GetMembershipStatusQueryParams.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const phone = params.data.phone.replace(/\D/g, "");
  const [member] = await db
    .select()
    .from(membershipTable)
    .where(eq(membershipTable.phoneNumber, phone));

  res.json(
    GetMembershipStatusResponse.parse({
      confirmed: member?.confirmed ?? false,
      confirmedAt: member?.confirmedAt?.toISOString() ?? null,
    })
  );
});

export default router;

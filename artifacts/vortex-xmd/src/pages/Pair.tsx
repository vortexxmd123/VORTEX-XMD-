import { useState, useEffect } from "react";
import { useConfirmMembership, useRequestPairCode } from "@workspace/api-client-react";

export default function Pair() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"membership" | "pair">("membership");
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const confirmMutation = useConfirmMembership();
  const pairMutation = useRequestPairCode();

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [countdown]);

  const handleConfirm = async () => {
    if (!phone.replace(/\D/g, "")) { setError("Enter a phone number."); return; }
    setError(null);
    try {
      await confirmMutation.mutateAsync({ data: { phoneNumber: phone } });
      setStep("pair");
    } catch (e: unknown) {
      setError((e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Confirmation failed.");
    }
  };

  const handlePair = async () => {
    const digits = phone.replace(/\D/g, "");
    if (!digits) { setError("Enter a phone number."); return; }
    setError(null);
    try {
      const res = await pairMutation.mutateAsync({ data: { phoneNumber: digits } });
      setPairingCode(res.pairingCode);
      setSessionId(res.sessionId);
      setCountdown(res.expiresIn ?? 60);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Pairing failed. Try again.");
    }
  };

  const formatted = pairingCode
    ? pairingCode.length === 8
      ? `${pairingCode.slice(0, 4)}-${pairingCode.slice(4)}`
      : pairingCode
    : null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-card border border-primary/30 rounded-sm p-6 glow-border">
        <pre className="text-primary text-sm text-glow mb-4">{`╭━━〔 DEVICE PAIRING 〕━━⬣
┃ VORTEX XMD — WhatsApp Link
╰━━━━━━━━━━━━⬣`}</pre>

        {step === "membership" && (
          <div className="space-y-4">
            <div className="border border-accent/40 bg-accent/5 rounded-sm p-4">
              <div className="text-accent text-sm font-bold mb-2 tracking-widest">JOIN REQUIRED</div>
              <p className="text-muted-foreground text-sm">You must join our community before pairing your device.</p>
            </div>

            <div className="flex gap-3">
              <a
                href="https://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd?s=cl&p=a&mlu=0"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center px-4 py-3 border border-primary/50 text-primary hover:bg-primary/10 rounded-sm text-xs tracking-widest transition-colors"
              >
                JOIN GROUP
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center px-4 py-3 border border-border text-foreground hover:border-primary/40 hover:text-primary rounded-sm text-xs tracking-widest transition-colors"
              >
                JOIN CHANNEL
              </a>
            </div>

            <div>
              <label className="text-xs text-muted-foreground tracking-widest block mb-1">PHONE NUMBER (with country code)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 22879492633"
                className="w-full bg-background border border-input text-foreground px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
              />
            </div>

            {error && <div className="text-accent text-sm border border-accent/30 bg-accent/5 px-4 py-2 rounded-sm">{error}</div>}

            <button
              onClick={handleConfirm}
              disabled={confirmMutation.isPending}
              className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 transition-colors text-sm"
            >
              {confirmMutation.isPending ? "CONFIRMING..." : "I HAVE JOINED — CONFIRM"}
            </button>
          </div>
        )}

        {step === "pair" && !pairingCode && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Membership confirmed. Enter your WhatsApp number to receive a pairing code.</p>
            <div>
              <label className="text-xs text-muted-foreground tracking-widest block mb-1">WHATSAPP NUMBER</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 22879492633"
                className="w-full bg-background border border-input text-foreground px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60 font-mono"
              />
            </div>

            {error && <div className="text-accent text-sm border border-accent/30 bg-accent/5 px-4 py-2 rounded-sm">{error}</div>}

            <button
              onClick={handlePair}
              disabled={pairMutation.isPending}
              className="w-full px-4 py-3 bg-primary text-primary-foreground font-bold tracking-widest rounded-sm hover:bg-primary/80 disabled:opacity-50 transition-colors text-sm"
            >
              {pairMutation.isPending ? "GENERATING CODE..." : "REQUEST PAIRING CODE"}
            </button>
          </div>
        )}

        {pairingCode && formatted && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground tracking-widest mb-4">YOUR PAIRING CODE</div>
              <div className="text-6xl font-bold text-primary text-glow tracking-widest py-6 border border-primary/40 rounded-sm bg-primary/5">
                {formatted}
              </div>
              {sessionId && <div className="text-xs text-muted-foreground mt-2">Session: {sessionId}</div>}
            </div>

            {countdown > 0 && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>EXPIRES IN</span>
                  <span className={countdown < 15 ? "text-accent" : "text-primary"}>{countdown}s</span>
                </div>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(countdown / 60) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {countdown === 0 && (
              <div className="text-accent text-sm text-center border border-accent/30 bg-accent/5 px-4 py-2 rounded-sm">
                Code expired. Request a new one.
              </div>
            )}

            <div className="bg-muted/50 border border-border rounded-sm p-4 text-xs text-muted-foreground space-y-1">
              <div className="text-primary font-bold mb-2 tracking-widest">PAIRING INSTRUCTIONS</div>
              <div>1. Open WhatsApp on your phone</div>
              <div>2. Tap ⋮ (three dots) → Linked Devices</div>
              <div>3. Tap "Link a Device"</div>
              <div>4. Choose "Link with phone number"</div>
              <div>5. Enter the code above</div>
            </div>

            <button
              onClick={() => { setPairingCode(null); setCountdown(0); }}
              className="w-full px-4 py-3 border border-border text-muted-foreground hover:border-primary/40 hover:text-primary rounded-sm text-xs tracking-widest transition-colors"
            >
              REQUEST NEW CODE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

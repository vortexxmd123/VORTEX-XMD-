import { registerCommand } from "../lib/commandLoader";

const convStub = (name: string) => async ({ sock, jid }: Parameters<Parameters<typeof registerCommand>[0]["handler"]>[0]) => {
  await sock.sendMessage(jid, { text: `🔄 ${name}: Reply with the media to convert.` });
};

registerCommand({ name: "tourl", category: "converter", description: "Upload media and get URL", handler: convStub("To URL") });
registerCommand({ name: "tovn", category: "converter", description: "Convert audio to voice note", handler: convStub("To voice note") });
registerCommand({ name: "toptt", category: "converter", description: "Convert to PTT", handler: convStub("To PTT") });
registerCommand({ name: "todoc", category: "converter", description: "Convert to document", handler: convStub("To document") });
registerCommand({ name: "topdf", category: "converter", description: "Convert to PDF", handler: convStub("To PDF") });
registerCommand({ name: "totext", category: "converter", description: "Extract text from image (OCR)", handler: convStub("To text") });

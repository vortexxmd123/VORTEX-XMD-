import { registerCommand } from "../lib/commandLoader";

const mediaStub = (name: string) => async ({ sock, jid }: Parameters<Parameters<typeof registerCommand>[0]["handler"]>[0]) => {
  await sock.sendMessage(jid, { text: `🎬 ${name}: Reply with an image/video/audio to process.` });
};

registerCommand({ name: "sticker", aliases: ["s"], category: "media", description: "Convert image to sticker", handler: mediaStub("Sticker") });
registerCommand({ name: "take", category: "media", description: "Take sticker and rename", handler: mediaStub("Take sticker") });
registerCommand({ name: "toimg", category: "media", description: "Convert sticker to image", handler: mediaStub("To image") });
registerCommand({ name: "tovid", category: "media", description: "Convert to video", handler: mediaStub("To video") });
registerCommand({ name: "tomp3", category: "media", description: "Extract audio from video", handler: mediaStub("To MP3") });
registerCommand({ name: "gif", category: "media", description: "Convert to GIF", handler: mediaStub("GIF") });
registerCommand({ name: "attp", category: "media", description: "Animated text sticker", handler: async ({ sock, jid, args }) => { await sock.sendMessage(jid, { text: `✨ Animated sticker: "${args.join(" ")}"` }); } });
registerCommand({ name: "emix", category: "media", description: "Mix emojis", handler: async ({ sock, jid, args }) => { await sock.sendMessage(jid, { text: `😊 Mixed: ${args.join(" + ")}` }); } });
registerCommand({ name: "photo", category: "media", description: "Send bot profile photo", handler: mediaStub("Photo") });
registerCommand({ name: "enhance", category: "media", description: "Enhance image quality", handler: mediaStub("Enhance") });
registerCommand({ name: "blur", category: "media", description: "Blur an image", handler: mediaStub("Blur") });
registerCommand({ name: "crop", category: "media", description: "Crop an image", handler: mediaStub("Crop") });
registerCommand({ name: "removebg", category: "media", description: "Remove image background", handler: mediaStub("Remove background") });
registerCommand({ name: "vv", category: "media", description: "View once bypass", handler: mediaStub("View once") });
registerCommand({ name: "vv2", category: "media", description: "View once bypass v2", handler: mediaStub("View once v2") });

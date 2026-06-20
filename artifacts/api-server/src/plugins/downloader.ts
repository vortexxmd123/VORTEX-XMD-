import { registerCommand } from "../lib/commandLoader";

const notImpl = (name: string) => async ({ sock, jid }: Parameters<Parameters<typeof registerCommand>[0]["handler"]>[0]) => {
  await sock.sendMessage(jid, { text: `⬇️ ${name} downloader — provide URL. (Integrate download API for full functionality)` });
};

registerCommand({ name: "yt", aliases: ["youtube"], category: "downloader", description: "Download YouTube video", handler: notImpl("YouTube") });
registerCommand({ name: "ytmp3", category: "downloader", description: "Download YouTube as MP3", handler: notImpl("YouTube MP3") });
registerCommand({ name: "ytmp4", category: "downloader", description: "Download YouTube as MP4", handler: notImpl("YouTube MP4") });
registerCommand({ name: "tiktok", aliases: ["tt"], category: "downloader", description: "Download TikTok video", handler: notImpl("TikTok") });
registerCommand({ name: "ig", aliases: ["instagram"], category: "downloader", description: "Download Instagram media", handler: notImpl("Instagram") });
registerCommand({ name: "fb", aliases: ["facebook"], category: "downloader", description: "Download Facebook video", handler: notImpl("Facebook") });
registerCommand({ name: "twitter", aliases: ["x"], category: "downloader", description: "Download Twitter/X media", handler: notImpl("Twitter/X") });
registerCommand({ name: "spotify", category: "downloader", description: "Download Spotify track info", handler: notImpl("Spotify") });
registerCommand({ name: "soundcloud", aliases: ["sc"], category: "downloader", description: "Download SoundCloud track", handler: notImpl("SoundCloud") });
registerCommand({ name: "mediafire", aliases: ["mf"], category: "downloader", description: "Download MediaFire file", handler: notImpl("MediaFire") });
registerCommand({ name: "github", aliases: ["gh"], category: "downloader", description: "Download GitHub repo zip", handler: notImpl("GitHub") });
registerCommand({ name: "apk", category: "downloader", description: "Download APK from PlayStore", handler: notImpl("APK") });
registerCommand({ name: "play", category: "downloader", description: "Play/download audio by name", handler: notImpl("Play") });
registerCommand({ name: "play2", category: "downloader", description: "Play/download video by name", handler: notImpl("Play Video") });

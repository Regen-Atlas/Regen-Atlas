import {
  XLogo,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
  GithubLogo,
  DiscordLogo,
  TelegramLogo,
  TiktokLogo,
  LinktreeLogo,
  ThreadsLogo,
  Files,
  Newspaper,
} from "@phosphor-icons/react";
import { Org } from "../shared/types";
import MirrorLogo from "./logos/MirrorLogo";

export default ({ org }: { org: Org }) => {
  return (
    <div className="flex gap-2">
      {org.social.map((social) => (
        <div key={social.platform}>
          <a href={social.link} target="_blank" rel="noopener noreferrer">
            <div
              className="font-bold tooltip cursor-pointer"
              data-tip={social.platform}
            >
              {social.platform === "facebook" ? (
                <FacebookLogo weight="fill" size={32} />
              ) : social.platform === "x" ? (
                <XLogo />
              ) : social.platform === "instagram" ? (
                <InstagramLogo weight="fill" size={32} />
              ) : social.platform === "tiktok" ? (
                <TiktokLogo weight="fill" size={32} />
              ) : social.platform === "karmagap" ? (
                <img
                  src="/social/karmagap.svg"
                  alt="karmagap"
                  width={32}
                  height={32}
                />
              ) : social.platform === "farcaster" ? (
                <img
                  src="/social/farcaster.svg"
                  alt="farcaster"
                  width={32}
                  height={32}
                />
              ) : social.platform === "mirror" ? (
                <MirrorLogo />
              ) : social.platform === "paragraph" ? (
                <img
                  src="/social/paragraph.svg"
                  alt="paragraph"
                  width={32}
                  height={32}
                />
              ) : social.platform === "linktree" ? (
                <LinktreeLogo weight="fill" size={32} />
              ) : social.platform === "discord" ? (
                <DiscordLogo weight="fill" size={32} />
              ) : social.platform === "youtube" ? (
                <YoutubeLogo weight="fill" size={32} />
              ) : social.platform === "linkedin" ? (
                <LinkedinLogo weight="fill" size={32} />
              ) : social.platform === "telegram" ? (
                <TelegramLogo weight="fill" size={32} />
              ) : social.platform === "signal" ? (
                <img
                  src="/social/signal.svg"
                  alt="signal"
                  width={32}
                  height={32}
                />
              ) : social.platform === "threads" ? (
                <ThreadsLogo weight="fill" size={32} />
              ) : social.platform === "hylo" ? (
                <img src="/social/hylo.svg" alt="hylo" width={32} height={32} />
              ) : social.platform === "bluesky" ? (
                <img
                  src="/social/bluesky.svg"
                  alt="bluesky"
                  width={32}
                  height={32}
                />
              ) : social.platform === "charmverse" ? (
                <img
                  src="/social/charmverse.svg"
                  alt="charmverse"
                  width={32}
                  height={32}
                />
              ) : social.platform === "blog" ? (
                <Newspaper weight="fill" size={32} />
              ) : social.platform === "docs" ? (
                <Files weight="fill" size={32} />
              ) : social.platform === "discourse" ? (
                <img
                  src="/social/discourse.svg"
                  alt="discourse"
                  width={32}
                  height={32}
                />
              ) : social.platform === "github" ? (
                <GithubLogo weight="fill" size={32} />
              ) : social.platform === "gitbook" ? (
                <img
                  src="/social/gitbook.svg"
                  alt="gitbook"
                  width={32}
                  height={32}
                />
              ) : null}
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export const SOCIAL_PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
  },
  {
    id: "x",
    name: "X",
  },
  {
    id: "instagram",
    name: "Instagram",
  },
  {
    id: "tiktok",
    name: "TikTok",
  },
  {
    id: "karmagap",
    name: "KarmaGAP",
  },
  {
    id: "farcaster",
    name: "Farcaster",
  },
  {
    id: "mirror",
    name: "Mirror",
  },
  {
    id: "paragraph",
    name: "Paragraph",
  },
  {
    id: "linktree",
    name: "Linktree",
  },
  {
    id: "discord",
    name: "Discord",
  },
  {
    id: "youtube",
    name: "Youtube",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
  },
  {
    id: "telegram",
    name: "Telegram",
  },
  {
    id: "signal",
    name: "Signal",
  },
  {
    id: "threads",
    name: "Threads",
  },
  {
    id: "hylo",
    name: "Hylo",
  },
  {
    id: "bluesky",
    name: "Bluesky",
  },
  {
    id: "charmverse",
    name: "Charmverse",
  },
  {
    id: "blog",
    name: "Blog",
  },
  {
    id: "docs",
    name: "Docs",
  },
  {
    id: "discourse",
    name: "Discourse",
  },
  {
    id: "github",
    name: "Github",
  },
  {
    id: "gitbook",
    name: "Gitbook",
  },
];

"use client";
import { Badge } from "@/components/ui/badge";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/NfDvERZS7va
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { SunoSong } from "@/types/song";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ArrowRight, Play, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAudioBlob } from "./download-form";
import toast from "react-hot-toast";
type CardType = {
  sunoSong: SunoSong[] | undefined;
};
export default function MusicCards({ sunoSong }: CardType) {
  const onDownload = async (downloadUrl: string) => {
    try {
      // console.log(values);

      const audioBlob = await getAudioBlob(downloadUrl);

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(audioBlob);
      downloadLink.download = `audio.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("error download");
    }
  };
  if (!sunoSong) {
    return null;
  }

  // 提取所有的 tags 并计算出现频率

  const tagCounts = sunoSong.reduce(
    (acc: Record<string, number>, song: SunoSong) => {
      const tags = song.clip.metadata.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      tags.forEach((tag) => {
        if (tag) {
          // 检查 tag 不是空字符串
          acc[tag] = (acc[tag] || 0) + 1;
        }
      });
      tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  // 将标签按出现频率排序并获取前20个，但作为对象{name, count}
  const top20Tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }));

  // console.log(top20Tags);

  return (
    <div className="mt-[3rem]">
      {/* badge */}
      <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
        {top20Tags.map((tag) => (
          <Badge key={tag.name} className="flex gap-2">
            <span>{tag.name}</span>
            {tag.count}
          </Badge>
        ))}
      </div>

      <div className="mt-[3rem] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* song */}
        {sunoSong &&
          sunoSong.map((song) => (
            <Card
              key={song.clip.audio_url}
              className="relative flex h-full flex-col"
            >
              <CardHeader className="relative overflow-hidden rounded-t-lg px-6 py-2">
                <AspectRatio ratio={16 / 9} className="bg-muted">
                  <Link href={`/detail/${song.clip.id}`}>
                    <Image
                      fill
                      alt="Pop song"
                      className="h-full w-full rounded-md object-cover"
                      src={song.clip.image_url}
                      // https://cdn1.suno.ai/image_5cc9deb4-69f8-4589-994e-e1925bc5c17a.png
                    />
                  </Link>
                </AspectRatio>
                <div>{/* className="aspect-w-16 aspect-h-9" */}</div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col p-4">
                {/* meta tag */}
                <div className="flex-1">
                  <div className="flex w-full flex-wrap items-center justify-center gap-3 text-sm font-medium leading-none">
                    {song.clip.metadata.tags.split(",").map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-2 items-center gap-4">
                    <div className="text-left text-sm">
                      {song.clip.upvote_count} likes
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <Play className="h-4 w-4" />
                      {song.clip.play_count}
                    </div>
                  </div>
                </div>

                <Link
                  className="flex items-center justify-center gap-2 transition-all duration-200 hover:text-blue-500"
                  // href={`https://app.suno.ai/song/${song.clip.id}`}
                  href={`/detail/${song.clip.id}`}
                  // target="_blank"
                >
                  <h2 className=" text-xl font-bold">{song.clip.title}</h2>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* <p className="mt-2 text-sm leading-snug text-gray-500">
                The perfect song for a sunny day. Let the music take you on a
                journey.
              </p> */}
                <div className="flex items-center justify-between gap-3">
                  <audio
                    className="mt-2 self-center"
                    src={song.clip.audio_url}
                    controls
                  />
                  <Button
                    variant="outline"
                    onClick={() => onDownload(song.clip.audio_url)}
                  >
                    Download
                  </Button>
                </div>

                {/* mp3 player component, with play, stop and other components */}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

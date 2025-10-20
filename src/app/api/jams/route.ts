import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

    if (!apiKey || !playlistId) {
      return NextResponse.json(
        { error: "Missing API key or playlist ID" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=20&key=${apiKey}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch playlist" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const jams = data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      artist: item.snippet.videoOwnerChannelTitle,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      channel: item.snippet.videoOwnerChannelTitle,
    }));

    return NextResponse.json(jams);
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

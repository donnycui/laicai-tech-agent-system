type Video = {
  platform: string
  id?: string
  url?: string
  cover?: string
}

function getEmbedUrl(video: Video) {
  if (video.platform === 'youtube' && video.id) {
    return `https://www.youtube.com/embed/${video.id}`
  }
  if (video.platform === 'bilibili' && video.id) {
    return `https://player.bilibili.com/player.html?bvid=${video.id}&page=1&high_quality=1&danmaku=0`
  }
  return ''
}

function getPlatformLabel(platform: string) {
  if (platform === 'youtube') return 'YouTube'
  if (platform === 'bilibili') return '哔哩哔哩'
  if (platform === 'wechat') return '视频号'
  if (platform === 'douyin') return '抖音'
  if (platform === 'xiaohongshu') return '小红书'
  return '视频'
}

export default function VideoPlayer({ video }: { video: Video }) {
  const embedUrl = getEmbedUrl(video)
  const label = getPlatformLabel(video.platform)

  if (embedUrl) {
    return (
      <div className="my-8">
        <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${label} 播放器`}
          />
        </div>
      </div>
    )
  }

  // 非 iframe 平台：封面 + 跳转（稳定、合规、不会失效）
  return (
    <div className="my-8 rounded-xl border overflow-hidden bg-white">
      {video.cover ? (
        <img src={video.cover} alt={`${label} 封面`} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-slate-100" />
      )}

      <div className="p-4 flex items-center justify-between gap-4">
        <div className="text-sm text-slate-700">
          <span className="font-medium">{label}</span>
          <span className="text-slate-400"> · </span>
          <span className="text-slate-500">点击跳转到原平台观看</span>
        </div>

        {video.url ? (
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg bg-black text-white text-sm"
          >
            前往观看
          </a>
        ) : (
          <span className="text-sm text-slate-400">未配置 url</span>
        )}
      </div>
    </div>
  )
}

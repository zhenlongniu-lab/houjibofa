interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#faf9f7",
        }}
      >
        {/* Play icon */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#fff",
            border: "1.5px solid #d8d6cf",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#1a1a1a"
            style={{ marginLeft: 3 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <p style={{ color: "#9ca3af", fontSize: "0.88rem", textAlign: "center", padding: "0 1rem" }}>
          视频来自央视网，请在外部页面观看
        </p>

        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          在央视网观看完整视频
        </a>
      </div>

      <div style={{ padding: "0.85rem 1.25rem", borderTop: "1px solid #eeedea" }}>
        <p style={{ color: "#6b7280", fontSize: "0.88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {title}
        </p>
      </div>
    </div>
  );
}

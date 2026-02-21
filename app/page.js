export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Bird API Server</h1>
      <p>Backend is running. Use the API routes:</p>
      <ul>
        <li><a href="/api/cases">GET /api/cases</a> – list cases</li>
        <li><a href="/api/cases/case-001">GET /api/cases/[id]</a> – case detail</li>
        <li><a href="/api/videos">GET /api/videos</a> – list videos</li>
        <li><a href="/api/leaderboard">GET /api/leaderboard</a> – leaderboard by score</li>
      </ul>
      <p>Frontend: open <a href="/appui/P-HOME.html">/appui/P-HOME.html</a> (copy appui folder into <code>public/</code> if needed).</p>
    </div>
  );
}

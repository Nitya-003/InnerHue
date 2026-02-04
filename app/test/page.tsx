'use client';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test Page - InnerHue</h1>
      <p>If you can see this, Next.js is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <style jsx>{`
        h1 { color: purple; }
        p { color: #333; }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test Page - InnerHue</h1>
      <p>If you can see this, Next.js is working!</p>
      <p>Current time: {time}</p>
      <style jsx>{`
        h1 { color: purple; }
        p { color: #333; }
      `}</style>
    </div>
  );
}

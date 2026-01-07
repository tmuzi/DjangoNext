// API

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getHello() {
    const res = await fetch(`${base}/hello`);
    const data = await res.json();
  return data;
}

import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const filePath = path.resolve("public/craft/index.html");
  const html = fs.readFileSync(filePath, "utf-8");
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
};

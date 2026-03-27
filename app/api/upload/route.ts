import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const data = await request.formData();
    const files = data.getAll("files").filter((file): file is File => file instanceof File);
    if (!files.length) return apiError("No files received.");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const savedFiles: string[] = [];

    for (const file of files) {
      const extension = file.name.split(".").pop() || "jpg";
      const filename = `${randomUUID()}.${extension}`;
      const filepath = path.join(uploadDir, filename);
      const arrayBuffer = await file.arrayBuffer();
      await writeFile(filepath, Buffer.from(arrayBuffer));
      savedFiles.push(`/uploads/${filename}`);
    }

    return apiOk({ files: savedFiles }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to upload files.", 500);
  }
}

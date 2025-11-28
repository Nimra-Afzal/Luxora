import { promises as fs } from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log("✅ Received form data:", data) // Debug log

    const filePath = path.join(process.cwd(), "contactData.json")

    let existingData: any[] = []
    try {
      const file = await fs.readFile(filePath, "utf-8")
      existingData = JSON.parse(file)
      console.log("📂 Existing contactData.json loaded")
    } catch {
      console.log("📂 No existing contactData.json found, creating new one")
    }

    const newEntry = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    existingData.push(newEntry)
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2))

    console.log("💾 Data saved to contactData.json:", newEntry) // Debug log

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error("❌ API Error while saving contact:", err) // Debug log
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 })
  }
}

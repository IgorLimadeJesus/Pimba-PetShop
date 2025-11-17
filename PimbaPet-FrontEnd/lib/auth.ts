import jwt from "jsonwebtoken"

export async function verifyToken(token?: string) {
    if (!token) return null
    try {
        const secret = process.env.JWT_SECRET || "dev-secret"
        const payload = jwt.verify(token, secret) as any
        return { id: payload.sub || payload.id, role: payload.role }
    } catch (err) {
        console.error("verifyToken error:", err)
        return null
    }
}

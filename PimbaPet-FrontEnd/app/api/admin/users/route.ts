import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { CreateUserSchema } from "@/dtos/create-user.dto"
import { verifyToken } from "@/lib/auth"
import { createUser } from "@/services/user.service"

export async function POST(req: Request) {
    try {
        const auth = req.headers.get("authorization") || ""
        const token = auth.replace("Bearer ", "") || undefined
        const requester = await verifyToken(token)
        if (!requester || requester.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const parsed = CreateUserSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten() }, { status: 400 })
        }

        const { name, email, password, role } = parsed.data
        const hashed = await hash(password, 10)
        const user = await createUser({ name, email, password: hashed, role: role ?? "worker" })

        // Do not return password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _p, ...safe } = user as any
        return NextResponse.json({ user: safe }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: "Internal error" }, { status: 500 })
    }
}

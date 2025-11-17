import prisma from "@/lib/prisma"

type CreateUserInput = {
    name: string
    email: string
    password: string // hashed
    role?: string
}

export async function createUser(input: CreateUserInput) {
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: input.password,
            role: input.role ?? "worker",
        },
    })
    return user
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
}
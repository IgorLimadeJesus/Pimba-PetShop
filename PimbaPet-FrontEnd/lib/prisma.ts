// Lazily require @prisma/client only if available. This file lives in the front-end
// workspace but many environments (the frontend dev container) won't have
// @prisma/client installed. Use a runtime require guarded with ts-ignore so the
// TypeScript build doesn't fail when the package is missing.
declare global {
    // eslint-disable-next-line no-var
    var prisma: any
}

let prisma: any = undefined
try {
    // @ts-ignore: allow require even if types are missing in this environment
    const { PrismaClient } = require("@prisma/client")
    prisma = (global as any).prisma || new PrismaClient()
    if (process.env.NODE_ENV === "development") (global as any).prisma = prisma
} catch (err) {
    // Fallback stub when @prisma/client isn't available in this environment.
    // Consumers should handle a missing implementation at runtime.
    prisma = {} as any
}

export default prisma

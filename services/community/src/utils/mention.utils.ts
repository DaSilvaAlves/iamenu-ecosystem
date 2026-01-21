import prisma, { PrismaClient } from '../lib/prisma';

/**
 * Extrair usernames mencionados do texto
 * @param text - Texto para procurar menções
 * @returns Array de usernames sem o símbolo @
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]); // Username sem @
  }

  // Remove duplicados
  return [...new Set(mentions)];
}

/**
 * Resolver usernames para userIds
 * @param mentions - Array de usernames para resolver
 * @param prismaClient - Instância do Prisma Client
 * @returns Map<username, userId> dos usernames encontrados
 */
export async function resolveMentions(
  mentions: string[],
  prismaClient: PrismaClient
): Promise<Map<string, string>> {
  if (mentions.length === 0) {
    return new Map();
  }

  const profiles = await prismaClient.profile.findMany({
    where: {
      username: { in: mentions }
    },
    select: { username: true, userId: true }
  });

  const mentionMap = new Map<string, string>();
  profiles.forEach((p: { username: string | null; userId: string }) => {
    if (p.username) {
      mentionMap.set(p.username, p.userId);
    }
  });

  return mentionMap;
}

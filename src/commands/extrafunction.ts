export async function parseDuration(durationStr: string): Promise<number> {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if(!match){
        throw new Error(`wrong parameters passed for time`);
    }
    const amount = parseInt(match[1], 10);
  const unit = match[2];
  const msMap = { ms: 1, s: 1000, m: 60_000, h: 3_600_000 } as const;
  return amount * msMap[unit as keyof typeof msMap];
}
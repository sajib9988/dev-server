/**
 * Check if buffer is ZIP
 * @param buffer - file buffer
 * @returns true if ZIP
 */
export const isZipBuffer = (buffer: Buffer) => buffer.slice(0, 2).toString() === "PK";
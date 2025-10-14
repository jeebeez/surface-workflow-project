/**
 * Clipboard utility functions
 */

/**
 * Copy text to clipboard
 * @param text - The text to copy
 * @returns Promise that resolves when text is copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  await window.navigator.clipboard.writeText(text);
}

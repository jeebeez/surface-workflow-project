import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid";

/**
 * Copy text to clipboard
 * @param text - The text to copy
 * @returns Promise that resolves when text is copied
 */
export function copyToClipboard(text: string) {
  return window.navigator.clipboard.writeText(text);
}

export const CopyToClipboardButton = ({
  text,
  onCopy,
  copyText,
  copiedText,
}: {
  text: string;
  onCopy?: () => void;
  copyText: string;
  copiedText: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <Button
      onClick={async () => {
        console.log("copying text", text);
        await copyToClipboard(text);
        console.log("copied text", text);
        onCopy?.();
        console.log("onCopy");
        setIsCopied(true);
        console.log("setIsCopied", isCopied);
      }}
    >
      <ClipboardDocumentCheckIcon />
      {isCopied ? copiedText : copyText}
    </Button>
  );
};

import type { KeyboardEvent } from "react";

/** Keep Enter from submitting a form while the user is still in a field. */
export function preventEnterSubmit(
  event: KeyboardEvent<HTMLFormElement>,
) {
  if (event.key !== "Enter" || event.nativeEvent.isComposing) return;

  const target = event.target as HTMLElement | null;
  if (!target) return;

  const tag = target.tagName;
  if (tag === "TEXTAREA") return;
  if (tag === "BUTTON" || target.closest("button")) return;

  event.preventDefault();
}

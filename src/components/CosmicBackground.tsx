/**
 * Magical space background: deep gradient + twinkling starfield,
 * glowing crescent moon, distant planet, and shooting stars.
 * Pure CSS — no images, no JS animation cost.
 */
export function CosmicBackground() {
  return (
    <>
      <div className="starfield" aria-hidden />
      <div className="cosmic-moon" aria-hidden />
      <div className="cosmic-planet" aria-hidden />
      <div className="shooting-star" aria-hidden />
      <div className="shooting-star delay" aria-hidden />
    </>
  );
}

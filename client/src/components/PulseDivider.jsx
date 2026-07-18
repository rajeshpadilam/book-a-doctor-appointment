// The recurring "heartbeat" motif used across the app as a section divider.
export default function PulseDivider() {
  return (
    <div className="pulse-divider" aria-hidden="true">
      <svg viewBox="0 0 600 40" preserveAspectRatio="none">
        <path
          className="pulse-line"
          d="M0 20 H180 L205 20 L220 6 L238 34 L256 20 L270 20 L285 12 L298 20 H600"
        />
      </svg>
    </div>
  );
}

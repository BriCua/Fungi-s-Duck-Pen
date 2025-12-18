interface ProgressBarProps {
  percentage: number;
  cardTheme: {
    titleColor: string;
    textColor: string;
    iconColor: string;
    cardColor: string;
  };
}

const ProgressBar = ({ percentage, cardTheme }: ProgressBarProps) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  // Determine if cardColor is generally light or dark to choose appropriate track color
  // Simple heuristic: check luminance (average of R, G, B)
  const isCardColorLight = (color: string) => {
    // This is a rough estimation and might need more robust parsing for all CSS color formats
    // For our specific CSS vars, we know they are either #RRGGBB or rgba(R,G,B,A)
    let r, g, b;
    if (color.startsWith('var(--')) {
      // This is not easily parsable directly here, assuming cardTheme.cardColor is processed.
      // For simplicity in this context, we might need a fixed heuristic or pass a more processed color.
      // Given our current colors, duck-yellow-dark, duck-yellow-subtle are light, brighter-pink is medium.
      // Let's assume yellow colors are light, pink is darker for track purposes.
      if (color.includes('duck-yellow')) return true; // Light
      if (color.includes('brighter-pink')) return false; // Dark
      return true; // Default to light if unknown
    } else if (color.startsWith('rgba(')) {
      const parts = color.match(/(\d+(\.\d+)?)/g)?.map(Number);
      if (parts && parts.length >= 3) {
        [r, g, b] = parts;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
      }
    }
    return true; // Default to light
  };

  const trackColor = isCardColorLight(cardTheme.cardColor) ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';

  return (
    <div className="w-full rounded-full h-2.5" style={{ backgroundColor: trackColor }}>
      <div
        className="h-2.5 rounded-full"
        style={{ width: `${safePercentage}%`, backgroundColor: cardTheme.iconColor }}
      ></div>
    </div>
  );
};

export default ProgressBar;

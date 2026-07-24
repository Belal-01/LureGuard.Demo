import React, { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
}

const CYBER_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  scrambleSpeed = 30,
}) => {
  const [displayText, setDisplayText] = useState<string>('');

  useEffect(() => {
    let frame = 0;
    const totalFrames = text.length * 3;
    let animationInterval: NodeJS.Timeout;

    animationInterval = setInterval(() => {
      frame++;

      const revealedCount = Math.floor((frame / totalFrames) * text.length);
      let result = '';

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
        }
      }

      setDisplayText(result);

      if (frame >= totalFrames) {
        clearInterval(animationInterval);
        setDisplayText(text);
      }
    }, scrambleSpeed);

    return () => clearInterval(animationInterval);
  }, [text, scrambleSpeed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink text-emerald-400 font-mono inline-block mr-1">_</span>
    </span>
  );
};

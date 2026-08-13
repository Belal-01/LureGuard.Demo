import React, { useEffect, useState } from 'react';

interface TypewriterTitleProps {
  titles: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypewriterTitle: React.FC<TypewriterTitleProps> = ({
  titles,
  typingSpeed = 45,
  erasingSpeed = 25,
  pauseDuration = 2200,
  className = '',
}) => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!titles || titles.length === 0) return;

    const fullText = titles[currentTitleIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < fullText.length) {
        timer = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length - 1));
        }, erasingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentTitleIndex, titles, typingSpeed, erasingSpeed, pauseDuration]);

  return (
    <span className={`inline-block ${className}`}>
      <span className="inline">{displayText}</span>
      <span className="inline-block ml-0.5 animate-blink font-bold text-blue-400">_</span>
    </span>
  );
};

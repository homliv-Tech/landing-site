import type { CSSProperties } from "react";

// Adapted from Fancy Components' Vertical Cut Reveal:
// https://www.fancycomponents.dev/docs/components/text/vertical-cut-reveal.md
// CSS keeps the text server-rendered and lets the intro control the start.
export default function VerticalCutReveal({ lines }: { lines: string[] }) {
  let wordIndex = 0;

  return (
    <span className="cut-reveal">
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => (
          <span className="cut-reveal-line" key={lineIndex}>
            {line.split(" ").map((word, index) => (
              <span key={index}>
                {index > 0 && " "}
                <span className="cut-reveal-mask">
                  <span
                    className="cut-reveal-word"
                    style={{ "--word-index": wordIndex++ } as CSSProperties}
                  >
                    {word}
                  </span>
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

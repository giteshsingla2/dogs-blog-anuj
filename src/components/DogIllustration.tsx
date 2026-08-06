import React from "react";

interface DogIllustrationProps {
  id: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function DogIllustration({ id, width = "100%", height = "100%", className }: DogIllustrationProps) {
  switch (id) {
    case "hero-dog":
      return (
        <svg className={className} viewBox="0 0 600 340" preserveAspectRatio="xMidYMax slice" width={width} height={height}>
          <ellipse cx="150" cy="300" rx="380" ry="60" fill="#00000022" />
          <g fill="#00000030">
            <ellipse cx="470" cy="150" rx="230" ry="230" />
          </g>
          {/* running dog silhouette, paper-cut style */}
          <g transform="translate(60,120)" fill="#F3F1FB" opacity="0.92">
            <ellipse cx="140" cy="90" rx="95" ry="42" />
            <ellipse cx="235" cy="55" rx="34" ry="30" />
            <ellipse cx="258" cy="35" rx="12" ry="18" transform="rotate(20 258 35)" />
            <ellipse cx="40" cy="70" rx="14" ry="24" transform="rotate(-40 40 70)" />
            <rect x="60" y="115" width="14" height="55" rx="6" transform="rotate(18 60 115)" />
            <rect x="120" y="120" width="14" height="60" rx="6" transform="rotate(-10 120 120)" />
            <rect x="180" y="118" width="14" height="58" rx="6" transform="rotate(14 180 118)" />
            <rect x="215" y="115" width="14" height="55" rx="6" transform="rotate(-12 215 115)" />
          </g>
        </svg>
      );

    case "card-senior":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000020" />
          <g transform="translate(90,45)" fill="#EAF3F0">
            <ellipse cx="60" cy="65" rx="55" ry="34" />
            <circle cx="115" cy="38" r="26" />
            <ellipse cx="20" cy="45" rx="10" ry="18" transform="rotate(-25 20 45)" />
            <ellipse cx="105" cy="12" rx="9" ry="15" transform="rotate(10 105 12)" />
          </g>
        </svg>
      );

    case "card-adventure":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000020" />
          <g transform="translate(70,40)" fill="#EFF4E8">
            <ellipse cx="90" cy="70" rx="65" ry="30" />
            <circle cx="160" cy="45" r="24" />
            <rect x="40" y="90" width="12" height="40" rx="5" />
            <rect x="90" y="95" width="12" height="38" rx="5" />
            <rect x="140" y="92" width="12" height="40" rx="5" />
          </g>
        </svg>
      );

    case "card-training":
    case "strip-redirection":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000015" />
          <g transform="translate(85,42)" fill="#FFF6E5">
            <ellipse cx="70" cy="60" rx="58" ry="32" />
            <circle cx="130" cy="35" r="24" />
            <ellipse cx="105" cy="10" rx="9" ry="16" transform="rotate(15 105 10)" />
            <ellipse cx="150" cy="14" rx="9" ry="16" transform="rotate(-10 150 14)" />
          </g>
        </svg>
      );

    case "card-rescue":
    case "strip-beagle":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000020" />
          <g transform="translate(75,40)" fill="#FCF1EF">
            <ellipse cx="75" cy="65" rx="60" ry="30" />
            <circle cx="140" cy="40" r="24" />
            <ellipse cx="30" cy="42" rx="10" ry="17" transform="rotate(-30 30 42)" />
          </g>
        </svg>
      );

    case "card-gear":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000030" />
          <g transform="translate(80,38)" fill="#F3F1FB">
            <ellipse cx="80" cy="70" rx="62" ry="32" />
            <circle cx="150" cy="42" r="26" />
            <ellipse cx="180" cy="18" rx="9" ry="16" transform="rotate(20 180 18)" />
          </g>
        </svg>
      );

    case "card-corgi":
    case "strip-rearranged":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000015" />
          <g transform="translate(90,45)" fill="#FFF6E5">
            <circle cx="60" cy="55" r="42" />
            <ellipse cx="20" cy="20" rx="9" ry="16" transform="rotate(-15 20 20)" />
            <ellipse cx="98" cy="18" rx="9" ry="16" transform="rotate(15 98 18)" />
          </g>
        </svg>
      );

    case "card-puppy":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000020" />
          <g transform="translate(70,45)" fill="#EEF4E8">
            <ellipse cx="85" cy="60" rx="60" ry="28" />
            <circle cx="150" cy="38" r="22" />
            <rect x="30" y="80" width="10" height="35" rx="4" />
            <rect x="70" y="85" width="10" height="32" rx="4" />
          </g>
        </svg>
      );

    case "card-pyrenees":
    case "strip-guilt":
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000025" />
          <g transform="translate(65,35)" fill="#E9F3F1">
            <ellipse cx="95" cy="70" rx="72" ry="34" />
            <circle cx="175" cy="42" r="26" />
            <path d="M175 16 q10 -20 24 -10 q-4 22 -20 24 z" />
          </g>
        </svg>
      );

    case "card-foster":
    default:
      return (
        <svg viewBox="0 0 300 150" width={width} height={height} className={className}>
          <ellipse cx="150" cy="130" rx="150" ry="30" fill="#00000020" />
          <g transform="translate(78,42)" fill="#FCF1EF">
            <ellipse cx="72" cy="62" rx="58" ry="30" />
            <circle cx="135" cy="38" r="23" />
            <ellipse cx="15" cy="80" rx="9" ry="16" transform="rotate(-45 15 80)" />
          </g>
        </svg>
      );
  }
}

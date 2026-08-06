"use client";

import React, { useEffect, useState } from "react";

interface AdSlotProps {
  placement: "header" | "sidebar" | "in-feed" | "mid-content";
  adId?: string;
}

interface MockAd {
  title: string;
  description: string;
  cta: string;
  link: string;
  imageUrl?: string;
  sponsorName: string;
}

const mockAds: Record<string, MockAd[]> = {
  header: [
    {
      title: "BarkBox: Double Your First Box Free",
      description: "Get two times the toys and treats in your first box of happiness.",
      cta: "Claim Offer",
      link: "#",
      sponsorName: "BarkBox"
    },
    {
      title: "Fi Smart Dog Collar - GPS & Activity",
      description: "Track your dog's steps, sleep, and location in real-time.",
      cta: "Save $50 Now",
      link: "#",
      sponsorName: "Fi Collar"
    }
  ],
  sidebar: [
    {
      title: "Nom Nom Fresh Dog Food",
      description: "Formulated by veterinary nutritionists. Real ingredients, pre-portioned for your pup.",
      cta: "Get 50% Off First Order",
      link: "#",
      sponsorName: "Nom Nom Pet Food"
    },
    {
      title: "Chewy: Pet Supplies & Food",
      description: "Fast free shipping on pet food, toys, and prescriptions. 24/7 customer service.",
      cta: "Shop Now",
      link: "#",
      sponsorName: "Chewy"
    }
  ],
  "in-feed": [
    {
      title: "Rover: Find 5-Star Pet Sitters Near You",
      description: "Book trusted dog walkers, house sitters, and boarding services in your neighborhood.",
      cta: "Book a Sitter",
      link: "#",
      sponsorName: "Rover"
    }
  ],
  "mid-content": [
    {
      title: "Farmers Dog: Smart Food For Dogs",
      description: "Freshly made food delivered to your door. Human-grade meat and veggies gently cooked to seal in nutrients.",
      cta: "Start Trial",
      link: "#",
      sponsorName: "The Farmer's Dog"
    }
  ]
};

export default function AdSlot({ placement, adId }: AdSlotProps) {
  const [ad, setAd] = useState<MockAd | null>(null);

  useEffect(() => {
    // Randomly pick one of the mock ads for this placement
    const list = mockAds[placement];
    if (list && list.length > 0) {
      const index = Math.floor(Math.random() * list.length);
      setAd(list[index]);
    }
  }, [placement]);

  if (!ad) return null;

  // Render mock ads based on placement style
  return (
    <div className="ad-container" data-placement={placement} id={adId}>
      <span className="ad-label">Sponsored Advertisement</span>
      <div className="ad-content">
        {placement === "header" && (
          <div className="ad-banner-header">
            <div className="ad-text">
              <h6>{ad.title}</h6>
              <p>{ad.description}</p>
            </div>
            <button className="ad-btn" onClick={() => window.open(ad.link, "_blank")}>
              {ad.cta}
            </button>
          </div>
        )}

        {placement === "sidebar" && (
          <div className="ad-sidebar">
            <div className="ad-sidebar-img">
              {/* Abstract decorative SVG instead of empty space */}
              <svg viewBox="0 0 268 120" width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="adGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--teal)" />
                    <stop offset="100%" stopColor="var(--green)" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#adGrad)" />
                <circle cx="134" cy="60" r="40" fill="rgba(255,255,255,0.15)" />
                <path d="M 0,60 Q 67,40 134,60 T 268,60" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="var(--font-fraunces), serif">
                  {ad.sponsorName}
                </text>
              </svg>
            </div>
            <h6>{ad.title}</h6>
            <p>{ad.description}</p>
            <button className="ad-btn" style={{ width: "100%" }} onClick={() => window.open(ad.link, "_blank")}>
              {ad.cta}
            </button>
          </div>
        )}

        {placement === "in-feed" && (
          <div className="ad-infeed">
            <div>
              <h6>🐾 {ad.title}</h6>
              <p>{ad.description}</p>
            </div>
            <button className="ad-btn" onClick={() => window.open(ad.link, "_blank")}>
              {ad.cta}
            </button>
          </div>
        )}

        {placement === "mid-content" && (
          <div className="ad-infeed" style={{ margin: "24px 0", background: "var(--cream-2)", borderStyle: "dashed" }}>
            <div>
              <h6>🐶 {ad.title}</h6>
              <p style={{ fontSize: "12px", marginTop: "4px" }}>{ad.description}</p>
            </div>
            <button className="ad-btn" onClick={() => window.open(ad.link, "_blank")}>
              {ad.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

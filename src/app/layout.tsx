import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const GTM_ID = "GTM-P6L4T3J5";
const GA_ID = "G-7J4BRRJ1BS";

export const metadata: Metadata = {
  title: "Resurrect My GPA",
  description:
    "GPA Predictor & Calculator for University students. Predict your semester results and CGPA with the Resurrect My GPA roadmap tool. Plan your academic comeback to see if you can still make first class and hit your target.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} bg-[#f2f4f7] text-[#0a0a0a]`}
      >
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {children}

        {/* Google Analytics (gtag.js) */}
        <Script
          id="ga4-src"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="ga4-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`,
          }}
        />

        {/* html2canvas — same CDN the original page used */}
        <Script
          id="html2canvas-cdn"
          src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          strategy="afterInteractive"
        />

        {/* Vercel Web Analytics (only when deployed on Vercel) */}
        {process.env.VERCEL ? (
          <>
            <Script
              id="vercel-va"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`,
              }}
            />
            <Script
              id="vercel-insights"
              src="/_vercel/insights/script.js"
              strategy="afterInteractive"
            />
          </>
        ) : null}
      </body>
    </html>
  );
}

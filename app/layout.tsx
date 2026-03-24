import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "휴대폰 자급제 vs 통신사 구매 비교 계산기",
  description:
    "휴대폰 자급제와 통신사 구매 중 어떤 방식이 더 저렴한지 총비용 기준으로 비교해보세요.",
  keywords: [
    "자급제",
    "통신사 구매",
    "휴대폰 비교",
    "핸드폰 비교",
    "자급제 계산기",
    "요금제 비교",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
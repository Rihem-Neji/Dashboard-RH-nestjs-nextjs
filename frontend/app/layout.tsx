import type { Metadata } from "next";
import { ConfigProvider, App as AntApp } from "antd";
import "antd/dist/reset.css";
import "./globals.css";

const HEADER_H = 72; // DOIT matcher la valeur du header

export const metadata: Metadata = {
  title: "Dashboard RH",
  description: "Next.js + Ant Design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "var(--jg-blue-600)",
              colorInfo: "var(--jg-blue-600)",
              colorText: "var(--jg-navy-900)",
              colorLink: "var(--jg-blue-600)",
              colorLinkHover: "var(--jg-blue-700)",
              borderRadius: 10,
            },
            components: {
              Button: { controlHeight: 40, fontWeight: 600 },
              Tag: { defaultBg: "var(--jg-blue-050)", defaultColor: "var(--jg-navy-900)" },
              Card: { headerBg: "#fff", boxShadowTertiary: "0 6px 16px rgba(0,0,0,.06)" },
              Layout: { bodyBg: "var(--jg-blue-050)" },
            }
          }}
        >
          <AntApp>{children}</AntApp>
        </ConfigProvider>
      </body>
    </html>
  );
}

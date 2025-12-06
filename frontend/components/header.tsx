"use client";

import Image from "next/image";
import Link from "next/link";
import { Layout, Button, Space, Typography,Divider } from "antd";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout, getUser } from "@/lib/auth";

const { Header } = Layout;
const { Text } = Typography;
const HEADER_H = 72; // px  (choisis 64, 68, 72… mais garde-la fixe)


export default function AppHeader() {
  const router = useRouter();
  const authed = isAuthenticated();
  const user = getUser();

  const handleLogout = () => {
    logout();               // supprime le token localStorage
    router.push("/login");  // redirige vers login
  };

  return (
    <Header
      style={{
        background: "linear-gradient(180deg, var(--jg-blue-050), #fff)",
        borderBottom: "1px solid var(--jg-gray-200)",
        padding: 0,
        position: "fixed",    // ✅ colle toute la barre
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_H,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
  }}
      
    >
      <div
        style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",   // ✅ espace interne
        margin: 0,           // ✅ enlève marges externes
        width: "100%",       // ✅ occupe toute la largeur
        //position: "fixed",   // ✅ colle en haut
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,

        }}
      >
        {/* Gauche : logo + nom */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/logo.png" alt="Job Gate" width={60} height={50} priority />
          <Text style={{ fontWeight: 700, fontSize: 18, color: "var(--jg-navy-900)" }}>
            Job Gate
          </Text>
        </Link>

        {/* CENTRE : tagline */}
        <div style={{ textAlign: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--jg-navy-900)",
              letterSpacing: 0.5,
            }}
          >
            your gate to professional life
          </Text>
        </div>

        {/* Droite : actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
          {!authed ? (
            <>
              <Button type="text">
                <Link href="/register">Créer un compte</Link>
              </Button>
              <Divider type="vertical" />
              <Button type="primary">
                <Link href="/login">Se connecter</Link>
              </Button>
            </>
          ) : (
            <>
            <Space size="middle" style={{ marginRight: 0 }}>   
              <Text style={{ color: "var(--jg-navy-900)" }}>{user?.email}</Text>
                <Button danger onClick={handleLogout}>Logout</Button>
            </Space>

            </>
          )}
        
      </div>
      </div>
    </Header>
  );
}
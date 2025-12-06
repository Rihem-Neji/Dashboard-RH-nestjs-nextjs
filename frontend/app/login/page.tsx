"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import api from "@/lib/api";
import { getUser, saveToken } from "@/lib/auth";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await api.post<{ access_token: string }>("/auth/login", values);
      saveToken(data.access_token);
      const u = getUser(); // { email?, role? ... } depuis ton lib/auth (decode JWT)
      if (u?.role === 'RH') {
        router.push('/dashboard');     // back-office
      }else {
        router.push('/');              // page d’accueil “jobs”
}
      message.success("Connexion réussie !");
      //router.push(next);
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Échec de connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0096c7", // bleu du logo
    padding: 24,
  }}
>
  <Card style={{ width: 420, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <img src="/logo.png" alt="Job Gate" width={100} height={100 }/>
      </div>
      <Title level={3} style={{ margin: 8 }}>Bienvenue à Job Gate</Title>
      <p style={{ color: "#555" }}>Votre passerelle vers la vie professionnelle 🚀</p>
    </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Veuillez saisir votre email" },
              { type: "email", message: "Format d’email invalide" },
            ]}
          >
            <Input placeholder="email@exemple.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: "Veuillez saisir votre mot de passe" }]}
          >
            <Input.Password placeholder="••••••••" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Se connecter
          </Button>
        </Form>

        <Space style={{ marginTop: 12, width: "100%", justifyContent: "center" }}>
          <Text>Pas de compte ?</Text>
          <Button
            type="link"
            onClick={() => router.push(`/register?next=${encodeURIComponent(next)}`)}
          >
            Créer un compte
          </Button>
        </Space>
      </Card>
    </div>
  );
}

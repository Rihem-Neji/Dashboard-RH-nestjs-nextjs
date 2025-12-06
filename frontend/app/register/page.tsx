"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, Button, Card, Typography, message } from "antd";
import api from "@/lib/api";

const { Title } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/login";
  const [loading, setLoading] = useState(false);

  // adapte les champs aux exigences de ton backend (first_name/last_name si nécessaires)
  const onFinish = async (values: { name?: string; first_name?: string; last_name?: string; email: string; password: string; }) => {
    setLoading(true);
    try {
      // 👉 choisis la forme qui correspond à ton schéma côté Nest (exemple avec first_name/last_name)
      const payload = {
        first_name: values.first_name ?? values.name ?? "",
        last_name: values.last_name ?? "",
        email: values.email,
        password: values.password,
      };
      await api.post("/auth/register", payload);
      message.success("Compte créé. Connectez-vous.");
      router.push(`/login?next=${encodeURIComponent(next)}`);
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0096c7", // bleu Job Gate
        padding: 24,
      }}
    >
      <Card style={{ width: 480, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <img src="/logo.png" alt="Job Gate" width={100} height={100 }/>
          </div><Title level={3} style={{ margin: 8 }}>Inscrivez-vous sur Job Gate</Title>
          <p style={{ color: "#555" }}>Votre passerelle vers la vie professionnelle 🚀</p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Prénom" name="first_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nom" name="last_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mot de passe" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirmer le mot de passe"
            name="password2"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirmez le mot de passe" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) return Promise.resolve();
                  return Promise.reject(new Error("Les mots de passe ne correspondent pas"));
          
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Créer le compte
          </Button>
        </Form>
      </Card>
    </div>
  );
}

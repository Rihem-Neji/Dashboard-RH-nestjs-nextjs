// app/apply/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { App as AntApp, Card, Form, Input, Button, Typography, Select, Upload } from "antd";
import api from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type ApplyFormValues = {
  nom: string;
  prenom: string;
  email: string;
  CV: string;
  status: "submitted" | "pending" | "accepted" | "rejected";
};

// --- Helpers -------------------------------------------------
const titleCase = (s?: string) =>
  (s ?? "")
    .trim()
    .toLowerCase()
    .replace(/(^.|[-_\s].)/g, (m) => m.toUpperCase())
    .replace(/[-_]/g, " ");

/** Extrait {nom, prenom, email} d’un payload JWT hétérogène, sans inverser. */
function extractIdentity(u: any): { nom: string; prenom: string; email: string } {
  const email: string = u?.email ?? "";

  // 1) champs explicites les plus fréquents
  const prenomExpl =
    u?.prenom ?? u?.firstName ?? u?.given_name ?? u?.givenName ?? u?.given ??
    undefined;
  const nomExpl =
    u?.nom ?? u?.lastName ?? u?.family_name ?? u?.familyName ?? u?.surname ??
    undefined;

  if (prenomExpl || nomExpl) {
    return {
      prenom: titleCase(String(prenomExpl ?? "")),
      nom: titleCase(String(nomExpl ?? "")),
      email,
    };
  }

  // 2) dérive depuis l’email si pas d’infos explicites
  //    "khawla.benali@…" -> ["khawla", "benali"]
  const base = email.split("@")[0] || "";
  const parts = base.split(/[._-]+/).filter(Boolean);

  const prenom =
    parts.length >= 1 ? titleCase(parts[0]) : "";
  const nom =
    parts.length >= 2 ? titleCase(parts.slice(1).join(" ")) : ""; // tout le reste en nom

  return { prenom, nom, email };
}
// -------------------------------------------------------------

export default function ApplyPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const offerId = sp.get("offer");

  const { modal ,message} = AntApp.useApp();
  const [form] = Form.useForm<ApplyFormValues>();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false); // attendre la vérif d'auth pour rendre
  const [file, setFile] = useState<File | null>(null);

  // --- Garde d’auth + Préremplissage ---
  useEffect(() => {
    if (!offerId) return setChecked(true);

    if (!isAuthenticated()) {
      const next = encodeURIComponent(`/apply?offer=${offerId}`);
      router.replace(`/login?next=${next}`);
      return;
    }

    const u = getUser(); // payload JWT décodé
    const { nom, prenom, email } = extractIdentity(u);

    form.setFieldsValue({
      nom,
      prenom,
      email,
      CV: "",
      status: "submitted",
    });

    setChecked(true);
  }, [offerId, router, form]);

  if (!checked) return null;
  if (!offerId) {
    return <div style={{ padding: 24 }}>Aucune offre sélectionnée.</div>;
  }
  const beforeUpload = (f: File) => {
    const ok = f.type === "application/pdf";
    if (!ok) message.error("Merci de sélectionner un PDF.");
    setFile(ok ? f : null);
    return false; // empêcher l'upload auto d'AntD, on gère nous-mêmes
  };

   const onFinish = async (values: ApplyFormValues) => {
    if (!file) {
      message.error("Le CV (PDF) est requis.");
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("id_offre", offerId!);
      fd.append("nom", values.nom);
      fd.append("prenom", values.prenom);
      fd.append("email", values.email);
      // fd.append("status", "submitted"); // optionnel, le back le met par défaut
      fd.append("cv", file); // IMPORTANT: nom du champ = 'cv'

      await api.post("/candidatures", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await modal.success({
        title: "Votre postulation a été enregistrée ✅",
        centered: true,
        okText: "OK",
      });

      form.resetFields();
      setFile(null);
      router.push("/");
    } catch (err: any) {
      modal.error({
        title: "Échec de la postulation",
        content: err?.response?.data?.message || "Veuillez réessayer plus tard.",
        centered: true,
        okText: "Fermer",
      });
    } finally {
      setLoading(false);
    }
  };



  ////// --- Soumission ---

 // const onFinish = async (values: ApplyFormValues) => {
    //try {
      //setLoading(true);

//      await api.post("/candidatures", {
  //      id_offre: offerId,
    //    ...values,
      //});

      //await modal.success({
        //title: "Votre postulation a été enregistrée ✅",
        //content: "Nous vous recontacterons si votre profil correspond.",
        //centered: true,
        //okText: "OK",
      //});

      //form.resetFields();
      //router.push("/");
    //} catch (err: any) {
      //modal.error({
        //title: "Échec de la postulation",
       // content: err?.response?.data?.message || "Veuillez réessayer plus tard.",
        //centered: true,
        //okText: "Fermer",
      //});
    //} finally {
      //setLoading(false);
    //}
  //};


  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <Card style={{ width: 560 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Postuler à l’offre
        </Title>
        <Text type="secondary">
          Offre ID : <b>{offerId}</b>
        </Text>

        <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
          <Form.Item label="Nom" name="nom" rules={[{ required: true, message: "Nom requis" }]}>
            <Input placeholder="Votre nom" />
          </Form.Item>

          <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: "Prénom requis" }]}>
            <Input placeholder="Votre prénom" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email requis" },
              { type: "email", message: "Email invalide" },
            ]}
          >
            <Input placeholder="email@exemple.com" />
          </Form.Item>

          <Form.Item
            label="CV (PDF)"
            required
            tooltip="PDF uniquement"
          >
             <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              accept=".pdf"
              showUploadList={{ showRemoveIcon: true }}
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Choisir un PDF</Button>
            </Upload>
          </Form.Item>


          {/* On envoie toujours 'submitted' lors d'une nouvelle candidature */}
          <Form.Item label="Statut" name="status" initialValue="submitted">
            <Select
              options={[
                { label: "Soumis", value: "submitted" },
                { label: "En attente", value: "pending", disabled: true },
                { label: "Accepté", value: "accepted", disabled: true },
                { label: "Refusé", value: "rejected", disabled: true },
              ]}
              disabled
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Envoyer
          </Button>
        </Form>
      </Card>
    </div>
  );
}

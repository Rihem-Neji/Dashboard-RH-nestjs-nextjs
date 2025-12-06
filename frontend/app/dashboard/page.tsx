"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, isAuthenticated } from "@/lib/auth";
import api from "@/lib/api";
import AppHeader from "@/components/header";

import OfferForm, {
  OfferFormValues,
  OfferFormFields,
  toFormValues,
  toPayload,
} from "@/components/offerForm";

import CandidatesTable from "@/components/CandidatesTable";

import {
  Layout,
  Table,
  Button,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Menu,
} from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

// --- Hauteur du header fixe (doit matcher AppHeader)
const HEADER_H = 72;

type Offer = OfferFormValues & { _id: string };

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  // --- NAV LATERALE (ajout de "home")
  type MenuKey = "home" | "offers" | "candidates";

  // clé sélectionnée selon l’URL (robuste en navigation directe)
  const selectedKey: MenuKey = useMemo(() => {
    if (pathname?.startsWith("/offers")) return "offers";
    if (pathname?.startsWith("/applications")) return "candidates";
    if (pathname?.startsWith("/dashboard")) return "offers"; // par défaut: section Offres
    return "home";
  }, [pathname]);

  const [menuKey, setMenuKey] = useState<MenuKey>(selectedKey);
  useEffect(() => setMenuKey(selectedKey), [selectedKey]);

  // --- Guards d'accès
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login?next=/dashboard");
    } else if (u.role !== "RH") {
      message.error("Accès réservé aux RH");
      router.replace("/"); // renvoyer vers l’accueil
    }
  }, [router]);

  // --- Offres
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form] = Form.useForm<OfferFormFields>();

  const loadOffers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Offer[]>("/offers");
      setOffers(data || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = toPayload(values);
      if (editing) {
        await api.put(`/offers/${editing._id}`, payload);
        message.success("Offre mise à jour");
      } else {
        await api.post("/offers", payload);
        message.success("Offre créée");
      }
      setOpen(false);
      setEditing(null);
      form.resetFields();
      loadOffers();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || "Erreur");
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.delete(`/offers/${id}`);
      message.success("Offre supprimée");
      loadOffers();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Erreur");
    }
  };

  const offerColumns = [
    { title: "ID", dataIndex: "id_offre" },
    { title: "Titre", dataIndex: "titre" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Statut",
      dataIndex: "status_offre",
      render: (s: Offer["status_offre"]) => (
        <Tag color={s === "active" ? "green" : "default"}>{s}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_: any, record: Offer) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(toFormValues(record));
              setOpen(true);
            }}
          >
            Modifier
          </Button>
          <Popconfirm title="Supprimer ?" onConfirm={() => onDelete(record._id)}>
            <Button type="link" danger>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- Navigation menu (sans <Link/>, plus stable avec Menu)
  const handleMenuClick = ({ key }: { key: string }) => {
    const k = key as MenuKey;
    setMenuKey(k);
    if (k === "home") router.push("/"); // ⬅️ Accueil en 1er
    if (k === "offers") router.push("/dashboard"); // tu peux aussi /offers si tu as une route dédiée
    if (k === "candidates") router.push("/apply");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader />

      {/* décale tout le layout sous le header fixe */}
      <Layout style={{ marginTop: HEADER_H }}>
        <Sider
          width={220}
          theme="light"
          style={{
            borderRight: "1px solid #eee",
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflow: "auto",
            background: "#fff",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[menuKey]}
            onClick={(e) => {
              const k = e.key as "home" |"offers" | "candidates";
              setMenuKey(k);
              if (k === "home") {
                router.push("/");          // ⬅️ ouvre la vraie page d’accueil
              } else {
                router.push("/dashboard"); // ⬅️ reste dans dashboard pour les autres
              }
            }}
            items={[
              { key: "home", icon: <HomeOutlined />, label: "Accueil" }, // ⬅️ 1er item
              { key: "offers", icon: <AppstoreOutlined />, label: "Gestion des offres" },
              { key: "candidates", icon: <TeamOutlined />, label: "Gestion des candidatures" },
            ]}
          />
        </Sider>

        <Content style={{ padding: 24 }}>
          {/* Section Offres (par défaut dans /dashboard) */}
          {menuKey === "offers" && (
            <>
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditing(null);
                    form.resetFields();
                    setOpen(true);
                  }}
                >
                  Nouvelle offre
                </Button>
              </Space>

              <Table
                rowKey="_id"
                columns={offerColumns as any}
                dataSource={offers}
                loading={loading}
              />

              <Modal
                title={editing ? "Modifier une offre" : "Créer une offre"}
                open={open}
                onOk={onSubmit}
                onCancel={() => {
                  setOpen(false);
                  setEditing(null);
                }}
                okText={editing ? "Enregistrer" : "Créer"}
                destroyOnClose
              >
                <Form form={form} layout="vertical" initialValues={{ status_offre: "active" }}>
                  <OfferForm />
                </Form>
              </Modal>
            </>
          )}

          {/* Section Candidatures */}
          {menuKey === "candidates" && (
            <>
              <h3 style={{ marginBottom: 16 }}>Candidatures</h3>
              <CandidatesTable />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

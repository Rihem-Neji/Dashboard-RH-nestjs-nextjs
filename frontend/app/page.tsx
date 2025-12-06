"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Row,
  Col,
  Input,
  Empty,
  Typography,
  Skeleton,
  Space,
  Pagination,
  Button, // (déjà ajouté pour le bouton RH)
} from "antd";
import api from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth"; // (déjà ajouté pour détecter RH)
import OfferCard, { Offer } from "@/components/offerCard";
import AppHeader from "@/components/header";

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// ✅ hauteur du header fixe (AntD Header = 64px)
const HEADER_H = 64;

export default function HomePage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const user = getUser(); // (déjà ajouté)

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // 6 cards par page (3 colonnes * 2 rangées)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/offers");
        setOffers(data || []);
      } catch (e) {
        console.error("Erreur lors du chargement des offres", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrage par recherche
  const filtered = useMemo(() => {
    if (!q.trim()) return offers;
    const needle = q.toLowerCase();
    return offers.filter(
      (o) =>
        o.titre?.toLowerCase().includes(needle) ||
        o.description?.toLowerCase().includes(needle)
    );
  }, [offers, q]);

  // Découpage pour pagination
  const total = filtered.length;
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Réinitialiser la page si la recherche change et fait “rétrécir” la liste
  useEffect(() => {
    setPage(1);
  }, [q]);

  // Clic sur "Postuler"
  const handleApply = (offer: Offer) => {
    if (!isAuthenticated()) {
      router.push(`/login?next=/`);
      return;
    }
    router.push(`/apply?offer=${offer._id}`);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--jg-blue-050)" }}>
      <AppHeader />
      {/* ✅ spacer pour ne plus recouvrir le contenu par la barre fixe */}
      <div style={{ height: HEADER_H }} />

      <Content style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Titre + sous-titre */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Title>Découvrez nos opportunités</Title>
            <Paragraph type="secondary">
              Consultez les offres disponibles et postulez en un clic.
            </Paragraph>
          </div>

          {/* ✅ Bouton visible uniquement pour RH */}
          {user?.role === "RH" && (
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <Button type="primary" size="large" onClick={() => router.push("/dashboard")}>
                Accéder au Dashboard RH
              </Button>
            </div>
          )}

          {/* Barre de recherche */}
          <div style={{ maxWidth: 640, margin: "0 auto 24px" }}>
            <Input.Search
              allowClear
              size="large"
              placeholder="Rechercher par titre, mots-clés…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Liste d’offres */}
          {loading ? (
            <Row gutter={[16, 16]}>
              {Array.from({ length: pageSize }).map((_, i) => (
                <Col key={i} xs={24} sm={12} md={8} style={{ display: "flex" }}>
                  <div style={{ width: "100%" }}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : total === 0 ? (
            <Empty description="Aucune offre trouvée" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {paged.map((offer) => (
                  <Col
                    key={offer._id}
                    xs={24}
                    sm={12}
                    md={8}
                    style={{ display: "flex" }}     // ⬅️ Col flex pour que la Card s’étire
                  >
                    <div style={{ width: "100%" }}>
                      <OfferCard offer={offer} onApply={handleApply} />
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <Space
                style={{
                  marginTop: 24,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger
                  pageSizeOptions={[6, 9, 12, 15]}
                  onChange={(p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                  }}
                  showTotal={(t) => `${t} offre(s)`}
                />
              </Space>
            </>
          )}
        </div>
      </Content>

      <Footer style={{ background: "#fff", borderTop: "1px solid var(--jg-gray-200)", textAlign: "center" }}>
        © {new Date().getFullYear()} RH Jobs — Inspiré de TanitJobs
      </Footer>
    </Layout>
  );
}

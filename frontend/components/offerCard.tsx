"use client";

import { Card, Tag, Button, Space, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

export type Offer = {
  _id: string;
  id_offre?: string;                     // optionnel si tu l’as en BD
  titre: string;
  description: string;
  status_offre?: "active" | "archived";
  createdAt?: string;                    // optionnel
};

export default function OfferCard({
  offer,
  onApply,
}: {
  offer: Offer;
  onApply: (offer: Offer) => void;
}) {
  const isArchived = offer.status_offre === "archived";

  return (
    <Card hoverable styles={{
    body: { display: "flex", flexDirection: "column", gap: 10 , height:260},
  }}>
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Space wrap align="center">
          <Title level={4} style={{ margin: 0 }}>
            {offer.titre}
          </Title>
          {/* Tag cohérent avec le vert du logo */}
          {isArchived ? (
            <Tag>archived</Tag>
          ) : (
            <Tag style={{ background: "rgba(138,186,62,.12)", color: "var(--jg-green-500)", borderColor: "transparent" }}>
              active
            </Tag>
          )}
        </Space>

        {/* Ligne d’info légère (facultatif) */}
        {(offer.id_offre || offer.createdAt) && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {offer.id_offre ? `Réf: ${offer.id_offre}` : null}
            {offer.id_offre && offer.createdAt ? " • " : ""}
            {offer.createdAt ? `Publiée le ${new Date(offer.createdAt).toLocaleDateString()}` : null}
          </Text>
        )}

        <Paragraph ellipsis={{ rows: 3 }}>{offer.description}</Paragraph>

       <div style={{ marginTop: "auto" }}>
          <Button
            type="primary"
            block
            disabled={isArchived}
            onClick={() => onApply(offer)}
            style={{ background: "var(--jg-blue-600)" }}
          >
          Postuler
        </Button>
      </div>
    </Space>
    </Card>
  );
}

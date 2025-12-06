"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/lib/api";

export type Candidature = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  status: "submitted" | "pending" | "accepted" | "rejected";
  id_offre?: { titre?: string; id_offre?: string };
  cvUrl?: string;
  cvOriginalName?: string;
  cvMimeType?: string;
  cvSize?: number;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function CandidatesTable() {
  const [data, setData] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Candidature[]>("/candidatures");
      setData(data || []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: Candidature["status"]) => {
    try {
      await api.put(`/candidatures/${id}`, { status });
      setData(prev => prev.map(c => (c._id === id ? { ...c, status } : c)));
      message.success("Statut mis à jour");
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Erreur de mise à jour");
    }
  };

  const columns: ColumnsType<Candidature> = [
    {
      title: "Offre",
      dataIndex: ["id_offre", "titre"],
      render: (_: string | undefined, r) =>
        r.id_offre?.titre ? (
          <>
            <div style={{ fontWeight: 600 }}>{r.id_offre.titre}</div>
            <div style={{ color: "#888" }}>{r.id_offre.id_offre}</div>
          </>
        ) : (
          "—"
        ),
    },
    { title: "Nom", dataIndex: "nom" },
    { title: "Email", dataIndex: "email" },

    // 🔵 Colonne CV : affiche un lien si cvUrl existe
    {
      title: "CV",
      dataIndex: "cvUrl",
      render: (cvUrl: string | undefined, record) => {
        if (!cvUrl) return "—";
        const href = `${API}${cvUrl}`;
        const label = record.cvOriginalName || "Télécharger le CV";
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      },
    },

    {
      title: "Statut",
      dataIndex: "status",
      render: (s: Candidature["status"], r) => {
        const color =
          s === "accepted" ? "green" :
          s === "pending" ? "gold" :
          s === "rejected" ? "red" : "blue";
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tag color={color}>{s}</Tag>
            <Select
              size="small"
              value={s}
              onChange={(val) => updateStatus(r._id, val)}
              options={[
                { value: "submitted", label: "Soumise" },
                { value: "pending", label: "En attente" },
                { value: "accepted", label: "Acceptée" },
                { value: "rejected", label: "Refusée" },
              ]}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Table<Candidature>
      rowKey="_id"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
}

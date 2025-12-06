"use client";

import { Form, Input, DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";

export type OfferFormValues = {
  id_offre: string;
  titre: string;
  description: string;
  date?: string; // ISO
  status_offre: "active" | "archived";
};
// Type utilisé *dans le Form* (DatePicker attend du Dayjs)
export type OfferFormFields = Omit<OfferFormValues, "date"> & {
  date?: Dayjs | null;
};

export default function OfferForm() {
  return (
    <>
      <Form.Item label="ID Offre" name="id_offre" rules={[{ required: true }]}>
        <Input placeholder="OFF-2025-001" />
      </Form.Item>
      <Form.Item label="Titre" name="titre" rules={[{ required: true, min: 3 }]}>
        <Input placeholder="Développeur Frontend" />
      </Form.Item>
      <Form.Item label="Description" name="description" rules={[{ required: true, min: 10 }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Date" name="date">
        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label="Statut" name="status_offre" initialValue="active">
        <Select
          options={[
            { label: "Active", value: "active" },
            { label: "Archivée", value: "archived" },
          ]}
        />
      </Form.Item>
    </>
  );
}

export function serializeOffer(values: any) {
  const v = { ...values };
  if (v.date) v.date = (v.date as any).toISOString?.() || dayjs(v.date).toISOString();
  return v;
}
// OfferForm.tsx (à la fin du fichier)
export function toFormValues(apiOffer: OfferFormValues): OfferFormFields {
  return {
    ...apiOffer,
    date: apiOffer.date ? dayjs(apiOffer.date) : null,
  };
}

export function toPayload(formValues: OfferFormFields): OfferFormValues {
  return {
    ...formValues,
    date: formValues.date ? formValues.date.format("YYYY-MM-DD") : undefined,
  };
}

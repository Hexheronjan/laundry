import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDateTime, rupiah } from "@/lib/utils/format";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#0F172A",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#0F766E",
    paddingBottom: 10,
  },
  businessName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0F766E",
    textTransform: "uppercase",
  },
  reportTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 8,
    color: "#64748B",
    marginTop: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryLabel: {
    fontSize: 7,
    color: "#64748B",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0F766E",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 10,
  },
  table: {
    width: "100%",
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0F766E",
    padding: 5,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    padding: 4,
    fontSize: 8,
  },
  colNo: { width: "5%" },
  colNota: { width: "20%" },
  colCust: { width: "20%" },
  colDate: { width: "15%" },
  colStatus: { width: "15%" },
  colPay: { width: "13%" },
  colTotal: { width: "12%", textAlign: "right" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 7,
    color: "#94A3B8",
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
  },
});

interface ReportPdfProps {
  businessName: string;
  startDate: string;
  endDate: string;
  totalOrders: number;
  paidRevenue: number;
  totalBilled: number;
  orders: {
    invoiceNo: string;
    customerName: string;
    receivedAt: string;
    status: string;
    paymentStatus: string;
    total: number;
  }[];
}

export function ReportPdfDocument({
  businessName,
  startDate,
  endDate,
  totalOrders,
  paidRevenue,
  totalBilled,
  orders,
}: ReportPdfProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.businessName}>{businessName}</Text>
          <Text style={styles.reportTitle}>LAPORAN OPERASIONAL & PENDAPATAN TRANSAKSI</Text>
          <Text style={styles.subtitle}>
            Periode: {startDate} s/d {endDate} | Dicetak: {new Date().toLocaleString("id-ID")}
          </Text>
        </View>

        {/* Ringkasan Angka */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Transaksi</Text>
            <Text style={styles.summaryValue}>{totalOrders}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Pendapatan Lunas</Text>
            <Text style={styles.summaryValue}>{rupiah(paidRevenue)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Nilai Tagihan</Text>
            <Text style={styles.summaryValue}>{rupiah(totalBilled)}</Text>
          </View>
        </View>

        {/* Tabel Pesanan */}
        <Text style={styles.sectionTitle}>Daftar Transaksi Pesanan</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>No</Text>
            <Text style={styles.colNota}>No. Nota</Text>
            <Text style={styles.colCust}>Pelanggan</Text>
            <Text style={styles.colDate}>Tanggal</Text>
            <Text style={styles.colStatus}>Status Laundry</Text>
            <Text style={styles.colPay}>Pembayaran</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {orders.slice(0, 35).map((o, idx) => (
            <View key={o.invoiceNo} style={styles.tableRow}>
              <Text style={styles.colNo}>{idx + 1}</Text>
              <Text style={[styles.colNota, { fontFamily: "Helvetica-Bold" }]}>{o.invoiceNo}</Text>
              <Text style={styles.colCust}>{o.customerName}</Text>
              <Text style={styles.colDate}>{formatDateTime(o.receivedAt)}</Text>
              <Text style={styles.colStatus}>{ORDER_STATUS_LABEL[o.status as keyof typeof ORDER_STATUS_LABEL]}</Text>
              <Text style={styles.colPay}>{PAYMENT_STATUS_LABEL[o.paymentStatus as keyof typeof PAYMENT_STATUS_LABEL]}</Text>
              <Text style={[styles.colTotal, { fontFamily: "Helvetica-Bold" }]}>{rupiah(o.total)}</Text>
            </View>
          ))}
        </View>

        {orders.length > 35 && (
          <Text style={{ fontSize: 8, color: "#64748B", fontStyle: "italic", textAlign: "right" }}>
            * Menampilkan 35 dari {orders.length} transaksi. Silakan unduh format Excel untuk data lengkap tanpa batas.
          </Text>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Laporan ini diterbitkan otomatis oleh Sistem Laundry ({businessName}) | Rahasia & Khusus Internal
        </Text>
      </Page>
    </Document>
  );
}

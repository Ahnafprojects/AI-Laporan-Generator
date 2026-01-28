"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Download, Printer, Receipt } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export default function InvoiceGeneratorPage() {
    const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [fromName, setFromName] = useState("Nama Perusahaan Anda");
    const [fromEmail, setFromEmail] = useState("email@perusahaan.com");
    const [toName, setToName] = useState("Nama Klien");
    const [toEmail, setToEmail] = useState("klien@email.com");

    const [items, setItems] = useState<InvoiceItem[]>([
        { id: '1', description: "Jasa Pembuatan Laporan", quantity: 1, price: 500000 },
        { id: '2', description: "Maintenance", quantity: 2, price: 150000 },
    ]);

    const invoiceRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    const addItem = () => {
        setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, price: 0 }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const handleDownload = async () => {
        if (!invoiceRef.current) return;
        setLoading(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${invoiceNumber}.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Gagal membuat PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
                    <Receipt className="h-8 w-8 text-purple-600" /> Invoice Generator
                </h1>
                <p className="text-gray-500">
                    Buat invoice profesional dalam hitungan detik. Download PDF siap kirim.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* EDITOR FORM */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>No. Invoice</Label>
                                    <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal</Label>
                                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label className="text-purple-600 font-bold">Dari (Sender)</Label>
                                    <Input placeholder="Nama Perusahaan" value={fromName} onChange={(e) => setFromName(e.target.value)} />
                                    <Input placeholder="Email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-600 font-bold">Kepada (Client)</Label>
                                    <Input placeholder="Nama Klien" value={toName} onChange={(e) => setToName(e.target.value)} />
                                    <Input placeholder="Email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <Label className="font-bold">Item Pekerjaan</Label>
                                </div>
                                {items.map((item, index) => (
                                    <div key={item.id} className="flex gap-2 items-start">
                                        <div className="flex-1 space-y-1">
                                            <Input
                                                placeholder="Deskripsi"
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-20 space-y-1">
                                            <Input
                                                type="number"
                                                placeholder="Qty"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="w-32 space-y-1">
                                            <Input
                                                type="number"
                                                placeholder="Harga"
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Item
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PREVIEW */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                        <span className="font-bold text-gray-700">Preview Invoice</span>
                        <Button onClick={handleDownload} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                            {loading ? "Generating..." : <><Download className="w-4 h-4 mr-2" /> Download PDF</>}
                        </Button>
                    </div>

                    <div className="overflow-auto max-h-[800px] border rounded-xl shadow-lg bg-gray-500/10 p-4 flex justify-center">
                        <div
                            ref={invoiceRef}
                            className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl text-sm text-gray-800 relative flex flex-col"
                            style={{ transform: 'scale(0.8)', transformOrigin: 'top center' }} // Scale down visual
                        >
                            {/* INVOICE HEADER */}
                            <div className="flex justify-between items-start mb-12 border-b pb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-purple-700 mb-2">INVOICE</h2>
                                    <p className="text-gray-500 font-medium">{invoiceNumber}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="font-bold text-xl">{fromName}</h3>
                                    <p className="text-gray-500">{fromEmail}</p>
                                    <p className="text-gray-500 mt-2">{date}</p>
                                </div>
                            </div>

                            {/* CLIENT INFO */}
                            <div className="mb-12">
                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Tagihan Kepada:</p>
                                <h3 className="font-bold text-xl">{toName}</h3>
                                <p className="text-gray-600">{toEmail}</p>
                            </div>

                            {/* TABLE */}
                            <table className="w-full mb-8">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="text-left py-3 font-bold text-gray-600">Deskripsi</th>
                                        <th className="text-center py-3 font-bold text-gray-600 w-24">Qty</th>
                                        <th className="text-right py-3 font-bold text-gray-600 w-40">Harga Satuan</th>
                                        <th className="text-right py-3 font-bold text-gray-600 w-40">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-50">
                                            <td className="py-4">{item.description || "Item Pekerjaan"}</td>
                                            <td className="py-4 text-center">{item.quantity}</td>
                                            <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                                            <td className="py-4 text-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* TOTAL */}
                            <div className="flex justify-end mt-auto mb-12">
                                <div className="w-1/2 bg-gray-50 p-6 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl font-bold text-purple-700 border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span>{formatCurrency(calculateTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="mt-auto pt-8 border-t text-center text-gray-400 text-xs">
                                <p>Terima kasih atas kepercayaan Anda.</p>
                                <p>Genereated automatically by AI Laporan Tools</p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

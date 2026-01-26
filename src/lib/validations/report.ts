import { z } from "zod";

export const reportFormSchema = z.object({
  title: z.string().min(5, "Judul praktikum minimal 5 karakter"),
  subject: z.string().min(3, "Mata kuliah wajib diisi"),
  studentName: z.string().min(3, "Nama mahasiswa wajib diisi"),
  studentId: z.string().min(1, "NRP wajib diisi"),
  class: z.string().min(1, "Kelas wajib diisi"),
  practiceDate: z.date({ required_error: "Tanggal praktikum wajib dipilih" }),
  lecturer: z.string().min(3, "Nama Dosen wajib diisi"),
  
  // Input Soal & Jawaban
  labSheet: z.string().min(20, "Soal/Modul Praktikum minimal 20 karakter"),
  codeContent: z.string().optional(), // Opsional - untuk jawaban coding
  questionImage: z.string().optional(), // Opsional - upload foto soal
  
  additionalNotes: z.string().optional(),
  templateStyle: z.enum(["formal", "detailed"]).default("detailed"),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
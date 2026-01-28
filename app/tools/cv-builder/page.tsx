"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Plus, Trash2, FileText, Image as ImageIcon } from "lucide-react";
import { useToolUsage } from "@/hooks/useToolUsage";

export default function CVBuilderPage() {
  const { isLimited, incrementUsage, remaining } = useToolUsage("cv-builder");
  // --- STATE DATA CV ---
  const [personal, setPersonal] = useState({
    name: "NAMA LENGKAP",
    email: "email@anda.com",
    phone: "0812-xxxx-xxxx",
    linkedin: "linkedin.com/in/username",
    address: "Kota, Negara",
    portfolio: "https://portfolio.com"
  });

  // State khusus Foto
  const [photo, setPhoto] = useState<string | null>(null);

  const [summary, setSummary] = useState("Tulis ringkasan singkat tentang dirimu di sini...");

  const [experiences, setExperiences] = useState([
    { id: 1, company: "Nama Perusahaan", role: "Posisi Pekerjaan", date: "Jan 2023 - Des 2023", bullets: ["Jelaskan tugasmu di sini..."] }
  ]);

  const [educations, setEducations] = useState([
    { id: 1, school: "Nama Kampus/Sekolah", degree: "Jurusan", date: "2020 - 2024", gpa: "3.85" }
  ]);

  const [skills, setSkills] = useState("Skill 1, Skill 2, Skill 3");

  const [loadingAI, setLoadingAI] = useState(false);
  const [usageInfo, setUsageInfo] = useState({ currentUsage: 0, maxUsage: 5, isPro: false });

  // --- HANDLERS ---
  const handlePersonal = (e: any) => setPersonal({ ...personal, [e.target.name]: e.target.value });

  // Handle Upload Foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addExp = () => setExperiences([...experiences, { id: Date.now(), company: "", role: "", date: "", bullets: [""] }]);
  const removeExp = (id: number) => setExperiences(experiences.filter(e => e.id !== id));
  const updateExp = (id: number, field: string, val: any) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const addEdu = () => setEducations([...educations, { id: Date.now(), school: "", degree: "", date: "", gpa: "" }]);
  const removeEdu = (id: number) => setEducations(educations.filter(e => e.id !== id));
  const updateEdu = (id: number, field: string, val: string) => {
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  // --- AI MAGIC ---
  const optimizeSummary = async () => {
    const textToOptimize = summary.trim();

    if (!textToOptimize || textToOptimize === "Tulis ringkasan singkat tentang dirimu di sini...") {
      alert("Tulis ringkasan tentang dirimu terlebih dahulu sebelum menggunakan AI");
      return;
    }

    setLoadingAI(true);
    try {
      const res = await fetch("/api/cv/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textToOptimize, type: "summary" }) // Remove hardcoded lang
      });

      const json = await res.json();
      console.log("Summary optimize response:", json);

      if (json.success) {
        setSummary(json.data);
        if (json.usageInfo) {
          setUsageInfo(json.usageInfo);
          if (!json.usageInfo.isPro) {
            alert(`Summary berhasil dioptimasi!\n\nPenggunaan AI hari ini: ${json.usageInfo.currentUsage}/${json.usageInfo.maxUsage}`);
          }
        }
      } else {
        if (json.error?.includes('Daily AI usage limit')) {
          alert(`Batas Penggunaan AI Tercapai\n\n${json.error}\n\nUpgrade ke PRO untuk akses unlimited AI`);
        } else {
          alert(`Gagal mengoptimasi summary: ${json.error || 'Unknown error'}`);
        }
      }
    } catch (e) {
      console.error("Summary optimize error:", e);
      alert("Gagal menghubungi server");
    }
    setLoadingAI(false);
  };

  const optimizeBullets = async (id: number, text: string) => {
    const textToOptimize = text.trim();

    if (!textToOptimize) {
      alert("Masukkan deskripsi pekerjaan terlebih dahulu");
      return;
    }

    setLoadingAI(true);
    try {
      const res = await fetch("/api/cv/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textToOptimize, type: "bullet" }) // Remove hardcoded lang
      });

      const json = await res.json();
      console.log("Bullets optimize response:", json);

      if (json.success && Array.isArray(json.data)) {
        updateExp(id, 'bullets', json.data);
        if (json.usageInfo) {
          setUsageInfo(json.usageInfo);
          if (!json.usageInfo.isPro) {
            alert(`Bullet points berhasil dioptimasi!\n\nPenggunaan AI hari ini: ${json.usageInfo.currentUsage}/${json.usageInfo.maxUsage}`);
          }
        }
      } else {
        if (json.error?.includes('Daily AI usage limit')) {
          alert(`Batas Penggunaan AI Tercapai\n\n${json.error}\n\nUpgrade ke PRO untuk akses unlimited AI`);
        } else {
          alert(`Gagal mengoptimasi bullets: ${json.error || 'Response tidak valid'}`);
        }
      }
    } catch (e) {
      console.error("Bullets optimize error:", e);
      alert("Gagal menghubungi server");
    }
    setLoadingAI(false);
  };

  const optimizeSkills = async () => {
    const textToOptimize = skills.trim();

    if (!textToOptimize || textToOptimize === "Skill 1, Skill 2, Skill 3") {
      alert("Masukkan skills kamu terlebih dahulu sebelum menggunakan AI");
      return;
    }

    setLoadingAI(true);
    try {
      const res = await fetch("/api/cv/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textToOptimize, type: "skills" }) // Remove hardcoded lang
      });

      const json = await res.json();
      console.log("Skills optimize response:", json);

      if (json.success) {
        setSkills(json.data);
        if (json.usageInfo) {
          setUsageInfo(json.usageInfo);
          if (!json.usageInfo.isPro) {
            alert(`Skills berhasil dioptimasi!\n\nPenggunaan AI hari ini: ${json.usageInfo.currentUsage}/${json.usageInfo.maxUsage}`);
          }
        }
      } else {
        if (json.error?.includes('Daily AI usage limit')) {
          alert(`Batas Penggunaan AI Tercapai\n\n${json.error}\n\nUpgrade ke PRO untuk akses unlimited AI`);
        } else {
          alert(`Gagal mengoptimasi skills: ${json.error || 'Response tidak valid'}`);
        }
      }
    } catch (e) {
      console.error("Skills optimize error:", e);
      alert("Gagal menghubungi server");
    }
    setLoadingAI(false);
  };

  // --- EXPORT TO WORD (VERSI TABEL ANTI-HANCUR) ---
  const componentRef = useRef<HTMLDivElement>(null);

  const exportToWord = () => {
    if (!incrementUsage()) return; // Check limit

    // Prepare data untuk HTML generator
    const cvData = {
      personal: personal,
      summary: summary,
      experience: experiences,
      education: educations,
      skills: skills,
      photo: photo
    };

    // Generate HTML dengan versi tabel anti-hancur
    const wordHTML = generateHarvardHTML(cvData);

    // Create blob and download
    const blob = new Blob([wordHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${personal.name.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- HARVARD HTML GENERATOR (WORD COMPATIBLE) ---
  const generateHarvardHTML = (data: any) => {
    return `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>CV ${data.personal?.name || 'Candidate'}</title>
        <style>
          /* Reset dasar untuk Word */
          body { font-family: 'Times New Roman', serif; font-size: 11pt; color: #000000; line-height: 1.2; margin: 0; }
          table { width: 100%; border-collapse: collapse; border: none; margin: 0; padding: 0; }
          td { vertical-align: top; padding: 0; }
          ul { margin: 2px 0 0 20px; padding: 0; }
          li { margin-bottom: 2px; text-align: justify; }
          
          /* Styling Khusus */
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000000;
            margin-top: 15px;
            margin-bottom: 8px;
            padding-bottom: 2px;
          }
          .bold { font-weight: bold; }
          .italic { font-style: italic; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <div style="width: 210mm; margin: auto; padding: 10mm;">
          
          <table style="width: 100%; border-bottom: 2px solid #000; margin-bottom: 15px;">
            <tr>
              <td style="width: ${data.photo ? '80%' : '100%'}; vertical-align: middle;">
                <div style="font-size: 24pt; font-weight: bold; text-transform: uppercase; margin-bottom: 5px;">
                  ${data.personal?.name || 'YOUR NAME'}
                </div>
                <div style="font-size: 10pt;">
                  ${data.personal?.email || ''} | ${data.personal?.phone || ''}<br/>
                  ${data.personal?.address || ''}<br/>
                  ${data.personal?.linkedin || ''}
                  ${data.personal?.portfolio ? `<br/>${data.personal.portfolio}` : ''}
                </div>
              </td>

              ${data.photo ? `
              <td style="width: 20%; text-align: right; vertical-align: middle; padding-bottom: 10px;">
                <img src="${data.photo}" width="100" height="100" style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #333;" />
              </td>
              ` : ''}
            </tr>
          </table>

          ${data.summary && data.summary !== 'Tulis ringkasan singkat tentang dirimu di sini...' ? `
          <div class="section-title">Professional Summary</div>
          <p style="margin: 0; text-align: justify;">${data.summary}</p>
          ` : ''}

          ${data.experience?.length > 0 ? `
          <div class="section-title">Experience</div>
          ${data.experience.map((exp: any) => `
            <div style="margin-bottom: 10px;">
              <table style="width: 100%;">
                <tr>
                  <td class="bold" style="text-align: left;">${exp.company}</td>
                  <td class="bold" style="text-align: right; white-space: nowrap;">${exp.date}</td>
                </tr>
              </table>
              
              <div class="italic">${exp.role}</div>
              
              <ul>
                ${Array.isArray(exp.bullets) ? exp.bullets.map((b: string) => b.trim() ? `<li>${b}</li>` : '').join('') : `<li>${exp.bullets}</li>`}
              </ul>
            </div>
          `).join('')}
          ` : ''}

          ${data.education?.length > 0 ? `
          <div class="section-title">Education</div>
          ${data.education.map((edu: any) => `
            <div style="margin-bottom: 10px;">
              <table style="width: 100%;">
                <tr>
                  <td class="bold" style="text-align: left;">${edu.school}</td>
                  <td class="bold" style="text-align: right; white-space: nowrap;">${edu.date}</td>
                </tr>
              </table>
              <div>${edu.degree}</div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
          ` : ''}

          ${data.skills && data.skills !== 'Skill 1, Skill 2, Skill 3' ? `
          <div class="section-title">Skills</div>
          <div style="line-height: 1.4;">
            ${data.skills.split('\n').map((line: string) =>
      line.trim() ? `<div style="margin-bottom: 3px;">${line}</div>` : ''
    ).join('')}
          </div>
          ` : ''}

        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden font-sans">

      {/* KIRI: EDITOR FORM */}
      <div className="w-full lg:w-1/3 bg-white border-r overflow-y-auto p-6 space-y-8 pb-32">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">CV Builder</h1>

          {/* AI Usage Indicator */}
          <div className="text-xs bg-gray-100 px-3 py-1 rounded-full border">
            {usageInfo.isPro ? (
              <span className="text-purple-600 font-bold">PRO: Unlimited</span>
            ) : (
              <span className="text-gray-600">
                AI Today: <b>{usageInfo.currentUsage}/{usageInfo.maxUsage}</b>
              </span>
            )}
          </div>
        </div>

        {/* 1. PERSONAL & FOTO */}
        <div className="space-y-4">
          <h3 className="font-bold text-blue-600 uppercase text-sm">Data Pribadi</h3>

          {/* UPLOAD FOTO */}
          <div className="flex items-center gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
              {photo ? (
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-700 block mb-1">Upload Foto (Opsional)</label>
              <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="h-8 text-xs file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
            </div>
          </div>

          <Input name="name" placeholder="Nama Lengkap" onChange={handlePersonal} />
          <Input name="email" placeholder="Email" onChange={handlePersonal} />
          <Input name="phone" placeholder="No HP" onChange={handlePersonal} />
          <Input name="address" placeholder="Kota, Negara" onChange={handlePersonal} />
          <Input name="linkedin" placeholder="LinkedIn URL" onChange={handlePersonal} />
          <Input name="portfolio" placeholder="Portfolio Website (Opsional)" onChange={handlePersonal} />
        </div>

        {/* 2. SUMMARY */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="font-bold text-blue-600 uppercase text-sm">Professional Summary</h3>
            <Button size="sm" variant="outline" onClick={optimizeSummary} disabled={loadingAI}>
              {loadingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />} AI Polish
            </Button>
          </div>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Contoh: Saya fresh graduate jurusan IT yang suka coding dan design. Punya pengalaman magang di startup. Mahir JavaScript dan React."
            className="h-32 text-sm"
          />
          <p className="text-xs text-gray-500">Tip: Tulis pengalaman & keahlian kasarmu, AI akan bikin jadi profesional</p>
        </div>

        {/* 3. EXPERIENCE */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-blue-600 uppercase text-sm">Pengalaman</h3>
            <Button size="sm" onClick={addExp} variant="ghost"><Plus className="w-4 h-4" /></Button>
          </div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="p-4 border rounded-lg bg-gray-50 relative space-y-2">
              <button onClick={() => removeExp(exp.id)} className="absolute top-2 right-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
              <Input placeholder="Perusahaan" value={exp.company} onChange={(e) => updateExp(exp.id, 'company', e.target.value)} className="font-bold" />
              <div className="flex gap-2">
                <Input placeholder="Posisi" value={exp.role} onChange={(e) => updateExp(exp.id, 'role', e.target.value)} />
                <Input placeholder="Tahun" value={exp.date} onChange={(e) => updateExp(exp.id, 'date', e.target.value)} />
              </div>
              <div className="pt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Deskripsi (Kasar aja)</span>
                  <Button size="sm" variant="outline" onClick={() => optimizeBullets(exp.id, exp.bullets.join(". "))} disabled={loadingAI}>
                    <Wand2 className="w-3 h-3 mr-1" /> AI Fix Bullets
                  </Button>
                </div>
                <Textarea
                  placeholder="Contoh: Saya ngurusin database..."
                  value={Array.isArray(exp.bullets) ? exp.bullets.join("\n") : exp.bullets}
                  onChange={(e) => updateExp(exp.id, 'bullets', e.target.value.split("\n"))}
                  className="h-24 text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 4. EDUCATION */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-blue-600 uppercase text-sm">Pendidikan</h3>
            <Button size="sm" onClick={addEdu} variant="ghost"><Plus className="w-4 h-4" /></Button>
          </div>
          {educations.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-lg bg-gray-50 relative space-y-2">
              <button onClick={() => removeEdu(edu.id)} className="absolute top-2 right-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
              <Input placeholder="Nama Kampus" value={edu.school} onChange={(e) => updateEdu(edu.id, 'school', e.target.value)} className="font-bold" />
              <div className="flex gap-2">
                <Input placeholder="Jurusan" value={edu.degree} onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)} />
                <Input placeholder="Tahun" value={edu.date} onChange={(e) => updateEdu(edu.id, 'date', e.target.value)} />
              </div>
              <Input placeholder="IPK / Honors" value={edu.gpa} onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)} />
            </div>
          ))}
        </div>

        {/* 5. SKILLS */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="font-bold text-blue-600 uppercase text-sm">Skills</h3>
            <Button size="sm" variant="outline" onClick={optimizeSkills} disabled={loadingAI}>
              {loadingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />} AI Polish
            </Button>
          </div>
          <Textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Contoh: HTML, CSS, JavaScript, React, Node.js, Python, Photoshop, Leadership, Public Speaking"
            className="h-20 text-sm"
          />
          <p className="text-xs text-gray-500">Tip: Tulis skills kasarmu, AI akan rapikan jadi profesional</p>
        </div>
      </div>

      {/* KANAN: LIVE PREVIEW */}
      <div className="w-full lg:w-2/3 bg-gray-500 p-8 flex justify-center overflow-y-auto relative">
        <div className="fixed bottom-8 right-8 z-50">
          <Button onClick={exportToWord} className="bg-blue-600 hover:bg-blue-700 shadow-xl h-14 px-8 rounded-full text-lg font-bold">
            <FileText className="mr-2" /> Download Word
          </Button>
        </div>

        {/* --- KERTAS HARVARD (Dengan Foto) --- */}
        <div ref={componentRef} className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[15mm_20mm] box-border text-black print:shadow-none">
          <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
            .cv-preview { font-family: 'Times New Roman', serif; line-height: 1.3; font-size: 11pt; color: #000; }
            
            /* Header Layout Logic */
            .cv-header-container { 
              display: flex; 
              justify-content: ${photo ? 'space-between' : 'center'}; 
              align-items: center; 
              margin-bottom: 20px; 
              border-bottom: 2px solid #000; 
              padding-bottom: 15px; 
            }
            .cv-header-text { text-align: ${photo ? 'left' : 'center'}; }
            
            .cv-name { font-size: 24pt; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; line-height: 1; }
            .cv-contact { font-size: 10pt; color: #333; }
            
            .cv-photo-box { 
              width: 110px; 
              height: 110px; 
              border: 1px solid #ccc; 
              margin-left: 20px; 
              flex-shrink: 0;
              overflow: hidden;
            }
            .cv-photo-img { width: 100%; height: 100%; object-fit: cover; }

            .cv-section { margin-bottom: 18px; }
            .cv-sec-title { 
              font-size: 11pt; 
              font-weight: bold; 
              text-transform: uppercase; 
              border-bottom: 1px solid #000; 
              margin-bottom: 10px; 
              padding-bottom: 2px; 
              letter-spacing: 0.5px;
            }
            .cv-entry { margin-bottom: 12px; }
            .cv-entry-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 11pt; }
            .cv-role { font-style: italic; margin-bottom: 2px; }
            .cv-list { margin: 2px 0 0 18px; padding: 0; }
            .cv-list li { margin-bottom: 3px; text-align: justify; padding-left: 5px; }
            .skills-formatted { }
            .skill-line { margin-bottom: 4px; }
          `}} />

          <div className="cv-preview">

            {/* HEADER FLEXBOX (Kalau ada foto dia ke kanan, kalau gak ada dia tengah) */}
            <div className="cv-header-container">
              <div className="cv-header-text">
                <div className="cv-name">{personal.name}</div>
                <div className="cv-contact">
                  {personal.email} | {personal.phone} <br />
                  {personal.address} <br />
                  {personal.linkedin}
                  {personal.portfolio && <><br />{personal.portfolio}</>}
                </div>
              </div>

              {photo && (
                <div className="cv-photo-box">
                  <img src={photo} alt="Profile" className="cv-photo-img" />
                </div>
              )}
            </div>

            {/* SECTIONS LAIN TETAP SAMA */}
            {summary && (
              <div className="cv-section">
                <div className="cv-sec-title">Professional Summary</div>
                <p className="text-justify">{summary}</p>
              </div>
            )}

            <div className="cv-section">
              <div className="cv-sec-title">Experience</div>
              {experiences.map(exp => (
                <div key={exp.id} className="cv-entry">
                  <div className="cv-entry-header">
                    <span>{exp.company}</span>
                    <span>{exp.date}</span>
                  </div>
                  <div className="cv-role">{exp.role}</div>
                  <ul className="cv-list list-disc">
                    {Array.isArray(exp.bullets) && exp.bullets.map((bull, i) => (
                      bull && <li key={i}>{bull}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="cv-section">
              <div className="cv-sec-title">Education</div>
              {educations.map(edu => (
                <div key={edu.id} className="cv-entry">
                  <div className="cv-entry-header">
                    <span>{edu.school}</span>
                    <span>{edu.date}</span>
                  </div>
                  <div className="cv-role">{edu.degree}</div>
                  {edu.gpa && <div>{edu.gpa}</div>}
                </div>
              ))}
            </div>

            <div className="cv-section">
              <div className="cv-sec-title">Skills</div>
              <div className="skills-formatted">
                {skills.split('\n').map((line, idx) => (
                  line.trim() && <div key={idx} className="skill-line">{line}</div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Limit Indicator */}
      <div className="fixed top-24 right-4 z-50">
        <div className="bg-white/80 backdrop-blur border border-white/20 shadow-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 flex items-center gap-2">
          <span>Daily Limit:</span>
          <span className={`${remaining === 0 ? 'text-red-500 font-bold' : 'text-violet-600'}`}>{remaining} left</span>
        </div>
      </div>
    </div>
  );
}
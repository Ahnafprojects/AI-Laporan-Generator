// lib/ai/cv-prompts.ts

export const MASTER_SYSTEM_PROMPT = `
# IDENTITAS & PERAN
Kamu adalah **Professional CV Writer AI** dengan 10+ tahun pengalaman membantu ribuan kandidat mendapat pekerjaan impian mereka. Keahlianmu:
- ✅ Menulis CV yang ATS-friendly (Applicant Tracking System)
- ✅ Menggunakan action verbs dan quantifiable metrics
- ✅ Menyesuaikan tone dengan industri target
- ✅ Menonjolkan achievements, bukan hanya responsibilities
- ✅ Mengikuti best practices modern CV writing

## ATURAN EMAS CV WRITING (WAJIB DIIKUTI)
### 1. BAHASA & TONE
- **Bahasa:** English atau Indonesian (sesuai permintaan user)
- **Tone:** Professional, confident, action-oriented
- **POV:** Third person (avoid "I", "my", "we")
- **Tense:** Past tense untuk past jobs, present tense untuk current job

### 2. ACTION VERBS (Mulai setiap bullet dengan kata kerja kuat)
**GUNAKAN:**
- ✅ Spearheaded, Architected, Orchestrated, Pioneered
- ✅ Implemented, Developed, Designed, Built, Created
- ✅ Led, Managed, Directed, Coordinated, Supervised
- ✅ Optimized, Enhanced, Streamlined, Improved, Transformed
- ✅ Achieved, Delivered, Executed, Launched, Established

### 3. QUANTIFIABLE METRICS (CRITICAL!)
**Setiap achievement HARUS ada angka:**
- ✅ "Increased revenue by 35%"
- ✅ "Reduced load time from 3s to 800ms (73% improvement)"
- ✅ "Managed team of 8 engineers"
**Jika user tidak kasih angka, estimasikan wajar:**
- "Multiple projects" -> "15+ projects"
- "Large team" -> "10+ team members"

### 4. STAR METHOD (Situation, Task, Action, Result)
Setiap bullet point harus contain Action + Result (Metric).

### 5. ATS OPTIMIZATION
- Use standard keywords from job description
- No fancy formatting
- Use standard section headings

## OUTPUT FORMAT
Selalu return dalam **valid JSON format** murni tanpa markdown berlebih.
`;

export const SUMMARY_PROMPT_TEMPLATE = `
# TASK: Generate Professional CV Summary
## INPUT DATA:
- **Target Role:** {targetRole}
- **Years of Experience:** {yearsOfExperience}
- **Top Skills:** {topSkills}
- **Industry:** {targetIndustry}
- **Career Goals:** {careerGoals}
- **Key Achievements:** {achievements}

## REQUIREMENTS:
1. **Length:** Exactly 3-4 sentences (60-80 words)
2. **Structure:** Role + Experience -> Technical Skills -> Achievement -> Goal
3. **Must Include:** Metric & Industry keywords

## OUTPUT FORMAT:
\`\`\`json
{
  "summary": "Generated summary text here...",
  "keywordsCovered": ["keyword1", "keyword2"],
  "atsScore": 85,
  "suggestions": ["suggestion 1"]
}
\`\`\`
`;

export const EXPERIENCE_PROMPT_TEMPLATE = `
# TASK: Generate Professional Work Experience Bullet Points
## INPUT DATA:
- **Job Title:** {jobTitle}
- **Company:** {companyName}
- **Duration:** {startDate} - {endDate}
- **Responsibilities:** {responsibilities}
- **Technologies Used:** {technologies}
- **Achievements/Impact:** {achievements}
- **Target Industry:** {targetIndustry}

## REQUIREMENTS:
1. Generate 4-5 bullet points
2. Formula: [Strong Action Verb] + [What] + [How/Technologies] + [Impact/Result with Metric]
3. Quantify everything. If no metric provided, estimate reasonably based on context.

## OUTPUT FORMAT:
\`\`\`json
{
  "bulletPoints": [
    "Spearheaded development of... resulting in..."
  ],
  "technologiesHighlighted": ["Tech1", "Tech2"],
  "metricsUsed": ["40%", "500K+ users"],
  "atsScore": 90
}
\`\`\`
`;

export const SKILLS_OPTIMIZER_TEMPLATE = `
# TASK: Optimize and Categorize Skills
## INPUT DATA:
- **Current Skills:** {currentSkills}
- **Target Role:** {targetRole}
- **Target Industry:** {targetIndustry}
- **Experience:** {yearsOfExperience}

## REQUIREMENTS:
1. Categorize skills (Languages, Frameworks, Tools, Soft Skills)
2. Add proficiency levels based on experience
3. Suggest missing critical skills for the role

## OUTPUT FORMAT:
\`\`\`json
{
  "optimizedSkills": {
    "technical": { "languages": [], "frameworks": [], "tools": [] },
    "soft": []
  },
  "missingSkills": { "critical": [], "recommended": [] },
  "atsKeywords": []
}
\`\`\`
`;

export const ATS_CHECKER_TEMPLATE = `
# TASK: Analyze CV for ATS Compatibility
## INPUT DATA:
- **CV Content:** {cvContent}
- **Job Description:** {jobDescription}

## REQUIREMENTS:
1. Calculate Keyword Match Score
2. Check Formatting & Structure
3. Identify Critical Issues

## OUTPUT FORMAT:
\`\`\`json
{
  "overallScore": 85,
  "breakdown": { "keywordMatch": 0, "formatting": 0, "contentQuality": 0 },
  "matchedKeywords": [],
  "missingKeywords": [],
  "recommendations": [ { "priority": "high", "issue": "...", "howToFix": "..." } ]
}
\`\`\`
`;

// Helper function untuk construct prompt
export function constructCVPrompt(
  type: 'summary' | 'experience' | 'skills' | 'ats',
  data: any
): { system: string, user: string } {
  const system = MASTER_SYSTEM_PROMPT;
  let user = '';

  switch(type) {
    case 'summary':
      user = SUMMARY_PROMPT_TEMPLATE
        .replace('{targetRole}', data.targetRole)
        .replace('{yearsOfExperience}', data.yearsOfExperience)
        .replace('{topSkills}', Array.isArray(data.topSkills) ? data.topSkills.join(', ') : data.topSkills)
        .replace('{targetIndustry}', data.targetIndustry)
        .replace('{careerGoals}', data.careerGoals)
        .replace('{achievements}', data.achievements || 'Not provided');
      break;
      
    case 'experience':
      user = EXPERIENCE_PROMPT_TEMPLATE
        .replace('{jobTitle}', data.jobTitle)
        .replace('{companyName}', data.companyName)
        .replace('{startDate}', data.startDate)
        .replace('{endDate}', data.endDate || 'Present')
        .replace('{responsibilities}', data.responsibilities)
        .replace('{technologies}', Array.isArray(data.technologies) ? data.technologies.join(', ') : data.technologies)
        .replace('{achievements}', data.achievements || 'Not specified')
        .replace('{targetIndustry}', data.targetIndustry);
      break;
      
    case 'skills':
      user = SKILLS_OPTIMIZER_TEMPLATE
        .replace('{currentSkills}', JSON.stringify(data.currentSkills))
        .replace('{targetRole}', data.targetRole)
        .replace('{targetIndustry}', data.targetIndustry)
        .replace('{yearsOfExperience}', data.yearsOfExperience);
      break;
      
    case 'ats':
      user = ATS_CHECKER_TEMPLATE
        .replace('{cvContent}', data.cvContent)
        .replace('{jobDescription}', data.jobDescription);
      break;
  }
  
  return { system, user };
}
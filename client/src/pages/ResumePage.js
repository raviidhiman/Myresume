import React, { useEffect, useRef } from 'react';
import { useResume } from '../context/ResumeContext';

export default function ResumePage() {
  const { resume, loading, fetchResume } = useResume();
  const resumeRef = useRef();

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume?.personal?.name || 'resume'}_CV.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!resume) return null;

  const { personal, education, experience, projects, skills, achievements, sectionOrder } = resume;

  const sectionComponents = {
    education: <EducationSection key="education" data={education} />,
    experience: <ExperienceSection key="experience" data={experience} />,
    projects: <ProjectsSection key="projects" data={projects} />,
    skills: <SkillsSection key="skills" data={skills} />,
    achievements: <AchievementsSection key="achievements" data={achievements} />,
  };

  const orderedSections = (sectionOrder || Object.keys(sectionComponents)).map(
    (key) => sectionComponents[key]
  );

  return (
    <div className="resume-page">
      <div className="resume-container">
        {/* Toolbar */}
        <div className="resume-toolbar no-print">
          <button className="btn-toolbar" onClick={handlePrint}>
            🖨 Print
          </button>
          <button className="btn-toolbar" onClick={handleExportPDF}>
            ⬇ Export PDF
          </button>
        </div>

        {/* Resume Paper */}
        <div className="resume-paper" ref={resumeRef}>
          {/* Header */}
          <div className="resume-header">
            <h1 className="resume-name">{personal.name}</h1>
            <div className="resume-contact">
              {personal.email && <a href={`mailto:${personal.email}`}>{personal.email}</a>}
              {personal.email && personal.phone && <span className="contact-sep">|</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <><span className="contact-sep">|</span><span>{personal.location}</span></>}
              {personal.linkedin && (
                <>
                  <span className="contact-sep">|</span>
                  <a href={`https://${personal.linkedin}`} target="_blank" rel="noreferrer">{personal.linkedin}</a>
                </>
              )}
              {personal.github && (
                <>
                  <span className="contact-sep">|</span>
                  <a href={`https://${personal.github}`} target="_blank" rel="noreferrer">{personal.github}</a>
                </>
              )}
              {personal.website && (
                <>
                  <span className="contact-sep">|</span>
                  <a href={`https://${personal.website}`} target="_blank" rel="noreferrer">{personal.website}</a>
                </>
              )}
            </div>
            {personal.summary && (
              <p className="resume-summary">{personal.summary}</p>
            )}
          </div>

          {orderedSections}
        </div>
      </div>
    </div>
  );
}

function EducationSection({ data }) {
  if (!data?.length) return null;
  return (
    <div className="resume-section">
      <h2 className="section-heading">Education</h2>
      {[...data].sort((a, b) => a.order - b.order).map((edu, i) => (
        <div key={i}>
          <div className="edu-entry">
            <span className="edu-institution">{edu.institution}</span>
            <span className="edu-year">{edu.startYear} – {edu.endYear}</span>
            <span className="edu-degree">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
            <span className="edu-location">{edu.location}</span>
            {edu.grade && <span className="edu-grade">{edu.grade}</span>}
            <span />
          </div>
          {i < data.length - 1 && <hr className="entry-divider" />}
        </div>
      ))}
    </div>
  );
}

function ExperienceSection({ data }) {
  if (!data?.length) return null;
  return (
    <div className="resume-section">
      <h2 className="section-heading">Experience</h2>
      {[...data].sort((a, b) => a.order - b.order).map((exp, i) => (
        <div key={i}>
          <div className="exp-entry">
            <div className="exp-header">
              <span className="exp-role">{exp.role}</span>
              <span className="exp-dates">{exp.startDate} – {exp.endDate}</span>
            </div>
            <p className="exp-company-line">
              {exp.company}{exp.location ? ` · ${exp.location}` : ''}
            </p>
            {exp.bullets?.length > 0 && (
              <ul className="exp-bullets">
                {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            )}
          </div>
          {i < data.length - 1 && <hr className="entry-divider" />}
        </div>
      ))}
    </div>
  );
}

function ProjectsSection({ data }) {
  if (!data?.length) return null;
  return (
    <div className="resume-section">
      <h2 className="section-heading">Projects</h2>
      {[...data].sort((a, b) => a.order - b.order).map((proj, i) => (
        <div key={i}>
          <div className="project-entry">
            <div className="project-header">
              <span className="project-title">{proj.title}</span>
              <div className="project-links">
                {proj.github && <a href={`https://${proj.github}`} target="_blank" rel="noreferrer">GitHub</a>}
                {proj.link && <a href={`https://${proj.link}`} target="_blank" rel="noreferrer">Demo</a>}
              </div>
            </div>
            {proj.tech?.length > 0 && (
              <p className="project-tech">{proj.tech.join(', ')}</p>
            )}
            {proj.description && <p className="project-desc">{proj.description}</p>}
          </div>
          {i < data.length - 1 && <hr className="entry-divider" />}
        </div>
      ))}
    </div>
  );
}

function SkillsSection({ data }) {
  if (!data?.length) return null;
  return (
    <div className="resume-section">
      <h2 className="section-heading">Skills</h2>
      <div className="skills-grid">
        {[...data].sort((a, b) => a.order - b.order).map((cat, i) => (
          <div key={i} className="skill-row">
            <span className="skill-category-label">{cat.category}:</span>
            <span className="skill-items">{cat.items.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsSection({ data }) {
  if (!data?.length) return null;
  return (
    <div className="resume-section">
      <h2 className="section-heading">Achievements</h2>
      {[...data].sort((a, b) => a.order - b.order).map((ach, i) => (
        <div key={i}>
          <div className="achievement-entry">
            <div className="achievement-left">
              <div className="achievement-title">{ach.title}</div>
              {ach.description && <div className="achievement-desc">{ach.description}</div>}
            </div>
            {ach.year && <span className="achievement-year">{ach.year}</span>}
          </div>
          {i < data.length - 1 && <hr className="entry-divider" />}
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="resume-page">
      <div className="resume-container">
        <div className="resume-paper">
          <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: '1.5px solid #000', marginBottom: '20px' }}>
            <div className="skeleton" style={{ width: '220px', height: '28px', margin: '0 auto 12px' }} />
            <div className="skeleton" style={{ width: '360px', height: '16px', margin: '0 auto' }} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ marginBottom: '24px' }}>
              <div className="skeleton" style={{ width: '120px', height: '16px', marginBottom: '12px' }} />
              <div className="skeleton" style={{ width: '100%', height: '12px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '80%', height: '12px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '90%', height: '12px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

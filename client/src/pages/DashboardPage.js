import React, { useEffect, useState, useCallback } from 'react';
import { useResume } from '../context/ResumeContext';

const SECTIONS = [
  { key: 'personal', label: 'Personal Info', icon: '👤' },
  { key: 'education', label: 'Education', icon: '🎓' },
  { key: 'experience', label: 'Experience', icon: '💼' },
  { key: 'projects', label: 'Projects', icon: '🔧' },
  { key: 'skills', label: 'Skills', icon: '⚡' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'order', label: 'Section Order', icon: '↕' },
];

export default function DashboardPage() {
  const { resume, fetchResume, saveResume, saving } = useResume();
  const [activeSection, setActiveSection] = useState('personal');
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (!resume) fetchResume();
  }, []);

  useEffect(() => {
    if (resume && !draft) setDraft(JSON.parse(JSON.stringify(resume)));
  }, [resume]);

  const updateDraft = useCallback((path, value) => {
    setDraft((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  }, []);

  const handleSave = async () => {
    if (!draft) return;
    await saveResume(draft);
  };

  if (!draft) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#888' }}>Loading editor...</p>
        </div>
      </div>
    );
  }

  const sectionProps = { draft, updateDraft, setDraft };

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">Edit Sections</div>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`sidebar-item ${activeSection === s.key ? 'active' : ''}`}
              onClick={() => setActiveSection(s.key)}
            >
              <span className="sidebar-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              {SECTIONS.find((s) => s.key === activeSection)?.icon}{' '}
              {SECTIONS.find((s) => s.key === activeSection)?.label}
            </h2>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? '⌛ Saving...' : '💾 Save Changes'}
            </button>
          </div>

          {activeSection === 'personal' && <PersonalEditor {...sectionProps} />}
          {activeSection === 'education' && <EducationEditor {...sectionProps} />}
          {activeSection === 'experience' && <ExperienceEditor {...sectionProps} />}
          {activeSection === 'projects' && <ProjectsEditor {...sectionProps} />}
          {activeSection === 'skills' && <SkillsEditor {...sectionProps} />}
          {activeSection === 'achievements' && <AchievementsEditor {...sectionProps} />}
          {activeSection === 'order' && <SectionOrderEditor {...sectionProps} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Personal Info ─────────────────────────────────────── */
function PersonalEditor({ draft, updateDraft }) {
  const p = draft.personal;
  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: '' },
    { key: 'email', label: 'Email', type: 'email', placeholder: '' },
    { key: 'phone', label: 'Phone', type: 'text', placeholder: '' },
    { key: 'location', label: 'Location', type: 'text', placeholder: '' },
    { key: 'linkedin', label: 'LinkedIn (without https://)', type: 'text', placeholder: '' },
    { key: 'github', label: 'GitHub (without https://)', type: 'text', placeholder: '' },
    { key: 'website', label: 'Website (without https://)', type: 'text', placeholder: '' },
  ];

  return (
    <div>
      <div className="edit-card">
        <div className="form-grid-2">
          {fields.map((f) => (
            <div className="form-group" key={f.key}>
              <label className="form-label">{f.label}</label>
              <input
                type={f.type}
                className="form-input"
                placeholder=""
                value={p[f.key] || ''}
                onChange={(e) => updateDraft(`personal.${f.key}`, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Professional Summary</label>
          <textarea
            className="form-textarea"
            placeholder=""
            value={p.summary || ''}
            onChange={(e) => updateDraft('personal.summary', e.target.value)}
            style={{ minHeight: '100px' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Education ─────────────────────────────────────────── */
function EducationEditor({ draft, setDraft }) {
  const addEntry = () => {
    setDraft((prev) => ({
      ...prev,
      education: [...(prev.education || []), {
        institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '', location: '',
        order: (prev.education?.length || 0),
      }],
    }));
  };

  const removeEntry = (i) => {
    setDraft((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== i),
    }));
  };

  const updateEntry = (i, key, val) => {
    setDraft((prev) => {
      const arr = [...prev.education];
      arr[i] = { ...arr[i], [key]: val };
      return { ...prev, education: arr };
    });
  };

  return (
    <div>
      {draft.education?.map((edu, i) => (
        <div className="edit-card" key={i}>
          <div className="edit-card-header">
            <span className="edit-card-title">{edu.institution || `Education Entry ${i + 1}`}</span>
            <button className="btn-icon danger" onClick={() => removeEntry(i)}>Remove</button>
          </div>
          <div className="form-grid-2">
            {[
              ['institution', 'Institution', ''],
              ['degree', 'Degree', ''],
              ['field', 'Field of Study', ''],
              ['startYear', 'Start Year', ''],
              ['endYear', 'End Year / Expected', ''],
              ['grade', 'Grade / GPA', ''],
              ['location', 'Location', ''],
            ].map(([key, label, placeholder]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="form-input"
                  placeholder=""
                  value={edu[key] || ''}
                  onChange={(e) => updateEntry(i, key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addEntry}>+ Add Education Entry</button>
    </div>
  );
}

/* ─── Experience ────────────────────────────────────────── */
function ExperienceEditor({ draft, setDraft }) {
  const addEntry = () => {
    setDraft((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), {
        company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''],
        order: (prev.experience?.length || 0),
      }],
    }));
  };

  const removeEntry = (i) => {
    setDraft((prev) => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
  };

  const updateEntry = (i, key, val) => {
    setDraft((prev) => {
      const arr = [...prev.experience];
      arr[i] = { ...arr[i], [key]: val };
      return { ...prev, experience: arr };
    });
  };

  const addBullet = (i) => {
    setDraft((prev) => {
      const arr = [...prev.experience];
      arr[i] = { ...arr[i], bullets: [...(arr[i].bullets || []), ''] };
      return { ...prev, experience: arr };
    });
  };

  const updateBullet = (i, j, val) => {
    setDraft((prev) => {
      const arr = [...prev.experience];
      const bullets = [...arr[i].bullets];
      bullets[j] = val;
      arr[i] = { ...arr[i], bullets };
      return { ...prev, experience: arr };
    });
  };

  const removeBullet = (i, j) => {
    setDraft((prev) => {
      const arr = [...prev.experience];
      arr[i] = { ...arr[i], bullets: arr[i].bullets.filter((_, idx) => idx !== j) };
      return { ...prev, experience: arr };
    });
  };

  return (
    <div>
      {draft.experience?.map((exp, i) => (
        <div className="edit-card" key={i}>
          <div className="edit-card-header">
            <span className="edit-card-title">{exp.role ? `${exp.role} @ ${exp.company}` : `Experience ${i + 1}`}</span>
            <button className="btn-icon danger" onClick={() => removeEntry(i)}>Remove</button>
          </div>
          <div className="form-grid-2">
            {[
              ['role', 'Job Title / Role', ''],
              ['company', 'Company', ''],
              ['startDate', 'Start Date', ''],
              ['endDate', 'End Date', ''],
              ['location', 'Location', ''],
            ].map(([key, label, placeholder]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className="form-input" placeholder="" value={exp[key] || ''}
                  onChange={(e) => updateEntry(i, key, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Bullet Points</label>
            <div className="bullets-list">
              {(exp.bullets || []).map((b, j) => (
                <div className="bullet-row" key={j}>
                  <span className="bullet-prefix">•</span>
                  <input className="bullet-input" placeholder=""
                    value={b} onChange={(e) => updateBullet(i, j, e.target.value)} />
                  <button className="btn-icon danger" onClick={() => removeBullet(i, j)}>×</button>
                </div>
              ))}
            </div>
            <button className="btn-add" style={{ marginTop: '4px' }} onClick={() => addBullet(i)}>+ Add Bullet</button>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addEntry}>+ Add Experience Entry</button>
    </div>
  );
}

/* ─── Projects ──────────────────────────────────────────── */
function ProjectsEditor({ draft, setDraft }) {
  const addEntry = () => {
    setDraft((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), {
        title: '', description: '', tech: [], link: '', github: '',
        order: (prev.projects?.length || 0),
      }],
    }));
  };

  const removeEntry = (i) => {
    setDraft((prev) => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));
  };

  const updateEntry = (i, key, val) => {
    setDraft((prev) => {
      const arr = [...prev.projects];
      arr[i] = { ...arr[i], [key]: val };
      return { ...prev, projects: arr };
    });
  };

  return (
    <div>
      {draft.projects?.map((proj, i) => (
        <div className="edit-card" key={i}>
          <div className="edit-card-header">
            <span className="edit-card-title">{proj.title || `Project ${i + 1}`}</span>
            <button className="btn-icon danger" onClick={() => removeEntry(i)}>Remove</button>
          </div>
          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input className="form-input" placeholder="" value={proj.title || ''}
              onChange={(e) => updateEntry(i, 'title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder=""
              value={proj.description || ''} onChange={(e) => updateEntry(i, 'description', e.target.value)} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">GitHub (without https://)</label>
              <input className="form-input" placeholder="" value={proj.github || ''}
                onChange={(e) => updateEntry(i, 'github', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Live Link (without https://)</label>
              <input className="form-input" placeholder="" value={proj.link || ''}
                onChange={(e) => updateEntry(i, 'link', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tech Stack</label>
            <TagsInput
              tags={proj.tech || []}
              onChange={(tags) => updateEntry(i, 'tech', tags)}
              placeholder=""
            />
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addEntry}>+ Add Project</button>
    </div>
  );
}

/* ─── Skills ────────────────────────────────────────────── */
function SkillsEditor({ draft, setDraft }) {
  const addCategory = () => {
    setDraft((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { category: '', items: [], order: (prev.skills?.length || 0) }],
    }));
  };

  const removeCategory = (i) => {
    setDraft((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));
  };

  const updateCategory = (i, key, val) => {
    setDraft((prev) => {
      const arr = [...prev.skills];
      arr[i] = { ...arr[i], [key]: val };
      return { ...prev, skills: arr };
    });
  };

  return (
    <div>
      {draft.skills?.map((cat, i) => (
        <div className="edit-card" key={i}>
          <div className="edit-card-header">
            <span className="edit-card-title">{cat.category || `Category ${i + 1}`}</span>
            <button className="btn-icon danger" onClick={() => removeCategory(i)}>Remove</button>
          </div>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input className="form-input" placeholder="" value={cat.category || ''}
              onChange={(e) => updateCategory(i, 'category', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Skills (press Enter or comma to add)</label>
            <TagsInput
              tags={cat.items || []}
              onChange={(tags) => updateCategory(i, 'items', tags)}
              placeholder=""
            />
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addCategory}>+ Add Skill Category</button>
    </div>
  );
}

/* ─── Achievements ──────────────────────────────────────── */
function AchievementsEditor({ draft, setDraft }) {
  const addEntry = () => {
    setDraft((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), { title: '', description: '', year: '', order: (prev.achievements?.length || 0) }],
    }));
  };

  const removeEntry = (i) => {
    setDraft((prev) => ({ ...prev, achievements: prev.achievements.filter((_, idx) => idx !== i) }));
  };

  const updateEntry = (i, key, val) => {
    setDraft((prev) => {
      const arr = [...prev.achievements];
      arr[i] = { ...arr[i], [key]: val };
      return { ...prev, achievements: arr };
    });
  };

  return (
    <div>
      {draft.achievements?.map((ach, i) => (
        <div className="edit-card" key={i}>
          <div className="edit-card-header">
            <span className="edit-card-title">{ach.title || `Achievement ${i + 1}`}</span>
            <button className="btn-icon danger" onClick={() => removeEntry(i)}>Remove</button>
          </div>
          <div className="form-grid-2">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="" value={ach.title || ''}
                onChange={(e) => updateEntry(i, 'title', e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder=""
                value={ach.description || ''} onChange={(e) => updateEntry(i, 'description', e.target.value)} style={{ minHeight: '60px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input className="form-input" placeholder="" value={ach.year || ''}
                onChange={(e) => updateEntry(i, 'year', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addEntry}>+ Add Achievement</button>
    </div>
  );
}

/* ─── Section Order ─────────────────────────────────────── */
function SectionOrderEditor({ draft, setDraft }) {
  const order = draft.sectionOrder || ['education', 'experience', 'projects', 'skills', 'achievements'];
  const labels = { education: '🎓 Education', experience: '💼 Experience', projects: '🔧 Projects', skills: '⚡ Skills', achievements: '🏆 Achievements' };

  const moveUp = (i) => {
    if (i === 0) return;
    const newOrder = [...order];
    [newOrder[i - 1], newOrder[i]] = [newOrder[i], newOrder[i - 1]];
    setDraft((prev) => ({ ...prev, sectionOrder: newOrder }));
  };

  const moveDown = (i) => {
    if (i === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[i], newOrder[i + 1]] = [newOrder[i + 1], newOrder[i]];
    setDraft((prev) => ({ ...prev, sectionOrder: newOrder }));
  };

  return (
    <div>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '13.5px', color: '#666', marginBottom: '20px' }}>
        Use the arrows to reorder how sections appear on your resume.
      </p>
      <div className="reorder-list">
        {order.map((key, i) => (
          <div className="reorder-item" key={key}>
            <span className="drag-handle">☰</span>
            <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: '14px' }}>{labels[key]}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn-icon" onClick={() => moveUp(i)} disabled={i === 0}>↑</button>
              <button className="btn-icon" onClick={() => moveDown(i)} disabled={i === order.length - 1}>↓</button>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: '12px', color: '#999', marginTop: '16px' }}>
        💡 Remember to click "Save Changes" after reordering.
      </p>
    </div>
  );
}

/* ─── Tags Input ────────────────────────────────────────── */
function TagsInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('');

  const addTag = (val) => {
    const trimmed = val.trim().replace(/,+$/, '');
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="tags-container">
        {tags.map((tag, i) => (
          <div className="tag" key={i}>
            {tag}
            <button className="tag-remove" onClick={() => onChange(tags.filter((_, idx) => idx !== i))}>×</button>
          </div>
        ))}
      </div>
      <div className="tag-input-row">
        <input
          className="form-input"
          style={{ flex: 1 }}
          placeholder=""
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
        />
        <button className="btn-icon" onClick={() => addTag(input)}>Add</button>
      </div>
    </div>
  );
}



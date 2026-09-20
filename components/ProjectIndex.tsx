"use client";

import { useState } from "react";
import { projects } from "@/content/projects";
import styles from "./ProjectIndex.module.css";

export default function ProjectIndex() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);

  return (
    <section className="section" id="travaux">
      <div className="wrap">
        <div className="sectionHead">
          <h2>Index des travaux</h2>
          <span className="label tabular">{projects.length} projets</span>
        </div>

        <div>
          {projects.map((project) => {
            const open = openId === project.id;
            return (
              <article
                key={project.id}
                className={styles.item}
                data-open={open}
              >
                <button
                  type="button"
                  className={styles.row}
                  aria-expanded={open}
                  aria-controls={`panel-${project.id}`}
                  onClick={() => setOpenId(open ? null : project.id)}
                >
                  <span className={styles.year}>{project.year}</span>
                  <span className={styles.title}>{project.title}</span>
                  <span className={styles.domain}>{project.domain}</span>
                  <span className={styles.plus} aria-hidden="true" />
                </button>

                <div className={styles.panel} id={`panel-${project.id}`}>
                  <div className={styles.panelInner}>
                    <div className={styles.panelBody}>
                      <span className={styles.note}>{project.note}</span>
                      <div>
                        {project.body.map((paragraph) => (
                          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                        ))}
                        <ul className={styles.stack}>
                          {project.stack.map((tech) => (
                            <li key={tech}>{tech}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

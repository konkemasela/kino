export interface LegalSection {
  id: string;
  title: string;
  body: string[];
  /** Bullet list shown after `body`. */
  list?: string[];
  /** Paragraphs shown after the list. */
  after?: string[];
  /** Highlighted callout. */
  note?: string;
}

export interface LegalDoc {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  sections: LegalSection[];
}

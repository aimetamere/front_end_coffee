/** Backend address, set at build time. Empty: the site runs on its built-in content. */
const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, '');
const SITE_ID = 'cafe-du-conservatoire';
/** A slow or dead API must not hold the page back: after this, the built-in content is used. */
const LOAD_TIMEOUT_MS = 2500;

export const hasApi = API_URL !== '';

export interface ImageValue {
  url: string;
  name?: string;
  width?: number;
  height?: number;
  variants?: { url: string; width: number }[];
}

export interface FileValue {
  url: string;
  name?: string;
  size?: number;
  type?: string;
}

export interface SiteContent {
  settings?: {
    contact?: { street?: string; city?: string; phone?: string; email?: string };
    hours?: { lines?: string[] };
    menu?: { pdf?: FileValue; subtitle?: string };
    about?: { subtitle?: string; text?: string };
  };
  collections?: {
    gallery?: { id: string; image?: ImageValue; alt?: string }[];
  };
}

/** The site's content, or null when there is no API or it did not answer in time. Never throws. */
export async function loadContent(): Promise<SiteContent | null> {
  if (!hasApi) return null;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), LOAD_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_URL}/api/public/sites/${SITE_ID}`, { signal: controller.signal });
    if (!response.ok) return null;
    return (await response.json()) as SiteContent;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export type SubmitResult = { ok: true } | { ok: false; status: number; fields?: Record<string, string> };

/** Posts a form. Status 0 means the request never got an answer (network error). */
export async function submitForm(formKey: string, data: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const response = await fetch(`${API_URL}/api/public/sites/${SITE_ID}/forms/${formKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (response.ok) return { ok: true };
    let fields: Record<string, string> | undefined;
    try {
      fields = ((await response.json()) as { fields?: Record<string, string> }).fields;
    } catch {
      // No readable body: the status alone tells the story.
    }
    return { ok: false, status: response.status, fields };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** Text from the API goes into innerHTML and attributes: neutralise markup first. */
export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

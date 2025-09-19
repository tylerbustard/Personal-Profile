import { Mail, Phone, Globe } from "lucide-react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import unbLogo from "@assets/University_of_New_Brunswick_Logo.svg_1755912478863.png";
import irvingLogo from "@assets/Irving_Oil.svg_1755913265895.png";
import rbcLogo from "@assets/RBC-Logo_1755913716813.png";
import tdLogo from "@assets/Toronto-Dominion_Bank_logo.svg_1755913265896.png";
import bmoLogo from "@assets/BMO_Logo.svg_1755913265896.png";
import profileImage from "@assets/Untitled design (1)_1755896187722.png";
import fiscalAiLogo from "@assets/fiscal_ai_logo_new.png";
import mcgillLogo from "@assets/mcgill_university_logo_2.png";
import queensLogo from "@assets/queens_university_logo.png";
import rotmanLogo from "@assets/rotman.png";
 

function toAbsolute(url: string): string {
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

function buildSignatureHtml() {
  const profile = toAbsolute(profileImage);
  const logos = [unbLogo, irvingLogo, rbcLogo, tdLogo, bmoLogo].map(toAbsolute);
  const primary = "#1d4ed8"; // blue-700
  const text = "#111827"; // gray-900
  const subtext = "#374151"; // gray-700
  const border = "#e5e7eb"; // gray-200

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:${text}; background:#ffffff;">
    <tr>
      <td style="padding:0 0 8px 0; font-size:16px; color:#111827; font-weight:700;">Sincerely,</td>
    </tr>
    <tr>
      <td>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
          <tr>
            <td style="vertical-align:middle; padding-right:12px;">
              <img src="${profile}" width="56" height="56" style="border-radius:12px; display:block; border:1px solid ${border};" alt="Tyler Bustard" />
            </td>
            <td style="vertical-align:middle;">
              <div style="font-size:18px; font-weight:700; line-height:1.2;">Tyler Bustard</div>
              <div style="font-size:13px; font-weight:600; color:${primary}; margin-top:2px;">Finance & Technology Professional</div>
              <div style="height:10px"></div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; font-size:13px; color:${subtext}; table-layout:auto">
                <tr>
                  <td style="vertical-align:middle; padding:4px 24px 4px 0; white-space:nowrap;">
                    <span style="display:inline-block; vertical-align:middle; width:28px; height:28px; border-radius:999px; background:#eff6ff; color:${primary}; text-align:center; line-height:28px; font-weight:600; margin-right:8px;">☎</span>
                    <a href="tel:+16139851223" style="color:${subtext}; text-decoration:none; vertical-align:middle">+1 (613) 985-1223</a>
                  </td>
                  <td style="vertical-align:middle; padding:4px 24px 4px 0; white-space:nowrap;">
                    <span style="display:inline-block; vertical-align:middle; width:28px; height:28px; border-radius:999px; background:#eff6ff; color:${primary}; text-align:center; line-height:28px; font-weight:600; margin-right:8px;">✉</span>
                    <a href="mailto:tylerbustard@hotmail.com" style="color:${subtext}; text-decoration:none; vertical-align:middle">tylerbustard@hotmail.com</a>
                  </td>
                  <td style="vertical-align:middle; padding:4px 24px 4px 0; white-space:nowrap;">
                    <span style="display:inline-block; vertical-align:middle; width:28px; height:28px; border-radius:999px; background:#eff6ff; color:${primary}; text-align:center; line-height:28px; font-weight:600; margin-right:8px;">◯</span>
                    <a href="https://tylerbustard.ca" style="color:${primary}; text-decoration:none; vertical-align:middle">tylerbustard.ca</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td colspan="2" style="height:12px"></td></tr>
          <tr>
            <td colspan="2" style="border-top:1px solid ${border}; padding-top:10px; width:60%;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  ${logos.map(src => `<td style="padding-right:12px"><img src="${src}" height="28" style="display:block" alt="logo" /></td>`).join("")}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

export default function EmailSignature() {
  const exportRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportCount, setExportCount] = useState(0);

  const emails = [
    'tylerbustard@hotmail.com',
    'tbustard@unb.ca',
    't.bustard@unb.ca',
    'tyler.bustard@gmail.com',
    'tbustard@icloud.com',
    'tylerwaynebustard@icloud.com',
  ];

  const SignatureBlock = ({ email, website, logos, role = 'Finance & Technology Professional', org }: { email: string; website: string; logos: string[]; role?: string; org?: string }) => (
    <div className="flex">
      {/* Content */}
      <div className="flex-1">
        <div className="p-0">
          <p className="text-[16px] font-bold text-gray-900 mb-3">Sincerely,</p>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={profileImage} alt="Tyler Bustard" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">Tyler Bustard</h1>
                <p className="text-[13px] text-blue-700 font-semibold leading-snug">{role}</p>
                {org ? (
                  <p className="text-[13px] text-gray-700 leading-snug">{org}</p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Contact */}
          <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            <li className="shrink-0">
              <a href="tel:+16139851223" className="group inline-flex items-center gap-2 text-gray-800 hover:text-blue-700 whitespace-nowrap align-middle">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-100 shrink-0">
                  <Phone size={12} />
                </span>
                <span className="leading-5">+1 (613) 985-1223</span>
              </a>
            </li>
            <li className="shrink-0">
              <a href={`mailto:${email}`} className="group inline-flex items-center gap-2 text-gray-800 hover:text-blue-700 whitespace-nowrap align-middle">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-100 shrink-0">
                  <Mail size={12} />
                </span>
                <span className="leading-5">{email}</span>
              </a>
            </li>
            <li className="shrink-0">
              <a href={`https://${website}`} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-gray-800 hover:text-blue-700 whitespace-nowrap align-middle">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-100 shrink-0">
                  <Globe size={12} />
                </span>
                <span className="leading-5">{website}</span>
              </a>
            </li>
          </ul>

          {/* Divider */}
          <div className="mt-5 h-px bg-gray-200 w-3/4 md:w-2/3" />

          {/* Logos */}
          <div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-5">
            {logos.map((src, i) => {
              const isQueens = src === queensLogo;
              const isRotman = src === rotmanLogo;
              const sizeClass = isQueens ? 'h-12 sm:h-14' : 'h-7 sm:h-8';
              // Ensure Rotman logo matches standard size exactly
              const normalizedSizeClass = isRotman ? 'h-7 sm:h-8' : sizeClass;
              return <img key={i} src={src} alt="logo" className={`${normalizedSizeClass} w-auto align-middle object-contain`} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
  const getFilename = (index: number) => `signature-${String(index + 1).padStart(2, '0')}.png`;

  function sanitizeForFile(value: string) {
    return value
      .toLowerCase()
      .replace(/https?:\/\//g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function makeFileName(email: string, website: string) {
    const emailSlug = sanitizeForFile(email.replace('@', '-at-'));
    const siteSlug = sanitizeForFile(website);
    return `${siteSlug}__${emailSlug}.png`;
  }

  async function exportAll() {
    if (isExporting) return;
    try {
      setIsExporting(true);
      setExportCount(0);
      // Ensure fonts/images are ready
      // @ts-ignore - fonts may not exist in some environments but in browsers it does
      if (document.fonts && document.fonts.ready) {
        try { await (document.fonts as any).ready; } catch {}
      }

      const zip = new JSZip();
      const nodes = exportRefs.current.filter(Boolean) as HTMLDivElement[];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        setExportCount(i + 1);
        await ensureAssetsReady(node);
        const { width, height } = getTightSize(node);
        const dataUrl = await toPng(node, {
          backgroundColor: 'transparent',
          cacheBust: true,
          pixelRatio: 3,
          width,
          height,
        });
        const filenameAttr = node.getAttribute('data-filename') || getFilename(i);
        zip.file(filenameAttr, dataUrl.split(',')[1], { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'email-signatures.zip');
    } finally {
      setIsExporting(false);
    }
  }

  async function ensureAssetsReady(root: HTMLElement) {
    const images = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];
    await Promise.all(
      images.map((img) => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve()))
    );
    // Next paint
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }

  function getTightSize(el: HTMLElement) {
    // Use offset dimensions to avoid fractional canvas sizes
    const width = Math.ceil(el.offsetWidth || el.getBoundingClientRect().width);
    const height = Math.ceil(el.offsetHeight || el.getBoundingClientRect().height);
    return { width, height };
  }

  let refIndex = 0;

  return (
    <div className="min-h-screen flex justify-center px-4 py-12" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={exportAll}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 text-sm font-semibold"
          >
            {isExporting ? `Exporting ${exportCount}/26…` : 'Export 26 PNGs'}
          </button>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">University of New Brunswick - tylerbustard.ca</h2>
        </div>
        
        {emails.map((email, idx) => (
          <div key={email} className={idx === 0 ? '' : 'mt-12'}>
            <div
              ref={el => { const i = refIndex++; if (el) { exportRefs.current[i] = el; el.setAttribute('data-filename', makeFileName(email, 'tylerbustard.ca')); } }}
              style={{ display: 'inline-block', width: 'max-content', backgroundColor: 'transparent' }}
            >
              <SignatureBlock email={email} website={'tylerbustard.ca'} logos={[unbLogo, irvingLogo, rbcLogo, tdLogo, bmoLogo, fiscalAiLogo]} role={'Equity Analyst'} org={'Fiscal.ai'} />
            </div>
          </div>
        ))}

        {/* McGill Section */}
        <div className="text-center mt-14 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">McGill University - tylerbustard.com</h2>
        </div>

        {[
          'tbustard@unb.ca',
          't.bustard@unb.ca',
          'tylerbustard@hotmail.com',
          'tyler.bustard@gmail.com',
          'tbustard@icloud.com',
          'tylerwaynebustard@icloud.com',
        ].map((email, idx) => (
          <div key={`mcgill-${email}`} className={idx === 0 ? '' : 'mt-12'}>
            <div
              ref={el => { const i = refIndex++; if (el) { exportRefs.current[i] = el; el.setAttribute('data-filename', makeFileName(email, 'tylerbustard.com')); } }}
              style={{ display: 'inline-block', width: 'max-content', backgroundColor: 'transparent' }}
            >
              <SignatureBlock
                email={email}
                website={'tylerbustard.com'}
                logos={[unbLogo, irvingLogo, rbcLogo, tdLogo, bmoLogo, fiscalAiLogo, mcgillLogo]}
                role={'Master of Management in Finance Candidate, 2027'}
                org={'Desautels Faculty of Management • McGill University'}
              />
            </div>
          </div>
        ))}

        {/* University of Toronto Section */}
        <div className="text-center mt-14 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">University of Toronto - tylerbustard.info</h2>
        </div>

        {[
          'tyler.bustard@rotman.utoronto.ca',
          'tyler.bustard@mail.utoronto.ca',
          'tbustard@unb.ca',
          't.bustard@unb.ca',
          'tylerbustard@hotmail.com',
          'tyler.bustard@gmail.com',
          'tbustard@icloud.com',
          'tylerwaynebustard@icloud.com',
        ].map((email, idx) => (
          <div key={`uoft-${email}`} className={idx === 0 ? '' : 'mt-12'}>
            <div
              ref={el => { const i = refIndex++; if (el) { exportRefs.current[i] = el; el.setAttribute('data-filename', makeFileName(email, 'tylerbustard.info')); } }}
              style={{ display: 'inline-block', width: 'max-content', backgroundColor: 'transparent' }}
            >
              <SignatureBlock
                email={email}
                website={'tylerbustard.info'}
                logos={[unbLogo, irvingLogo, rbcLogo, tdLogo, bmoLogo, fiscalAiLogo, rotmanLogo]}
                role={'Master of Business Candidate, 2026'}
                org={'Rotman School of Management • University of Toronto'}
              />
            </div>
          </div>
        ))}

        {/* Queens Section */}
        <div className="text-center mt-14 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Queens University - tylerbustard.net</h2>
        </div>

        {[
          'tbustard@unb.ca',
          't.bustard@unb.ca',
          'tylerbustard@hotmail.com',
          'tyler.bustard@gmail.com',
          'tbustard@icloud.com',
          'tylerwaynebustard@icloud.com',
        ].map((email, idx) => (
          <div key={`queens-${email}`} className={idx === 0 ? '' : 'mt-12'}>
            <div
              ref={el => { const i = refIndex++; if (el) { exportRefs.current[i] = el; el.setAttribute('data-filename', makeFileName(email, 'tylerbustard.net')); } }}
              style={{ display: 'inline-block', width: 'max-content', backgroundColor: 'transparent' }}
            >
              <SignatureBlock
                email={email}
                website={'tylerbustard.net'}
                logos={[unbLogo, irvingLogo, rbcLogo, tdLogo, bmoLogo, fiscalAiLogo, queensLogo]}
                role={'Master of Finance Candidate, 2027'}
                org={'Smith School of Business • Queens University'}
              />
            </div>
          </div>
        ))}

        
      </div>
    </div>
  );
}


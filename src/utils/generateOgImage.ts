import { Resvg } from '@resvg/resvg-js';
import { html } from 'satori-html';
import satori from 'satori';

const SITE = 'actualfuckingwebsite.com';
const BG = '#fefcf7';
const INK = '#1a1a1a';
const MUTED = '#999';

async function loadGoogleFont(family: string, weight: string, text: string) {
  const api = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(api, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  }).then((r) => r.text());
  const match = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Failed to load font: ${family} ${weight}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export async function generateOgImage(title: string, subtitle?: string): Promise<Uint8Array> {
  const chars =
    title +
    (subtitle ?? '') +
    SITE +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,—-–?!/';

  const [loraNormal, loraBold, inconsolata] = await Promise.all([
    loadGoogleFont('Lora', '400', chars),
    loadGoogleFont('Lora', '700', chars),
    loadGoogleFont('Inconsolata', '400', chars),
  ]);

  const titleSize = title.length > 55 ? 54 : title.length > 35 ? 66 : 78;

  const markup = html`
    <div
      style="
        background: ${BG};
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 80px;
        font-family: 'Lora';
      "
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          width: 100%;
          text-align: center;
        "
      >
        <div style="width: 48px; height: 2px; background: ${INK}; display: flex;"></div>

        <div
          style="
            font-size: ${titleSize}px;
            font-weight: 700;
            color: ${INK};
            line-height: 1.2;
            display: flex;
            max-height: 320px;
            overflow: hidden;
            text-align: center;
            justify-content: center;
          "
        >
          ${title}
        </div>

        ${
          subtitle
            ? `<div style="font-family: 'Inconsolata'; font-size: 22px; color: ${MUTED}; display: flex;">${subtitle}</div>`
            : ''
        }

        <div style="width: 48px; height: 2px; background: ${INK}; display: flex;"></div>

        <div
          style="
            font-family: 'Inconsolata';
            font-size: 18px;
            color: ${MUTED};
            letter-spacing: 0.05em;
            display: flex;
          "
        >
          ${SITE}
        </div>
      </div>
    </div>
  `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Lora', data: loraNormal, weight: 400, style: 'normal' },
      { name: 'Lora', data: loraBold, weight: 700, style: 'normal' },
      { name: 'Inconsolata', data: inconsolata, weight: 400, style: 'normal' },
    ],
  });

  return new Uint8Array(new Resvg(svg).render().asPng());
}

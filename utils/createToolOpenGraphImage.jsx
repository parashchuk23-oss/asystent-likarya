import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const notoSansRegular = readFile(path.join(process.cwd(), 'utils/fonts/NotoSans-Regular.ttf'));
const notoSansBold = readFile(path.join(process.cwd(), 'utils/fonts/NotoSans-Bold.ttf'));
const logoMark = readFile(path.join(process.cwd(), 'public/brand/favicon-v3-128.png')).then(
  (buffer) => `data:image/png;base64,${buffer.toString('base64')}`,
);

export const openGraphImageSize = {
  width: 1200,
  height: 630,
};

export const openGraphImageContentType = 'image/png';

export async function createToolOpenGraphImage({ eyebrow, title, description }) {
  const [regularFont, boldFont, logoSrc] = await Promise.all([
    notoSansRegular,
    notoSansBold,
    logoMark,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Noto Sans',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 360,
            height: 360,
            borderRadius: 999,
            background: '#ccfbf1',
            right: -110,
            top: -150,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: 999,
            background: '#dbeafe',
            right: 110,
            bottom: -150,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={logoSrc} alt="" width="58" height="58" />
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>Асистент лікаря</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 930 }}>
          <div
            style={{
              display: 'flex',
              marginBottom: 20,
              color: '#0f766e',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 38 ? 54 : 64,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              maxWidth: 900,
              color: '#475569',
              fontSize: 28,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 24,
            borderTop: '2px solid #e2e8f0',
            color: '#64748b',
            fontSize: 22,
          }}
        >
          <div style={{ display: 'flex' }}>Професійний інструмент для лікаря</div>
          <div style={{ display: 'flex', fontWeight: 700 }}>asystentlikarya.com.ua</div>
        </div>
      </div>
    ),
    {
      ...openGraphImageSize,
      fonts: [
        {
          name: 'Noto Sans',
          data: regularFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Noto Sans',
          data: boldFont,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}

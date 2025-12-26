import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../../src';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
const variants = [
  'bordered',
  'borderless',
  'filled',
  'transparent',
  'outlined',
] as const;
const variantLabels: Record<(typeof variants)[number], string> = {
  bordered: 'Com Borda',
  borderless: 'Sem Borda',
  filled: 'Com Fundo',
  transparent: 'Sem Fundo',
  outlined: 'Apenas Borda',
};

const ExampleRow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>{children}</div>
);

const App: React.FC = () => {
  // Cores para o cartão 'Cores Individuais' (controle local)
  const [singleTitleColor, setSingleTitleColor] = useState('#ff0000');
  const [singleDescriptionColor, setSingleDescriptionColor] =
    useState('#008000');
  const [singleBackgroundColor, setSingleBackgroundColor] = useState('#ffffff');
  // Toggle para exibir o editor de cores do cartão único
  const [showSingleControls, setShowSingleControls] = useState<boolean>(false);

  // Fonte e opções de fonte para o cartão
  const fonts = [
    'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    'Roboto, Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, Times, serif',
    'Courier New, monospace',
    'Tahoma, Geneva, sans-serif',
  ];
  const [singleFont, setSingleFont] = useState<string>(fonts[0]);

  // Campos editáveis no editor do cartão único
  const [singleTitleText, setSingleTitleText] = useState('Cores');
  const [singleDescriptionText, setSingleDescriptionText] = useState(
    'Ajuste as cores abaixo'
  );
  const [singleSize, setSingleSize] = useState<(typeof sizes)[number]>('md');
  const [singleVariant, setSingleVariant] =
    useState<(typeof variants)[number]>('filled');

  // Cartões criados pelo usuário
  const [createdCards, setCreatedCards] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      titleColor: string;
      descriptionColor: string;
      backgroundColor: string;
      font: string;
      titleOffset?: { x: number; y: number };
      descriptionOffset?: { x: number; y: number };
      size?: (typeof sizes)[number];
      variant?: (typeof variants)[number];
    }>
  >([]);

  // Track the last created card id so we can show the download button beneath it
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  // Confetti/toast feedback on create
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const confettiColors = [
    '#FF5C8A',
    '#FFB86B',
    '#FFD93D',
    '#6BCB77',
    '#4D96FF',
    '#9B6DFF',
    '#FF8FB1',
  ];

  // Preset palettes (technological / versatile) — now extended with many presets
  const techPalettes = [
    { name: 'Neon Tech', titleColor: '#FFFFFF', descriptionColor: '#B7FF00', backgroundColor: 'linear-gradient(90deg,#0f0c29,#302b63,#24243e)' },
    { name: 'Aurora', titleColor: '#E6F0FF', descriptionColor: '#CDBBFF', backgroundColor: 'linear-gradient(90deg,#001f3f,#2b5876)' },
    { name: 'Sunset', titleColor: '#221c15', descriptionColor: '#663d00', backgroundColor: 'linear-gradient(90deg,#ff9a9e,#fad0c4)' },
    { name: 'Cyber', titleColor: '#00ffff', descriptionColor: '#9bffea', backgroundColor: 'linear-gradient(90deg,#0f2027,#203a43,#2c5364)' },
    { name: 'Pastel Tech', titleColor: '#2b2b2b', descriptionColor: '#6b6b6b', backgroundColor: 'linear-gradient(90deg,#f6f4ff,#e6fbff)' },
    { name: 'Matrix', titleColor: '#00ff9f', descriptionColor: '#8affb3', backgroundColor: 'linear-gradient(90deg,#001100,#003300)' },
    { name: 'Volt', titleColor: '#FFFFFF', descriptionColor: '#c8ff12', backgroundColor: 'linear-gradient(90deg,#0f0c29,#00c6ff)' },
    { name: 'Deep Sea', titleColor: '#E6FFF9', descriptionColor: '#BFEFFF', backgroundColor: 'linear-gradient(90deg,#011627,#014f86)' },
    { name: 'Solar Flare', titleColor: '#2b0500', descriptionColor: '#5a2e00', backgroundColor: 'linear-gradient(90deg,#ffb347,#ffcc33)' },
    { name: 'Lunar', titleColor: '#E6EEFF', descriptionColor: '#CFDFFF', backgroundColor: 'linear-gradient(90deg,#2b2b5f,#1b1b2f)' },
    { name: 'Hologram', titleColor: '#F8F8FF', descriptionColor: '#B19CFF', backgroundColor: 'linear-gradient(90deg,#ff9a9e,#a18cd1)' },
    { name: 'Pulse', titleColor: '#FFFFFF', descriptionColor: '#FFD1DC', backgroundColor: 'linear-gradient(90deg,#00b4db,#0083b0)' },
    { name: 'Electric Purple', titleColor: '#FFFFFF', descriptionColor: '#FFDAEC', backgroundColor: 'linear-gradient(90deg,#6a00f4,#a800ff)' },
    { name: 'Glass', titleColor: '#000000', descriptionColor: '#333333', backgroundColor: 'linear-gradient(90deg,#ffffff,#f0f7ff)' },
    { name: 'Frost', titleColor: '#0F1F2F', descriptionColor: '#4F6B86', backgroundColor: 'linear-gradient(90deg,#e0f7ff,#bfe9ff)' },
    { name: 'Comet', titleColor: '#FFFFFF', descriptionColor: '#FFEFD5', backgroundColor: 'linear-gradient(90deg,#3a1c71,#d76d77)' },
    { name: 'Plasma', titleColor: '#FFFFFF', descriptionColor: '#FFE0F0', backgroundColor: 'linear-gradient(90deg,#0f2027,#203a43,#2c5364)' },
    { name: 'Monochrome', titleColor: '#111111', descriptionColor: '#444444', backgroundColor: '#f7f7f7' },
    { name: 'Mint', titleColor: '#012B23', descriptionColor: '#045C42', backgroundColor: 'linear-gradient(90deg,#bfffc7,#a3ffd1)' },
    { name: 'Opal', titleColor: '#2B1F2A', descriptionColor: '#7B5F7A', backgroundColor: 'linear-gradient(90deg,#cfe9ff,#e6dfff)' },
    { name: 'Coral Reef', titleColor: '#41221a', descriptionColor: '#642f24', backgroundColor: 'linear-gradient(90deg,#ff9966,#ff5e62)' },
    { name: 'Obsidian', titleColor: '#FFFFFF', descriptionColor: '#BDBDBD', backgroundColor: 'linear-gradient(90deg,#0f0f0f,#2b2b2b)' },
    { name: 'Retro Wave', titleColor: '#FFFFFF', descriptionColor: '#FFF1C6', backgroundColor: 'linear-gradient(90deg,#ff4e50,#f9d423)' },
    { name: 'Vapor', titleColor: '#FFFFFF', descriptionColor: '#C9FFFD', backgroundColor: 'linear-gradient(90deg,#d7d2cc,#304352)' },
    { name: 'Glitch', titleColor: '#FFFFFF', descriptionColor: '#00FFCB', backgroundColor: 'linear-gradient(90deg,#0f0c29,#302b63)' },
    { name: 'Binary', titleColor: '#00FF00', descriptionColor: '#B3FFB3', backgroundColor: '#000000' },
    { name: 'Infrared', titleColor: '#FFFFFF', descriptionColor: '#FFB3C6', backgroundColor: 'linear-gradient(90deg,#ff416c,#ff4b2b)' },
    { name: 'Zenith', titleColor: '#FFFFFF', descriptionColor: '#CBD4FF', backgroundColor: 'linear-gradient(90deg,#1e3c72,#2a5298)' },
    { name: 'Gradient Sky', titleColor: '#FFFFFF', descriptionColor: '#DFEFFF', backgroundColor: 'linear-gradient(90deg,#00c6ff,#0072ff)' },
    { name: 'Emerald City', titleColor: '#FFFFFF', descriptionColor: '#BFFFB6', backgroundColor: 'linear-gradient(90deg,#134e4a,#16a085)' },
    { name: 'Midnight', titleColor: '#FFFFFF', descriptionColor: '#BDB9FF', backgroundColor: 'linear-gradient(90deg,#0f2027,#2f1b7c)' },
    { name: 'Sapphire', titleColor: '#FFFFFF', descriptionColor: '#CCE7FF', backgroundColor: 'linear-gradient(90deg,#0f2027,#2b5876)' },
    { name: 'Amber', titleColor: '#1B0E00', descriptionColor: '#694011', backgroundColor: 'linear-gradient(90deg,#ffb75e,#ed8f03)' },
    { name: 'Magma', titleColor: '#FFFFFF', descriptionColor: '#FFD0B3', backgroundColor: 'linear-gradient(90deg,#ff512f,#dd2476)' },
    { name: 'Quantum', titleColor: '#FFFFFF', descriptionColor: '#B9FFD6', backgroundColor: 'linear-gradient(90deg,#141e30,#243b55)' },
  ];


  const [showAllPalettes, setShowAllPalettes] = useState(false);

  // Edit card state (rename / description edit)
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingDescription, setEditingDescription] = useState<string>('');

  // Estados para edição de cores do card
  const [editingTitleColor, setEditingTitleColor] = useState<string>('#000000');
  const [editingDescriptionColor, setEditingDescriptionColor] = useState<string>('#000000');
  const [editingBackgroundColor, setEditingBackgroundColor] = useState<string>('#ffffff');
  // Estados para mover texto (posições locais enquanto edita)
  const [editingMoveMode, setEditingMoveMode] = useState<boolean>(false);
  const [editingTitlePos, setEditingTitlePos] = useState<{ x: number; y: number }>({ x: 32, y: 72 });
  const [editingDescriptionPos, setEditingDescriptionPos] = useState<{ x: number; y: number }>({ x: 32, y: 120 });
  const draggingRef = useRef<null | { type: 'title' | 'desc'; startX: number; startY: number; origX: number; origY: number }>(null);

  // Single card move-text states (preview while creating)
  const [singleMoveMode, setSingleMoveMode] = useState<boolean>(false);
  const [singleTitlePos, setSingleTitlePos] = useState<{ x: number; y: number }>({ x: 32, y: 72 });
  const [singleDescriptionPos, setSingleDescriptionPos] = useState<{ x: number; y: number }>({ x: 32, y: 120 });
  const singleDraggingRef = useRef<null | { type: 'title' | 'desc'; startX: number; startY: number; origX: number; origY: number }>(null);
  // Committed positions are applied to the preview Card only when explicitly saved
  const [committedSingleTitlePos, setCommittedSingleTitlePos] = useState<{ x: number; y: number } | null>(null);
  const [committedSingleDescriptionPos, setCommittedSingleDescriptionPos] = useState<{ x: number; y: number } | null>(null);

  // Error state for inline edits
  const [editingError, setEditingError] = useState<string | null>(null);

  // -- Download helpers (SVG -> PNG, no deps) --
  const escapeXml = (str: string) =>
    String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const extractGradientColors = (val?: string) => {
    if (!val || typeof val !== 'string') return null;
    if (!val.startsWith('linear-gradient')) return null;
    const inner = val.substring(val.indexOf('(') + 1, val.lastIndexOf(')'));
    const parts = inner.split(',').map((p) => p.trim());
    return parts.filter((p) => !/deg$/.test(p) && !p.startsWith('to '));
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  type DemoCard = { title?: string; description?: string; backgroundColor?: string; titleColor?: string; descriptionColor?: string; font?: string; titleOffset?: { x: number; y: number }; descriptionOffset?: { x: number; y: number } };

  // Break text into chunks of `n` characters (simple fixed-width wrap per request)
  const chunkText = (s: string, n = 20) => {
    const out: string[] = [];
    for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n));
    return out;
  };

  const formatForDisplay = (s?: string) => (s ? chunkText(s, 20).join('\n') : '');

  const buildSvgForCard = (card: DemoCard) => {
  /* eslint-enable @typescript-eslint/no-unused-vars */
    const width = 900;
    const height = 520;
    const padding = 32;
    const title = escapeXml(card.title || '');
    const description = escapeXml(card.description || '');
    const fontFamily = card.font || 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    let defs = '';
    let bgFill = '#ffffff';
    const gradColors = extractGradientColors(card.backgroundColor);
    if (gradColors && gradColors.length > 0) {
      const stops = gradColors
        .map((c: string, i: number) => `<stop offset="${Math.round((i / (gradColors.length - 1)) * 100)}%" stop-color="${c}" />`)
        .join('\n');
      defs = `<defs>\n  <linearGradient id="g" x1="0%" x2="100%">\n${stops}\n  </linearGradient>\n</defs>`;
      bgFill = 'url(#g)';
    } else if (card.backgroundColor) {
      bgFill = card.backgroundColor;
    }

    // Prepare multi-line tspans for title and description (20 chars per line)
    const titleLines = chunkText(title, 20);
    const descLines = chunkText(description, 20);
    const titleX = (card.titleOffset && card.titleOffset.x) ?? 0;
    const titleY = (card.titleOffset && card.titleOffset.y) ?? 72;
    const descX = (card.descriptionOffset && card.descriptionOffset.x) ?? 0;
    const descY = (card.descriptionOffset && card.descriptionOffset.y) ?? 120;

    const titleTspans = titleLines
      .map((l, i) => `    <tspan x="${titleX}" ${i === 0 ? `dy="0"` : `dy="44"`}>${l}</tspan>`)
      .join('\n');
    const descTspans = descLines
      .map((l, i) => `    <tspan x="${descX}" ${i === 0 ? `dy="0"` : `dy="22"`}>${l}</tspan>`)
      .join('\n');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n${defs}\n  <rect x="0" y="0" width="100%" height="100%" rx="18" fill="${bgFill}" />\n  <style>\n    .title{ font-family: ${fontFamily}; font-size: 40px; font-weight:800;}\n    .desc{ font-family: ${fontFamily}; font-size: 18px; opacity:0.95;}\n  </style>\n  <g transform="translate(${padding},${padding})">\n    <text x="${titleX}" y="${titleY}" class="title" fill="${card.titleColor || '#000'}">\n${titleTspans}\n    </text>\n    <text x="${descX}" y="${descY}" class="desc" fill="${card.descriptionColor || '#222'}">\n${descTspans}\n    </text>\n  </g>\n</svg>`;

    return { svg, width, height };
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const downloadSvgAsPng = (svgString: string, width: number, height: number, filename = 'card.png') => {
  /* eslint-enable @typescript-eslint/no-unused-vars */
    return new Promise<void>((resolve) => {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return resolve();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
          resolve();
        }, 'image/png');
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  };



  return (
    <div style={{ padding: 20, background: 'var(--page-bg, #fff)' }}>
      {/* Confetti and toast feedback */}
      {showConfetti && (
        <div className="confetti" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 5) % 100}%`,
                background: confettiColors[i % confettiColors.length],
                animationDelay: `${(i % 6) * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {toastMessage && (
        <div className="toast" role="status">
          {toastMessage}
        </div>
      )}



      <h2 style={{ marginTop: 20, color: 'var(--accent-2)', fontSize: 24, fontWeight: 800 }}>Faça seu Card</h2>
      <ExampleRow>
        {/* Container with the Card that toggles the color editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Card
              title="Cores"
              description="Clique para editar as cores"
              titleColor={singleTitleColor}
              descriptionColor={singleDescriptionColor}
              variant={singleVariant}
              onClick={() => setShowSingleControls((s) => !s)}
            />

            {/* Variant quick actions + Reset */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginLeft: 8,
              }}
            >
              <button
                onClick={() => {
                  setSingleTitleColor('#ff0000');
                  setSingleDescriptionColor('#008000');
                  setSingleBackgroundColor('#ffffff');
                }}
                style={{ marginLeft: 12 }}
              >
                reset
              </button>
            </div>
          </div>

          {/* Collapsible editor panel */}
          {showSingleControls && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                padding: 12,
                background: 'rgba(0,0,0,0.03)',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.04)',
              }}
            >
              {/* Font selector (1) */}
              <div
                style={{
                  minWidth: 220,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <label style={{ fontSize: 12 }}>Fonte</label>
                <select
                  value={singleFont}
                  onChange={(e) => setSingleFont(e.target.value)}
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>
                      {f.split(',')[0]}
                    </option>
                  ))}
                </select>

                {/* Live preview (2) */}
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontSize: 12 }}>Preview Dinâmico</label>
                  <div
                    style={{
                      padding: 8,
                      marginTop: 8,
                      background: '#fff',
                      borderRadius: 8,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                      <div style={{ fontFamily: singleFont }}>
                        <Card
                          title={singleTitleText}
                          description={singleDescriptionText}
                          titleColor={singleTitleColor}
                          descriptionColor={singleDescriptionColor}
                          size={singleSize}
                          variant={singleVariant}
                          backgroundColor={singleBackgroundColor}
                          fontFamily={singleFont}
                          // Show live dragged offsets while move mode is active, otherwise show committed (or none)
                          titleOffset={singleMoveMode ? singleTitlePos : (committedSingleTitlePos ?? undefined)}
                          descriptionOffset={singleMoveMode ? singleDescriptionPos : (committedSingleDescriptionPos ?? undefined)}
                        />

                        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                          <button onClick={() => setSingleMoveMode((s) => !s)}>{singleMoveMode ? 'Fechar mover' : 'Mover Texto'}</button>
                          {singleMoveMode && (
                            <button onClick={() => { setSingleMoveMode(false); setToastMessage('Posição salva'); setTimeout(() => setToastMessage(null), 1400); }}>
                              Salvar Posição
                            </button>
                          )}
                          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>Arraste os textos no preview</div>
                        </div>

                        {singleMoveMode && (
                          <div
                            onPointerMove={(e) => {
                              if (!singleDraggingRef.current) return;
                              const dx = e.clientX - singleDraggingRef.current.startX;
                              const dy = e.clientY - singleDraggingRef.current.startY;
                              if (singleDraggingRef.current.type === 'title') {
                                setSingleTitlePos({ x: Math.max(0, singleDraggingRef.current.origX + dx), y: Math.max(0, singleDraggingRef.current.origY + dy) });
                              } else {
                                setSingleDescriptionPos({ x: Math.max(0, singleDraggingRef.current.origX + dx), y: Math.max(0, singleDraggingRef.current.origY + dy) });
                              }
                            }}
                            onPointerUp={(e) => {
                              if (singleDraggingRef.current) {
                                try { (e.currentTarget as Element).releasePointerCapture((e as any).pointerId); } catch {}
                              }
                              singleDraggingRef.current = null;
                            }}
                            style={{ marginTop: 8, width: 360, height: 200, border: '1px solid rgba(0,0,0,0.06)', position: 'relative', background: singleBackgroundColor }}
                          >
                            <div
                              style={{ position: 'absolute', left: singleTitlePos.x, top: singleTitlePos.y, cursor: 'grab', color: singleTitleColor, fontWeight: 800, whiteSpace: 'pre-wrap', lineHeight: 1.05 }}
                              onPointerDown={(e) => {
                                (e.currentTarget as Element).setPointerCapture((e as any).pointerId);
                                singleDraggingRef.current = { type: 'title', startX: e.clientX, startY: e.clientY, origX: singleTitlePos.x, origY: singleTitlePos.y };
                              }}
                            >
                              {formatForDisplay(singleTitleText)}
                            </div>
                            <div
                              style={{ position: 'absolute', left: singleDescriptionPos.x, top: singleDescriptionPos.y, cursor: 'grab', color: singleDescriptionColor, whiteSpace: 'pre-wrap' }}
                              onPointerDown={(e) => {
                                (e.currentTarget as Element).setPointerCapture((e as any).pointerId);
                                singleDraggingRef.current = { type: 'desc', startX: e.clientX, startY: e.clientY, origX: singleDescriptionPos.x, origY: singleDescriptionPos.y };
                              }}
                            >
                              {formatForDisplay(singleDescriptionText)}
                            </div>
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              </div>

              {/* Size & Variant (3 & 4) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 200,
                }}
              >
                <label style={{ fontSize: 12 }}>Tamanho</label>
                <select
                  value={singleSize}
                  onChange={(e) =>
                    setSingleSize(e.target.value as (typeof sizes)[number])
                  }
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label style={{ fontSize: 12, marginTop: 8 }}>Variante</label>
                <select
                  value={singleVariant}
                  onChange={(e) =>
                    setSingleVariant(
                      e.target.value as (typeof variants)[number]
                    )
                  }
                >
                  {variants.map((v) => (
                    <option key={v} value={v}>
                      {variantLabels[v]}
                    </option>
                  ))}
                </select>

                <label style={{ fontSize: 12, marginTop: 8 }}>
                  Título (texto)
                </label>
                <input
                  aria-label="single-title-text"
                  type="text"
                  value={singleTitleText}
                  onChange={(e) => setSingleTitleText(e.target.value)}
                />
                <label style={{ fontSize: 12, marginTop: 8 }}>
                  Descrição (texto)
                </label>
                <input
                  aria-label="single-description-text"
                  type="text"
                  value={singleDescriptionText}
                  onChange={(e) => setSingleDescriptionText(e.target.value)}
                />
              </div>

              {/* Colors (5) */}
              <div className="controls">
                <label>Título (cor)</label>
                <input
                  aria-label="single-title-color"
                  type="color"
                  value={singleTitleColor}
                  onChange={(e) => setSingleTitleColor(e.target.value)}
                />
              </div>

              <div className="controls">
                <label>Descrição (cor)</label>
                <input
                  aria-label="single-description-color"
                  type="color"
                  value={singleDescriptionColor}
                  onChange={(e) => setSingleDescriptionColor(e.target.value)}
                />
              </div>

              <div className="controls">
                <label>Cor de Fundo</label>
                <input
                  aria-label="single-bg-color"
                  type="color"
                  value={singleBackgroundColor}
                  onChange={(e) => setSingleBackgroundColor(e.target.value)}
                />
              </div>

              {/* Paletas Tecnológicas */}
              <div style={{ marginTop: 8, width: '100%' }}>
                <label style={{ fontSize: 12 }}>Paletas Tecnológicas</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                  <button className="all-palettes-btn" onClick={() => setShowAllPalettes((s) => !s)}>
                    Todas Paletas ({techPalettes.length})
                  </button>
                </div>

                {showAllPalettes && (
                  <div className="palette-panel" role="dialog" aria-modal="true">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ fontWeight: 700 }}>Todas Paletas</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-reset" onClick={() => setShowAllPalettes(false)}>Fechar</button>
                      </div>
                    </div>

                    <div className="palette-panel-grid">
                      {techPalettes.map((p) => (
                        <div key={p.name} className="palette-item" style={{ background: p.backgroundColor, color: p.titleColor }}>
                          <button
                            className="palette-item-btn"
                            onClick={() => {
                              setSingleTitleColor(p.titleColor);
                              setSingleDescriptionColor(p.descriptionColor);
                              setSingleBackgroundColor(p.backgroundColor);
                              setShowAllPalettes(false);
                            }}
                          >
                            <div className="palette-item-name">{p.name}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={() => {
                    const id = `custom-${Date.now()}`;
                    setCreatedCards((prev) => [
                      {
                        id,
                        title: singleTitleText,
                        description: singleDescriptionText,
                        titleColor: singleTitleColor,
                        descriptionColor: singleDescriptionColor,
                        backgroundColor: singleBackgroundColor,
                        font: singleFont,
                        size: singleSize,
                        variant: singleVariant,
                        titleOffset: committedSingleTitlePos ?? singleTitlePos,
                        descriptionOffset: committedSingleDescriptionPos ?? singleDescriptionPos,
                      },
                      ...prev,
                    ]);
                    setLastCreatedId(id);
                    setShowSingleControls(false);
                    setShowConfetti(true);
                    setToastMessage('Cartão criado');
                    setTimeout(() => setShowConfetti(false), 1400);
                    setTimeout(() => setToastMessage(null), 1600);
                  }}
                >
                  Criar Card
                </button>
                <button onClick={() => setShowSingleControls(false)}>
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </ExampleRow>

      <h2 style={{ marginTop: 24 }}>Meus Cardes</h2>
      <ExampleRow>
        {createdCards.length === 0 ? (
          <div>Nenhum card criado</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {createdCards.map((card) => (
              <div
                key={card.id}
                style={{
                  border: '1px solid rgba(0,0,0,0.06)',
                  padding: 12,
                  borderRadius: 8,
                  minWidth: 220,
                }}
              >
                <div style={{ fontFamily: card.font }}>
                  <Card
                    title={card.title}
                    description={card.description}
                    titleColor={card.titleColor}
                    descriptionColor={card.descriptionColor}
                    size={card.size}
                    variant={card.variant}
                    backgroundColor={card.backgroundColor}
                    // If this card is being edited and move mode is active, show the live edit positions
                    titleOffset={editingCardId === card.id && editingMoveMode ? editingTitlePos : card.titleOffset}
                    descriptionOffset={editingCardId === card.id && editingMoveMode ? editingDescriptionPos : card.descriptionOffset}
                  />
                </div>

                {editingCardId === card.id ? (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 12 }}>Título (cor)</label>
                      <input
                        aria-label={`edit-title-color-${card.id}`}
                        type="color"
                        value={editingTitleColor}
                        onChange={(e) => setEditingTitleColor(e.target.value)}
                      />
                      <label style={{ fontSize: 12 }}>Descrição (cor)</label>
                      <input
                        aria-label={`edit-description-color-${card.id}`}
                        type="color"
                        value={editingDescriptionColor}
                        onChange={(e) => setEditingDescriptionColor(e.target.value)}
                      />

                      <label style={{ fontSize: 12 }}>Cor de Fundo</label>
                      <input
                        aria-label={`edit-bg-color-${card.id}`}
                        type="color"
                        value={editingBackgroundColor}
                        onChange={(e) => setEditingBackgroundColor(e.target.value)}
                      />

                      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                        {techPalettes.slice(0, 8).map((p) => (
                          <button
                            key={p.name}
                            onClick={() => {
                              setEditingTitleColor(p.titleColor);
                              setEditingDescriptionColor(p.descriptionColor);
                              setEditingBackgroundColor(p.backgroundColor);
                            }}
                            style={{ padding: 6, borderRadius: 6, border: '1px solid rgba(0,0,0,0.06)', background: p.backgroundColor, color: p.titleColor }}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <button onClick={() => setEditingMoveMode((s) => !s)}>{editingMoveMode ? 'Fechar mover' : 'Mover Texto'}</button>
                        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>Arraste os textos no preview</div>
                      </div>

                      {editingMoveMode && (
                        <div
                          onPointerMove={(e) => {
                            if (!draggingRef.current) return;
                            const dx = e.clientX - draggingRef.current.startX;
                            const dy = e.clientY - draggingRef.current.startY;
                            if (draggingRef.current.type === 'title') {
                              setEditingTitlePos({ x: Math.max(0, draggingRef.current.origX + dx), y: Math.max(0, draggingRef.current.origY + dy) });
                            } else {
                              setEditingDescriptionPos({ x: Math.max(0, draggingRef.current.origX + dx), y: Math.max(0, draggingRef.current.origY + dy) });
                            }
                          }}
                          onPointerUp={(e) => {
                            if (draggingRef.current) {
                              try { (e.currentTarget as Element).releasePointerCapture((e as any).pointerId); } catch {}
                            }
                            draggingRef.current = null;
                          }}
                          style={{ marginTop: 8, width: 360, height: 200, border: '1px solid rgba(0,0,0,0.06)', position: 'relative', background: editingBackgroundColor }}
                        >
                          <div
                            style={{ position: 'absolute', left: editingTitlePos.x, top: editingTitlePos.y, cursor: 'grab', color: editingTitleColor, fontWeight: 800, whiteSpace: 'pre-wrap', lineHeight: 1.05 }}
                            onPointerDown={(e) => {
                              (e.currentTarget as Element).setPointerCapture((e as any).pointerId);
                              draggingRef.current = { type: 'title', startX: e.clientX, startY: e.clientY, origX: editingTitlePos.x, origY: editingTitlePos.y };
                            }}
                          >
                            {formatForDisplay(card.title)}
                          </div>
                          <div
                            style={{ position: 'absolute', left: editingDescriptionPos.x, top: editingDescriptionPos.y, cursor: 'grab', color: editingDescriptionColor, whiteSpace: 'pre-wrap' }}
                            onPointerDown={(e) => {
                              (e.currentTarget as Element).setPointerCapture((e as any).pointerId);
                              draggingRef.current = { type: 'desc', startX: e.clientX, startY: e.clientY, origX: editingDescriptionPos.x, origY: editingDescriptionPos.y };
                            }}
                          >
                            {formatForDisplay(card.description)}
                          </div>

                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            if (editingCardId) {
                              setCreatedCards((prev) =>
                                prev.map((x) => (x.id === editingCardId ? { ...x, titleOffset: editingTitlePos, descriptionOffset: editingDescriptionPos } : x))
                              );
                              setEditingMoveMode(false);
                              setToastMessage('Posição salva');
                              setTimeout(() => setToastMessage(null), 1400);
                            }
                          }}
                        >
                          Salvar Posição
                        </button>

                        <button
                          onClick={() => {
                            setCreatedCards((prev) =>
                              prev.map((x) =>
                                x.id === card.id
                                  ? {
                                      ...x,
                                      titleColor: editingTitleColor,
                                      descriptionColor: editingDescriptionColor,
                                      backgroundColor: editingBackgroundColor,
                                      titleOffset: editingTitlePos,
                                      descriptionOffset: editingDescriptionPos,
                                    }
                                  : x
                              )
                            );
                            setEditingCardId(null);
                            setEditingMoveMode(false);
                            setToastMessage('Cores atualizadas');
                            setTimeout(() => setToastMessage(null), 1400);
                          }}
                        >
                          Salvar
                        </button>

                        <button
                          onClick={() => {
                            setEditingCardId(null);
                            setEditingMoveMode(false);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>

                      <button
                        onClick={() => {
                          setEditingCardId(card.id);
                          setEditingTitleColor(card.titleColor);
                          setEditingDescriptionColor(card.descriptionColor);
                          setEditingBackgroundColor(card.backgroundColor);
                          setEditingTitlePos(card.titleOffset ?? { x: 32, y: 72 });
                          setEditingDescriptionPos(card.descriptionOffset ?? { x: 32, y: 120 });
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setCreatedCards((prev) => prev.filter((x) => x.id !== card.id));
                          setToastMessage('Cartão removido');
                          setTimeout(() => setToastMessage(null), 1400);
                        }}
                      >
                        Excluir
                      </button>
                      {card.id === lastCreatedId && (
                        <button
                          onClick={async () => {
                            const { svg, width, height } = buildSvgForCard({ title: card.title, description: card.description, titleColor: card.titleColor, descriptionColor: card.descriptionColor, backgroundColor: card.backgroundColor, font: card.font, titleOffset: card.titleOffset, descriptionOffset: card.descriptionOffset });
                            await downloadSvgAsPng(svg, width, height, `${card.title || 'cartao'}.png`);
                            setToastMessage('Download iniciado');
                            setTimeout(() => setToastMessage(null), 1400);
                          }}
                        >
                          Baixar
                        </button>
                      )}
                    </div>

                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </ExampleRow>

      <footer style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>© 2025 Seu Nome. Todos os direitos reservados.</div>
        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.6)' }}>Licença MIT</div>
      </footer>

    </div>
  );
};

export default App;

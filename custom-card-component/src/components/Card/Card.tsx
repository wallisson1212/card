import React from 'react';
import styles from './Card.styles.module.css';
import { CardProps } from './Card.types';

const Card: React.FC<CardProps> = ({
  title,
  description,
  leftIcon,
  rightIcon,
  titleColor,
  descriptionColor,
  leftIconColor,
  rightIconColor,
  backgroundColor,
  size = 'md',
  variant = 'bordered',
  disabled = false,
  loading = false,
  onClick,
  showActions = false,
  onEdit,
  onDownload,
  downloadFileName = 'card.html',
  fontFamily,
  ['aria-label']: ariaLabel,
  ['data-testid']: testId,
}) => {
  const sizeClass = styles[`card--${size}`] || '';

  const variantClass = variant ? styles[`card--${variant}`] || '' : '';
  const disabledClass = disabled ? styles['card--disabled'] : '';

  const classList = [styles.card, sizeClass, variantClass, disabledClass].filter(Boolean);
  const cardClass = classList.join(' ');

  const style: React.CSSProperties & Record<string, string> = {};
  if (backgroundColor) style['--card-background'] = backgroundColor;
  if (titleColor) style['--title-color'] = titleColor;
  if (descriptionColor) style['--description-color'] = descriptionColor;
  if (leftIconColor) style['--left-icon-color'] = leftIconColor;
  if (rightIconColor) style['--right-icon-color'] = rightIconColor;

  const titleStyle: React.CSSProperties | undefined = titleColor ? { color: titleColor } : undefined;
  const descriptionStyle: React.CSSProperties | undefined = descriptionColor ? { color: descriptionColor } : undefined;

  const getIconText = (node?: React.ReactNode) => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (React.isValidElement(node)) {
      const elem = node as React.ReactElement<unknown>;
      const c = (elem.props as { children?: React.ReactNode })?.children;
      if (typeof c === 'string' || typeof c === 'number') return String(c);
    }
    return '';
  };

  const handleDownload = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e && e.stopPropagation();

    const leftIconText = getIconText(leftIcon);
    const rightIconText = getIconText(rightIcon);

    const safeTitle = title ? title : '';
    const safeDesc = description ? description : '';
    const bg = backgroundColor || '#fff';
    const tColor = titleColor || 'inherit';
    const dColor = descriptionColor || 'inherit';
    const font = fontFamily || undefined;

    const styleBlock = `
      body{margin:0;font-family:${font || 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'};}
      .card{box-sizing:border-box;padding:1rem;border-radius:10px;background:${bg};color:inherit;max-width:720px;margin:24px auto;border:1px solid rgba(0,0,0,0.06);font-family:${font || 'inherit'} }
      .card h1{margin:0 0 8px;color:${tColor};font-size:20px}
      .card p{margin:0;color:${dColor};font-size:14px}
      .icons{display:flex;gap:8px;align-items:center;margin-bottom:8px}
    `;

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${safeTitle}</title>
          <style>${styleBlock}</style>
        </head>
        <body>
          <div class="card">
            <div class="icons">
              ${leftIconText ? `<span class="left">${leftIconText}</span>` : ''}
              ${rightIconText ? `<span class="right">${rightIconText}</span>` : ''}
            </div>
            ${safeTitle ? `<h1>${safeTitle}</h1>` : ''}
            ${safeDesc ? `<p>${safeDesc}</p>` : ''}
          </div>
        </body>
      </html>`;

    const blob = new Blob([html], { type: 'text/html' });

    if (onDownload) {
      try {
        onDownload(blob, html);
        return;
      } catch (err) {
        console.error('onDownload handler failed', err);
      }
    }

    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName || 'card.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (typeof URL.revokeObjectURL === 'function') URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  return (
    <div
      className={cardClass}
      style={style}
      onClick={(e) => !disabled && !loading && onClick && onClick(e)}
      role={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
      data-testid={testId}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {leftIcon && <div className={`${styles['card__left']} ${styles['card__icon']} ${styles['card__icon--left']}`}>{leftIcon}</div>}

      <div className={styles['card__content']}>
        <h3 className={`${styles['card__title']} ${styles['card__title--color']}`} style={titleStyle}>{title}</h3>
        {description && (
          <p className={`${styles['card__description']} ${styles['card__description--color']}`} style={descriptionStyle}>{description}</p>
        )}
      </div>

      {rightIcon && <div className={`${styles['card__right']} ${styles['card__icon']} ${styles['card__icon--right']}`}>{rightIcon}</div>}

      {showActions && (
        <div className={styles['card__actions']} onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button className={styles['card__action-button']} onClick={(e) => { e.stopPropagation(); onEdit(); }} aria-label="Editar">Editar</button>
          )}
          <button className={`${styles['card__action-button']} ${styles['card__action-button--primary']}`} onClick={handleDownload} aria-label="Baixar">Baixar</button>
        </div>
      )}
    </div>
  );
};

export default Card;
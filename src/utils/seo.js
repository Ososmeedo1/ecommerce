function ensureMetaTag({ selector, attributes }) {
  let meta = document.head.querySelector(selector);

  if (!meta) {
    meta = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      meta.setAttribute(key, value);
    });
    document.head.appendChild(meta);
  }

  return meta;
}

export function setPageMeta({ title, description, image }) {
  if (title) {
    document.title = title;
  }

  if (description) {
    const descriptionTag = ensureMetaTag({
      selector: 'meta[name="description"]',
      attributes: { name: 'description' }
    });
    descriptionTag.setAttribute('content', description);

    const ogDescriptionTag = ensureMetaTag({
      selector: 'meta[property="og:description"]',
      attributes: { property: 'og:description' }
    });
    ogDescriptionTag.setAttribute('content', description);
  }

  if (title) {
    const ogTitleTag = ensureMetaTag({
      selector: 'meta[property="og:title"]',
      attributes: { property: 'og:title' }
    });
    ogTitleTag.setAttribute('content', title);
  }

  if (image) {
    const ogImageTag = ensureMetaTag({
      selector: 'meta[property="og:image"]',
      attributes: { property: 'og:image' }
    });
    ogImageTag.setAttribute('content', image);
  }
}

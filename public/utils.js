
export const setDocumentTitle = (newTitle) => {
  document.title = newTitle;
};

export const between = (value, min, max) => Math.max(Math.min(value, max), min);

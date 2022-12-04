export const parseList = rawList => {
  const items = rawList.split('\r\n').map(line => line.split('\t'));
  return items;
};

export const downloadJSON = (object, filename = 'data') => {
  const blob = new Blob([JSON.stringify(object, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.parentElement.removeChild(link);
  URL.revokeObjectURL(href);
};

export default {};

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

/**
 * @param {Object} file Resource from an file input field
 * @return {Object} Object with name and content as ArrayBuffer
 */
export const readFile = (file, readerMethod = 'readAsArrayBuffer') => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject(new Error('file reading was aborted'));
    reader.onerror = () => reject(new Error('file reading has failed'));
    reader.onload = () => resolve({
      filename: file.name,
      content: reader.result,
    });
    reader[readerMethod](file);
  })
);

/**
 * Get buffer content from an array of file resources
 *
 * @param {Object[]} fileResources Array of file resources (from file input field)
 * @returns {Object[]} An array of file with name, and content as ArrayBuffer
 */
export const readFiles = async (fileResources, readerMethod) => {
  const promises = fileResources.map(fileResource => readFile(fileResource, readerMethod));
  const files = await Promise.all(promises);
  return files;
};

export default {};

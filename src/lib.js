export const parseList = rawList => {
  const items = rawList.split('\r\n').map(line => line.split('\t'));
  return items;
};

export default {};

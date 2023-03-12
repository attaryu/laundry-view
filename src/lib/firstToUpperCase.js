export default function firstToUpperCase(string) {
  // params 'laki_laki'
  const removeUnderline = string.split('_');
  // result: ['laki', 'laki'],
  const splitAllWord = removeUnderline.map((word) => word.split(''));
  // result: [['l', 'a', 'k', 'i'], ['l', 'a', 'k', 'i']]

  return splitAllWord.map((alp) => `${alp[0].toUpperCase()}${alp.slice(1).join('')}`).join(' ');
  // result: 'Laki Laki'
}

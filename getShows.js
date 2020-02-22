// Original file by Wes Bos/Scott Tolinski
const { promisify } = require('util');
const glob = promisify(require('glob'));
const { readFile } = require('fs');

const readAFile = promisify(readFile);


exports.loadSickPicksWithMatchString = async (matchstring) => {
  const files = await glob('./Syntax/shows/*.md');
  const markdownPromises = files.map(file => readAFile(file, 'utf-8'));
  const showMarkdown = await Promise.all(markdownPromises);

  const matchStringRegex = new RegExp(`^\\* (Wes|Scott).*${matchstring}.*$`, 'i');
  const urlRegex = new RegExp(`^\\* (Wes|Scott)?.*(https?).*$`, 'i');

  const matchedLines = showMarkdown
    .reduce((accumulator, value) => {
      const linesWithPodcasts = value
        .split('\n')
        .filter(line => (!!line.match(matchStringRegex) && !!line.match(urlRegex)))
      return accumulator.concat(linesWithPodcasts);
    }, []);

    const matchedUniqueLines = new Set(matchedLines);
    const formattedLines = [...matchedUniqueLines]
      .map(line => ({
        sickPickBy: line.includes('Wes') ? 'Wes' : 'Scott',
        title: line.match(/\[(.*)\]/)[1],
        url: line.match(/\((.*)\)/)[1],
      }));
    
    return formattedLines;
};
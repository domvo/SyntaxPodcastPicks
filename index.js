const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const { loadSickPicksWithMatchString } = require('./getShows');

const getSickPicksAndWriteToReadme = async () => {
  const podcastSickPicks = await loadSickPicksWithMatchString('podcast');
  const youtubeSickPicks = await loadSickPicksWithMatchString('youtube');

  const currentReadme = await readFile('./README.md', 'utf8');
  const staticReadmeContent = currentReadme.split('<!-- dynamic_content_below -->')[0];

  const dynamicPodcastLines = [
    '# Sick Picked Podcasts',
    '',
    'Name | Link | Sick Pick by',
    '--- | --- | ---',
  ];

  podcastSickPicks.forEach(podcast => {
    dynamicPodcastLines.push(`${podcast.title} | [Click me](${podcast.url}) | ${podcast.sickPickBy}`);
  });

  const dynamicYoutubeLines = [
    '# Sick Picked Youtube Videos or Channels',
    '',
    'Name | Link | Sick Pick by',
    '--- | --- | ---',
  ];

  youtubeSickPicks.forEach(podcast => {
    dynamicYoutubeLines.push(`${podcast.title} | [Click me](${podcast.url}) | ${podcast.sickPickBy}`);
  });

  const finalReadMeString = 
    staticReadmeContent + 
    '<!-- dynamic_content_below -->' + 
    '\n' +
    dynamicPodcastLines.join('\n') + 
    '\n' +
    dynamicYoutubeLines.join('\n');
  
  await writeFile('./README.md', finalReadMeString);
}

getSickPicksAndWriteToReadme();
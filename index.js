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
    let title = podcast.title;
    if (title.length > 30) {
      title = `${title.substr(0, 29)}...`;
    }
    dynamicPodcastLines.push(`${title} | [Click me](${podcast.url}) | ${podcast.sickPickBy}`);
  });

  const dynamicYoutubeLines = [
    '# Sick Picked Youtube Videos or Channels',
    '',
    'Name | Link | Sick Pick by',
    '--- | --- | ---',
  ];

  youtubeSickPicks.forEach(youtubeVideo => {
    let title = youtubeVideo.title;
    if (title.length > 30) {
      title = `${title.substr(0, 29)}...`;
    }
    dynamicYoutubeLines.push(`${title} | [Click me](${youtubeVideo.url}) | ${youtubeVideo.sickPickBy}`);
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

(async () => {
  await getSickPicksAndWriteToReadme();
})();  

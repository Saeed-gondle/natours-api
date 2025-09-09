module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Netlify Build Starting...');
    console.log('Node version:', process.version);
    console.log('NODE_VERSION env:', process.env.NODE_VERSION);
    console.log('Current directory:', process.cwd());
    console.log('Directory contents:', utils.run.command('ls -la'));
    console.log(
      'NVM status:',
      utils.run.command('which node || echo "No node found"')
    );
    console.log('Available npm scripts:', utils.run.command('npm run'));
  },
  onBuild: ({ utils }) => {
    console.log('Build step running...');
    console.log('public directory exists:', utils.run.command('ls -la public || echo "No public directory"'));
    console.log('netlify/functions directory exists:', utils.run.command('ls -la netlify/functions || echo "No functions directory"'));
  }
};

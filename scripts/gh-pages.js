const ghpages = require('gh-pages')
const dir = '../'

ghpages.publish(dir, (err) => {
  if (err) console.error(err)
  else console.log('Published')
})

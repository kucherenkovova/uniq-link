const querystring = require('querystring')
const randomstring = require('randomstring')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

if (!process.argv[2]) throw 'You must specify an input file!'
if (!process.argv[3]) throw 'You must specify amount of unique links!'

const FILENAME = process.argv[2]
const AMOUNT = process.argv[3]

if (isNaN(Number(AMOUNT))) throw 'Second argument should be a number!'

readLinksFromFile(path.join(process.cwd(), FILENAME))
  .then(generateRandomLinks)
  .then(uniqueLinks => {
    _.each(uniqueLinks, link => console.log(link))
  })
  .catch(err => {
    console.log(err)
    process.exit(1)
  })

function generateRandomLinks (links) {
  const uniqueLinks = _.flatMap(links, link => {
    return _.times(AMOUNT, () => randomizeLink(link))
  })
  return uniqueLinks
}

function randomizeLink (link) {
  const randomObj = {
    [randomstring.generate(3)]: randomstring.generate(5),
    [randomstring.generate(2)]: randomstring.generate(4)
  }
  return `${link}?${querystring.stringify(randomObj)}`
}

function readLinksFromFile(file) {
  return new Promise(resolve => {
    const links = fs.readFileSync(file, 'utf8').split(/\r?\n/)
    resolve(links)
  })
}

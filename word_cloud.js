let myWords = [
  { word: 'Running', size: '10' },
  { word: 'Surfing', size: '20' },
  { word: 'Climbing', size: '50' },
  { word: 'Kiting', size: '30' },
  { word: 'Sailing', size: '20' },
  { word: 'Snowboarding', size: '60' },
]
let stopWord = []
function readTextFile(file) {
  var rawFile = new XMLHttpRequest()
  rawFile.open('GET', file, false)
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        stopWord = rawFile.responseText.split(',')
      }
    }
  }
  rawFile.send(null)
}
readTextFile('https://gist.githubusercontent.com/ZohebAbai/513218c3468130eacff6481f424e4e64/raw/b70776f341a148293ff277afa0d0302c8c38f7e2/gist_stopwords.txt')
const test = `I had no idea what this was going into it, I only found out about it while surfing the CC website and checking out clips on various shows. As I watched each video I began to notice I was laughing nonstop at each short scene. I thought if these two minute snidbits are this funny then the full half hour must be hilarious. Sure enough I watched the first episode and spend the rest of the night binge watching season 1 and the first episode of season 2. This show is laugh out loud funny, just dirty enough to be edgy, and the writing is some of the freshest and most clever on TV. I knew Andy Daly from EastBound and Down, although funny throughout that series, he only played a minor part in it. But in this show he shines like no other comedian I've seen in awhile and I couldn't see anyone else filling this role. Each episode takes you on a hilarious adventure with Forrest as he tries to navigate these insane and grueling reviews. His consistently oblivious nature puts him at odds with the people around him and sets in motion some of the funniest comedic situations on television. The reviews he has sent in each week range from joining the Mile High club to finding out what it's like to be a little person, but it's the way Forrest goes about surveying these reviews that really makes the show so remarkable. I give it ***** Stars!
I was a bit skeptical about the concept behind this show. What saves it from banality is just how creative and edgy each episode is. The viewer has NO idea what is going to happen next. There is no formula and the tension is often ratcheded up to excruciating levels. There are tons of laughs here and the back stories are woven in expertly. So many comedies are played very hammy with lots of stereotypes. This is a very refreshing new form of comedy where the backdrop is more realistic with only some of the characters being over the top. If you're a fan of Louie, The Office or Curb Your Enthusiasm you will likely really love this show. It's fresh and Andy Daly plays the role of the hapless reporter to perfection. I hope that we see more hilarious comedies coming. Great stuff!
A Very enjoyable farce in which the host is game for a laugh. The seriousness and commitment that Andrew Daly brings to the character is to be applauded. He reviews many life situations from the bizarre to the feared and delves in with enthusiasm that's to be admired. Everything from "being gay" to "murder" to "joining a cult". In short, try everything in life and review it!!!

I only hope it hasn't been cancelled or worse that the presenter hasn't died from heart failure.

Here I am reviewing "reviewed"

O the irony. I dare you not to laugh.
I don't know how I didn't know about this show when it actually aired and why it's not still on. The premise is such a brilliant idea and something I could definitely see being made into a realty show. The difference is the reality show would scrutinize the viewer suggestions for what to review and they'd pick the easy ones. I've seen Andrew Daly in the background of other movies/shows and I never thought one way or the other about him but he is spot on in this. Forrest MacNeil (Daly) is a married father of one son who has a review show on tv. He doesn't review books or food or movies, he reviews everyday life and gets his suggestions from viewers. It can be anything from eating 15 pancakes, having a best friend, to stealing, doing drugs, and making a sex tape. No matter the request he must do whatever the suggestion says and that's where the hilarity comes in.
This American remake of the brilliant and often very dark Australian series of the same name is riddled with bad choices which resulted in a bland and poorly executed comedy.

The original series was so good not just in the way that the reviews were executed, but also the way they were picked. The presenter Myles Barlow would read a letter from a viewer containing some personal issue or predicament then he would decide what to review based on what he thinks is the theme of the letter, sometimes reviewing things that have little to no relation to the letter itself, making it all the more funny. After experiencing what he was set to review and just before giving it a rating, Barlow would then present this wordy monologue full of pseudo-criticism jargon. It was one of the highlights of the series' superb writing.

Instead of letters, the American version has tweets, emails or video messages that simply say what's it like to do this, or how it feels to do that. Then we see the present Forrest MacNeil leaving the studio to review it. The part where he talks about the experience is never funny. It's just a couple of simple and tired sentences repeated throughout the show. It felt like so much of the comedic value was lost. MacNeil cartoonish personality and obnoxious delivery didn't help much either.

One of the most notable addition to the remake is of course a co-presenter which possibly happens to be one of the most unfunny and unnecessary characters to ever appear in a comedy series, and that's something that you'll be reminded of every time she says a word or makes a facial expression looking at the camera.

When it comes to the reviews themselves, too many were about sex, and they mostly felt like a lazy way to get some cheap laughs. You have the Making a Sex Tape review, Orgy review, Gloryhole review, Sleeping with Your Teacher review and even Mile High Club review where MacNeil has to have sex in an airplane bathroom. Some of these contain the kind of situations that no one over 14 or 15 would find funny. Some of the reviews that I found myself enjoying more were the likes of Being Irish, and Small People. It was always funny illustrating how dedicated Forrest is to what he was reviewing.`
const fill = d3.schemeCategory10

const tokenize = function (sentence) {
  let words = sentence
    .toLowerCase()
    .replace(/[()!\.,:;*\?]/g, '')
    .replace(/\s+/g, ' ')
	.replace(/\d+/g, ' ')
    .split(' ')

  words = words.filter((x) => !stopWord.includes(x))
  words = words.reduce(function (wordMap, word) {
    wordMap[word] = (wordMap[word] || 0) + 1
    return wordMap
  }, {})

  const counters = Object.values(words)
  const max = Math.max(...counters)
  const min = Math.min(...counters)
  console.log(max)
  console.log(min)
  return Object.entries(words).map(([word, count]) => ({ word, size: selectSizeFactor(min, max, count) }))
}

const selectSizeFactor = function (min, max, value) {
  const a = (max - min) / (10 - 1)
  const b = max - a * 10
  return (value - b) / a
}
myWords = tokenize(test)
console.log(myWords)
const margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom

const svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const layout = d3.layout
  .cloud()
  .size([width, height])
  .words(
    myWords.map(function (d) {
      return { text: d.word, size: d.size }
    }),
  )
  .font('Impact')
  .padding(5) //space between words
  .rotate(function () {
    return 0
  })

  .fontSize(function (d) {
    return d.size * 14
  })

  .on('end', draw)

layout.start()

function draw(words) {
  svg
    .append('g')
    .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
    .selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .style('font-size', function (d) {
      return d.size
    })
    .style('fill', (d, i) => fill[i % 10])
    .attr('text-anchor', 'middle')
    .style('font-family', 'Impact')
    .attr('transform', function (d) {
      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
    })
    .text(function (d) {
      return d.text
    })
}

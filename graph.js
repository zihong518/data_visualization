// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 1000 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom

// append the svg object to the body of the page
const svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
const selectId = 'tt0810819'
d3.csv('https://raw.githubusercontent.com/zihong518/data_visualization/master/data.csv').then(async function (data) {
  // 將cast整理成array
  let dataFirst = data.map((d) => {
    let dict = {
      id: d.tconst,
      title: d.title,
      casts: d.cast.split(','),
      image: d.image,
    }
    return dict
  })
  // 做出名字的node
  let nodes = []
  let filmList = []
  let castSelected = []
  dataFirst
    .filter((x) => x.id === selectId)
    .map((x) => {
      let movieDict = {
        filmId: [x.id],
        name: x.title,
        type: 'movie',
        image: x.image,
      }
      nodes.push(movieDict)
      x.casts.map((cast) => {
        let castDict = {
          filmId: [x.id],
          name: cast,
          type: 'character',
        }
        nodes.push(castDict)
        castSelected.push(cast)
      })

      nodes.map((node) => {
        dataFirst.map((film) => {
          if (film.casts.includes(node.name)) {
            if (!film.id.includes(node.filmId)) {
              film.casts.map((cast) => {
                nodes.map((node) => {
                  if (node.name === cast) {
                    node.filmId.push(film.id)
                  }
                })
              })
            }
          }
        })
      })
      nodes.map((node) => {
        if (node.filmId.length > 1) {
          node.filmId.map((filmId) => {
            if (filmId != selectId) {
              let film = dataFirst.find((film) => film.id == filmId)
              let movieDict = {
                filmId: [film.id],
                name: film.title,
                type: 'movie',
                image: film.image,
              }
              nodes.push(movieDict)
            }
          })
        }
      })
    })
  console.log(nodes)
  let nodeLink = []

  nodes
    .filter((node) => node.type === 'movie')
    .map((movie) => {
      let id = movie.filmId[0]
      filmList.push(id)
      nodes
        .filter((node) => node.type === 'character')
        .map((actor) => {
          if (actor.filmId.includes(id)) {
            const relation = {
              source: movie.name,
              target: actor.name,
            }
            nodeLink.push(relation)
          }
        })
    })
  console.log(filmList)

  console.log(nodeLink)

  let colorList = []
  for (let i = 0; i < filmList.length; i++) {
    colorList.push(d3.hsl((360 / filmList.length) * i, 0.75, 0.75))
  }
  let lineColor = d3.scaleOrdinal().domain(filmList).range(colorList)
  // Let's list the force we wanna apply on the network
  const simulation = d3
    .forceSimulation(nodes) // Force algorithm is applied to data.nodes
    .force(
      'link',
      d3
        .forceLink() // This force provides links between nodes
        .id(function (d) {
          return d.name
        }) // This provide  the id of a node
        .links(nodeLink), // and this the list of links
    )
    .force('charge', d3.forceManyBody().strength(-200)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
    .on('tick', ticked)

  // Initialize the links
  const link = svg
    .selectAll('line')
    .data(nodeLink)
    .join('line')
    .style('stroke', (d) => lineColor(d.source.filmId[0]))
    .style('stroke-width', 4)
  // console.log(link);
  // Initialize the nodes
  console.log(nodes)

  const node = svg
    .selectAll('g')
    .data(nodes.filter((x) => x.type === 'character'))
    .join('circle')
    .attr('r', 8)
    .style('fill', (d) => lineColor(d.filmId[0]))
    .call(drag(simulation))

  const movieNode = svg
    .selectAll('image')
    .data(nodes.filter((x) => x.type === 'movie'))
    .join('image')
    .attr('href', (d) => d.image)
    .attr('width', 50)
    .attr('height', 50)
    .on('mouseover', hoverImg)
    .call(drag(simulation))

  // node
  //   .append('text')
  //   .attr('x', 20)
  //   .attr('y', '0.31em')
  //   .text((d) => d.name)
  // .clone(true)
  // .lower()
  // .attr('fill', 'black')
  // .attr('stroke', 'white')
  // .attr('stroke-width', 3)

  function hoverImg(event, d) {
    // if(event.)
    document.getElementById('hoverImg').src = d.image
  }
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.8).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event, d) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.x = null
      event.subject.y = null
    }

    return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
  }
  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr('x1', function (d) {
        return d.source.x
      })
      .attr('y1', function (d) {
        return d.source.y
      })
      .attr('x2', function (d) {
        return d.target.x
      })
      .attr('y2', function (d) {
        return d.target.y
      })

    node
      .attr('cx', function (d) {
        return d.x
      })
      .attr('cy', function (d) {
        return d.y
      })
    movieNode
      .attr('x', function (d) {
        return d.x - 20
      })
      .attr('y', function (d) {
        return d.y - 20
      })
  }
})

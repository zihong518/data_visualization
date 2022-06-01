// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom

// append the svg object to the body of the page
const svg = d3
  .select('#my_dataviz')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

d3.csv('https://raw.githubusercontent.com/zihong518/data_visualization/master/netflix_titles.csv').then(function (data) {
  // 將cast整理成array
  let dataFirst = data.slice(0,2)
    .map((d) => {
      let dict = {
        title: d.title,
        casts: d.cast.split(",")
      }
      return dict
    })
  
  // 做出名字的node
  let nodes = []
  let index = 0
  let titleList = []
  dataFirst.forEach(d => {
    d.casts.forEach(cast=>{
      if(cast!==''){
        if(nodes.find(el =>el.name == cast)){
          let id = nodes.find(el =>el.name == cast).id
          nodes[id].title.push(d.title)
        }
        let castDict={
          id : index,
          name:cast,
          title:[d.title]
        }
        nodes.push(castDict)
        index++
        // console.log(titleList);
        // console.log());
        if (!(titleList.includes(d.title))){
          titleList.push(d.title)
        }
      }


    })

  })
  // 做出 link
  const titleCast = titleList.map(title =>{
    return nodes.filter(node => node.title.includes(title))
  })
  let nodeLink = []

  titleCast.forEach(el=>{
    for(let i=0;i<el.length;i++){
      for(let j=i+1;j<el.length;j++){
        const relation = {
          source: el[i].id,
          target: el[j].id
        }
        nodeLink.push(relation)
      }
    }
  })
  console.log(nodeLink);
  // Let's list the force we wanna apply on the network
  const simulation = d3
    .forceSimulation(nodes) // Force algorithm is applied to data.nodes
    .force(
      'link',
      d3
        .forceLink() // This force provides links between nodes
        .id(function (d) {
          return d.id
        }) // This provide  the id of a node
        .links(nodeLink), // and this the list of links
    )
    .force('charge', d3.forceManyBody().strength(-100)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
    .on('end', ticked)

  // Initialize the links
  const link = svg.selectAll('line').data(nodeLink).join('line').style('stroke', '#aaa')
  // console.log(link);
  // Initialize the nodes
  const node = svg.selectAll('circle').data(nodes).join('circle').attr('r', 10).style('fill', '#69b3a2').call(drag(simulation))



  function drag(simulation) {    
    function dragstarted(event,d) {
      if (!event.active) simulation.alphaTarget(0.8).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event,d) {
      console.log(event.subject.fx);
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event,d) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.x = null;
      event.subject.y = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
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
  }

  
})

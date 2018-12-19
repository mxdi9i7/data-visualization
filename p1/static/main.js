// custom javascript

$(function () {
  console.log('jquery is working!');
  createGraph();
});

const brightnessByColor = (color) => {
  var m = color.match(/(\d+){3}/g);
  if (m) var r = m[0], g = m[1], b = m[2];
  if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

const createGraph = () => {
  const width = 960;
  const height = 800;
  const format = d3.format(",d");
  const color = d3.scaleOrdinal(d3.schemeAccent);
  const blues = d3.scaleOrdinal(d3.schemeBlues[9]);
  const oranges = d3.rgb('steelblue')
  const sizeOfRadius = d3.scalePow().domain([-100, 100]).range([-50, 50]);

  //declare layout
  const bubble = d3.pack()
    .size([width, height])
    .padding(10)
    .radius(d => 20 + (sizeOfRadius(Number(d.value)) / 10))

  const svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'bubble')

  const tooltip = d3.select('body')
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

  d3.json('/data').then((quotes) => {
    const root = d3.hierarchy(quotes)
      .sum(d => d.price)
    bubble(root);
    const node = svg.selectAll('.node')
      .data(root.descendants()
        .filter(d => !d.children))
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    const prices = quotes.children.map(item => item.price)
    const max = Math.max(...prices)

    const circles = node.append('circle')
      .attr('r', d => +d.r)
      .style('fill', d => blues(d.r))
      .style('opacity', 0)

    circles
      .transition()
      .duration(1000)
      .delay((d, i) => (i * 25))
      .style("opacity", 1)



    circles
      .on('mouseover', d => {
        tooltip.text(`${d.data.name}: $${d.data.price}`);
        tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () =>
        tooltip
          .style('top', (d3.event.pageY - 10) + 'px')
          .style('left', (d3.event.pageX + 10) + 'px')
      )
      .on('mouseout', () =>
        tooltip
          .style('visibility', 'hidden')
      );

    const companyNames = node.append('text')
      .attr('dy', '.3em')
      .style('font-size', '10px')
      .style('text-anchor', 'middle')
      .style('opacity', 0)
      .style('fill', function (d) {
        const colorValue = d3.select(this.parentNode)._groups[0][0].firstChild.style.fill
        const brightness = brightnessByColor(colorValue)
        if (brightness > 127) return '#000'
        return '#fff'
      })
      .text(d => d.data.symbol)


    companyNames
      .transition()
      .duration(1000)
      .delay((d, i) => i * 25)
      .style("opacity", 1)
  })
}
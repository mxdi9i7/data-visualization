// custom javascript

$(function () {
  console.log('jquery is working!');
  createGraph();
});

const createGraph = () => {
  const width = 960;
  const height = 700;
  const format = d3.format(",d");
  const color = d3.scale.category20();
  const sizeOfRadius = d3.scale.pow().domain([-100, 100]).range([-50, 50]);

  //declare layout
  const bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1)
    .radius(d => 20 + (sizeOfRadius(d) * 30))

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

  d3.json('/data', ((err, quotes) => {
    const node = svg.selectAll('.node')
      .data(bubble.nodes(quotes)
        .filter(function (d) { return !d.children; }))
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' });

    node.append('circle')
      .attr('r', d => d.r)
      .style('fill', d => color(d.symbol))
      .on('mouseover', d => {
        tooltip.text(`${d.name}: $${d.price}`);
        tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () => tooltip.style('top', (d3.event.pageY - 10) + 'px').style('left', (d3.event.pageX + 10) + 'px'))
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    node.append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(d => d.symbol)
  }))


}
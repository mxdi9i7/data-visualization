// custom javascript

$(function () {
  console.log('jquery is working!');
  createGraph();
});

const createGraph = () => {
  const width = 960;
  const height = 800;
  const format = d3.format(",d");
  const color = d3.scaleOrdinal(d3.schemeAccent);
  const blues = d3.scaleOrdinal(d3.schemeBlues[9]);
  const sizeOfRadius = d3.scalePow().domain([-100, 100]).range([-50, 50]);

  //declare layout
  const bubble = d3.pack()
    .size([width, height])
    .padding(1)
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
    const root = d3.hierarchy(quotes).sum(d => Number(d.price));
    bubble(root);
    const node = svg.selectAll('.node')
      .data(root.descendants()
        .filter(d => !d.children))
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    node.append('circle')
      .attr('r', d => d.r)
      .style('fill', d => color(d.data.symbol))
      .on('mouseover', d => {
        tooltip.text(`${d.data.name}: $${d.data.price}`);
        tooltip.style('visibility', 'visible');
      })
      .on('mousemove', () => tooltip.style('top', (d3.event.pageY - 10) + 'px').style('left', (d3.event.pageX + 10) + 'px'))
      .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    node.append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(d => d.data.symbol)
  })


}
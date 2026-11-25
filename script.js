const DATA_URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const w = 920;
const h = 630;
const padding = 60;

const tooltip = d3.select('#tooltip');

fetch(DATA_URL)
  .then((res) => res.json())
  .then((dataset) => {
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const years = dataset.map((d) => d.Year);
    const minYear = d3.min(years);
    const maxYear = d3.max(years);

    const xScale = d3
      .scaleTime()
      .domain([new Date(minYear - 1, 0, 1), new Date(maxYear + 1, 0, 1)])
      .range([padding, w - padding]);

    const times = dataset.map((d) => new Date(d.Seconds * 1000));
    const yScale = d3
      .scaleTime()
      .domain([d3.min(times), d3.max(times)])
      .range([padding, h - padding]);

    const color = (d) => (d.Doping ? '#ff7f0e' : '#1f77b4');

    svg
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', (d) => xScale(new Date(d.Year, 0, 1)))
      .attr('cy', (d) => yScale(new Date(d.Seconds * 1000)))
      .attr('data-xvalue', (d) => new Date(d.Year, 0, 1))
      .attr('data-yvalue', (d) => new Date(d.Seconds * 1000))
      .attr('fill', color)
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 0.9)
          .attr('data-year', new Date(d.Year, 0, 1))
          .html(
            d.Name +
              ' (' +
              d.Nationality +
              ')<br>Year: ' +
              d.Year +
              ', Time: ' +
              d.Time +
              (d.Doping ? '<br><br>' + d.Doping : '')
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ',0)')
      .call(yAxis);

    const legend = svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', 'translate(' + (w - padding - 220) + ',' + (padding + 10) + ')');

    const legendData = [
      { label: 'Riders with doping allegations', color: '#ff7f0e' },
      { label: 'No doping allegations', color: '#1f77b4' },
    ];

    legendData.forEach((item, i) => {
      const g = legend.append('g').attr('transform', 'translate(0,' + i * 25 + ')');
      g.append('rect').attr('width', 18).attr('height', 18).attr('fill', item.color);
      g.append('text').attr('x', 24).attr('y', 14).text(item.label);
    });
  })
  .catch((err) => console.error('Failed to load cyclist data:', err));

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const CloudBridgeChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Data: Simulated latency over time (ms)
    const data = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      latency: Math.floor(Math.random() * 20) + 10,
    }));

    const width = 400;
    const height = 150;
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain([0, 19])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 40])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line<typeof data[0]>()
      .x(d => x(d.time))
      .y(d => y(d.latency))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#06b6d4') // cyan-500
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .attr('fill', '#94a3b8'); // slate-400

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4))
      .selectAll('text')
      .attr('fill', '#94a3b8'); // slate-400

  }, []);

  return (
    <div className="neo-inset p-4 rounded-2xl">
      <h4 className="text-xs font-bold text-slate-400 mb-2">Latencia Conexión (ms)</h4>
      <svg ref={svgRef} width="400" height="150" viewBox="0 0 400 150" />
    </div>
  );
};

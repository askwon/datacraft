function startForceLayout(data) {
    force = d3.layout.force()
        .nodes(nodes)
        .size([ width, height ])
        .gravity(0)
        .charge(-800)
        .on('tick', tick)
        .start();

    servers = canvas.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('id', d => `server-${d.id}`)
        .attr('r', d => d.radius)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('fill', d => d.color)
        // .on('click', toggleSidebarDetails.bind(this, data))
        .on('dblclick', onServerDblclick.bind(this, data))
        .on('mouseout', onServerMouseOut.bind(this, data))
        .on('mouseover', onServerMouseOver.bind(this, data))
        .on('mousemove', tooltipMousemove)
        // .on('mouseover', tooltipMouseover.bind(this, data))
        // .on('mouseout', tooltipMouseout)
        .call(force.drag);
}

function onServerDblclick(data, bubble, i) {
    initServerviewSidebar(bubble.id);
}

function onServerMouseOver(data, bubble, i) {
    // bubble.id -> starts with 1
    appendSidebarPreview(data, bubble.id - 1);
    tooltipMouseover(data, bubble, i);
}

function onServerMouseOut(data, bubble, i) {
    removeSidebarPreview(data, bubble.id - 1);
    tooltipMouseout();
}

function onServerClick(data, bubble, i) {
    console.log(`clicked server ${bubble.id}`);
    // segueFromOverviewInto();
}

function tick(event) {
    servers.each(gravitate(0.1 * event.alpha))
        .each(collision(0.5))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

// Center gravitation logic
function gravitate(alpha) {
    return d => {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
    };
}

// Collision detection logic 
function collision(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return d => {
        var r = d.radius + radius.domain()[1] + 2;
        offsetX1 = d.x - r,
        offsetX2 = d.x + r,
        offsetY1 = d.y - r,
        offsetY2 = d.y + r;
        quadtree.visit((quad, x1, y1, x2, y2) => {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x;
                var y = d.y - quad.point.y;
                var l = Math.sqrt(x*x+y*y);
                var radius = d.radius + quad.point.radius 
                    + (d.color !== quad.point.color) * 2;
                if (l < radius) {
                    l = (l - radius) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > offsetX2 || 
                    x2 < offsetX1 || 
                    y1 > offsetY2 || 
                    y2 < offsetY1;
        });
    };
}

function orderForceByColor() {
    force.alpha(0);

    servers.transition()
        .duration(1000)
        .attr("cx", d => d.colorx)
        .attr("cy", d => d.horizy)
}

function orderForceBySize() {
    force.alpha(0);

    servers.transition()
        .duration(1000)
        .attr("cx", d => d.sizex)
        .attr("cy", d => d.horizy)
}

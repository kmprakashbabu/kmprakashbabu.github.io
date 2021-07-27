const MIN_COUNT = 0;
const MAX_COUNT = 6;
let current_count = 0;

let debtTypeColor = {
    "Mortgage":'#E98517',
    "HE Revolving":'#8064A2',
    "Auto Loan":"#89A54E",
    "Credit Card":"#1F497D",
    "Student Loan":"#C00101",
    "Other":"#7F7F7F"
};

let stateColor = {
    "AZ":"#604A7B",
    "CA":"#FF0101",
    "FL":"#4B70C6",
    "IL":"#01B050",
    "MI":"#FFC001",
    "NJ":"#77933C",
    "NV":"#1F497D",
    "NY":"#7F7F7F",
    "OH":"#C85509",
    "PA":"#948A54",
    "TX":"#3939FD",
    "National Average":"black"
};

ageColor = {
    "18-29":"#61AEEA",
    "30-39":"#B84645",
    "40-49":"#B1812C",
    "50-59":"#046C9D",
    "60-69":"#DBC56E",
    "70+":"#9FA1A8"
};

scenesGenerated = [0];
scenesTitle = ["Introduction",
"National Total Debt Balance and its Composition", 
"Composition of Debt Balance per Capita* by State (2021 Q1)", 
"Total Debt Balance per Capita* by State",
"Total Debt Balance by Age",
"Quarterly Transition into Serious Delinquency (90+) by Age",
"Summary"];

let div = null;

let scene1_config = {};
let scene2_config = {};
let scene3_config = {};
let scene4_config = {};
let scene5_config = {};

$(document).ready(function(){


    /*Reveal.initialize({
        center:false,
        disableLayout:true
    });

    Reveal.on('ready', event => {
        d3.select("#scene1_svg").selectAll('rect').data([10,20]).enter().append('rect')
        .attr("x", d => d * 10)
        .attr("y",50)
        .attr("width", d => d)
        .attr("height", d => d);
    });*/

    //new Splide( '.splide' ).mount();

    //var myCarousel = document.querySelector('#carouselExampleIndicators')
    //var carousel = new bootstrap.Carousel(myCarousel)

    
    

    scene1_config = {
        parentEL:$("#scene1_chart"),
        svg:d3.select('#scene1_svg'),
        url:'data/NationalDebtBreakDown.csv',
        xCol:"Quarters",
        yCol:"Total",
        yColTitle:"Trillions of dolloars",
        barCols:["Mortgage","HE Revolving","Auto Loan","Credit Card","Student Loan","Other"],
        paramContainerID:"scene1_param",
        annotationData:[{
            xVal:"21:Q1",
            yVal:14.64,
            data:["2021Q1 Total $14.64 Trillion","All time high"]
        },{
            xVal:"21:Q1",
            yVal:6.0,
            data:["Mortgae debt is a","biggest chunk of all"]
        },{
            xVal:"13:Q3",
            yVal:10.5,
            data:["Student loan crossed $1 Triln.","Continued to rise"]
        }]
    };

    scene2_config = {
        parentEL:$("#scene2_chart"),
        svg:d3.select('#scene2_svg'),
        url:'data/StateDebtPerCapitaComposition.csv',
        xCol:"State",
        yCol:"Total",
        yColTitle:"Thousands of dolloars",
        barCols:["Mortgage","HE Revolving","Auto Loan","Credit Card","Student Loan","Other"],
        paramContainerID:"scene2_param",
        annotationData:[{
            xVal:"CA",
            yVal:73.45,
            data:["Total $73.454 Thousands","Highest in the country"]
        },{
            xVal:"US",
            yVal:52.94,
            data:["National averge is","$52.94 Thousands"]
        }]
    };


    scene3_config = {
        parentEL:$("#scene3_chart"),
        svg:d3.select('#scene3_svg'),
        url:'data/StateDebtPerCapita.csv',
        xCol:'Quarters',
        yColTitle:"Thousands of dolloars",
        yColRange:[20,100],
        paramContainerID:"scene3_param",
        lineNames:["AZ","CA","FL","IL","MI","NJ","NV","NY","OH","PA","TX","National Average"],
        annotationData:[{
            xVal:"08:Q3",
            yVal:87.8,
            markerDirection:"h",
            textDirection:"r",
            data:["Between 08:Q1 to 09:Q1","CA and AZ","had highest debt"]
        },{
            xVal:"20:Q1",
            yVal:52.2,
            markerDirection:"v",
            textDirection:"t",
            data:["Per capita debt balance","continue to rise"]
        }]
    };

    scene4_config = {
        parentEL:$("#scene4_chart"),
        svg:d3.select('#scene4_svg'),
        url:'data/TotalDebtByAge.csv',
        xCol:"Quarters",
        yCol:"Total",
        yColTitle:"Trillions of dolloars",
        barCols:["18-29","30-39","40-49","50-59","60-69","70+"],
        paramContainerID:"scene4_param",
        annotationData:[{
            xVal:"21:Q1",
            yVal:14.62,
            data:["Age 30-59 accumulated","more debt over the years"]
        },{
            xVal:"21:Q1",
            yVal:7,
            data:["Age 40-49 debt is high","every single year"]
        }]
    };

    scene5_config = {
        parentEL:$("#scene5_chart"),
        svg:d3.select('#scene5_svg'),
        url:'data/DelinquencyByAge.csv',
        xCol:'Quarters',
        yColTitle:"Percent of Balance",
        yColRange:[0,10],
        paramContainerID:"scene5_param",
        lineNames:["18-29","30-39","40-49","50-59","60-69","70+"],
        annotationData:[{
            xVal:"09:Q2",
            yVal:9.42,
            markerDirection:"h",
            textDirection:"r",
            data:["Delinquency rate peaked","in the last recession","for age groups 18-29, 30-39 and 40-49"]
        },{
            xVal:"20:Q1",
            yVal:2.24,
            markerDirection:"v",
            textDirection:"t",
            reduceHeight:true,
            data:["Gov. policies during pandemic","helping people.","Will increase after policy expiration"]
        }]

    };


    div = d3.select("body").append("div")	
    .attr("class", "tooltip")
    .attr("id","tooltip")			
    .style("opacity", 0);


    $("#previousButton").click(function(){
        current_count--;
        $("#nextButton").prop('disabled',false);
        if(current_count == MIN_COUNT)
            $(this).prop('disabled',true);

        $(".scene").hide();
        $("#scene"+current_count).show();

        changeSceneTitle();
    });

    $("#nextButton").click(function(){
        current_count++;
        $("#previousButton").prop('disabled',false);
        if(current_count >= MAX_COUNT)
            $(this).prop('disabled',true);

        $(".scene").hide();
        $("#scene"+current_count).show();

        changeSceneTitle();

        if(scenesGenerated.indexOf(current_count) == -1){
            scenesGenerated.push(current_count);
            if(current_count == 1){
                generateStackedBarChart(scene1_config,scene1_config.parentEL,scene1_config.svg,scene1_config.url,scene1_config.xCol,
                    scene1_config.yCol,scene1_config.yColTitle,scene1_config.barCols,debtTypeColor,scene1_config.paramContainerID);
                generateCheckBox(scene1_config.barCols,scene1_config.paramContainerID);
            }
            else if(current_count == 3){
                generateMultiLineChart(scene3_config,scene3_config.parentEL,scene3_config.svg,scene3_config.url,scene3_config.xCol,scene3_config.yColTitle,scene3_config.yColRange,
                    stateColor,scene3_config.lineNames,scene3_config.paramContainerID,"National Average");
                generateCheckBox(scene3_config.lineNames,scene3_config.paramContainerID);
                generateDataPointsBtn(scene3_config.svg,scene3_config.paramContainerID);
            }
            else if(current_count == 2){
                generateStackedBarChart(scene2_config,scene2_config.parentEL,scene2_config.svg,scene2_config.url,scene2_config.xCol,
                    scene2_config.yCol,scene2_config.yColTitle,scene2_config.barCols,debtTypeColor,scene2_config.paramContainerID);
                generateCheckBox(scene2_config.barCols,scene2_config.paramContainerID);
            }
            else if(current_count == 4){
                generateStackedBarChart(scene4_config,scene4_config.parentEL,scene4_config.svg,scene4_config.url,scene4_config.xCol,
                    scene4_config.yCol,scene4_config.yColTitle,scene4_config.barCols,ageColor,scene4_config.paramContainerID);
                generateCheckBox(scene4_config.barCols,scene4_config.paramContainerID);
            }
            else if(current_count == 5){
                generateMultiLineChart(scene5_config,scene5_config.parentEL,scene5_config.svg,scene5_config.url,scene5_config.xCol,scene5_config.yColTitle,scene5_config.yColRange,
                    ageColor,scene5_config.lineNames,scene5_config.paramContainerID,null);
                generateCheckBox(scene5_config.lineNames,scene5_config.paramContainerID);
                generateDataPointsBtn(scene5_config.svg,scene5_config.paramContainerID);
            }

        }
    });

    changeSceneTitle();
});

bisect = function(){
    const bisect = d3.bisector(d => d.date).left;
    return mx => {
      const date = x.invert(mx);
      const index = bisect(data, date, 1);
      const a = data[index - 1];
      const b = data[index];
      return b && (date - a.date > b.date - date) ? b : a;
    };
};

function changeSceneTitle(){
    $("#sceneTitle").text(scenesTitle[current_count]);
}

/*callout = (g, value) => {
    if (!value) return g.style("display", "none");
  
    g
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");
  
    const path = g.selectAll("path")
      .data([null])
      .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");
  
    const text = g.selectAll("text")
      .data([null])
      .join("text")
      .call(text => text
        .selectAll("tspan")
        .data((value + "").split(/\n/))
        .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i) => `${i * 1.1}em`)
          .style("font-weight", (_, i) => i ? null : "bold")
          .text(d => d));
  
    const {x, y, width: w, height: h} = text.node().getBBox();
  
    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }*/


function generateMultiLineChart(sceneConfig,parentEL,svg,url,xCol,yColTitle,yColRange,colorMap,seriesNames,paramContainerID,pivotCol){
    let margin = {top: 50, right: 20, bottom: 30, left: 60},
    width = +parentEL.width() - margin.left - margin.right,
    height = +parentEL.height() - margin.top - margin.bottom;

    d3.csv(url).then(function (dataObj) {
        const columns = dataObj.columns.slice(1);
        let data = {
            series: dataObj.filter(d => seriesNames.indexOf(d.name)  != -1).map(d => ({
              name: d.name,
              values: columns.map(k => +d[k])
            })),
            dates: columns
        }
        let circleMap = {};
        for(let aObj of dataObj){
            circleMap[aObj.name] = aObj;
        }
        data.circleMap = circleMap;

        let x = d3.scaleBand()
            .domain(data.dates)
            .range([margin.left, width - margin.right])
            .padding(0.1);

        let y = d3.scaleLinear()
            .domain([yColRange[0], yColRange[1]]).nice()
            .range([height - margin.bottom, margin.top]);

        sceneConfig.x = x;
        sceneConfig.y = y;
        sceneConfig.width = width;
        sceneConfig.height = height;
    

        let xAxis = g => g
            .attr("transform", `translate(-10,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
            
        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            //.call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));

        let yAxisR = g => g
            .attr("transform", `translate(${width-margin.right-15},0)`)
            .call(d3.axisRight(y))
            //.call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y));


        let line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => x(data.dates[i]))
            .y(d => y(d));

        svg.append("g")
            .call(xAxis)
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
      
        svg.append("g")
            .call(yAxis);

        svg.append("g")
            .call(yAxisR);

        svg.append('text')
            .attr('class', 'axis-label')
            .text(xCol)
            .attr('x', margin.left + (width - margin.left - margin.right) / 2)
            .attr('y', height+margin.bottom); // Relative to the x axis.;

        svg.append('text')
            .attr('class', 'axis-label')
            .text(yColTitle)
            .attr('transform', 'rotate(-90)')
            .attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
            .attr('y', margin.left-25); // Relative to the y axis.

        svg.append('text')
            .attr('class', 'axis-label')
            .text(yColTitle)
            .attr('transform', 'rotate(-90)')
            .attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
            .attr('y', width+margin.right-15); // Relative to the y axis.

      
        const path = svg.append("g")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", function(d){
                return line(d.values);
            })
            .attr("fill", "none")
            .attr("stroke", function(d){
                return colorMap[d.name];
            })
            .attr("stroke-width", 3)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .style("stroke-dasharray", function(d){
                return d.name == pivotCol ? ("4,1,2") : ("1,1");
            });

            for(let sName of seriesNames){
                let aSeriesCirleMap = data.circleMap[sName];
                svg.append("g")
                .selectAll("circle")
                .data(data.dates)
                .enter()
                .append("circle")
                .attr("class", "circle")
                .attr("fill",function(d){
                    return colorMap[sName];
                })
                .attr("stroke-width",2)
                .attr("stroke", function(d){
                    return colorMap[sName];
                })
                .attr("opacity","0")
                .attr("r", 4)
                .attr("cx", function(d) {
                  return x(d);
                })
                .attr("cy", function(d) {
                  return y(aSeriesCirleMap[d]);
                })
                .on("mouseover",function(event, d){
                    //d3.select(this).attr("opacity",1);
                    let tooltipText = "<table width=125>";
                    tooltipText += "<tr ><td colspan='3' style=' border-bottom: 1px solid white;'>"+yColTitle+"</td></tr>";
                    tooltipText += "<tr ><td colspan='3' style=' border-bottom: 1px solid white;'>"+sName+"</td></tr>";
                    tooltipText += "<tr>";
                    tooltipText += "<td class='fitwidth'>"+d+"</td>";
                    tooltipText += "<td>:</td>";
                    tooltipText += "<td>"+aSeriesCirleMap[d]+"</td>";
                    tooltipText += "</tr>";

                    /*barCols.forEach(aCol => {
                        tooltipText += "<tr>";
                        tooltipText += "<td class='fitwidth'>"+d+"</td>";
                        tooltipText += "<td>:</td>";
                        tooltipText += "<td>"+aSeriesCirleMap[d]+"</td>";
                        tooltipText += "</tr>";
                    });*/
    
                    tooltipText +="</table>";
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    div.html(tooltipText)	
                        .style("left", (event.pageX) + "px")		
                        .style("top", (event.pageY) + "px");	                    
                })
                .on("mouseleave",function(event, d){
                    /*d3.select(this).transition()		
                    .duration(200)		
                    .attr("opacity",0);*/

                    div.transition()		
                        .duration(200)		
                        .style("opacity", 0);                    
                });
            }
            if(seriesNames.length == sceneConfig.lineNames.length)
                drawAnnotationForLineChart(sceneConfig);
            generateLegend(svg,seriesNames,colorMap,margin,75);
    });

}

function generateStackedBarChart(sceneConfig,parentEL,svg,url,xCol, yCol, yColTitle, barCols,colorMap,paramContainerID){
    let margin = {top: 50, right: 20, bottom: 30, left: 60},
    width = +parentEL.width() - margin.left - margin.right,
    height = +parentEL.height() - margin.top - margin.bottom;

    d3.csv(url).then(function (data) {

        // Transpose the data into layers
        /*var dataset = d3.stack()(barCols.map(function (aBarCol) {
            return data.map(function (d) {
                return { x: d[xCol], y: +d[aBarCol] };
            });
        }));*/

        var dataset = d3.stack().keys(barCols)(data).map(d => (d.forEach(v => v.key = d.key), d));


        // Set x, y and colors
        let x = d3.scaleBand()
        .domain(data.map(d => d[xCol]))
        .range([margin.left, width - margin.right])
        .padding(0.1)

        let y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d3.max(d, d => d[1]))])
        .rangeRound([height - margin.bottom, margin.top])

        sceneConfig.x = x;
        sceneConfig.y = y;
        sceneConfig.width = width;
        sceneConfig.height = height;

        // Define and draw axes
        let yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"));
            //.call(g => g.selectAll(".domain").remove())

        let xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));
            //.call(g => g.selectAll(".domain").remove());
    

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        
        svg.append('text')
            .attr('class', 'axis-label')
            .text(xCol)
            .attr('x', margin.left + (width - margin.left - margin.right) / 2)
            .attr('y', height+margin.bottom); // Relative to the x axis.;

        svg.append('text')
            .attr('class', 'axis-label')
            .text(yColTitle)
            .attr('transform', 'rotate(-90)')
            .attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
            .attr('y', margin.left-25); // Relative to the y axis.

        let rect = svg.append("g")
            .selectAll("g")
            .data(dataset)
            .join("g")
            .attr("fill", d => colorMap[d.key])
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => x(d.data[xCol]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            /*.on("mouseover", function () { tooltip.style("display", null); })
            .on("mouseout", function () { tooltip.style("display", "none"); })
            .on("mousemove", function (event) {
                var xPosition = event.screenX;
                var yPosition = event.screenY;
                tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                tooltip.select("text").text(event.y);

            });
            */
            .on("mouseover", function(event,d) {
                let tooltipText = "<table width=125>";
                tooltipText += "<tr ><td colspan='3' style=' border-bottom: 1px solid white;'>"+yColTitle+"</td></tr>";
                barCols.forEach(aCol => {
                    tooltipText += "<tr>";
                    tooltipText += "<td class='fitwidth'>"+aCol+"</td>";
                    tooltipText += "<td>:</td>";
                    tooltipText += "<td>"+d.data[aCol]+"</td>";
                    tooltipText += "</tr>";
                });

                tooltipText +="</table>";
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(tooltipText)	
                    .style("left", (event.pageX) + "px")		
                    .style("top", (event.pageY) + "px");	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });

            if(barCols.length == sceneConfig.barCols.length)
                drawAnnotation(sceneConfig);
            generateLegend(svg,barCols,colorMap,margin,120);

    });
}

function drawAnnotationForLineChart(sceneConfig){
    let svg = sceneConfig.svg;
    let x = sceneConfig.x;
    let y = sceneConfig.y;
    let width = sceneConfig.width;
    let height = sceneConfig.height;

    let annotationData = sceneConfig.annotationData;
    if(annotationData){
        let rectW = 100;
        let rectH = 65;
        for(let aData of annotationData){
            let markerDirection = aData.markerDirection;
            let textDirection   = aData.textDirection;
            let reduceMarkerHeight = aData.reduceHeight;
        
            let callOutX = ((width/2)+(rectW*2));
            let lineX = x(aData.xVal)+(x.bandwidth()/2);
            let lineY = y(aData.yVal);

            let rx = markerDirection == "h" ? "70px" : "25px";
            let ry = markerDirection == "h" ? "50px" : reduceMarkerHeight ? "90px" : "125px";

            let gX = textDirection == "r" ? (lineX+75) : lineX-145;
            let gY = textDirection == "r" ? (lineY-50) : lineY-175;
        
        
            svg.append("ellipse")
                .attr("cx",lineX)
                .attr("cy",lineY)
                .attr("rx",rx)
                .attr("ry",ry)
                //.attr("r","50px")
                .attr("fill","none")
                .attr("stroke-width",4)
                .attr("stroke","black")
                .attr("stroke-dasharray","4,2")
                .attr("opacity",.5);
        
            let annotationG = svg.append("g")
                .attr("transform","translate("+gX+","+gY+")");
            
            let text = annotationG
                .append("text")
                .attr("x", 0)
                .attr("y", 10)
                .attr("font-size","14px")
                //.attr("dy", ".05em")
                .style("fill","black")
                .style("opacity", 1);
    
            for(let aText of aData.data){
                text.append("tspan")
                    .text(aText)
                    .attr("x", 0)
                    .attr("dx", 0)
                    .attr("dy", 20);                
            }
        }
   }
}

function drawAnnotation(sceneConfig){

    let svg = sceneConfig.svg;
    let x = sceneConfig.x;
    let y = sceneConfig.y;
    let width = sceneConfig.width;
    let height = sceneConfig.height;
    let annotationData = sceneConfig.annotationData;
    if(annotationData){
        let rectW = 100;
        let rectH = 60;
        for(let aData of annotationData){
    
            let callOutX = ((width/2)+(rectW*2));
            let lineX = x(aData.xVal)+(x.bandwidth()/2);
            let lineY = y(aData.yVal);
        
            svg.append("line")
                .attr("x1",lineX)
                .attr("y1",lineY)
                .attr("x2",callOutX)
                .attr("y2",lineY)
                .attr("stroke","black")
                .attr("stroke-width","1");
             
            svg.append("circle")
                .attr("cx",lineX)
                .attr("cy",lineY)
                .attr("r","3px")
                .attr("fill","black");
        
            let annotationG = svg.append("g")
                .attr("transform","translate("+callOutX+","+(y(aData.yVal)-(rectH/2))+")");
            
            annotationG.append("rect")
                .attr("rx",2)
                .attr("ry",2)
                .attr("width",rectW*2)
                .attr("height",rectH)
                .attr("fill","black")
                .attr("stroke","black");
                //.attr("opacity",".7");
            
            let text = annotationG
                .append("text")
                .attr("x", 0)
                .attr("y", 10)
                //.attr("dx",5)
                //.attr("dy", ".35em")
                .attr("font-size","14px")
                .style("fill","white")
                .style("opacity", 1);
    
            for(let aText of aData.data){
                text.append("tspan")
                    .text(aText)
                    .attr("x", 0)
                    .attr("dx", 10)
                    .attr("dy", 20);                
            }
        }
   }
}

function generateLegend(svg,cols,colorMap,margin,offset){
    var dataL = margin.left;
   
    var legend4 = svg.selectAll('.legends4')
        .data(cols)
        .enter().append('g')
        .attr("class", "legends4")
        .attr("transform", function (d, i) {
         if (i === 0) {
            dataL = dataL + d.length + offset;
            return "translate("+margin.left+",10)";
        } else { 
         var newdataL = dataL;
         dataL +=  d.length + offset;
         return "translate(" + (newdataL) + ",10)";
        }
    })
    
    legend4.append('rect')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return colorMap[d];
        });
    
    legend4.append('text')
        .attr("x", 20)
        .attr("y", 10)
    //.attr("dy", ".35em")
    .text(function (d, i) {
        return d
    })
    .attr("class", "textselected")
    .style("text-anchor", "start")
    .style("font-size", 15);
}

function generateDataPointsBtn(svg,containerID){
    let seriesName = "series"+current_count;
      $('#'+containerID)
        .append("<span style='padding-left:25px;'>Data Points : </Span>")
        .append("<button id='"+seriesName+"showBtn'>Show</button>")
        .append("<button id='"+seriesName+"hideBtn'>Hide</button>")
    
    $('#'+seriesName+'showBtn').click(function(){
        svg.selectAll('circle').attr("opacity",1);
    });

    $('#'+seriesName+'hideBtn').click(function(){
        svg.selectAll('circle').attr("opacity",0);
    });
}


function generateCheckBox(list,containerID){
    let seriesName = "series"+current_count;
    for (var value of list) {
      $('#'+containerID)
        .append(`<input type="checkbox" id="${value}" name="${seriesName}" value="${value}" checked>`)
        .append(`<label for="${value}" style='padding-right:10px;'>${value}</label></div>`)
    }
    
    $('input[type=checkbox][name="'+seriesName+'"]').change(paramCheckBoxChanged);
}

function paramCheckBoxChanged(){
    var filteredCols = [];
    let seriesName = "series"+current_count;
    $.each($("input[name='"+seriesName+"']:checked"), function(){            
        filteredCols.push($(this).val());
    });

    switch(current_count){
        case 1:{
            redrawScene1(filteredCols);
            break;
        }
        case 2:{
            redrawScene2(filteredCols);
            break;
        }
        case 3:{
            redrawScene3(filteredCols);
            break;
        }
        case 4:{
            redrawScene4(filteredCols);
            break;
        }
        case 5:{
            redrawScene5(filteredCols);
            break;
        }
    }
}

function redrawScene1(filteredCols){
    scene1_config.svg.selectAll('*').remove();
    //$("#"+scene1_config.paramContainerID).empty();
    generateStackedBarChart(scene1_config,scene1_config.parentEL,scene1_config.svg,scene1_config.url,scene1_config.xCol,
        scene1_config.yCol,scene1_config.yColTitle,filteredCols,debtTypeColor,scene1_config.paramContainerID);
}

function redrawScene3(filteredCols){
    scene3_config.svg.selectAll('*').remove();
    //$("#"+scene1_config.paramContainerID).empty();
    generateMultiLineChart(scene3_config,scene3_config.parentEL,scene3_config.svg,scene3_config.url,scene3_config.xCol,scene3_config.yColTitle,scene3_config.yColRange,
        stateColor,filteredCols,scene3_config.paramContainerID,"National Average");
}

function redrawScene2(filteredCols){
    scene2_config.svg.selectAll('*').remove();
    //$("#"+scene1_config.paramContainerID).empty();
    generateStackedBarChart(scene2_config,scene2_config.parentEL,scene2_config.svg,scene2_config.url,scene2_config.xCol,
        scene2_config.yCol,scene2_config.yColTitle,filteredCols,debtTypeColor,scene2_config.paramContainerID);
}

function redrawScene4(filteredCols){
    scene4_config.svg.selectAll('*').remove();
    //$("#"+scene1_config.paramContainerID).empty();
    generateStackedBarChart(scene4_config,scene4_config.parentEL,scene4_config.svg,scene4_config.url,scene4_config.xCol,
        scene4_config.yCol,scene4_config.yColTitle,filteredCols,ageColor,scene4_config.paramContainerID);
}

function redrawScene5(filteredCols){
    scene5_config.svg.selectAll('*').remove();
    //$("#"+scene1_config.paramContainerID).empty();
    generateMultiLineChart(scene5_config,scene5_config.parentEL,scene5_config.svg,scene5_config.url,scene5_config.xCol,scene5_config.yColTitle,scene5_config.yColRange,
        ageColor,filteredCols,scene5_config.paramContainerID,null);
}

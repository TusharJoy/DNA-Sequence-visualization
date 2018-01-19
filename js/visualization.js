    function visualization(affectedlength,mutatedarray,germlinelength,germlinearray,numberofpatients)
    {
      //  console.log("germlinelength "+germlinearray[]);
      //  console.log("affectedlength "+affectedlength);
    var lengthofxaxis;
    if(affectedlength>germlinelength)
        lengthofxaxis=affectedlength;
    else
        lengthofxaxis=germlinelength;

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = lengthofxaxis*25 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width],0);
    var x2 = d3.scale.ordinal().rangeRoundBands([width,0],0) ;

    var y = d3.scale.linear()
    .range([height, 0]);

    var y2 =  d3.scale.linear()
    .range([0,height]);   

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat("");
        
    var xAxis2 =d3.svg.axis()
                .scale(x)
                .orient("top") ;

    var yAxis2=  d3.svg.axis()
        .scale(y2)
        .orient("left");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#hiddenblock").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height+300+ margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var data=mutatedarray.map(function(obj)
    {
        var temp=new Array();
        for(var i=0;i<26;i++)
        {
            temp[i]=new Array(2);
            temp[i].push(new Object());
        }
        for(var i=0;i<26;i++)
        {
            temp[i].letter=String.fromCharCode(i+65);
            temp[i].bits=(obj[i]/numberofpatients)*5;
        }
       return temp;
    }) ;
    var data1=germlinearray.map(function(obj)
    {
       
        var temp=new Array();

        temp[0]=new Array(2);
        temp[0].push(new Object());
        temp[0].letter=String.fromCharCode(obj[0]);
        temp[0].bits=(obj[1]/numberofpatients)*5;


       return temp;
    }) ;

      // for(var i=0;i<len;i++)
      // {
      //   for(var j=0;j<26;j++)
      //   {
      //    console.log(data[i].letter + ' '+ data[i].bits);
      //   }
      //   console.log('\n');
      // }


    data.forEach( function (d){

        d.sort(function (a, b) {
      if (a.bits> b.bits) {
        return 1;
      } 
      if (a.bits < b.bits) {
        return -1;
      }
      return 0;
    });

    });


    data.forEach(function(d) {
    var y0 = 0;
    d.bits = d.map( function( entry ) { 

    return { bits: entry.bits, letter: entry.letter, y0: y0, y1 : y0 += +entry.bits };  
    }  
    )
    d.bitTotal = d.bits[d.bits.length-1].y1 ;
    });


    data1.forEach(function(d) {
    var y0 = 0;
    d.bits = d.map( function( entry ) { 

    return { bits: entry.bits, letter: entry.letter, y0: y0, y1 : y0 += +entry.bits };  
    }  
    )
    d.bitTotal = d.bits[d.bits.length-1].y1 ;

    });



    x.domain( data.map( function(d,i) {return i; } ) );
    //x2.domain(data1.map(function(d,i) {return i; } )) ; 

    var maxBits1 = d3.max( data, function( d ) { return d.bitTotal } );
    var maxBits2 = d3.max( data1, function( d ) { return d.bitTotal } );



    y.domain([0, maxBits1]);
    y2.domain([0,maxBits1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("line")
        .attr("y2","0");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,0)")
        .call(xAxis2);

    svg.append("g")
        .attr("transform","translate(0,"+height+")")
        .attr("class" ," y axis")
        .call(yAxis2);
        

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", ".11em")
        .style("text-anchor", "end")
        .text("bits");



    var capHeightAdjust = 1.38;

    var column = svg.selectAll(".sequence-column")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(" + (x(i) + (x.rangeBand()/2 )) + ",0)"; })
        .attr("class", "sequence-column");

    // approximation to bring cap-height to full font size


    column
        .selectAll("text")
        .data(function(d) { return d.bits; })
        .enter()
        .append("text")
        .style("fill-opacity", 0.75)
        .attr("y", function(e) { return y(e.y0); })
        .text( function(e) { return e.letter; } )
        .attr("class", function(e) { return "letter-" + e.letter; } )
        .style( "text-anchor", "middle" )
        .style( "font-family", "monospace" )
        .attr( "textLength", x.rangeBand())
        .attr( "lengthAdjust", "spacingAndGlyphs" )
        .attr( "font-size", function(e) { return ( y(e.y0) - y(e.y1) ) * capHeightAdjust; } );
    // another column under X axis for 


    var column1 = svg.selectAll(".sequence-column1")
        .data(data1)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {  return "translate("+ (x(i) + (x.rangeBand()/2 )) + ","+2*height+") "; })
        .attr("class", "sequence-column1");


    column1
        .selectAll("text")
        .data(function(d) { return d.bits; })
        .enter()
        .append("text")
        .attr("transform","rotate(180) scale(-1 1)")
        .attr("y", function(e) { return y(e.y0); })
        .text( function(e) { return e.letter; } )
        .attr("class", function(e) { return "letter-" + e.letter; } )
        .style( "text-anchor", "middle" )
        .style( "font-family", "monospace" )
        .attr( "textLength", x.rangeBand())
        .attr( "lengthAdjust", "spacingAndGlyphs" )
        .style("fill-opacity", 0.75)
        .attr( "font-size", function(e) { return ( y(e.y0) - y(e.y1) ) * capHeightAdjust; } )
        
    }

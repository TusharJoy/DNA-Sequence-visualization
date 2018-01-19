
var affectedarray=[],germlinearray=[];
	for(var i=0;i<100;i++)
	{
	   germlinearray[i]= new Array(2).fill(0);
	}
var affectedlength,lengthofgchar,lengthofxaxis,germlinelength;
document.getElementById('file2').onchange = function(){

  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function(progressEvent){

    var text=this.result;
    var newtext=text.replace(/^.*>.*$/mg, "@");
    var lines = newtext.split('@');
    var size=lines[1].length;  //lenth of one dna sequence
    var size2=lines.length;    //lenth of the total dna sequence array
   // console.log(lines);


    //to keep track of the frequency of alphabets

	var germlinefreq= [];

	for(var i=0;i<size;i++)
	{
	   germlinefreq[i] = new Array(2).fill(0);
	}
    for(var j=1;j<size;j++)
    {
    	if(!(lines[1][j]==undefined | lines[1][j]==null))
    	{
            var ascii=lines[1][j].charCodeAt(); //getting the ascii value of one character in one position
        	germlinearray[j][0]=ascii;
        	//germlinefreq[j][1]=1;  //remember to change it when done
    	}
    }

    //germlinelength=germlinefreq.length;

    lengthofxaxis=size;
    //germlinearray=Array.from(germlinefreq);
    germlinelength=size;

  };
  reader.readAsText(file);
};



document.getElementById('file1').onchange = function(){

  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function(progressEvent){

    var text=this.result;
    var newtext=text.replace(/^.*>.*$/mg, "@");
    var lines = newtext.split('@');
    var size=lines[1].length;
    var size2=lines.length;

    lengthofgchar=size2;  
    //to keep track of the frequency of alphabets
    //we are starting from i=1 and j=1 because in the first line every first character is the main header which is useless
	var freq= [];
	for(var i=0;i<size;i++)
	{
	   freq[i] = new Array(26).fill(0);
	}
    for(var j=1;j<size;j++)
    {
    	lengthofgchar=size2-1;
        for(var i=1;i<size2;i++)
        {
        	if(!(lines[i][j]==undefined | lines[i][j]==null))
        	{
                var index=lines[i][j].charCodeAt()-65;
                //console.log(index);
            	if(index>=0 && index <=25 /*&& lines[i][j].charCodeAt()!=germlinearray[j][0]*/)
            		freq[j][index]=freq[j][index]+1;
            	else if(lines[i][j]=='-')
            	{
            		lengthofgchar--;
            	}
        	}
        }
        germlinearray[j][1]=lengthofgchar;
    }
    //console.log(size2);
   // console.log(lengthofgchar);
    affectedlength=freq.length;
   
    affectedarray=Array.from(freq);

  // console.log(affectedarray);
  };
  reader.readAsText(file);
};


//console.log(germlinearray);

function calculation(){
	var value;
	for(var j=1;j<germlinelength;j++)  //for cancelling the characters which matches the germline character
    {
		var mainacid=germlinearray[j][0]-65;
		value=affectedarray[j][mainacid];
		germlinearray[j][1]-=value; 
		affectedarray[j][mainacid]=0;
		console.log(germlinearray[j][1]);
    }

	visualization(affectedlength,affectedarray,germlinelength,germlinearray);
	//console.log(germlinearray);
};



function visualization(len,mutatedarray,germlinelength,germlinearray)
{

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 600 - margin.left - margin.right,
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
		.orient("bottom");


	var yAxis2=  d3.svg.axis()
		.scale(y2)
		.orient("left");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg = d3.select("body").append("svg")
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
        
        var j=0,index=-1;
        for(var i=0;i<26;i++)
        {
        	if(i!=index)
        	{
				temp[j].letter=String.fromCharCode(i+65);
				temp[j].bits=obj[i];
				j++;
			}
        }
       return temp;
	}) ;
	var data1=germlinearray.map(function(obj)
	{
	   
        var temp=new Array();

    	temp[0]=new Array(2);
    	temp[0].push(new Object());
		temp[0].letter=String.fromCharCode(obj[0]);
		temp[0].bits=obj[1];

  
       return temp;
	}) ;

	  // for(var i=0;i<len;i++)
	  // {
	  //   for(var j=0;j<26;j++)
	  //   {
	  //   	console.log(data[i].letter + ' '+ data[i].bits);
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
		.call(xAxis);


	svg.append("g")
		.attr("transform","translate(0,"+height+")")
		.attr("class" ," y axis")
		.call(yAxis2)
		

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
		.transition()
		.attr("transform","rotate(180) scale(-1 1)")
		.attr("y", function(e) { return y(e.y0); })
		.text( function(e) { return e.letter; } )
		.attr("class", function(e) { return "letter-" + e.letter; } )
		.style( "text-anchor", "middle" )
		.style( "font-family", "monospace" )
		.attr( "textLength", x.rangeBand())
		.attr( "lengthAdjust", "spacingAndGlyphs" )
		.duration(500)
		.style("fill-opacity", 0.75)
		.attr( "font-size", function(e) { return ( y(e.y0) - y(e.y1) ) * capHeightAdjust; } )
		
}


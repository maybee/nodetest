window.addEvent('domready', function() {
    
	//attach click event on people
	$$('.rank').each(function(el){
		el.addEvent('click',function(){
			add(el.id);
		})
	})

	var add = function(ident) {
		if (!$('inputPlayerRanks').value=="")
			$('inputPlayerRanks').value =$('inputPlayerRanks').value + ',';
		$('inputPlayerRanks').value =$('inputPlayerRanks').value + ident;
	}

	var chart = new MilkChart.Line('chart', {
			width:950, 
			height:400,
			lineWeight:5,
			showRowNames: false,
            showValues: true,
            border:0,
            fontSize:40




            	}).load({
                url: '/data',
                onLoad: function(data) {
                    return data.data;
                }
            });


});
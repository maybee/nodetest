window.addEvent('domready', function() {
    
	//attach click event on people
	$$('.rank').each(function(el){
		el.addEvent('click',function(){
			add(el.id);
		})
	})

	var add = function(ident) {
		$('inputPlayerRanks').value =+ ident;
	}

});
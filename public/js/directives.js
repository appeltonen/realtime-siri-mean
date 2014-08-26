'use strict';

/* Directives */

/*angular.module('directives', []).
  directive('my-graph', function(){
  	return{
  		require: '^AppCtrl',
  		restrict: 'E',
  		replace: true,
  		templateUrl: 'dirtemplates/emptydiv.html',
  		link: function(scope, element, attrs, controllers){
  			var graph = null;
  			var interval = 1000;

  			graph = new Rickshaw.Graph( {
  				element: element[0],
  				width: 600,
  				height: 200,
  				renderer: line,
  				series: new Rickshaw.Series.FixedDuration([{ value: 10 }, {value: 15}], undefined, {
  					timeInterval: interval,
  					maxDataPoints: 100,
  					timeBase: new Date().getTime() / 1000
  				}) 
  			});
  			graph.render();

  			//set graph to update per interval variable
  			var iv = setInterval( function() {
  				//reference controller's method
  				//Note: This results in tight coupling of the controller and the directive
  				var data = {
  					value: AppCtrl.updateNumberOfActive()
  				};

  				//add data to graph
  				graph.series.addData(data);
  				//update graph
  				graph.render();
  			}, interval);
  		}
  	};
  }
);*/

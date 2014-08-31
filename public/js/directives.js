'use strict';

/* Directives */

angular.module('directives', []).directive('activityGraph', function(){
    return{
      restrict: 'E',
      replace: true,
      template: '<div id="chart-container">' + 
                  '<div id="y_axis"></div>' +
                  '<div id="graph"></div>' +
                '</div>',
      link: function(scope, element, attrs, controllers){
        var graph = null;
        var interval = 1000;

        graph = new Rickshaw.Graph( {
          element: document.getElementById('graph'),
          width: 565,
          height: 150,
          max: 200,
          renderer: 'line',
          series: new Rickshaw.Series.FixedDuration([
            {name: 'active', color: '#428bca'},
            {name: 'timely', color: '#5cb85c'},
            {name: 'delayed', color: '#f0ad4e'}
            ], undefined, {
            timeInterval: interval,
            maxDataPoints: 100,
            timeBase: new Date().getTime() / 1000
          }) 
        });

        var y_ticks = new Rickshaw.Graph.Axis.Y( {
          graph: graph,
          orientation: 'left',
          tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
          element: document.getElementById('y_axis')
        });

        graph.render();

        //set graph to update per interval variable
        var iv = setInterval( function() {
          //reference controller's method
          //Note: This results in tight coupling of the controller and the directive
          var data = {
            active: scope.updateNumberOfActive(),
            timely: scope.updateNumberOfTimely(),
            delayed: scope.updateNumberOfDelayed()
          };

          //add data to graph
          graph.series.addData(data);
          //update graph
          graph.render();
        }, interval);
      }
    };
  }
);

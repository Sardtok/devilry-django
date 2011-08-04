Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit']);

Ext.onReady(function() {

	Ext.define('trix.apps.trix.simplified.periodexercise.SimplifiedPeriodExercise', {
		extend: 'Ext.data.Model',
		    requires: ['devilry.extjshelpers.RestProxy'],
		    fields: [{"type": "int", "name": "id"}, {"type": "auto", "name": "period"}, {"type": "auto", "name": "exercise"}, {"type": "int", "name": "points"}, {"type": "bool", "name": "starred"}],
		    idProperty: 'id',
		    proxy: Ext.create('devilry.extjshelpers.RestProxy', {
			    url: '/trix/restfulsimplifiedperiodexercise/',
				extraParams: {
				getdata_in_qrystring: true,
				    result_fieldgroups: '[]'
				    },
				reader: {
				type: 'json',
				    root: 'items',
				    totalProperty: 'total'
				    },
				writer: {
				type: 'json'
				    }
			})
		    });

    var store = Ext.create('Ext.data.Store', {
	    model: 'trix.apps.trix.simplified.periodexercise.SimplifiedPeriodExercise',
	    id: 'trix.apps.trix.simplified.periodexercise.SimplifiedPeriodExerciseStore',
	    remoteFilter: true,
	    remoteSort: true,
	    autoSync: true 
	});

    store.load();

    var colors = ['url(#v-1)',
                  'url(#v-2)',
                  'url(#v-3)',
                  'url(#v-4)',
                  'url(#v-5)'];
    
    var baseColor = '#eee';
    
    Ext.define('Ext.chart.theme.Fancy', {
        extend: 'Ext.chart.theme.Base',
        
        constructor: function(config) {
            this.callParent([Ext.apply({
                axis: {
                    fill: baseColor,
                    stroke: baseColor
                },
                axisLabelLeft: {
                    fill: baseColor
                },
                axisLabelBottom: {
                    fill: baseColor
                },
                axisTitleLeft: {
                    fill: baseColor
                },
                axisTitleBottom: {
                    fill: baseColor
                },
                colors: colors
            }, config)]);
        }
    });


    var win = Ext.create('Ext.Window', {
        width: 800,
        height: 600,
        hidden: false,
        maximizable: true,
        title: 'Bar Renderer',
        renderTo: Ext.getBody(),
        layout: 'fit',

        items: {
            xtype: 'chart',
            animate: true,
            style: 'background:#fff',
            shadow: false,
            store: store,
            axes: [{
                type: 'Category',
                position: 'bottom',
                fields: ['period'],
                title: 'Period',
            }, {
                type: 'Numeric',
                position: 'left',
                fields: ['points'],
                title: 'Points',
		minimum: 0,
            }],
            series: [{
		type: 'column',
                axis: 'left',
                highlight: true,
                label: {
                  display: 'insideEnd',
                  'text-anchor': 'middle',
                    field: 'points',
                    orientation: 'horizontal',
                    fill: '#fff',
                    font: '17px Arial'
                },
                renderer: function(sprite, storeItem, barAttr, i, store) {
                    barAttr.fill = colors[i % colors.length];
                    return barAttr;
                },
                style: {
                    opacity: 0.95
                },
                xField: 'name',
                yField: 'points'

            }]
        }
    });
});


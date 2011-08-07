Ext.require('Ext.chart.*');
Ext.require(['Ext.fx.target.Sprite', 'Ext.layout.container.Fit']);
    
var colors = ['#0077B3',
                  '#77B300',
                  '#CC4400',];
    
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

Ext.onReady(function() {
    var topicstore = Ext.data.StoreManager.lookup('trix.apps.trix.restful.topicstats.RestfulTopicStatisticsStore').load();
    var periodstore = Ext.data.StoreManager.lookup('trix.apps.trix.restful.periodstats.RestfulPeriodStatisticsStore').load();

    var tabs = Ext.create('Ext.tab.Panel', {
        width: 800,
        height: 600,
        title: 'Statistics',
        renderTo: 'stats',
        layout: 'fit',
	activeTab: 'points_topic',

        items: [
		getPercentageDict('points_topic', 'Points/Topic', 'Topic', 'name', 'Points', 'points_percent', topicstore),
		getPercentageDict('exercises_topic', 'Exercises/Topic', 'Topic', 'name', 'Exercises', 'done_percent', topicstore), 
		getPercentageDict('points_period', 'Points/Period', 'Period', 'long_name', 'Points', 'points_percent', periodstore),
		getPercentageDict('exercise_period', 'Exercises/Period', 'Period', 'long_name', 'Exercises', 'done_percent', periodstore),
		]
    });
});

function getValuesDict(id, title, x_title, x_field, y_title, y_field, store) {
    return {
            id: id,
	    title: title,
            xtype: 'chart',
            theme: 'Fancy',
            animate: {
                easing: 'bounceOut',
                duration: 750
            },
            store: store,
            background: {
                fill: 'rgb(17, 17, 17)'
            },
            axes: [{
                type: 'Category',
                position: 'bottom',
                fields: [x_field],
                title: x_title,
            }, {
                type: 'Numeric',
                position: 'left',
                fields: [y_field],
                title: y_title,
		minimum: 0,

            }],
            series: [{
		type: 'column',
                axis: 'left',
                highlight: true,
                label: {
                  display: 'insideEnd',
                  'text-anchor': 'middle',
                    field: y_field,
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
                xField: x_field,
                yField: y_field

            }]
        }
}

function getPercentageDict(id, title, x_title, x_field, y_title, y_field, store) {
    return {
            id: id,
	    title: title,
            xtype: 'chart',
            theme: 'Fancy',
            animate: {
                easing: 'bounceOut',
                duration: 750
            },
            store: store,
            background: {
                fill: 'rgb(17, 17, 17)'
            }	    
            axes: [{
                type: 'Category',
                position: 'bottom',
                fields: [x_field],
                title: x_title,
            }, {
                type: 'Numeric',
                position: 'left',
		fields: [y_field],
                title: y_title + ' %',
		minimum: 0,
		maximum: 100,

            }],
            series: [{
		type: 'column',
                axis: 'left',
                highlight: true,
                label: {
                    display: 'insideEnd', 'text-anchor': 'middle',
		    field: y_field,
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
		tips: {
                    trackMouse: true,
		    width: 80,
		    height: 28,
                    renderer: function(storeItem, item) {
                        this.setTitle(String(item.value[1]) + ' % of max');
                    }
                },

                xField: x_field,
                yField: y_field

            }]
        }
}

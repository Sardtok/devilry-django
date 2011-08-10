Ext.require('Ext.chart.*');
Ext.require(['Ext.fx.target.Sprite', 'Ext.layout.container.Fit']);
    
var colors = ['#0077B3',
                  '#77B300',
                  '#CC4400',];
/*var colors = ['url(#v-1)',
	      'url(#v-2)',
	      'url(#v-3)',
	      'url(#v-4)',
	      'url(#v-5)',];*/
    
var baseColor = '#eee';
    
Ext.define('Ext.chart.theme.Fancy', {
        extend: 'Ext.chart.theme.Base',
        
        constructor: function(config) {
            this
.callParent([Ext.apply({
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

    var periodstats = Ext.create('Ext.tab.Panel', {
        width: 800,
        height: 600,
        title: gettext('Statistics'),
        renderTo: 'stats',
        layout: 'fit',
	activeTab: 'points_topic',
	preventHeader: 'true',
        items: [
		Ext.create('Ext.tab.Panel', {
			title: gettext('Topics'),
			items: [
				getPercentageDict('points_topic', gettext('Points'), gettext('Topic'), 'name', gettext('Points'), 'points_percent', topicstore),
				getPercentageDict('exercises_topic', gettext('Effort'), gettext('Topic'), 'name', gettext('Exercises'), 'done_percent', topicstore), 
			]
		    }),
		Ext.create('Ext.tab.Panel', {
			title: gettext('Periods'),
			items: [
				getPercentageDict('points_period', gettext('Points'), gettext('Period'), 'long_name', gettext('Points'), 'points_percent', periodstore),
				getPercentageDict('exercise_period', gettext('Effort'), gettext('Period'), 'long_name', gettext('Exercises'), 'done_percent', periodstore),
				]
		    }),]
    });
});

/***
 * Returns a dictionary containing data to be displayed as values in a bar chart.
 */
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

/***
 * Returns a dictionary containing data to be displayed as percentage in a bar chart.
 */
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
            },
	    /*gradients: [
            {
                'id': 'v-1',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(212, 40, 40)'
                    },
                    100: {
                        color: 'rgb(117, 14, 14)'
                    }
                }
            },
            {
                'id': 'v-2',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(180, 216, 42)'
                    },
                    100: {
                        color: 'rgb(94, 114, 13)'
                    }
                }
            },
            {
                'id': 'v-3',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(43, 221, 115)'
                    },
                    100: {
                        color: 'rgb(14, 117, 56)'
                    }
                }
            },
            {
                'id': 'v-4',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(45, 117, 226)'
                    },
                    100: {
                        color: 'rgb(14, 56, 117)'
                    }
                }
            },
            {
                'id': 'v-5',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(187, 45, 222)'
                    },
                    100: {
                        color: 'rgb(85, 10, 103)'
                    }
                }
		}],*/
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
		    console.log(sprite);
                    barAttr.fill = colors[i % colors.length];
                    return barAttr;
                },
                style: {
                    opacity: 0.95,
                },
		tips: {
                    trackMouse: true,
		    width: 100,
		    height: 32,
                    renderer: function(storeItem, item) {
			console.log(storeItem);
                        this.setTitle(String(storeItem.data['exercises_done']) + ' av ' + String(storeItem.data['exercises']) + ' oppgaver gjort');
                    }
                },

                xField: x_field,
                yField: y_field

            }]
        }
}

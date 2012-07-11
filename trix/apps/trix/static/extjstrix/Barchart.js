var baseColor = '#eee';
var colors = ['#77B300',
	      '#0077B3',
	      '#FF3333',];

/***
 * Returns a dictionary containing data to be displayed as a percentage bar chart.
 *
 * Parameters:
 * - id             = id of this item
 * - title          = title that will be displayed in the tab
 * - x_title        = title that will be displayed on the x axis
 * - x_field        = name of data field to look for in store
 * - y_title        = title for y axix
 * - y_field        = name of data field to look for in store
 * - mouseover1     = name of first data field to be displayed in the mouseover tip
 * - mouseover2     = name of second data field to be displayed in the mouseover tip
 * - mouseover_text = text to be displayed in mouseover tip
 *
 * Returns : a dictionary, meant to be used as an item in the tab Panel
 */
function getPercentageBarChart(id, title, x_title, x_field, y_title, y_field, mouseover1, mouseover2, mouseover_text, store) {
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
		font: '17px Arial',
		renderer: function(string) {
		    return string + '%'
		},
	    },
            renderer: function(sprite, storeItem, barAttr, i, store) {
		//barAttr.fill = colors[i % colors.length];
                if (storeItem.data[y_field] == 100) {
                    barAttr.fill = colors[0];
		} else if (storeItem.data[y_field] > 66) {
		    if (storeItem.data['starred_done'] > 0)
			barAttr.fill = colors[0];
		    else
			barAttr.fill = colors[1];
		} else if (storeItem.data[y_field] > 33){
		    if (storeItem.data['starred_done'] > 0)
			barAttr.fill = colors[1];
		    else
			barAttr.fill = colors[2];
		} else {
		    barAttr.fill = colors[2];
		}
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
                    this.setTitle(String(storeItem.data[mouseover1]) + gettext(' of ') 
				  + String(storeItem.data[mouseover2]) + mouseover_text);
                }
            },

            xField: x_field,
	    yField: y_field,
	}],
    }
}

/**
 * Theme to color bars and make them bounce.
 */
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

/**
 * A bar chart for periods and topics.
 */
Ext.define('trix.Barchart', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.trixchart',
    title: gettext('Statistics'),
    layout: 'fit',
    autoHeight: true,

    items: [{
	xtype: 'tabpanel',
	title: gettext('Periods'),
	plain: true,
	padding: 3,
        autoHeight: true,
        layout: 'fit',
	//id: 'periods',
	items: [
	    getPercentageBarChart('exercise_period', gettext('Effort'), gettext('Period'), 'long_name', gettext('Exercises'), 'done_percent', 'exercises_done', 'exercises', gettext(' exercises done'), periodstore),
	    getPercentageBarChart('points_period', gettext('Points'), gettext('Period'), 'long_name', gettext('Points'), 'points_percent', 'points', 'total_points', gettext(' possible points'), periodstore),
	]
    },
	    {
		xtype: 'tabpanel',
		title: gettext('Topics'),
		//id: 'topics',
		padding: 3,
		plain: true,
		items: [
		    getPercentageBarChart('exercises_topic', gettext('Effort'), gettext('Topic'), 'name', gettext('Exercises'), 'done_percent', 'exercises_done', 'exercises', gettext(' exercises done'), topicstore),
		    getPercentageBarChart('points_topic', gettext('Points'), gettext('Topic'), 'name', gettext('Points'), 'points_percent', 'points', 'total_points', gettext(' possible points'), topicstore), 
		]
	    },],

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },

    initComponent: function() {
        this.callParent(arguments);
    }
});

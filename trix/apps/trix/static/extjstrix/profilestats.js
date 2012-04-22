Ext.require('Ext.chart.*');
Ext.require('Ext.grid.*');
Ext.require(['Ext.fx.target.Sprite', 'Ext.layout.container.Fit']);

/*var colors = ['#0077B3',
  '#77B300',
  '#CC4400',];*/
var colors = ['#77B300',
	      '#0077B3',
	      '#FF3333',];

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

    var fancystats = Ext.create('Ext.tab.Panel', {
        width: 800,
        height: 600,
        title: gettext('Statistics'),
        renderTo: 'graph',
        layout: 'fit',
	//activeTab: 'periods',
	preventHeader: 'true',
	
        items: [{
	    xtype: 'tabpanel',
	    title: gettext('Periods'),
	    plain: true,
	    padding: 3,
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
		},]
    });


    var periodgrid = Ext.create('Ext.grid.Panel', {
	title: gettext('Periods'),
	store: periodstore,
	columns: [
            {header: gettext('Period'),  dataIndex: 'long_name'},
            {header: gettext('Points'), dataIndex: 'points', 
	     renderer: function(value, md, record) {
		 return String(value + gettext(' of ') + record.get('total_points'));}},
            {header: 
	     gettext('Exercises done'), dataIndex: 'exercises_done', flex:1,
	     renderer: function(value, md, record) {
		 return String(value) + gettext(' of ') + record.get('exercises');}},
            {header: 
	     gettext('Key exercises'), dataIndex: 'starred_done', flex:1,
	     renderer: function(value, md, record) {
		 return String(value) + gettext(' of ') + record.get('starred');   
	     }},],
    });

    var topicgrid = Ext.create('Ext.grid.Panel', {
	title: gettext('Topics'),
	store: topicstore,
	columns: [
            {header: gettext('Topic'),  dataIndex: 'name', flex:1},
            {header: gettext('Points'), dataIndex: 'points', 
	     renderer: function(value, md, record) {
		 return String(value + gettext(' of ') + record.get('total_points'));}},
            {header: 
	     gettext('Exercises done'), dataIndex: 'exercises_done', flex:1,
	     renderer: function(value, md, record) {
		 return String(value) + gettext(' of ') + record.get('exercises');}},
            {header: 
	     gettext('Key exercises'), dataIndex: 'starred_done', flex:1,
	     renderer: function(value, md, record) {
		 return String(value) + gettext(' of ') + record.get('starred');   
	     }},],
    });

    var gridstats = Ext.create('Ext.tab.Panel', {
	autoHeight: true,
	width: 450,
	title: gettext('Overview'),
	preventHeader: 'true',
	renderTo: 'grid',
	items: [periodgrid, topicgrid]		    
    });

    //gridstats.on('rowclick', function() { alert("hey");});
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
		if (storeItem.data[y_field] > 66) {
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

Ext.require('Ext.chart.*');
Ext.require(['Ext.fx.target.Sprite', 'Ext.layout.container.Fit']);

Ext.onReady(function() {

    var topicstore = Ext.data.StoreManager.lookup('trix.apps.trix.restful.topicstats.RestfulTopicStatisticsStore').load();
    var periodstore = Ext.data.StoreManager.lookup('trix.apps.trix.restful.topicstats.RestfulPeriodStatisticsStore');
    
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
    

    var topics = Ext.create('Ext.tab.Panel', {
        width: 800,
        height: 600,
        hidden: false,
        title: 'Statistics',
        renderTo: 'stats',
        layout: 'fit',

        items: {
            id: 'chartCmp',
            xtype: 'chart',
            theme: 'Fancy',
            animate: {
                easing: 'bounceOut',
                duration: 750
            },
            store: topicstore,
            background: {
                fill: 'rgb(17, 17, 17)'
            },
            axes: [{
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: 'Topic',
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

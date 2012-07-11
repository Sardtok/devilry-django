Ext.define('trix.StatisticsPanel', {
    extend: 'Ext.Panel',
    alias: 'widget.trixstats',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    border: 0,
    autoHeight: true,
    items: [
        { xtype: 'trixstatstable', flex: 1, margins: '0 5 0 5'},
        { xtype: 'trixchart', flex: 1, margins: '0 5 0 5'}
    ]
});

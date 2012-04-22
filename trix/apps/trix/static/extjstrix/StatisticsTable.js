Ext.define('trix.StatisticsTable', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.trixstatstable',
    title: gettext('Overview'),
    preventHeader: 'true',
    layout: 'fit',
    autoHeight: true,

    items: [
        { xtype: 'trixperiodstats'},
        { xtype: 'trixtopicstats'}
    ]
});
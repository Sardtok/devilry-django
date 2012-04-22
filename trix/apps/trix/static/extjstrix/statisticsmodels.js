// Models

// Period statistics
Ext.define('trix.apps.trix.restful.periodstats.RestfulPeriodStatistics', {
    extend: 'Ext.data.Model',
    requires: ['devilry.extjshelpers.RestProxy'],
    fields: [{"type": "int", "name": "id"}, {"type": "auto", "name": "short_name"}, {"type": "auto", "name": "long_name"}, {"type": "int", "name": "exercises"}, {"type": "int", "name": "exercises_done"}, {"type": "int", "name": "starred"}, {"type": "int", "name": "starred_done"}, {"type": "int", "name": "total_points"}, {"type": "int", "name": "points"}, {"type": "int", "name": "starred_percent"}, {"type": "int", "name": "points_percent"}, {"type": "int", "name": "done_percent"}],
    idProperty: 'id',
    proxy: Ext.create('devilry.extjshelpers.RestProxy', {
        url: '/trix/restfulperiodstatistics/',
        extraParams: {
            getdata_in_qrystring: true,
            result_fieldgroups: '[]'
        },
        reader: {
            type: 'json',
            root: 'items',
            totalProperty: 'total'
        }
    })
});

// Topic statistics
Ext.define('trix.apps.trix.restful.topicstats.RestfulTopicStatistics', {
    extend: 'Ext.data.Model',
    requires: ['devilry.extjshelpers.RestProxy'],
    fields: [{"type": "int", "name": "id"}, {"type": "auto", "name": "name"}, {"type": "int", "name": "exercises"}, {"type": "i' nt", "name": "exercises_done"}, {"type": "int", "name": "starred"}, {"type": "int", "name": "starred_done"}, {"type": "int", "name": "total_points"}, {"type": "int", "name": "points"}, {"type": "int", "name": "starred_percent"}, {"type": "int", "name": "points_percent"}, {"type": "int", "name": "done_percent"}],
    idProperty: 'id',
    proxy: Ext.create('devilry.extjshelpers.RestProxy', {
        url: '/trix/restfultopicstatistics/',
        extraParams: {
            getdata_in_qrystring: true,
            result_fieldgroups: '[]'
        },
        reader: {
            type: 'json',
            root: 'items',
            totalProperty: 'total'
        }
    })
});

// Stores
// Period statistics
Ext.create('Ext.data.Store', {
    model: 'trix.apps.trix.restful.periodstats.RestfulPeriodStatistics',
    id: 'trix.apps.trix.restful.periodstats.RestfulPeriodStatisticsStore',
    remoteFilter: true,
    remoteSort: true,
    autoSync: true
});

// Topic statistics
Ext.create('Ext.data.Store', {
    model: 'trix.apps.trix.restful.topicstats.RestfulTopicStatistics',
    id: 'trix.apps.trix.restful.topicstats.RestfulTopicStatisticsStore',
    remoteFilter: true,
    remoteSort: true,
    autoSync: true
});

var topicstore = Ext.data.StoreManager.lookup('trix.apps.trix.restful.topicstats.RestfulTopicStatisticsStore').load();
var periodstore = Ext.data.StoreManager.lookup('trix.apps.trix.restful.periodstats.RestfulPeriodStatisticsStore').load();

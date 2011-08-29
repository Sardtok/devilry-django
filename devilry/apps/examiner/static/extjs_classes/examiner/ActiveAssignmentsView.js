Ext.define('devilry.examiner.ActiveAssignmentsView', {
    extend: 'devilry.extjshelpers.DashGrid',
    requires: [
        'devilry.extjshelpers.DateTime'
    ],


    config: {
        model: undefined,
        noRecordsMessage: {
            title: 'No active assignments',
            msg: "You are not registered on any assignments in an active period/semester. You can find inactive assignments using the search box."
        }
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },
    
    createStore: function() {
        this.store = Ext.create('Ext.data.Store', {
            model: this.model,
            groupField: 'parentnode__parentnode__long_name',
            remoteFilter: true,
            remoteSort: true,
            autoSync: true
        });

        this.store.proxy.extraParams.filters = Ext.JSON.encode([{
            field: 'parentnode__start_time',
            comp: '<',
            value: devilry.extjshelpers.DateTime.restfulNow()
        }, {
            field: 'parentnode__end_time',
            comp: '>',
            value: devilry.extjshelpers.DateTime.restfulNow()
        }]);
        this.store.proxy.extraParams.orderby = Ext.JSON.encode(['-publishing_time']);
        this.store.pageSize = 500; // A bit ugly, but we do not want to make it unlimited??
    },

    createBody: function() {
        var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
            groupHeaderTpl: '{name}',
        });
        var activeAssignmentsGrid = Ext.create('Ext.grid.Panel', {
            frame: false,
            frameHeader: false,
            border: false,
            sortableColumns: false,
            cls: 'selectable-grid',
            store: this.store,
            features: [groupingFeature],
            columns: [{
                text: 'Assignment',
                menuDisabled: true,
                flex: 20,
                dataIndex: 'long_name'
            },{
                text: 'Period',
                menuDisabled: true,
                dataIndex: 'parentnode__long_name',
                flex: 20,
            },{
                text: 'Published',
                menuDisabled: true,
                width: 150,
                dataIndex: 'publishing_time',
                renderer: function(value) {
                    var rowTpl = Ext.create('Ext.XTemplate',
                        '{.:date}'
                    );
                    return rowTpl.apply(value);
                }
            }],
            listeners: {
                scope: this,
                itemmouseup: function(view, record) {
                    var url = DASHBOARD_URL + "assignment/" + record.data.id
                    window.location = url;
                }
            }
        });
        this.add({
            xtype: 'box',
            html: '<h2>Assignments in an active period/semester</h2>'
        });
        this.add(activeAssignmentsGrid);
    }

});

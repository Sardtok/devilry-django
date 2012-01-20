Ext.define('devilry.extjshelpers.assignmentgroup.AssignmentGroupTodoListWindow', {
    extend: 'Ext.window.Window',
    title: 'To-do list (Open groups on this assignment)',
    height: 370,
    width: 750,
    modal: true,
    layout: 'fit',

    config: {
        assignmentgroupstore: undefined,
        assignmentgroup_recordcontainer: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },

    initComponent: function() {
        Ext.apply(this, {
            items: {
                xtype: 'assignmentgrouptodolist',
                assignmentgroup_recordcontainer: this.assignmentgroup_recordcontainer,
                store: this.assignmentgroupstore
            }
        });
        this.callParent(arguments);
    }
});

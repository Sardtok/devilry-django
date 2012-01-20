Ext.define('devilry.extjshelpers.assignmentgroup.AssignmentGroupTodoList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.assignmentgrouptodolist',
    cls: 'widget-assignmentgrouptodolist',
    requires: [
        'devilry.extjshelpers.formfields.StoreSearchField'
    ],

    studentsColTpl: Ext.create('Ext.XTemplate',
        '<div class="section popuplistitem">',
        '    <tpl if="name">',
        '        {name}: ',
        '    </tpl>',
        '    <ul style="display: inline-block;">',
        '    <tpl for="candidates">',
        '       <li>{identifier} <tpl if="full_name">({full_name})</tpl></li>',
        '    </tpl>',
        '    </ul>',
        '    <tpl if="id == current_assignment_group_id">',
        '        &mdash; <strong>(currently selected)</strong>',
        '    </tpl>',
        '</div>'
    ),

    deliveriesColTpl: Ext.create('Ext.XTemplate', 
        '<div class="section popuplistitem">',
        '<span class="deliveriescol">',
        '    <tpl if="number_of_deliveries &gt; 0">',
        '       {number_of_deliveries}',
        '    </tpl>',
        '    <tpl if="number_of_deliveries == 0">',
        '       <span class="nodeliveries">0</div>',
        '   </tpl>',
        '</span>',
        '</div>'
    ),

    todohelptext: '<p>This is your to-do list on this assignment. It shows all <em>open</em> groups. An <em>open</em> group is a group that is still waiting for deliveries or feedback.</p>',

    /**
    * @cfg
    * AssignmentGroup ``Ext.data.Store``. (Required).
    */
    store: undefined,

    /**
    * @cfg
    * A {@link devilry.extjshelpers.SingleRecordContainer} for AssignmentGroup. (Optional).
    *
    * Used to show current assignmentgroup.
    */
    assignmentgroup_recordcontainer: undefined,

    /**
     * @cfg
     */
    pageSize: 7,

    /**
     * @cfg
     */
    toolbarExtra: undefined,

    /**
     * @cfg
     */
    helpTpl: Ext.create('Ext.XTemplate',
        '<div class="section helpsection">{todohelptext}</div>'
    ),


    initComponent: function() {
        var me = this;
        this.tbarItems = [{
            xtype: 'storesearchfield',
            emptyText: 'Search...',
            store: this.store,
            pageSize: this.pageSize,
            width: 300,
            autoLoadStore: false
        }];
        if(this.toolbarExtra) {
            Ext.Array.insert(this.tbarItems, 1, this.toolbarExtra);
        }

        Ext.apply(this, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                flex: 6,
                xtype: 'grid',
                cls: 'selectable-grid',
                store: this.store,
                frame: false,
                border: false,
                sortableColumns: false,
                autoScroll: true,
                columns: [{
                    header: 'Students',
                    dataIndex: 'id',
                    flex: 2,
                    menuDisabled: true,
                    renderer: function(value, metaData, grouprecord) {
                        var data = {};
                        if(me.assignmentgroup_recordcontainer) {
                            data.current_assignment_group_id = me.assignmentgroup_recordcontainer.record.data.id;
                        }
                        Ext.apply(data, grouprecord.data);
                        return me.studentsColTpl.apply(data);
                    }
                }, {
                    text: 'Deliveries', dataIndex: 'id', width: 70, menuDisabled: true,
                    renderer: function(v, p, record) { return me.deliveriesColTpl.apply(record.data); }
                }],

                listeners: {
                    scope: this,
                    itemmouseup: this.onSelectGroup
                }
            }, {
                xtype: 'box',
                width: 300,
                autoScroll: true,
                flex: 4,
                html: this.helpTpl.apply({todohelptext: this.todohelptext})
            }],

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                //ui: 'footer',
                items: this.tbarItems
            }, {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                displayInfo: true
            }]
        });

        this.callParent(arguments);

        if(this.assignmentgroup_recordcontainer) {
            if(this.assignmentgroup_recordcontainer.record) {
                this.onSetAssignmentGroup();
            }
            this.assignmentgroup_recordcontainer.addListener('setRecord', this.onSetAssignmentGroup, this);
        }
    },

    onSelectGroup: function(grid, assignmentgroupRecord) {
        window.location.href = assignmentgroupRecord.data.id.toString();
    },

    /**
     * @private
     */
    onSetAssignmentGroup: function() {
        this.loadTodoListForAssignment(this.assignmentgroup_recordcontainer.record.data.parentnode);
    },

    /**
     * Reload store with the given assignmentid.
     * */
    loadTodoListForAssignment: function(assignmentid) {
        this.store.pageSize = this.pageSize;
        var searchfield = this.down('storesearchfield');
        searchfield.alwaysAppliedFilters = [{
            field: 'parentnode',
            comp: 'exact',
            value: assignmentid
        }, {
            field: 'is_open',
            comp: 'exact',
            value: true
        }];
        searchfield.refreshStore();
    },
});

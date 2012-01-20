Ext.define('devilry.extjshelpers.assignmentgroup.AssignmentGroupInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.assignmentgroupinfo',
    cls: 'widget-assignmentgroupinfo',

    requires: [
        'devilry.extjshelpers.assignmentgroup.AssignmentGroupTodoList',
        'devilry.extjshelpers.assignmentgroup.DeliveriesOnSingleGroupListing',
        'devilry.extjshelpers.assignmentgroup.DeadlinesOnSingleGroupListing',
        'devilry.extjshelpers.assignmentgroup.AssignmentGroupDetails'
    ],

    config: {
        /**
         * @cfg
         * Enable creation of new feedbacks? Defaults to ``false``.
         * See: {@link devilry.extjshelpers.assignmentgroup.DeliveryInfo#canExamine}.
         *
         * When this is ``true``, the authenticated user still needs to have
         * permission to POST new feedbacks for the view to work.
         */
        canExamine: false,

        assignmentgroup_recordcontainer: undefined,
        delivery_recordcontainer: undefined,
        assignmentgroupstore: undefined,
        deliverymodel: undefined,
        deadlinemodel: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },


    initComponent: function() {
        var tbarItems = [{
            xtype: 'button',
            id: 'tooltip-deliveries',
            text: 'Deadlines',
            scale: 'large',
            listeners: {
                scope: this,
                click: this.onDeadlines
            }
        }];
        
        if(this.canExamine) {
            var onUncorrectedGroupsBtn = Ext.ComponentManager.create({
                xtype: 'button',
                id: 'tooltip-uncorrected-groups',
                text: 'To-do',
                scale: 'large',
                listeners: {
                    scope: this,
                    click: this.onTodo
                }
            });
            Ext.Array.insert(tbarItems, 0, [onUncorrectedGroupsBtn]);

            this.closeopenbtn = Ext.ComponentManager.create({
                xtype: 'button',
                text: '',
                scale: 'large',
                listeners: {
                    scope: this,
                    click: this.onCloseOrOpenGroup
                }
            });
            Ext.Array.insert(tbarItems, 3, [this.closeopenbtn]);

            if(this.assignmentgroup_recordcontainer.record) {
                this.onSetAssignmentGroup();
            }
            this.assignmentgroup_recordcontainer.addListener('setRecord', this.onSetAssignmentGroup, this);
        }

        Ext.apply(this, {
            tbar: tbarItems,
            items: [{
                xtype: 'assignmentgroupdetails',
                extradata: {
                    canExamine: this.canExamine
                },
                singlerecordontainer: this.assignmentgroup_recordcontainer
            }]
        });

        this.callParent(arguments);
    },


    /**
     * @private
     */
    onSetAssignmentGroup: function() {
        this.closeopenbtn.setText(this.assignmentgroup_recordcontainer.record.data.is_open? 'Close group': 'Open group');
    },

    /**
     * @private
     */
    onTodo: function(button) {
        var groupsWindow = Ext.create('Ext.window.Window', {
            title: 'To-do list (Open groups on this assignment)',
            height: 370,
            width: 750,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'assignmentgrouptodolist',
                assignmentgroup_recordcontainer: this.assignmentgroup_recordcontainer,
                store: this.assignmentgroupstore,
                toolbarExtra: ['->', {
                    xtype: 'button',
                    scale: 'large',
                    text: 'Go to assignment',
                    listeners: {
                        scope: this,
                        click: this.onGoToAssignmentsView
                    }
                }],

                helpTpl: Ext.create('Ext.XTemplate',
                    '<div class="section helpsection">',
                    '   {todohelptext}',
                    '   <p>Choose <span class="menuref">Go to assignment</span> to show the assignment where you have access to all groups, and information about the assignment.</p>',
                    '</div>'
                ),
            }
        });
        groupsWindow.show();
    },

    /**
     * @private
     */
    onGoToAssignmentsView: function() {
        var url = Ext.String.format('../assignment/{0}',
            this.assignmentgroup_recordcontainer.record.data.parentnode
        );
        window.location.href = url;
    },

    /**
     * @private
     */
    onCloseOrOpenGroup: function(button) {
        if(this.assignmentgroup_recordcontainer.record.data.is_open) {
            this.onCloseGroup(button);
        } else {
            this.onOpenGroup(button);
        }
    },

    /**
     * @private
     */
    onOpenGroup: function(button) {
        var win = Ext.MessageBox.show({
            title: 'Are you sure you want to open this group?',
            msg: '<p>This will <strong>allow</strong> students to add more deliveries. ' +
                'Normally Devilry will close groups automatically when:</p>'+
                '<ul>' +
                '   <li>you have given a passing grade.</li>' +
                '   <li>students have failed to get a passing grade more than the configured maximum number of times.</li>' +
                '</ul>' +
                '<p>And you normally do not open it again unless you want students to add a new delivery.</p>',
            buttons: Ext.Msg.YESNO,
            scope: this,
            closable: false,
            fn: function(buttonId) {
                if(buttonId == 'yes') {
                    this.assignmentgroup_recordcontainer.record.data.is_open = true;
                    this.assignmentgroup_recordcontainer.record.save({
                        scope: this,
                        success: function(record) {
                            this.assignmentgroup_recordcontainer.fireSetRecordEvent();
                        },
                        failure: function() {
                            throw "Failed to open group."
                        }
                    });
                }
            }
        });
    },

    /**
     * @private
     */
    onCloseGroup: function(button) {
        var win = Ext.MessageBox.show({
            title: 'Are you sure you want to close this group?',
            msg: '<p>This will <strong>prevent</strong> students from adding more deliveries. ' +
                'Normally Devilry will close groups automatically when:</p>'+
                '<ul>' +
                '   <li>you have given a passing grade.</li>' +
                '   <li>students have failed to get a passing grade more than the configured maximum number of times.</li>' +
                '</ul>' +
                '<p>However you may have to close a group manually if no maximum number of tries have been configured, or if you want the current feedback to be stored as the final feedback for this group.</p>',
            buttons: Ext.Msg.YESNO,
            scope: this,
            closable: false,
            fn: function(buttonId) {
                if(buttonId == 'yes') {
                    this.assignmentgroup_recordcontainer.record.data.is_open = false;
                    this.assignmentgroup_recordcontainer.record.save({
                        scope: this,
                        success: function(record) {
                            this.assignmentgroup_recordcontainer.fireSetRecordEvent();
                        },
                        failure: function() {
                            throw "Failed to close group."
                        }
                    });
                }
            }
        });
    },

    /**
     * @private
     */
    onDeadlines: function(button) {
        var deadlinesWindow = Ext.create('Ext.window.Window', {
            title: 'Deadlines for this group',
            width: 600,
            height: 400,
            modal: true,
            layout: 'fit',
            closeAction: 'hide',
            items: {
                xtype: 'deadlinesonsinglegrouplisting',
                assignmentgroup_recordcontainer: this.assignmentgroup_recordcontainer,
                delivery_recordcontainer: this.delivery_recordcontainer,
                deliverymodel: this.deliverymodel,
                deadlinemodel: this.deadlinemodel,
                enableDeadlineCreation: this.canExamine
            }
        });
        deadlinesWindow.show();
    }
});

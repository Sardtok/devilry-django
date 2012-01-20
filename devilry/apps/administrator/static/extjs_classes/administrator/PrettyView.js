/** A prettyview is a read-only view panel used to display a single model record. */
Ext.define('devilry.administrator.PrettyView', {
    extend: 'Ext.panel.Panel',
    cls: 'prettyviewpanel',
    bodyPadding: 0,
    layout: 'fit',

    requires: [
        'devilry.extjshelpers.SetListOfUsers',
        'devilry.extjshelpers.NotificationManager',
        'devilry.extjshelpers.RestProxy'
    ],

    config: {
        /**
         * @cfg
         * The name of the ``Ext.data.Model`` to present in the body. (Required).
         */
        modelname: undefined,

        /**
         * @cfg
         * Unique ID of the object to load from the model. (Required).
         */
        objectid: undefined,

        /**
         * @cfg
         * A ``Ext.XTemplate`` object for the body of this view. (Required).
         */
        bodyTpl: undefined,

        /**
         * @cfg
         * Optional list of buttons for related actions.
         */
        relatedButtons: undefined,

        /**
         * @cfg
         * The url to the dashboard. (Required). Used after delete to return to
         * the dashboard.
         */
        dashboardUrl: undefined

        /**
         * @cfg
         * Optional list of menuitems for plugin actions.
         */
        //pluginItems: undefined
    },

    constructor: function(config) {
        this.addEvents(
            /**
             * @event
             * Fired when the model record is loaded successfully.
             * @param {Ext.model.Model} record The loaded record.
             */
            'loadmodel',
            
            /**
             * @event
             * Fired when the edit button is clicked.
             * @param {Ext.model.Model} record The record to edit.
             * @param button The edit button.
             */
            'edit');
        this.callParent([config]);
        this.initConfig(config);
    },

    initComponent: function() {
        this.setadminsbutton = Ext.create('Ext.button.Button', {
            text: 'Manage administrators',
            scale: 'large',
            //enableToggle: true,
            listeners: {
                scope: this,
                click: this.onSetadministrators
            }
        });


        this.deletebutton = Ext.create('Ext.button.Button', {
            text: 'Delete',
            scale: 'large',
            //enableToggle: true,
            listeners: {
                scope: this,
                click: this.onDelete
            }
        });

        this.editbutton = Ext.create('Ext.button.Button', {
            text: 'Edit',
            //enableToggle: true,
            scale: 'large',
            listeners: {
                scope: this,
                click: this.onEdit
            }
        });

        var tbar = ['->', this.deletebutton, this.setadminsbutton, this.editbutton];

        if(this.extraMeButtons) {
            Ext.Array.insert(tbar, 2, this.extraMeButtons);
        }

        //if(this.pluginItems) {
            //Ext.Array.insert(tbar, 0, this.pluginItems);
        //}

        if(this.relatedButtons) {
            Ext.Array.insert(tbar, 0, this.relatedButtons);
        }

        this.bodyBox = Ext.widget('box', {
            autoScroll: true,
            padding: 20
        });
        Ext.apply(this, {
            tbar: tbar,
            items: this.bodyBox
        });
        this.callParent(arguments);

        var model = Ext.ModelManager.getModel(this.modelname);
        model.load(this.objectid, {
            scope: this,
            success: this.onModelLoadSuccess,
            failure: this.onModelLoadFailure
        });
    },

    onModelLoadSuccess: function(record) {
        this.record = record;
        this.refreshBody();
        this.fireEvent('loadmodel', record);
    },

    refreshBody: function() {
        var bodyData = this.getExtraBodyData(this.record);
        Ext.apply(bodyData, this.record.data);
        this.bodyBox.update(this.bodyTpl.apply(bodyData));
    },

    /**
     * @private
     */
    getExtraBodyData: function(record) {
        return {};
    },

    /**
     * @private
     */
    onModelLoadFailure: function(record, operation) {
        throw 'Failed to load the model';
    },

    /**
     * @private
     */
    onEdit: function(button) {
        this.fireEvent('edit', this.record, button);
    },

    /** Set record. Triggers the loadmodel event. */
    setRecord: function(record) {
        this.onModelLoadSuccess(record);
    },

    /**
     * @private
     */
    onDelete: function(button) {
        var me = this;
        var win = Ext.MessageBox.show({
            title: 'Confirm delete',
            msg: 'Are you sure you want to delete?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            closable: false,
            fn: function(btn) {
                if(btn == 'yes') {
                    me.deleteObject();
                }
            }
        });
    },

    /**
     * @private
     */
    deleteObject: function() {
        this.record.destroy({
            scope: this,
            success: function() {
                window.location.href = this.dashboardUrl;
            },
            failure: this.onDeleteFailure
        });
    },

    /**
     * @private
     */
    onDeleteFailure: function(record, operation) {
        var title, msg;
        if(operation.error.status == 403) {
            title = "Forbidden";
            msg = 'You do not have permission to delete this item. Only super-administrators have permission to delete items with any content.';
        } else {
            title = 'An unknow error occurred';
            msg = "This is most likely caused by a bug, or a problem with the Devilry server.";
        }

        Ext.MessageBox.show({
            title: title,
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR
        });
    },

    /**
     * @private
     */
    onSetadministrators: function(button) {
        var win = Ext.widget('window', {
            title: 'Set administrators',
            modal: true,
            width: 550,
            height: 300,
            maximizable: true,
            layout: 'fit',
            items: {
                xtype: 'setlistofusers',
                usernames: this.record.data.admins__username,
                helptext: '<p>The username of a single administrator on each line. Example:</p>',
                listeners: {
                    scope: this,
                    saveClicked: this.onSaveAdmins
                }
            }
        });
        win.show();
        //win.alignTo(button, 'br?', [-win.width, 0]);
    },

    /**
     * @private
     */
    onSaveAdmins: function(setlistofusersobj, usernames) {
        setlistofusersobj.getEl().mask('Saving...');
        this.record.data.fake_admins = usernames
        this.record.save({
            scope: this,
            success: function(record) {
                setlistofusersobj.getEl().unmask();
                record.data.admins__username = usernames
                this.onModelLoadSuccess(record)
                setlistofusersobj.up('window').close();
                devilry.extjshelpers.NotificationManager.show({
                    title: 'Save successful',
                    message: 'Updated adminstrators.'
                });
            },
            failure: function(record, operation) {
                setlistofusersobj.getEl().unmask();
                devilry.extjshelpers.RestProxy.showErrorMessagePopup(operation, 'Failed to change administrators');
            }
        });
    },

    alignToCoverBody: function(item) {
        item.alignTo(this.bodyBox, 'tl', [0, 0]);
    },

    setSizeToCoverBody: function(item, height) {
        item.setWidth(this.bodyBox.getWidth());
        if(!height) {
            height = this.bodyBox.getHeight();
            if(height > 500) {
                height = 500;
            }
        }
        item.setHeight(height);
    }
});

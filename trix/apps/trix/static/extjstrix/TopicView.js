Ext.define('trix.TopicView', {
    extend: 'trix.ModelView',
    alias: 'widget.topicview',
    
    requires: [
        'trix.forms.Topic',
        'trix.DefaultEditWindow',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel'
    ],

    config: {
        exercisestore: undefined
    },

    headerTpl: Ext.create('Ext.XTemplate',
                          '<h1>{name}</h1>'),

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    getSelection: function() {
        var selectionModel = this.grid.getSelectionModel();
        return selectionModel.getCount() < 1 ? undefined : selectionModel.getSelection()[0];
    },

    initComponent: function() {
        this.exercisestore.filter(new Ext.util.Filter({ property: 'topics__id', value: this.objectid }));
        this.exercisestore.load();

        this.editButton = Ext.create('Ext.button.Button', {
            text: 'Edit', scope: this, margin: '0 5 20 0',
            handler: function() {
                var window = Ext.create('trix.DefaultEditWindow', {
                    title: 'Edit topic',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_topicform')
                    })
                }).show();
            }
        });

        this.deleteButton = Ext.create('Ext.button.Button', {
            text: 'Delete', scope: this, margin: '0 5 20 0',
            handler: function() {
                Ext.MessageBox.show({
                    title: gettext('Confirm removal'),
                    msg: gettext('Are you sure you want to remove this topic?'),
                    buttons: Ext.MessageBox.YESNO,
                    icon: Ext.Msg.WARNING,
                    closable: false,
                    scope: this,
                    fn: function(button) {
                        if (button != 'yes') {
                            return;
                        }
                        
                        this.record.destroy({
                            scope: this,
                            success: function() {
                                window.location.href = this.dashboardUrl;
                            }
                        });
                    }
                });
            }
        });

        this.viewButton = Ext.create('Ext.button.Button', {
            text: gettext('View exercise'), scope: this, disabled: true,
            handler: function() {
                var record = this.getSelection();
                window.open(this.dashboardUrl + "exercise/" + record.get('id'));
            }
        });

        this.grid = Ext.create('Ext.grid.Panel',
                               {columns: [{header: gettext('Title'), dataIndex: 'long_name',
                                           sortable: false, hideable: false, flex: 1},
                                          {header: gettext('Points'), dataIndex: 'points',
                                           sortable: false, hideable: false}],
                                store: this.exercisestore,

                                listeners: {
                                    select: { fn: function() {
                                        this.viewButton.setDisabled(false);
                                    },
                                              scope: this} },
                                tbar: [gettext('Exercises'), '->',
                                       this.viewButton],
                                scope: this});

        Ext.apply(this, { items: [this.editButton, this.deleteButton, this.grid] });
        this.callParent(arguments);
    }
});

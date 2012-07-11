Ext.define('trix.TopicView', {
    extend: 'trix.ModelView',
    alias: 'widget.topicview',
    
    requires: [
        'trix.forms.Topic',
        'trix.DefaultEditWindow',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel'
    ],

    headerTpl: Ext.create('Ext.XTemplate',
                          '<h1>{name}</h1>'),

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    initComponent: function() {
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
                    title: 'Confirm removal',
                    msg: 'Are you sure you want to remove this topic?',
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

        Ext.apply(this, { items: [this.editButton, this.deleteButton] });
        this.callParent(arguments);
    }
});

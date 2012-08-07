Ext.define('trix.GroupList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.grouplist',
    border: 0,
    hidden: true,

    requires: [
        'trix.forms.AddGroup',
        'trix.DefaultEditWindow',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel',
        'devilry.extjshelpers.formfields.ForeignKeySelector'
    ],

    config: {
        objectid: undefined,
        modelname: undefined,
        groupstore: undefined
    },

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    initComponent: function() {
        this.listView = Ext.widget('box', {
            componentCls: 'grouplist',
            tpl: Ext.create('Ext.XTemplate',
                            gettext('Groups'),
                            ': ',
                            '<tpl for=".">{data.subject__long_name} - {data.long_name}',
                            '<span id="group-{data.id}"></span></tpl>',
                            '<span id="addgroups"></span>')
        });

        this.groupstore.addListener({load: this.onModelLoad, scope: this });
        this.groupstore.filter('followers__id', this.objectid);

        var model = Ext.ModelManager.getModel(this.modelname);
        if (this.objectid) {
            model.load(this.objectid, {
                scope: this,
                success: this.onStudentLoadSuccess
            });
        }

        Ext.apply(this, {items: this.listView});
        this.callParent(arguments);
    },

    onStudentLoadSuccess: function(record) {
        this.record = record;
    },

    onModelLoad: function(store, records, success) {
        if (success) {
            this.listView.update(records);
            this.show();
            Ext.Function.defer(this.addButtons, 200, this, [records]);
        }
    },

    deleteGroup: function(id) {
        return function() {
            this.record.set('fake_followedgroups', -id);
            this.record.save();
            this.groupstore.load();
        };
    },
    
    addButtons: function(records) {
        if (!this.deleteGroupButtons) {
            this.deleteGroupButtons = Array();
        }

        for (i in records) {
            id = records[i].get('id');
            if (this.deleteGroupButtons[id]) {
                Ext.removeNode(this.deleteGroupButtons[id]);
            }
            
            this.deleteGroupButtons[id] = Ext.create('Ext.button.Button', {
                tooltip: gettext('Remove period group'), margin: '2 10 2 2', iconCls: 'icon-delete-16', scope: this,
                handler: this.deleteGroup(id)
            }).render(document.body, 'group-' + id);
        }

        if (this.addGroupButton) {
            Ext.removeNode(this.addGroupButton);
        }

        this.addGroupButton = Ext.create('Ext.button.Button', {
            text: gettext('Add period group'),
            tooltip: gettext('Add period group'), iconCls: 'icon-add-16', margin: '2 10 2 2', scope: this,
            handler: function() {
                this.record.set('fake_followedgroups', null);
                var window = Ext.create('trix.DefaultEditWindow', {
                    scope: this,
                    title: 'Add period group',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_addgroupform')
                    })
                }).show();
            }
        }).render(document.body, 'addgroups');

        this.doComponentLayout();
    },

    refreshWrapper: function() {
        var me = this;
        return function() { me.groupstore.load(); }
    }
});

Ext.define('trix.PeriodGroupView', {
    extend: 'trix.ModelView',
    alias: 'widget.periodgroupview',
    
    requires: [
        'trix.DefaultEditWindow',
        'trix.forms.PeriodGroup',
        'trix.forms.AddPeriod',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel',
    ],

    config: {
        periodstore: undefined,
        static_url: undefined,
        subjectid: undefined
    },

    headerTpl: Ext.create('Ext.XTemplate',
                          '<div>{subject__long_name}</div>',
                          '<h1>{long_name}</h1>'
                         ),

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    reloadPeriods: function() {
        var store = this.periodstore;
        //var deletePeriodButton = this.deletePeriodButton;
        //var viewButton = this.viewPeriodButton;
        var grid = this.grid;
        var selection = this.getSelection();
        if (selection) {
            selection = selection.get('id');
        }

        return function() {
            //deletePeriodButton.setDisabled(true);
            //viewButton.setDisabled(true);

            store.load(function(records, operations, success) {
                if (success && selection) {
                    for (x in records) {
                        if (records[x].get('id') == selection) {
                            grid.getSelectionModel().select(records[x]);
                            return;
                        }
                    }
                    grid.getSelectionModel().deselectAll(false);
                }
            });
        };
    },

    getSelection: function() {
        var selectionModel = this.grid.getSelectionModel();
        return selectionModel.getCount() < 1 ? undefined : selectionModel.getSelection()[0];
    },

    addPeriod: function() {
        this.record.set('fake_periods', null);
        Ext.create('trix.DefaultEditWindow', {
            title: 'Add period',
            successfn: this.reloadPeriods(),
            editpanel: Ext.ComponentManager.create({
                xtype: 'restfulsimplified_editpanel',
                model: this.modelname,
                record: this.record,
                editform: Ext.widget('administrator_addperiodform')
            }),
        }).show();
    },

    removePeriod: function() {
        var period = this.getSelection();
        var record = this.record;
        if (!period) {
            this.removePeriodButton.setDisabled(true);
            Ext.MessageBox.alert('No selection!', 'You have not selected any period to delete.');
            return;
        }
        
        Ext.MessageBox.show({
            title: 'Confirm removal',
            msg: 'Are you sure you want to remove this period?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.Msg.WARNING,
            closable: false,
            scope: this,
            fn: function(button) {
                if (button != 'yes') {
                    return;
                }
                
                record.set('fake_periods', -period.get('id'));
                record.save({ success: this.reloadPeriods() });
            }
        });
    },

    initComponent: function() {
        this.addPeriodButton = Ext.create('Ext.button.Button',
                                          {text: 'Add period', handler: this.addPeriod,
                                           scope: this
                                          });
        this.removePeriodButton = Ext.create('Ext.button.Button',
                                             {text: 'Remove period', handler: this.removePeriod,
                                              scope: this, disabled: true
                                             });

        this.grid = Ext.create('Ext.grid.Panel',
                               {columns: [{header: 'Name', dataIndex: 'long_name',
                                           sortable: false, hideable: false, flex: 1},
                                          {header: 'Start', dataIndex: 'start_time',
                                           sortable: false, hideable: false, flex: 1},
                                          {header: 'End', dataIndex: 'end_time',
                                           sortable: false, hideable: false, flex: 1}],
                                store: this.periodstore,

                                listeners: {
                                    select: { fn: function() {
                                        this.removePeriodButton.setDisabled(false);
                                    }, scope: this },
                                    deselect: { fn: function() {
                                        this.removePeriodButton.setDisabled(true);
                                    }, scope: this }
                                },

                                tbar: ['Periods', '->',
                                       this.addPeriodButton, this.removePeriodButton],

                                scope: this});
        
        this.editButton = Ext.create('Ext.button.Button', {
            text: 'Edit', scope: this, margin: '0 5 20 0',
            handler: function() {
                var window = Ext.create('trix.DefaultEditWindow', {
                    title: 'Edit period group',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_periodgroupform')
                    })
                });
                window.show();
            }
        });

        this.deleteButton = Ext.create('Ext.button.Button', {
            text: 'Delete', scope: this, margin: '0 5 20 0',
            handler: function() {
                Ext.MessageBox.show({
                    title: 'Confirm removal',
                    msg: 'Are you sure you want to remove this period group?',
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
        
        Ext.apply(this, {items: [this.editButton, this.deleteButton, this.grid], autoScroll: true});
        this.callParent(arguments);
    },

    refreshBody: function() {
        this.periodstore.filter(new Ext.util.Filter({ property: 'group', value: this.objectid }));

        //this.box.update(this.record.data);
        this.callParent(arguments);
    }
});

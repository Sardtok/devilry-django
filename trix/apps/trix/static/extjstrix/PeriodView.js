Ext.define('trix.PeriodView', {
    extend: 'trix.ModelView',
    alias: 'widget.periodview',
    
    requires: [
        'trix.DefaultEditWindow',
        'trix.forms.PeriodExercise',
        'trix.forms.Period',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel',
    ],

    config: {
        periodexercisestore: undefined,
        static_url: undefined
    },

    headerTpl: Ext.create('Ext.XTemplate',
                          '<div>{parentnode__long_name}</div>',
                          '<h1>{long_name}</h1>'
                         ),

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    /**
     * This function provides a closure ensuring the correct scope
     * when reloading exercises through the store's load function.
     */
    reloadExercises: function() {
        var store = this.periodexercisestore;
        var editExerciseButton = this.editExerciseButton;
        var deleteExerciseButton = this.deleteExerciseButton;
        var upButton = this.upButton;
        var downButton = this.downButton;
        var viewButton = this.viewButton;
        var grid = this.grid;
        var selection = this.getSelection();
        if (selection) {
            selection = selection.get('id');
        }

        return function() {
            editExerciseButton.setDisabled(true);
            deleteExerciseButton.setDisabled(true);
            upButton.setDisabled(true);
            downButton.setDisabled(true);
            viewButton.setDisabled(true);

            store.load(function(records, operations, success) {
                if (success && selection) {
                    for (x in records) {
                        if (records[x].get('id') == selection) {
                            grid.getSelectionModel().select(records[x]);
                            break;
                        }
                    }
                }
            });
        };
    },

    getSelection: function() {
        var selectionModel = this.grid.getSelectionModel();
        return selectionModel.getCount() < 1 ? undefined : selectionModel.getSelection()[0];
    },

    openExerciseWindow: function(record) {
        var title = record ? 'Edit link between exercise and period' : 'Link an exercise to this period';

        if (!record) {
            record = Ext.create(this.periodexercisestore.model,
                                {period: this.objectid});
        }

        var window = Ext.create('trix.DefaultEditWindow', {
            title: title,
            successfn: this.reloadExercises(),
            editpanel: Ext.ComponentManager.create({
                xtype: 'restfulsimplified_editpanel',
                model: this.modelname,
                record: record,
                editform: Ext.widget('administrator_periodexerciseform')
            }),
        }).show();
    },

    /**
     * Pops up a window to edit a link.
     *
     * TODO: Hide or lock the exercise and period.
     */
    editLink: function() {
        var record = this.getSelection();
        if (!record) {
            this.editExerciseButton.setDisabled(true);
            Ext.MessageBox.alert('No selection!', 'You have not selected any exercises to edit.');
            return;
        }

        this.openExerciseWindow(record);
    },

    /**
     * Pops up a dialog window to ensure the 
     */
    removeExercise: function() {
        var record = this.getSelection();
        if(!record) {
            this.deleteButton.setDisabled(true);
            Ext.MessageBox.alert('No selection!', 'You have not selected any exercises to delete.');
            return;
        }
        
        Ext.MessageBox.show({
            title: 'Confirm removal',
            msg: 'Are you sure you want to remove this exercise?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.Msg.WARNING,
            closable: false,
            scope: this,
            fn: function(button) {
                if (button != 'yes') {
                    return;
                }
                
                record.destroy({ success: this.reloadExercises() });
            }
        });
    },

    moveExercise: function(direction) {
        return function() {
            var record = this.getSelection();
            record.data.number += direction;
            if (record.data.number > 0) {
                record.save({success: this.reloadExercises()});
            }
        }
    },

    initComponent: function() {
        this.periodexercisestore.filter(new Ext.util.Filter({ property: 'period', value: this.objectid }));
        this.periodexercisestore.load();
        this.createButton = Ext.create('Ext.button.Button',
                                     {text: 'Add exercise',
                                      handler: function() { this.openExerciseWindow(); },
                                      scope: this});
        this.upButton = Ext.create('Ext.button.Button',
                                   {text: 'Move up', disabled: true,
                                    handler: this.moveExercise(-1),
                                    scope: this
                                   });
        this.downButton = Ext.create('Ext.button.Button',
                                   {text: 'Move down', disabled: true,
                                    handler: this.moveExercise(1),
                                    scope: this
                                   });
        this.viewButton = Ext.create('Ext.button.Button',
                                     {text: 'View exercise', disabled: true,
                                      scope: this,
                                      handler: function() {
                                          var record = this.getSelection();
                                          window.open(this.dashboardUrl + "exercise/" + record.get('exercise'));
                                      }
                                     });
        this.editExerciseButton = Ext.create('Ext.button.Button',
                                     {text: 'Edit link', disabled: true,
                                      handler: this.editLink,
                                      scope: this});
        this.deleteExerciseButton = Ext.create('Ext.button.Button',
                                       {text: 'Remove exercise', disabled: true,
                                        handler: this.removeExercise,
                                        scope: this
                                       });
        this.grid = Ext.create('Ext.grid.Panel',
                               {columns: [{header: 'Key', dataIndex: 'starred',
                                           sortable: false, hideable: false,
                                           renderer: function(value) {
                                               return value ? '<img src="'
                                                   + this.static_url + '/trix/icons/star.png" />'
                                                   : '';
                                           },
                                           scope: this
                                          },
                                          {header: 'Title', dataIndex: 'exercise__long_name',
                                           sortable: false, hideable: false, flex: 1},
                                          {header: 'Points', dataIndex: 'points',
                                           sortable: false, hideable: false}],
                                store: this.periodexercisestore,

                                listeners: {
                                    select: { fn: function() {
                                        var index = this.periodexercisestore.indexOf(this.getSelection());
                                        this.upButton.setDisabled(index == 0);
                                        this.downButton.setDisabled(index == this.periodexercisestore.getCount() - 1);
                                        this.viewButton.setDisabled(false);
                                        this.editExerciseButton.setDisabled(false);
                                        this.deleteExerciseButton.setDisabled(false);
                                    },
                                              scope: this} },
                                tbar: ['Exercises', '->',
                                       this.createButton,
                                       '-',
                                       this.upButton,
                                       this.downButton,
                                       '-',
                                       this.viewButton,
                                       this.editExerciseButton,
                                       this.deleteExerciseButton],
                                scope: this});

        this.editButton = Ext.create('Ext.button.Button', {
            text: 'Edit', scope: this, margin: '0 5 20 0',
            handler: function() {
                Ext.create('trix.DefaultEditWindow', {
                    title: 'Edit period',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_periodform')
                    })
                }).show();
            }
        });

        this.deleteButton = Ext.create('Ext.button.Button', {
            text: 'Delete', scope: this, margin: '0 5 20 0',
            handler: function() {
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

        this.box = Ext.widget('box', {
            autoScroll: true,
            flex: 1,
            padding: '5 0',
            tpl: Ext.create('Ext.XTemplate',
                            '<div><b>Start:</b> {start_time:date}</div>',
                            '<div><b>End:</b> {end_time:date}</div>')

        });
        
        Ext.apply(this, { items: [ this.editButton, this.deleteButton, this.box, this.grid], autoScroll: true });
        this.callParent(arguments);
    },

    refreshBody: function() {
        this.box.update(this.record.data);
        this.callParent(arguments);
    }
});

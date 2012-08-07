Ext.define('trix.ExerciseView', {
    extend: 'trix.ModelView',
    alias: 'widget.exerciseview',
    
    requires: [
        'trix.forms.Exercise',
        'trix.forms.AddTopic',
        'trix.forms.AddPrerequisite',
        'trix.DefaultEditWindow',
        'trix.forms.PeriodExercise',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel',
        'devilry.extjshelpers.formfields.ForeignKeySelector'
    ],

    autoScroll: true,

    headerTpl: Ext.create('Ext.XTemplate',
                          '<h1>{long_name} &mdash;&nbsp;{points}&nbsp;points</h1>'),

    constructor: function(config) {
        this.callParent([config]);
        this.initConfig(config);
    },

    initComponent: function() {
        
        this.topicButton = Ext.create('Ext.button.Button', {
            text: 'Add topic', scope: this, margin: '0 5 20 0',
            handler: function() {
                var window = Ext.create('trix.DefaultEditWindow', {
                    title: 'Add topic',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_addtopicform')
                    })
                }).show();
            }
        });

        this.prerequisiteButton = Ext.create('Ext.button.Button', {
            text: 'Add prerequisite', scope: this, margin: '0 5 20 0',
            handler: function() {
                var window = Ext.create('trix.DefaultEditWindow', {
                    title: 'Add prerequisite',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_addprerequisiteform')
                    })
                }).show();
            }
        });

        this.editButton = Ext.create('Ext.button.Button', {
            text: 'Edit', scope: this, margin: '0 5 20 0',
            handler: function() {
                var window = Ext.create('trix.DefaultEditWindow', {
                    title: 'Edit exercise',
                    successfn: this.refreshWrapper(),
                    editpanel: Ext.ComponentManager.create({
                        xtype: 'restfulsimplified_editpanel',
                        model: this.modelname,
                        record: this.record,
                        editform: Ext.widget('administrator_exerciseform')
                    })
                }).show();
            }
        });

        this.deleteButton = Ext.create('Ext.button.Button', {
            text: 'Delete', scope: this, margin: '0 5 20 0',
            handler: function() {
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
            scope: this,
            tpl: Ext.create('Ext.XTemplate',
                            '<div class="topiclist">',
                            '<tpl if="topics__name"><div>Topics: ',
                            '<tpl for="topics__name">',
                            '<a href="{[this.dashboardUrl]}topic/{[parent.topics__id[xindex-1]]}">{.}</a>',
                            '<span id="topic-{[parent.topics__id[xindex-1]]}"></span></tpl></div></tpl>',
                            '<tpl if="prerequisites__name"><div>Prerequisites: ',
                            '<tpl for="prerequisites__name">',
                            '<a href="{[this.dashboardUrl]}topic/{[parent.prerequisites__id[xindex-1]]}">{.}</a>',
                            '<span id="prerequisite-{[parent.prerequisites__id[xindex-1]]}"></span></tpl></div></tpl></div>',
                            '<div class="exctext">{text}',
                            {dashboardUrl: this.dashboardUrl})
        });

        Ext.apply(this, { items: [this.editButton, this.deleteButton,
                                  this.topicButton, this.prerequisiteButton, this.box] });

        this.callParent(arguments);
        
    },

    refreshBody: function() {
        this.box.update(this.record.data);
        this.callParent(arguments);
        this.addDeleteButtons(this.record.get('topics__id'),
                              this.record.get('prerequisites__id'));
    },

    deleteTopic: function(id) {
        return function() {
            this.record.set('fake_topics', -id);
            this.record.save({success: this.refreshWrapper()});
        }
    },

    deletePrerequisite: function(id) {
        return function() {
            this.record.set('fake_prerequisites', -id);
            this.record.save({success: this.refreshWrapper()});
        }
    },
    
    addDeleteButtons: function(topics, prerequisites) {
        if (!this.deleteTopicButtons) {
            this.deleteTopicButtons = Array();
        }
        if (!this.deletePrerequisiteButtons) {
            this.deletePrerequisiteButtons = Array();
        }

        for (id in topics) {
            if (this.deleteTopicButtons[topics[id]]) {
                Ext.removeNode(this.deleteTopicButtons[topics[id]]);
            }
            
            this.deleteTopicButtons[topics[id]] = Ext.create('Ext.button.Button', {
                tooltip: 'Remove', margin: '2 10 2 2', iconCls: 'icon-delete-16', scope: this,
                handler: this.deleteTopic(topics[id])
            }).render(document.body, 'topic-' + topics[id]);
        }

        for (id in prerequisites) {
            if (this.deleteTopicButtons[prerequisites[id]]) {
                Ext.removeNode(this.deleteTopicButtons[prerequisites[id]]);
            }
            
            this.deleteTopicButtons[prerequisites[id]] = Ext.create('Ext.button.Button', {
                tooltip: 'Remove', margin: '2 10 2 2', iconCls: 'icon-delete-16', scope: this,
                handler: this.deletePrerequisite(prerequisites[id])
            }).render(document.body, 'prerequisite-' + prerequisites[id]);
        }
    }
});

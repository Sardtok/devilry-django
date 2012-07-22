Ext.define('trix.DashboardButtonBar', {
    extend: 'devilry.extjshelpers.ButtonBar',
    cls: 'dashboard-buttonbar',

    requires: [
        'trix.forms.Node',
        'trix.forms.Subject',
        'trix.forms.Period',
        'trix.forms.PeriodGroup',
        'trix.forms.Topic',
        'trix.forms.Exercise',
        'trix.forms.PeriodExercise',
        'devilry.administrator.DefaultCreateWindow',
        'devilry.extjshelpers.RestfulSimplifiedEditPanel',
        'devilry.extjshelpers.ButtonBarButton'
    ],

    config: {
        node_modelname: undefined,
        subject_modelname: undefined,
        period_modelname: undefined,
        periodgroup_modelname: undefined,
        topic_modelname: undefined,
        exercise_modelname: undefined,
        periodexercise_modelname: undefined,
        is_superuser: undefined,
        nodestore: undefined,
        subjectstore: undefined,
        periodstore: undefined,
        periodgroupstore: undefined,
        topicstore: undefined,
        exercisestore: undefined,
        periodexercisestore: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent([config]);
    },

    initComponent: function() {
        var me = this;
        Ext.apply(this, {
            items: [{
                xtype: 'buttonbarbutton',
                is_superuser: this.is_superuser,
                text: 'Node',
                store: this.nodestore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: '<span class="tooltip-title-current-item">Node</span> &rArr; Subject &rArr; Period',
                    body: 'A Node is a place to organise top-level administrators.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Create new node',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.node_modelname,
                            editform: Ext.widget('administrator_nodeform')
                        }),
                        successUrlTpl: Ext.create('Ext.XTemplate', 'node/{id}')
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: 'Subject',
                store: this.nodestore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: 'Node &rArr; <span class="tooltip-title-current-item">Subject</span> &rArr; Period',
                    body: 'A Subject is often also called a course.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Create new subject',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.subject_modelname,
                            editform: Ext.widget('administrator_subjectform')
                        }),
                        successUrlTpl: Ext.create('Ext.XTemplate', 'subject/{id}')
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: 'Period/Semester',
                store: this.subjectstore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: 'Node &rArr; Subject &rArr; <span class="tooltip-title-current-item">Period</span>',
                    body: 'A Period is a limited period in time, such as a semester.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Create new period',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.period_modelname,
                            editform: Ext.widget('administrator_periodform')
                        }),
                        successUrlTpl: Ext.create('Ext.XTemplate', 'period/{id}')
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: 'Period group',
                store: this.periodstore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: 'Period &rArr; <span class="tooltip-title-current-item">Period group</span> &rArr; Exercise &rArr; Link exercise to period',
                    body: 'A group of shorter periods that make up a semester.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Create new period group',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.periodgroup_modelname,
                            editform: Ext.widget('administrator_periodgroupform')
                        }),
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: 'Topic',
                store: this.periodstore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: '<span class="tooltip-title-current-item">Topic</span> &rArr; Exercise &rArr; Link exercise to period',
                    body: 'An exercise topic, e.g. Dynamic programming, pointers, or inheritance.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Create new topic',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.topic_modelname,
                            editform: Ext.widget('administrator_topicform')
                        }),
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: 'Exercise',
                store: this.periodstore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: 'Topic &rArr; <span class="tooltip-title-current-item">Exercise</span> &rArr; Link exercise to period',
                    body: 'An exercise that a student should complet to learn more about one or more topics.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Create new exercise',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.exercise_modelname,
                            editform: Ext.widget('administrator_exerciseform')
                        }),
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: 'Link exercise to period',
                store: this.exercisestore,
                iconCls: 'icon-add-32',
                tooltipCfg: {
                    title: 'Topic &rArr; Exercise &rArr; <span class="tooltip-title-current-item">Link exercise to period</span>',
                    body: 'Lets you set an exercise to be given in a certain period.'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: 'Link an exercise to a period',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: me.periodexercise_modelname,
                            editform: Ext.widget('administrator_periodexerciseform')
                        }),
                    }).show();
                }
            }]
        });
        this.callParent(arguments);
    }
});

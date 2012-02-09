{% extends "trix/trixadmin/base.django.html" %}
{% load extjs %}
{% load i18n %}

{% block imports %}
    {{ block.super }}
    Ext.require('devilry.extjshelpers.PermissionChecker');
    Ext.require('devilry.examiner.ActiveAssignmentsView');
    Ext.require('devilry.administrator.DashboardButtonBar');
{% endblock %}

{% block appjs %}
    {{ block.super }}

    {{ restfulapi.RestfulSimplifiedNode|extjs_model }};
    {{ restfulapi.RestfulSimplifiedSubject|extjs_model }};
    {{ restfulapi.RestfulSimplifiedPeriod|extjs_model:"subject" }};
    {{ }};

    var nodestore = {{ restfulapi.RestfulSimplifiedNode|extjs_store }};
    var subjectstore = {{ restfulapi.RestfulSimplifiedSubject|extjs_store }};
    var periodstore = {{ restfulapi.RestfulSimplifiedPeriod|extjs_store }};
    nodestore.pageSize = 1;
    subjectstore.pageSize = 1;
    periodstore.pageSize = 1;
    var is_superuser = {{ user.is_superuser|lower }};
{% endblock %}

{% block headextra %}
{{ block.super }}

<script>
    Ext.require('trix.DefaultEditWindow');
    Ext.require('devilry.extjshelpers.RestfulSimplifiedEditPanel');
    Ext.require('devilry.extjshelpers.ButtonBarButton');
    Ext.require('devilry.extjshelpers.ButtonBar');
    Ext.require('trix.forms.Exercise');
    Ext.require('trix.forms.Topic');
    Ext.require('trix.forms.PeriodExercise');

    {{ RestfulSimplifiedExercise|extjs_model }},
    {{ RestfulSimplifiedTopic|extjs_model }},
    {{ RestfulSimplifiedPeriodExercise|extjs_model }},
    {{ RestfulSimplifiedPeriod|extjs_model }};

    var exercisestore = {{ RestfulSimplifiedExercise|extjs_store }};
    var topicstore = {{ RestfulSimplifiedTopic|extjs_store }};
    var periodexercisestore = {{ RestfulSimplifiedPeriodExercise|extjs_store }};
    var periodstore = {{ RestfulSimplifiedPeriod|extjs_store }};


    Ext.onReady(function(){
        Ext.create('devilry.extjshelpers.ButtonBar', {
            renderTo: 'createbuttonbar',
            width: 600,
            items: [{
                xtype: 'buttonbarbutton',
                text: '{% trans "Topic" %}',
                iconCls: 'icon-add-32',
                store: periodstore,
                tooltipCfg: {
                    title: '<span class="tooltip-title-current-item">{% trans "Topic" %}</span> &rArr; {% trans "Exercise" %} &rArr; {% trans "Link exercise and period" %}',
                    body: "{% trans "A topic for exercise's topics and prerequisites." %}"
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: '{% trans "Create new topic" %}',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: {{ RestfulSimplifiedTopic|extjs_modelname }},
                            editform: Ext.widget('administrator_topicform')
                        }),
                        successUrlTpl: Ext.create('Ext.XTemplate', '')
                    }).show();
                }
            }, {
                xtype: 'buttonbarbutton',
                text: '{% trans "Exercise" %}',
                iconCls: 'icon-add-32',
                store: periodstore,
                tooltipCfg: {
                    title: '{% trans "Topic" %} &rArr; <span class="tooltip-title-current-item">{% trans "Exercise" %}</span> &rArr; {% trans "Link exercise and period" %}',
                    body: '{% trans "An exercise that goes in the exercise database." %}'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: '{% trans "Create new exercise" %}',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: {{ RestfulSimplifiedExercise|extjs_modelname }},
                            editform: Ext.widget('administrator_exerciseform')
                        }),
                        successUrlTpl: Ext.create('Ext.XTemplate', '')
                    }).show();
                }
            },  {
                xtype: 'buttonbarbutton',
                text: '{% trans "Link exercise and period" %}',
                iconCls: 'icon-add-32',
                store: periodstore,
                tooltipCfg: {
                    title: '{% trans "Topic" %} &rArr; {% trans "Exercise" %} &rArr; <span class="tooltip-title-current-item">{% trans "Link exercise and period" %}</span>',
                    body: '{% trans "Link an exercise and a period." %}'
                },
                handler: function() {
                    Ext.create('trix.DefaultEditWindow', {
                        title: '{% trans "Add exercise to period" %}',
                        editpanel: Ext.ComponentManager.create({
                            xtype: 'restfulsimplified_editpanel',
                            model: {{ RestfulSimplifiedPeriodExercise|extjs_modelname }},
                            editform: Ext.widget('administrator_periodexerciseform')
                        }),
                        successUrlTpl: Ext.create('Ext.XTemplate', '')
                    }).show();
                }
            }]
        });
    periodstore.load();
    Ext.QuickTips.init();
});
</script>
<script type="text/javascript">
  Ext.create('devilry.extjshelpers.formfields.ForeignKeySelector', {
  fieldLabel: '{% trans "View period" %}',
  model: {{ RestfulSimplifiedPeriod|extjs_modelname }},
  renderTo: 'perioddropdown',
  displayTpl: '{long_name}',
  dropdownTpl: '{long_name}',
  setRecordValue: function(record) {
  document.location.href=("/trix/trixadmin/period/" + record.data.id);
  }
  });
</script>
{% endblock %}

{% block onready %}
{% endblock %}

{% block bodyContent %}
<div id="perioddropdown"></div>

<div id="createbuttonbar"></div>
{% endblock %}

{% extends "trix/trixadmin/base.django.html" %}
{% load extjs %}
{% load i18n %}

{% block imports %}
    {{ block.super }}
    Ext.require('trix.DashboardButtonBar');
{% endblock %}

{% block appjs %}
    {{ block.super }}

    {{ restfulapi.RestfulSimplifiedExercise|extjs_model }},
    {{ restfulapi.RestfulSimplifiedTopic|extjs_model }},
    {{ restfulapi.RestfulSimplifiedPeriodExercise|extjs_model }},
    {{ restfulapi.RestfulSimplifiedNode|extjs_model }};
    {{ restfulapi.RestfulSimplifiedSubject|extjs_model }};
    {{ restfulapi.RestfulSimplifiedPeriod|extjs_model:"subject" }};
    {{ restfulapi.RestfulSimplifiedPeriodGroup|extjs_model }};
 
    var exercisestore = {{ restfulapi.RestfulSimplifiedExercise|extjs_store }};
    var topicstore = {{ restfulapi.RestfulSimplifiedTopic|extjs_store }};
    var periodexercisestore = {{ restfulapi.RestfulSimplifiedPeriodExercise|extjs_store }};
    var nodestore = {{ restfulapi.RestfulSimplifiedNode|extjs_store }};
    var subjectstore = {{ restfulapi.RestfulSimplifiedSubject|extjs_store }};
    var periodstore = {{ restfulapi.RestfulSimplifiedPeriod|extjs_store }};
    var periodgroupstore = {{ restfulapi.RestfulSimplifiedPeriodGroup|extjs_store }};
    nodestore.pageSize = 1;
    subjectstore.pageSize = 1;
    periodstore.pageSize = 1;
    var is_superuser = {{ user.is_superuser|lower }};
{% endblock %}

{% block onready %}
{{ block.super }}


    var dashboard_periodmodel = {{ restfulapi.RestfulSimplifiedPeriod|extjs_model:"subject" }}
    var permchecker = Ext.create('Ext.Component', {
        html: '<div class="section info-small extravisible-small"><h1>{{ DEVILRY_ADMINISTRATOR_NO_PERMISSION_MSG.title }}</h1>' +
            '<p>{{ DEVILRY_ADMINISTRATOR_NO_PERMISSION_MSG.body }}</p></div>',
    });


    var buttonbar = Ext.create('trix.DashboardButtonBar', {
        node_modelname: {{ restfulapi.RestfulSimplifiedNode|extjs_modelname }},
        subject_modelname: {{ restfulapi.RestfulSimplifiedSubject|extjs_modelname }},
        period_modelname: {{ restfulapi.RestfulSimplifiedPeriod|extjs_modelname }},
        periodgroup_modelname: {{ restfulapi.RestfulSimplifiedPeriodGroup|extjs_modelname }},
        topic_modelname:  {{ restfulapi.RestfulSimplifiedTopic|extjs_modelname }},
        exercise_modelname:  {{ restfulapi.RestfulSimplifiedExercise|extjs_modelname }},
        periodexercise_modelname:  {{ restfulapi.RestfulSimplifiedPeriodExercise|extjs_modelname }},
        is_superuser: is_superuser,
        nodestore: nodestore,
        subjectstore: subjectstore,
        periodstore: periodstore,
        periodgroupstore: periodgroupstore,
        topicstore: topicstore,
        exercisestore: exercisestore,
        periodexercisestore: periodexercisestore
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        style: 'background-color: transparent',
        items: [{
            region: 'north',
            xtype: 'trixheader',
            navclass: 'administrator'
        }, {
            region: 'south',
            xtype: 'trixfooter'
        }, {
            region: 'center',
            xtype: 'container',
            border: false,
            padding: {left: 20, right: 20},
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [searchwidget, {xtype:'box', height: 20}, permchecker, buttonbar/*, {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'panel',
                    flex: 3,
                    layout: 'fit',
                    border: false,
                    id: 'active-periods'
                }]
            }*/]
        }]
    });

    nodestore.load();
    subjectstore.load();
    periodstore.load();
    topicstore.load();
    exercisestore.load();
    periodexercisestore.load();

 if (!is_superuser) {
     buttonbar.hide();
     permchecker.show();
} else {
    permchecker.hide();
    searchwidget.show();
}
Ext.getBody().unmask();


{% endblock %}


{% extends "student/base.django.js" %}
{% load extjs %}

{% block imports %}
    {{ block.super }}
    Ext.require('devilry.student.StudentSearchWidget');
    Ext.require('devilry.extjshelpers.PermissionChecker');
    Ext.require('devilry.student.AddDeliveriesGrid');
    Ext.require('devilry.student.browseperiods.BrowsePeriods');
{% endblock %}

{% block appjs %}
    {{ block.super }}

    {{ restfulapi.RestfulSimplifiedRelatedStudentKeyValue|extjs_model }};

    {{ restfulapi.RestfulSimplifiedAssignmentGroup|extjs_model:";PermissionCheck" }};
    var assignmentgroup_permcheckstore = {{ restfulapi.RestfulSimplifiedAssignmentGroup|extjs_store:"PermissionCheck" }};
    assignmentgroup_permcheckstore.pageSize = 1;

    var deadlinemodel = {{ restfulapi.RestfulSimplifiedDeadline|extjs_model:"subject,period,assignment,assignment_group,assignment_group_users" }};
    var deadlinestore = {{ restfulapi.RestfulSimplifiedDeadline|extjs_store }};

    var ag_model = {{ restfulapi.RestfulSimplifiedAssignmentGroup|extjs_model:"subject,period,assignment,users,feedback,feedbackdelivery" }};
    var ag_store = Ext.create('Ext.data.Store', {
        model: ag_model,
        id: 'devilry.apps.student.AddDeliveriesStore',
        remoteFilter: true,
        remoteSort: true,
        autoSync: true
    });

    {{ restfulapi.RestfulSimplifiedPeriod|extjs_model:"subject" }};

    var dashboard_delivery_model = {{ restfulapi.RestfulSimplifiedDelivery|extjs_model:"subject,period,assignment,assignment_group" }};
    var dashboard_feedback_model = {{ restfulapi.RestfulSimplifiedStaticFeedback|extjs_model:"subject,period,assignment,assignment_group" }};
    function createGrids() {
        var addDeliveriesGrid = Ext.create('devilry.student.AddDeliveriesGrid', {
            store: ag_store,
            dashboard_url: DASHBOARD_URL,
            minHeight: 140,
            flex: 1
        });

        var recentDeliveries = Ext.create('devilry.examiner.RecentDeliveriesView', {
            model: dashboard_delivery_model,
            showStudentsCol: false,
            dashboard_url: DASHBOARD_URL,
            flex: 1
        });
        var recentFeedbacks = Ext.create('devilry.examiner.RecentFeedbacksView', {
            model: dashboard_feedback_model,
            showStudentsCol: false,
            dashboard_url: DASHBOARD_URL,
            flex: 1
        });
        Ext.getCmp('assignmentcontainer').add({
            xtype: 'tabpanel',
            bodyPadding: 10,
            items: [{
                xtype: 'panel',
                title: 'Dashboard',
                autoScroll: true,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [addDeliveriesGrid, {
                    xtype: 'container',
                    margin: {top: 10},
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    height: 200,
                    width: 800, // Needed to avoid layout issue in FF3.6
                    items: [recentDeliveries, {xtype: 'box', width: 40}, recentFeedbacks]
                }]
            }, {
                xtype: 'student-browseperiods',
                title: 'Browse all'
            }]
        });
    }
{% endblock %}

{% block onready %}
    {{ block.super }}

    {% comment %}
    var permchecker = Ext.create('devilry.extjshelpers.PermissionChecker', {
        stores: [assignmentgroup_permcheckstore],
        emptyHtml: '<div class="section info-small extravisible-small"><h1>{{ DEVILRY_STUDENT_NO_PERMISSION_MSG.title }}</h1>' +
            '<p>{{ DEVILRY_STUDENT_NO_PERMISSION_MSG.body }}</p></div>',
        listeners: {
            allLoaded: function() {
                Ext.getBody().unmask();
            },
            hasPermission: function() {
            }
        }
    });
    assignmentgroup_permcheckstore.load();
    {% endcomment %}


    Ext.getBody().unmask();
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        style: 'background-color: transparent',
        items: [{
            region: 'north',
            xtype: 'pageheader',
            navclass: 'student'
        }, {
            region: 'south',
            xtype: 'pagefooter'
        }, {
            region: 'center',
            xtype: 'container',
            border: false,
            padding: {left: 20, right: 20},
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [searchwidget, {xtype:'box', height: 20}, {
                xtype: 'panel',
                flex: 1,
                layout: 'fit',
                border: false,
                id: 'assignmentcontainer'
            }]
        }]
    });
    searchwidget.show();
    createGrids();
{% endblock %}

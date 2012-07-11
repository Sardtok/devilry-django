Ext.define('trix.forms.Exercise', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_exerciseform',
    cls: 'widget-exerciseform',
    requires: ['devilry.extjshelpers.formfields.ForeignKeySelector'],

    suggested_windowsize: {
        width: 600,
        height: 500
    },

    flex: 8,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 100,
        labelStyle: 'font-weight:bold'
    },

    items: [{
        name: "long_name",
        fieldLabel: gettext("Long name"),
        xtype: 'textfield',
        emptyText: gettext('Example: Hello World')
    }, {
        xtype: 'container',
        anchor: '100%',
        layout: 'column',
        items: [{
            name: "short_name",
            fieldLabel: gettext("Short name"),
            xtype: 'textfield',
            emptyText: gettext('Example: output1')
        }, {
            name: "points",
            fieldLabel: gettext("Points"),
            xtype: 'numberfield'
        }]
    }, {
        xtype: 'container',
        anchor: '100%',
        layout: 'column',
        items: [{
            name: "fake_topics",
            fieldLabel: gettext("Topic"),
            xtype: 'foreignkeyselector',
            model: 'trix.apps.trix.simplified.topic.SimplifiedTopic',
            emptyText: gettext('Select a topic'),
            displayTpl: '{name}',
            dropdownTpl: '<div class="important">{name}</div>'
        }, {
            name: "fake_prerequisites",
            fieldLabel: gettext("Prerequisite"),
            xtype: 'foreignkeyselector',
            model: 'trix.apps.trix.simplified.topic.SimplifiedTopic',
            emptyText: gettext('Select a topic'),
            displayTpl: '{name}',
            dropdownTpl: '<div class="important">{name}</div>'
        }]
    }, {
        name: "text",
        fieldLabel: gettext("Exercise text"),
        xtype: 'htmleditor',
        anchor: '100%',
        flex: 1
    }],

    help: [
        gettext('<strong>Long name</strong> is a longer descriptive exercise title.'),
        gettext('<strong>Short name</strong> is a short name used when the long name takes to much space. Short name can only contain english lower-case letters, numbers and underscore (_).'),
        gettext('<strong>Points</strong> is the default number of points for this exercise'),
        gettext('<strong>Topic</strong> is a topic for the exercise.'),
        gettext('<strong>Prerequisite</strong> is a topic the student should know before doing the exercise.'),
        gettext('<strong>Exercise text</strong> is the exercise itself.')
    ]
});

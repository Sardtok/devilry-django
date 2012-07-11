Ext.define('trix.forms.AddTopic', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_addtopicform',
    cls: 'widget-exerciseform',
    requires: ['devilry.extjshelpers.formfields.ForeignKeySelector'],
    
    suggested_windowsize: {
        width: 600,
        height: 500
    },
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
        name: "fake_topics",
        fieldLabel: gettext("Topic"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.topic.SimplifiedTopic',
        emptyText: gettext('Select a topic'),
        displayTpl: '{name}',
        dropdownTpl: '<div class="important">{name}</div>'
    }],
    help: [
        gettext('<strong>Topic</strong> is a topic for the exercise.')
    ]
});

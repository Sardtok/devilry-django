Ext.define('trix.forms.AddPrerequisite', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_addprerequisiteform',
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
        name: "fake_prerequisites",
        fieldLabel: gettext("Prerequisite"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.topic.SimplifiedTopic',
        emptyText: gettext('Select a topic'),
        displayTpl: '{name}',
        dropdownTpl: '<div class="important">{name}</div>'
    }],
    help: [
        gettext('<strong>Prerequisite</strong> is a topic the student should know before doing the exercise.')
    ]
});

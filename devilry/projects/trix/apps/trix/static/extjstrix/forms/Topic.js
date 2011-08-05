Ext.define('trix.forms.Topic', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_topicform',
    cls: 'widget-topicform',

    suggested_windowsize: {
        width: 400,
        height: 200
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
        name: "name",
        fieldLabel: "Name",
        xtype: 'textfield',
        emptyText: 'Example: Arrays'
    }],

    help: [
        '<strong>Name</strong> the name of the topic.'
    ]
});

Ext.define('trix.forms.Exercise', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_exerciseform',
    cls: 'widget-exerciseform',

    suggested_windowsize: {
        width: 600,
        height: 400
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
        xtype: 'container',
        anchor: '100%',
        layout: 'column',
        items: [{
            name: "short_name",
            fieldLabel: "Short name",
            xtype: 'textfield',
            emptyText: 'Example: output1'
        }, {
            name: "long_name",
            fieldLabel: "Long name",
            xtype: 'textfield',
            emptyText: 'Example: Hello World'
        }]
    }, {
        name: "text",
        fieldLabel: "Exercise text",
        xtype: 'htmleditor',
        height: 200,
        anchor: '100%',
        emptyText: 'Example: Create a program that outputs "Hello, World!" to the command line.'
    }],

    help: [
        '<strong>Short name</strong> is a short name used when the long name takes to much space. Short name can only contain english lower-case letters, numbers and underscore (_).',
        '<strong>Long name</strong> is a longer descriptive exercise title.',
        '<strong>Exercise text</strong> is the exercise itself.'
    ]
});

Ext.define('trix.forms.PeriodGroup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_periodgroupform',
    cls: 'widget-periodexerciseform',
    requires: 'devilry.extjshelpers.formfields.ForeignKeySelector',

    suggested_windowsize: {
        width: 550,
        height: 350
    },

    flex: 6,

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
        name: "subject",
        fieldLabel: gettext("Subject"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.subject.SimplifiedSubject',
        emptyText: gettext('Select a subject'),
        displayTpl: '{long_name}',
        dropdownTpl: '<div class="important">{short_name}</div> <div>{long_name}</div>'
    }, {
        name: "long_name",
        fieldLabel: gettext("Name"),
        xtype: 'textfield',
        emptyText: 'Example: Fall 2012',
    }],

    help: [
        gettext('<strong>Subject</strong> is the subject whose periods this group will contain.'),
        gettext('<strong>Name</strong> is the name of this period group.')    ]
});

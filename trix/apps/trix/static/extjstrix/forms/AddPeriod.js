Ext.define('trix.forms.AddPeriod', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_addperiodform',
    cls: 'widget-periodgroupform',
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
        name: "fake_periods",
        fieldLabel: gettext("Period"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.period.SimplifiedPeriod',
        emptyText: gettext('Select a period'),
        displayTpl: '{long_name}',
        dropdownTpl: '<div class="important">{long_name}</div>'
    }],
    help: [
        gettext('<strong>Period</strong> is the period to add to this group.')
    ]
});

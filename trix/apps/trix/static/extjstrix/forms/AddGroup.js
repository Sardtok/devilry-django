Ext.define('trix.forms.AddGroup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_addgroupform',
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
        name: "fake_followedgroups",
        fieldLabel: gettext("Period group"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.periodgroup.SimplifiedPeriodGroup',
        emptyText: gettext('Select a period group'),
        displayTpl: '{long_name}',
        dropdownTpl: '<div class="unimportant">{subject__long_name}</div><div class="important">{long_name}</div>'
    }],
    help: [
        gettext('<strong>Period group</strong> is the group you want to follow.')
    ]
});

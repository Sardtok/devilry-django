Ext.define('trix.forms.PeriodExercise', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_periodexerciseform',
    cls: 'widget-periodexerciseform',
    requires: 'devilry.extjshelpers.formfields.ForeignKeySelector',

    suggested_windowsize: {
        width: 600,
        height: 450
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
        name: "period",
        fieldLabel: "Period",
        xtype: 'foreignkeyselector',
        model: 'devilry.apps.administrator.simplified.SimplifiedPeriod',
        emptyText: 'Select a period',
        displayTpl: '{long_name}',
        dropdownTpl: '<div class="important">{short_name}</div> <div>{long_name}</div>'
    }, {
        name: "exercise",
        fieldLabel: "Exercise",
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.exercise.SimplifiedExercise',
        emptyText: 'Select an exercise',
        displayTpl: '{short_name}',
        dropdownTpl: '<div class="important">{short_name}</div> <div>{long_name}</div>'
    }, {
        name: "points",
        fieldLabel: "Points",
        xtype: 'numberfield'
    }, {
        name: "starred",
        fieldLabel: "Starred",
        xtype: 'checkbox',
        inputValue: true,
/*    }, {
        name: "topics__id",
        fieldLabel: "Topic",
        xtype: 'foreignkeytolistselector',
        model: 'trix.apps.trix.simplified.topic.SimplifiedTopic',
        emptyText: 'Select a topic',
        displayTpl: '{name}',
        dropdownTpl: '<div class="important">{name}</div>'
*/
    }],

    help: [
        '<strong>Short name</strong> is a short name used when the long name takes to much space. Short name can only contain english lower-case letters, numbers and underscore (_).',
        '<strong>Long name</strong> is a longer descriptive exercise title.',
        '<strong>Points</strong> is the default number of points for this exercise',
        '<strong>Exercise text</strong> is the exercise itself.'
    ]
});

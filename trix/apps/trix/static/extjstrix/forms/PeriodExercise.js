Ext.define('trix.forms.PeriodExercise', {
    extend: 'Ext.form.Panel',
    alias: 'widget.administrator_periodexerciseform',
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
        name: "period",
        fieldLabel: gettext("Period"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.period.SimplifiedPeriod',
        emptyText: gettext('Select a period'),
        displayTpl: '{long_name}',
        dropdownTpl: '<div class="important">{short_name}</div> <div>{long_name}</div>'
    }, {
        name: "exercise",
        fieldLabel: gettext("Exercise"),
        xtype: 'foreignkeyselector',
        model: 'trix.apps.trix.simplified.exercise.SimplifiedExercise',
        emptyText: gettext('Select an exercise'),
        displayTpl: '{short_name}',
        dropdownTpl: '<div class="important">{short_name} - {points} ' + gettext("points") + '</div> <div>{long_name}</div>'
    }, {
        xtype: 'container',
        anchor: '100%',
        layout: 'column',
        items: [{
            name: "number",
            fieldLabel: gettext("Number"),
            xtype: 'numberfield'
        }, {
            name: "points",
            fieldLabel: gettext("Points"),
            xtype: 'numberfield'
        }]
    }, {
        name: "starred",
        fieldLabel: gettext("Key exercise"),
        xtype: 'checkbox',
        inputValue: true,
    }],

    help: [
        gettext('<strong>Period</strong> is the period in which an exercise should be given.'),
        gettext('<strong>Exercise</strong> is the exercise to be given.'),
        gettext('<strong>Number</strong> the number of the exercise this period.'),
        gettext('<strong>Points</strong> can be filled in to override the number of points for this exercise.'),
        gettext('<strong>Key exercise</strong> marks exercises that are important.')
    ]
});

/**
 * SearchWidget used in every page in the Exercise interface.
 *
 * Lets users search for topics, periods or exercises that have been given.
 */
Ext.define('trix.TrixSearchWidget', {
    extend: 'devilry.extjshelpers.searchwidget.SearchWidget',
    requires: [
        'devilry.extjshelpers.searchwidget.FilterConfigDefaults',
    ],

    config: {
        /**
         * @cfg
         * URL prefix. Should be the absolute URL to /trix/
         */
        urlPrefix: '',

        /**
         * @cfg
         * ``Ext.XTemplate`` for rows of period results.
         */
        periodRowTpl: '',

        /**
         * @cfg
         * ``Ext.XTemplate`` for rows of topic results.
         */
        topicRowTpl:'',

        /**
         * @cfg
         * ``Ext.XTemplate`` for rows of exercise results.
         */
        exerciseRowTpl:''
    },

    // Set up each searchable table
    initComponent: function() {
        Ext.apply(this, {
            searchResultItems: [{
                xtype: 'searchresults',
                title: 'Periods',
                store: Ext.data.StoreManager.lookup('trix.apps.trix.simplified.period.SimplifiedPeriodStore'),
                filterconfig: {
                    type: 'period'
                },
                resultitemConfig: {
                    tpl: this.periodRowTpl,
                    defaultbutton: {
                        text: 'View',
                        clickLinkTpl: this.urlPrefix + 'period/{id}'
                    }
                }
            }, {
                xtype: 'searchresults',
                title: 'Topics',
                store: Ext.data.StoreManager.lookup('trix.apps.trix.simplified.topic.SimplifiedTopicStore'),
                filterconfig: {
                    type: 'topic'
                },
                resultitemConfig: {
                    tpl: this.topicRowTpl,
                    defaultbutton: {
                        text: 'View',
                        clickLinkTpl: this.urlPrefix + 'topic/{id}'
                    }
                }
            }, {
                xtype: 'searchresults',
                title: 'Exercises',
                store: Ext.data.StoreManager.lookup('trix.apps.trix.simplified.periodexercise.SimplifiedPeriodExerciseStore'),
                filterconfig: {
                    type: 'periodexercise'
                },
                resultitemConfig: {
                    tpl: this.exerciseRowTpl,
                    defaultbutton: {
                        text: 'View',
                        clickLinkTpl: this.urlPrefix + 'exercise/{id}'
                    }
                }
            }]
        });

        // Parent constructor
        this.callParent(arguments);
    }
});

/**
 * SearchWidget used in every page in the Exercise interface.
 *
 * Lets users search for topics, periods or exercises that have been given.
 */
Ext.define('trix.AdminSearchWidget', {
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
                store: Ext.data.StoreManager.lookup('trix.apps.trix.simplified.period.SimplifiedPeriodStoreSearch'),
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
                store: Ext.data.StoreManager.lookup('trix.apps.trix.simplified.topic.SimplifiedTopicStoreSearch'),
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
                store: Ext.data.StoreManager.lookup('trix.apps.trix.simplified.exercise.SimplifiedExerciseStoreSearch'),
                filterconfig: {
                    type: 'exercise'
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
